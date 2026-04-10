#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
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
  console.error('❌ Usage: npm run deploy:droplet <sitename>');
  console.error('\nExample: npm run deploy:droplet adalane');
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'));
const siteConfig = config.sites[siteName];
const dropletConfig = config.droplet;

if (!siteConfig) {
  console.error(`[ERROR] Site "${siteName}" not found in config`);
  process.exit(1);
}

if (!dropletConfig) {
  console.error('❌ Droplet configuration not found in sites.config.json');
  console.error('Add "droplet" section with host, user, and webroot');
  process.exit(1);
}

const siteDir = join(sitesDir, siteName);
const distDir = join(siteDir, 'dist');
const nginxDir = join(rootDir, 'nginx');
const nginxConfPath = join(nginxDir, `${siteName}.conf`);

if (!existsSync(distDir)) {
  console.error(`[ERROR] Build output not found. Run: npm run build ${siteName}`);
  process.exit(1);
}

// Check for required environment variables
const required = ['DROPLET_HOST', 'DROPLET_USER', 'DROPLET_SSH_KEY'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  console.error('\n💡 Add these to your .env file:');
  console.error('   DROPLET_HOST=123.45.67.89');
  console.error('   DROPLET_USER=root');
  console.error('   DROPLET_SSH_KEY=C:\\Users\\YOU\\.ssh\\id_rsa');
  process.exit(1);
}

const host = process.env.DROPLET_HOST;
const user = process.env.DROPLET_USER;
const sshKey = process.env.DROPLET_SSH_KEY;
const webroot = dropletConfig.webroot || '/var/www';
const siteWebroot = siteConfig.dropletPath || `${webroot}/${siteName}`;

console.log(`\n🚀 Deploying ${siteName} to Digital Ocean Droplet...\n`);
console.log(`   Host: ${user}@${host}`);
console.log(`   Destination: ${siteWebroot}`);
console.log('');

try {
  // Step 1: Create webroot directory on droplet
  console.log('[SETUP] Creating webroot directory...');
  execSync(
    `ssh -i "${sshKey}" ${user}@${host} "mkdir -p ${siteWebroot}"`,
    { stdio: 'inherit' }
  );

  // Step 2: Sync dist/ to droplet using rsync
  console.log('\n[SYNC] Syncing files to droplet...');
  const rsyncCmd = `rsync -avz --delete -e "ssh -i \\"${sshKey}\\"" "${distDir}/" ${user}@${host}:${siteWebroot}/`;
  console.log(`   Running: ${rsyncCmd}\n`);
  
  execSync(rsyncCmd, { stdio: 'inherit' });

  // Step 3: Deploy nginx config if it exists
  if (existsSync(nginxConfPath)) {
    console.log('\n[NGINX] Deploying nginx configuration...');
    
    // Copy nginx config to sites-available
    execSync(
      `scp -i "${sshKey}" "${nginxConfPath}" ${user}@${host}:/etc/nginx/sites-available/${siteName}`,
      { stdio: 'inherit' }
    );
    
    // Create symlink in sites-enabled if it doesn't exist
    const symlinkCmd = `
      if [ ! -L /etc/nginx/sites-enabled/${siteName} ]; then
        ln -s /etc/nginx/sites-available/${siteName} /etc/nginx/sites-enabled/${siteName}
        echo "[NGINX] Created nginx symlink"
      else
        echo "[NGINX] Nginx symlink already exists"
      fi
    `;
    
    execSync(
      `ssh -i "${sshKey}" ${user}@${host} "${symlinkCmd}"`,
      { stdio: 'inherit' }
    );
    
    // Test nginx config
    console.log('\n🧪 Testing nginx configuration...');
    execSync(
      `ssh -i "${sshKey}" ${user}@${host} "nginx -t"`,
      { stdio: 'inherit' }
    );
    
    // Reload nginx
    console.log('\n🔄 Reloading nginx...');
    execSync(
      `ssh -i "${sshKey}" ${user}@${host} "systemctl reload nginx"`,
      { stdio: 'inherit' }
    );
  } else {
    console.log(`\n[WARN] nginx config not found at: ${nginxConfPath}`);
    console.log('   Skipping nginx deployment. Create config in nginx/ directory.');
  }

  // Step 4: Set permissions
  console.log('\n[PERMS] Setting permissions...');
  execSync(
    `ssh -i "${sshKey}" ${user}@${host} "chown -R www-data:www-data ${siteWebroot} && chmod -R 755 ${siteWebroot}"`,
    { stdio: 'inherit' }
  );

  console.log('\n[SUCCESS] Deployment complete!\n');
  console.log(`[SITE] Your site should be available at: https://${siteConfig.domain}\n`);
  console.log('[TODO] Next steps:');
  console.log(`   1. Run certbot: ssh ${user}@${host}`);
  console.log(`   2. sudo certbot --nginx -d ${siteConfig.domain} -d www.${siteConfig.domain}`);
  console.log('   3. Uncomment HTTPS redirect in nginx config');
  console.log('   4. Test: curl -H "Accept: text/markdown" https://${siteConfig.domain}\n');

} catch (error) {
  console.error('\n[ERROR] Deployment failed:', error.message);
  console.error('\n[INFO] Troubleshooting:');
  console.error('   - Verify SSH key has access to droplet');
  console.error('   - Check that nginx is installed on droplet');
  console.error('   - Ensure user has sudo permissions');
  console.error(`   - Test connection: ssh -i "${sshKey}" ${user}@${host}`);
  process.exit(1);
}
