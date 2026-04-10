#!/usr/bin/env node
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const configPath = join(rootDir, 'sites.config.json');

const config = JSON.parse(readFileSync(configPath, 'utf-8'));
const sites = Object.values(config.sites);

if (sites.length === 0) {
  console.log('[INFO] No sites found. Create one with: npm run new <sitename>');
  process.exit(0);
}

console.log('\n[LIST] Managed Sites:\n');

sites.forEach((site, index) => {
  console.log(`${index + 1}. ${site.name}`);
  console.log(`   Domain: ${site.domain}`);
  console.log(`   Spaces Path: ${site.spacesPath}`);
  console.log(`   Created: ${new Date(site.created).toLocaleDateString()}`);
  console.log('');
});

console.log(`Total: ${sites.length} site${sites.length !== 1 ? 's' : ''}\n`);
