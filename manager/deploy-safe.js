#!/usr/bin/env node
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { config as loadEnv } from 'dotenv';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const sitesDir = join(rootDir, 'sites');
const deploymentConfigPath = join(rootDir, 'deployment.config.json');

// Load environment variables
loadEnv({ path: join(rootDir, '.env') });

// Parse command line arguments
const args = process.argv.slice(2);
let siteName, environment;

// Support both positional and flag syntax
if (args.includes('--site')) {
  const siteIdx = args.indexOf('--site');
  siteName = args[siteIdx + 1];
}
if (args.includes('--env')) {
  const envIdx = args.indexOf('--env');
  environment = args[envIdx + 1];
}

// Fallback to positional args
if (!siteName && args[0] && !args[0].startsWith('--')) {
  siteName = args[0];
}
if (!environment && args[1] && !args[1].startsWith('--')) {
  environment = args[1];
}

if (!siteName || !environment) {
  console.error('❌ Usage: npm run deploy:safe <sitename> <environment>');
  console.error('\nExamples:');
  console.error('  npm run deploy:safe ourbond staging');
  console.error('  npm run deploy:safe ourbond production');
  console.error('  npm run deploy:safe adalane production');
  console.error('\nEnvironments: localhost, staging, production');
  process.exit(1);
}

// Load deployment configuration
if (!existsSync(deploymentConfigPath)) {
  console.error(`❌ Deployment config not found: ${deploymentConfigPath}`);
  console.error('💡 Run: npm run init:deployment to create configuration');
  process.exit(1);
}

const deployConfig = JSON.parse(readFileSync(deploymentConfigPath, 'utf-8'));

if (!deployConfig.sites[siteName]) {
  console.error(`❌ Site "${siteName}" not found in deployment.config.json`);
  console.error(`\n📝 Available sites: ${Object.keys(deployConfig.sites).join(', ')}`);
  process.exit(1);
}

const siteEnvConfig = deployConfig.sites[siteName][environment];

if (!siteEnvConfig) {
  console.error(`❌ Environment "${environment}" not configured for site "${siteName}"`);
  console.error(`\n📝 Available environments for ${siteName}:`);
  console.error(`   ${Object.keys(deployConfig.sites[siteName]).join(', ')}`);
  process.exit(1);
}

const siteDir = join(sitesDir, siteName);
const distDir = join(siteDir, 'dist');

if (!existsSync(distDir)) {
  console.error(`❌ Build output not found. Run: npm run build ${siteName}`);
  process.exit(1);
}

// Create deployment manifest
const manifest = {
  site: siteName,
  environment,
  timestamp: new Date().toISOString(),
  config: siteEnvConfig,
  buildHash: getBuildHash(distDir)
};

const manifestPath = join(siteDir, '.deployment-manifest.json');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('\n📦 Deployment Summary');
console.log('━'.repeat(60));
console.log(`Site:        ${siteName}`);
console.log(`Environment: ${environment.toUpperCase()}`);
console.log(`Type:        ${siteEnvConfig.type || 'localhost'}`);
console.log(`URL:         ${siteEnvConfig.url}`);

if (siteEnvConfig.type === 'droplet') {
  console.log(`Host:        ${siteEnvConfig.user}@${siteEnvConfig.host}`);
  console.log(`Webroot:     ${siteEnvConfig.webroot}`);
}

if (siteEnvConfig.type === 'spaces') {
  console.log(`Bucket:      ${siteEnvConfig.bucket}`);
  console.log(`Path:        ${siteEnvConfig.path}`);
}

console.log('━'.repeat(60));

// Safety confirmation for production
if (environment === 'production') {
  console.log('\n⚠️  PRODUCTION DEPLOYMENT');
  console.log('━'.repeat(60));
  const confirmed = await confirmDeployment();
  
  if (!confirmed) {
    console.log('\n❌ Deployment cancelled by user');
    process.exit(0);
  }
}

// Execute deployment based on type
try {
  if (environment === 'localhost') {
    deployLocalhost(siteName, siteEnvConfig);
  } else if (siteEnvConfig.type === 'droplet') {
    deployToDroplet(siteName, siteEnvConfig, distDir);
  } else if (siteEnvConfig.type === 'spaces') {
    deployToSpaces(siteName, siteEnvConfig, distDir);
  } else {
    throw new Error(`Unknown deployment type: ${siteEnvConfig.type}`);
  }

  // Update last deployment record
  updateDeploymentHistory(siteName, environment, manifest);
  
  console.log('\n✅ Deployment successful!');
  console.log(`🌐 ${siteEnvConfig.url}\n`);

} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}

// ============================================================================
// Deployment Functions
// ============================================================================

