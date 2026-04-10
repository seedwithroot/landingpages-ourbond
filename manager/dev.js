#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const sitesDir = join(rootDir, 'sites');
const configPath = join(rootDir, 'sites.config.json');

const siteName = process.argv[2];

if (!siteName) {
  console.error('[ERROR] Usage: npm run dev <sitename>');
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'));
const siteConfig = config.sites[siteName];

if (!siteConfig) {
  console.error(`[ERROR] Site "${siteName}" not found`);
  process.exit(1);
}

const siteDir = join(sitesDir, siteName);

if (!existsSync(siteDir)) {
  console.error(`[ERROR] Site directory not found: ${siteDir}`);
  process.exit(1);
}

console.log(`[DEV] Starting dev server for ${siteName}...`);
console.log(`[INFO] Location: sites/${siteName}`);
console.log(`[INFO] URL: http://localhost:4321\n`);

// Run dev server using docker-compose
const devProcess = spawn('docker-compose', ['up', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    SITE_PATH: siteDir,
    DEV_PORT: '4321'
  }
});

devProcess.on('exit', (code) => {
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping dev server...');
  devProcess.kill('SIGINT');
});
