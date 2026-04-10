#!/usr/bin/env node
import { readFileSync, existsSync, rmSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const sitesDir = join(rootDir, 'sites');
const configPath = join(rootDir, 'sites.config.json');
const dockerfilePath = join(rootDir, 'docker', 'Dockerfile.astro');

const args = process.argv.slice(2);
const buildAll = args.includes('--all');
const siteName = buildAll ? null : args[0];

if (!buildAll && !siteName) {
  console.error('[ERROR] Usage: npm run build <sitename> or npm run build:all');
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'));

function buildSite(name) {
  const siteConfig = config.sites[name];
  if (!siteConfig) {
    console.error(`[ERROR] Site "${name}" not found in config`);
    return false;
  }

  const siteDir = join(sitesDir, name);
  if (!existsSync(siteDir)) {
    console.error(`[ERROR] Site directory not found: ${siteDir}`);
    return false;
  }

  console.log(`\n[BUILD] Building ${name}...`);
  
  const imageName = `astro-build-${name}`;
  const containerName = `astro-build-temp-${name}`;
  
  try {
    // Clean up any existing container
    try {
      execSync(`docker rm -f ${containerName}`, { stdio: 'ignore' });
    } catch {}
    
    // Build Docker image
    console.log('[DOCKER] Building Docker image...');
    const buildResult = spawnSync('docker', [
      'build',
      '-f', dockerfilePath,
      '-t', imageName,
      '.'
    ], {
      cwd: siteDir,
      stdio: 'inherit',
      shell: true
    });
    
    if (buildResult.status !== 0) {
      throw new Error('Docker build failed');
    }
    
    // Create container to extract dist folder
    console.log('[EXTRACT] Extracting build files...');
    execSync(`docker create --name ${containerName} ${imageName}`, { stdio: 'ignore' });
    
    // Remove old dist folder
    const distDir = join(siteDir, 'dist');
    if (existsSync(distDir)) {
      rmSync(distDir, { recursive: true, force: true });
    }
    
    // Copy dist folder from container
    execSync(`docker cp ${containerName}:/app/dist ${siteDir}/dist`, { stdio: 'inherit' });
    
    // Clean up container
    execSync(`docker rm ${containerName}`, { stdio: 'ignore' });
    
    console.log(`[SUCCESS] ${name} built successfully!`);
    console.log(`[OUTPUT] sites/${name}/dist`);
    return true;
    
  } catch (error) {
    console.error(`[ERROR] Failed to build ${name}:`, error.message);
    
    // Cleanup on error
    try {
      execSync(`docker rm -f ${containerName}`, { stdio: 'ignore' });
    } catch {}
    
    return false;
  }
}

if (buildAll) {
  console.log('[BUILD] Building all sites...');
  const sites = Object.keys(config.sites);
  
  if (sites.length === 0) {
    console.log('[INFO] No sites found. Create one with: npm run new <sitename>');
    process.exit(0);
  }
  
  let success = 0;
  let failed = 0;
  
  for (const site of sites) {
    if (buildSite(site)) {
      success++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n[COMPLETE] Build complete: ${success} succeeded, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
  
} else {
  const result = buildSite(siteName);
  process.exit(result ? 0 : 1);
}
