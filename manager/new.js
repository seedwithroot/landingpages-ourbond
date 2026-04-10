#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const sitesDir = join(rootDir, 'sites');
const configPath = join(rootDir, 'sites.config.json');

const siteName = process.argv[2];

if (!siteName) {
  console.error('[ERROR] Usage: npm run new <sitename>');
  process.exit(1);
}

// Validate site name
if (!/^[a-z0-9-]+$/.test(siteName)) {
  console.error('[ERROR] Site name must contain only lowercase letters, numbers, and hyphens');
  process.exit(1);
}

const siteDir = join(sitesDir, siteName);

// Check if site already exists
if (existsSync(siteDir)) {
  console.error(`❌ Site "${siteName}" already exists`);
  process.exit(1);
}

console.log(`🚀 Creating new Astro site: ${siteName}\n`);

// Create sites directory if it doesn't exist
if (!existsSync(sitesDir)) {
  mkdirSync(sitesDir, { recursive: true });
}

// Create Astro site using npm create
try {
  console.log('[INIT] Initializing Astro project...');
  execSync(`npm create astro@latest ${siteName} -- --template minimal --no-install --no-git --typescript strict`, {
    cwd: sitesDir,
    stdio: 'inherit'
  });
  
  console.log('\n📥 Installing dependencies...');
  execSync('npm install', {
    cwd: siteDir,
    stdio: 'inherit'
  });
  
} catch (error) {
  console.error('[ERROR] Failed to create Astro site');
  process.exit(1);
}

// Update config
const config = JSON.parse(readFileSync(configPath, 'utf-8'));
config.sites[siteName] = {
  name: siteName,
  domain: `${siteName}.com`,
  spacesPath: siteName,
  buildCommand: 'npm run build',
  created: new Date().toISOString()
};
writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log(`\n[SUCCESS] Site "${siteName}" created successfully!`);
console.log(`\n[INFO] Location: sites/${siteName}`);
console.log('\n🎯 Next steps:');
console.log(`   - Edit your site in sites/${siteName}/src`);
console.log(`   - Build: npm run build ${siteName}`);
console.log(`   - Deploy: npm run deploy ${siteName}`);
console.log(`   - Dev server: npm run dev ${siteName}`);
