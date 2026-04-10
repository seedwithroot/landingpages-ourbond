#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { config as loadEnv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const sitesDir = join(rootDir, 'sites');
const configPath = join(rootDir, 'sites.config.json');

// Load environment variables
loadEnv({ path: join(rootDir, '.env') });

const siteName = process.argv[2];

if (!siteName) {
  console.error('[ERROR] Usage: npm run deploy <sitename>');
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'));
const siteConfig = config.sites[siteName];

if (!siteConfig) {
  console.error(`[ERROR] Site "${siteName}" not found in config`);
  process.exit(1);
}

const siteDir = join(sitesDir, siteName);
const distDir = join(siteDir, 'dist');

if (!existsSync(distDir)) {
  console.error(`[ERROR] Build output not found. Run: npm run build ${siteName}`);
  process.exit(1);
}

// Check for required environment variables
const required = ['SPACES_KEY', 'SPACES_SECRET', 'SPACES_BUCKET', 'SPACES_ENDPOINT'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('[ERROR] Missing environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  console.error('\n[INFO] Copy .env.example to .env and fill in your credentials');
  process.exit(1);
}

console.log(`\n[DEPLOY] Deploying ${siteName} to Digital Ocean Spaces...\n`);

const spacesPath = siteConfig.spacesPath || siteName;
const endpoint = process.env.SPACES_ENDPOINT;
const bucket = process.env.SPACES_BUCKET;

// Check if AWS CLI is installed
try {
  execSync('aws --version', { stdio: 'ignore' });
} catch {
  console.error('[ERROR] AWS CLI not found. Install it to deploy to Spaces:');
  console.error('   Windows: https://aws.amazon.com/cli/');
  console.error('   Or use: winget install Amazon.AWSCLI');
  process.exit(1);
}

try {
  // Upload files using AWS S3 CLI (compatible with DO Spaces)
  console.log(`[UPLOAD] Uploading files...`);
  
  const awsCommand = `aws s3 sync . s3://${bucket}/${spacesPath}/ --endpoint-url=https://${endpoint} --acl public-read --delete`;
  
  execSync(awsCommand, {
    cwd: distDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      AWS_ACCESS_KEY_ID: process.env.SPACES_KEY,
      AWS_SECRET_ACCESS_KEY: process.env.SPACES_SECRET
    }
  });
  
  console.log(`\n[SUCCESS] ${siteName} deployed successfully!`);
  console.log(`\n[URL] Your site is available at:`);
  console.log(`   https://${bucket}.${endpoint}/${spacesPath}/index.html`);
  console.log(`\n[INFO] Configure a custom domain in your Spaces CDN settings`);
  
} catch (error) {
  console.error('[ERROR] Deployment failed:', error.message);
  process.exit(1);
}