function deployLocalhost(siteName, config) {
  console.log('\n🚀 Starting localhost development server...');
  console.log(`   Port: ${config.port}`);
  console.log(`   Press Ctrl+C to stop\n`);
  
  const siteDir = join(sitesDir, siteName);
  process.chdir(siteDir);
  
  execSync(`npm run dev -- --port ${config.port}`, {
    stdio: 'inherit',
    env: { ...process.env, DEV_PORT: config.port }
  });
}

function deployToDroplet(siteName, config, distDir) {
  console.log('\n🚀 Deploying to droplet...');
  
  const sshKey = join(process.env.USERPROFILE || process.env.HOME, '.ssh', config.sshKey);
  const host = `${config.user}@${config.host}`;
  
  if (!existsSync(sshKey)) {
    throw new Error(`SSH key not found: ${sshKey}`);
  }

  // Create webroot directory
  console.log(`[1/4] Creating webroot: ${config.webroot}`);
  execSync(
    `ssh -i "${sshKey}" ${host} "mkdir -p ${config.webroot}"`,
    { stdio: 'inherit' }
  );

  // Sync files
  console.log('[2/4] Syncing files...');
  
  // Use WSL's rsync on Windows
  const isWindows = process.platform === 'win32';
  let rsyncCmd;
  
  if (isWindows) {
    // Convert Windows path to WSL path
    const wslDistDir = distDir.replace(/\\/g, '/').replace(/^([A-Z]):/, (match, drive) => `/mnt/${drive.toLowerCase()}`);
    // Use SSH key from WSL home directory (already copied there)
    rsyncCmd = `wsl rsync -avz --delete -e "ssh -i ~/.ssh/${config.sshKey}" "${wslDistDir}/" ${host}:${config.webroot}/`;
  } else {
    rsyncCmd = `rsync -avz --delete -e "ssh -i '${sshKey}'" "${distDir}/" ${host}:${config.webroot}/`;
  }
  
  execSync(rsyncCmd, { stdio: 'inherit' });

  // Deploy nginx config if specified
  if (config.nginxConfig) {
    const nginxConfPath = join(rootDir, 'nginx', config.nginxConfig);
    
    if (existsSync(nginxConfPath)) {
      console.log('[3/4] Deploying nginx configuration...');
      
      execSync(
        `scp -i "${sshKey}" "${nginxConfPath}" ${host}:/etc/nginx/sites-available/${siteName}`,
        { stdio: 'inherit' }
      );
      
      execSync(
        `ssh -i "${sshKey}" ${host} "ln -sf /etc/nginx/sites-available/${siteName} /etc/nginx/sites-enabled/${siteName} && nginx -t && systemctl reload nginx"`,
        { stdio: 'inherit' }
      );
    } else {
      console.log('[3/4] ⚠️  nginx config not found, skipping...');
    }
  } else {
    console.log('[3/4] No nginx config specified');
  }

  // Set permissions
  console.log('[4/4] Setting permissions...');
  execSync(
    `ssh -i "${sshKey}" ${host} "chown -R www-data:www-data ${config.webroot} && chmod -R 755 ${config.webroot}"`,
    { stdio: 'inherit' }
  );
}

function deployToSpaces(siteName, config, distDir) {
  console.log('\n🚀 Deploying to Digital Ocean Spaces...');
  
  const required = ['SPACES_KEY', 'SPACES_SECRET', 'SPACES_ENDPOINT'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  try {
    execSync('aws --version', { stdio: 'ignore' });
  } catch {
    throw new Error('AWS CLI not found. Install it to deploy to Spaces.');
  }

  const awsCommand = `aws s3 sync . s3://${config.bucket}/${config.path}/ --endpoint-url=https://${process.env.SPACES_ENDPOINT} --acl public-read --delete`;
  
  execSync(awsCommand, {
    cwd: distDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      AWS_ACCESS_KEY_ID: process.env.SPACES_KEY,
      AWS_SECRET_ACCESS_KEY: process.env.SPACES_SECRET
    }
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

function getBuildHash(distDir) {
  try {
    const result = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' });
    return result.trim();
  } catch {
    // Fallback to timestamp if not in git repo
    return Date.now().toString(36);
  }
}

function updateDeploymentHistory(siteName, environment, manifest) {
  const historyPath = join(rootDir, '.deployment-history.json');
  let history = [];
  
  if (existsSync(historyPath)) {
    history = JSON.parse(readFileSync(historyPath, 'utf-8'));
  }
  
  history.unshift({
    site: siteName,
    environment,
    timestamp: manifest.timestamp,
    buildHash: manifest.buildHash,
    url: manifest.config.url
  });
  
  // Keep last 50 deployments
  history = history.slice(0, 50);
  
  writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

async function confirmDeployment() {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Type "DEPLOY" to confirm production deployment: ', (answer) => {
      rl.close();
      resolve(answer.trim() === 'DEPLOY');
    });
  });
}
