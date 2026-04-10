#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const sitesDir = join(rootDir, 'sites');
const deploymentConfigPath = join(rootDir, 'deployment.config.json');
const historyPath = join(rootDir, '.deployment-history.json');

const args = process.argv.slice(2);
const siteName = args[0];

if (!existsSync(deploymentConfigPath)) {
  console.error('❌ deployment.config.json not found');
  process.exit(1);
}

const deployConfig = JSON.parse(readFileSync(deploymentConfigPath, 'utf-8'));

if (siteName) {
  // Show detailed status for specific site
  showSiteStatus(siteName, deployConfig);
} else {
  // Show overview of all sites
  showOverview(deployConfig);
}

// ============================================================================
// Display Functions
// ============================================================================

function showOverview(config) {
  console.log('\n📊 Deployment Status Overview');
  console.log('═'.repeat(80));
  
  const sites = Object.keys(config.sites);
  
  for (const site of sites) {
    const siteConfig = config.sites[site];
    const manifestPath = join(sitesDir, site, '.deployment-manifest.json');
    
    let lastDeployment = null;
    if (existsSync(manifestPath)) {
      lastDeployment = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    }
    
    const environments = Object.keys(siteConfig);
    const prodConfig = siteConfig.production;
    
    console.log(`\n🌐 ${site}`);
    console.log('─'.repeat(80));
    console.log(`   Environments: ${environments.join(', ')}`);
    
    if (prodConfig) {
      console.log(`   Production:   ${prodConfig.url} (${prodConfig.type || 'N/A'})`);
    }
    
    if (lastDeployment) {
      const deployTime = new Date(lastDeployment.timestamp);
      const relativeTime = getRelativeTime(deployTime);
      console.log(`   Last Deploy:  ${lastDeployment.environment} - ${relativeTime}`);
      console.log(`   Build Hash:   ${lastDeployment.buildHash || 'N/A'}`);
    } else {
      console.log(`   Last Deploy:  Never`);
    }
  }
  
  console.log('\n═'.repeat(80));
  console.log('💡 Run "npm run deploy:status <sitename>" for detailed site status\n');
}

function showSiteStatus(siteName, config) {
  if (!config.sites[siteName]) {
    console.error(`❌ Site "${siteName}" not found`);
    console.error(`\nAvailable sites: ${Object.keys(config.sites).join(', ')}`);
    process.exit(1);
  }
  
  const siteConfig = config.sites[siteName];
  const manifestPath = join(sitesDir, siteName, '.deployment-manifest.json');
  
  console.log(`\n🌐 ${siteName} - Deployment Status`);
  console.log('═'.repeat(80));
  
  // Show each environment
  for (const [env, envConfig] of Object.entries(siteConfig)) {
    console.log(`\n📍 ${env.toUpperCase()}`);
    console.log('─'.repeat(80));
    console.log(`   Type:   ${envConfig.type || 'localhost'}`);
    console.log(`   URL:    ${envConfig.url}`);
    
    if (envConfig.type === 'droplet') {
      console.log(`   Host:   ${envConfig.user}@${envConfig.host}`);
      console.log(`   Path:   ${envConfig.webroot}`);
      if (envConfig.domain) {
        console.log(`   Domain: ${envConfig.domain}`);
      }
    }
    
    if (envConfig.type === 'spaces') {
      console.log(`   Bucket: ${envConfig.bucket}`);
      console.log(`   Path:   ${envConfig.path}`);
    }
  }
  
  // Show deployment history for this site
  if (existsSync(historyPath)) {
    const history = JSON.parse(readFileSync(historyPath, 'utf-8'));
    const siteHistory = history.filter(h => h.site === siteName).slice(0, 5);
    
    if (siteHistory.length > 0) {
      console.log('\n📜 Recent Deployments');
      console.log('─'.repeat(80));
      
      for (const deploy of siteHistory) {
        const deployTime = new Date(deploy.timestamp);
        const relativeTime = getRelativeTime(deployTime);
        console.log(`   ${deploy.environment.padEnd(12)} ${relativeTime.padEnd(20)} ${deploy.buildHash || 'N/A'}`);
      }
    }
  }
  
  // Show current manifest
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    console.log('\n📋 Last Deployment Manifest');
    console.log('─'.repeat(80));
    console.log(`   Environment: ${manifest.environment}`);
    console.log(`   Timestamp:   ${new Date(manifest.timestamp).toLocaleString()}`);
    console.log(`   Build Hash:  ${manifest.buildHash || 'N/A'}`);
  }
  
  console.log('\n═'.repeat(80));
  console.log(`💡 Deploy with: npm run deploy:safe ${siteName} <environment>\n`);
}

function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}
