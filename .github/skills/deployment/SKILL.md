---
name: deployment
description: 'Deploy static sites to nginx servers. Use when: deploying to production, deploying to staging, updating try.ourbond.com or lp-ourbond.adalane.com, checking nginx config, adding new domain mapping, or avoiding disruption to other hosted sites. Understands map-based multi-tenant nginx routing.'
---

# Deployment to Nginx Servers

This skill handles safe deployments to the static site servers, ensuring nginx configuration is understood before deployment to avoid disrupting other hosted sites.

## Server Infrastructure

**Production Server**: 24.199.118.174
- Domain: try.ourbond.com
- Web root: /var/www/ourbond
- SSL: Let's Encrypt (auto-renew enabled)

**Staging Server**: 137.184.116.148
- Domain: lp-ourbond.adalane.com
- Web root: /var/www/lp-ourbond
- SSL: Not configured (HTTP only)

## Pre-Deployment Checklist

Always complete these steps IN ORDER before deploying:

### 1. Identify Target Environment
Determine which server you're deploying to:

**Production** (24.199.118.174):
```powershell
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@24.199.118.174 "cat /etc/nginx/sites-available/adalane-static-sites"
```

**Staging** (137.184.116.148):
```powershell
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@137.184.116.148 "cat /etc/nginx/sites-available/adalane-static-sites"
```

Look for:
- `map $host $site_folder` block — maps domains to web root folders
- Server's current domain mappings
- SSL/HTTPS configuration per domain
- Any custom location blocks

### 2. Verify Domain Mapping
Confirm the target domain exists in the nginx map block on the correct server:

**Production nginx map**:
```nginx
map $host $site_folder {
    try.ourbond.com    ourbond;
    # ... other domains
}
```

**Staging nginx map**:
```nginx
map $host $site_folder {
    lp-ourbond.adalane.com    lp-ourbond;
    # ... other domains
}
```

If deploying to a **new domain**, you must:
1. Add the domain to the map block on the correct server
2. Reload nginx config: `ssh ... "nginx -t && systemctl reload nginx"`
3. Verify SSL cert exists or generate with certbot (production only)

### 3. Identify Web Root
Based on the map and server, determine the web root path:
- Production: `try.ourbond.com` → `/var/www/ourbond/` on 24.199.118.174
**Deploy to staging**:
```powershell
npm run build
npm run deploy:safe ourbond staging
```

**Deploy to production** (requires confirmation):
```powershell
npm run build
npm run deploy:safe ourbond production
```

### Method 2: Manual SCP Deployment
For staging (137.184.116.148):
```powershell
npm run build
scp -i "$env:USERPROFILE\.ssh\id_rsa_nopass" -r docs/* root@137.184.116.148:/var/www/lp-ourbond/
```

For production (24.199.118.174):
- Staging: `lp-ourbond.adalane.com` → `/var/www/lp-ourbond/` on 137.184.116.148

### 4. Build Locally First
Always build and verify locally before deploying:

```powershell
npm run build
# Verify dist/ output exists and is not empty
```

## Deployment Methods

### Method 1: Using deploy-safe.js (Recommended)
For sites configured in `deployment.config.json`:

```powershell
npm run deploy:safe ourbond production
```

This script:
- Validates build exists
- Creates deployment manifest
- Uses SCP to transfer files to droplet
- Preserves permissions

### Method 2: Manual SCP Deployment
For direct control or debugging:

```powershell
# Deploy entire dist folder to web root
scp -i "$env:USERPROFILE\.ssh\id_rsa_nopass" -r dist/* root@24.199.118.174:/var/www/ourbond/

# Deploy specific page
scp -i "$env:USERPROFILE\.ssh\id_rsa_nopass" -r dist/services/* root@24.199.118.174:/var/www/ourbond/services/
```

**Important:** Use `-r` for directories, ensure trailing `/` on destination to deploy contents (not folder itself).

## Shared Server Safety Rules

### Rule 1: NEVER Deploy to Root /var/www/
Always deploy to the specific site folder: `/var/www/<site_folder>/`

**Bad:** `scp dist/* root@24.199.118.174:/var/www/`  
**Good:** `scp dist/* root@24.199.118.174:/var/www/ourbond/`

### Rule 2: Verify Target Server and Folder Before Deployment
SSH into the CORRECT server and verify the folder:

**Staging:**
```powershell
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@137.184.116.148 "ls -la /var/www/lp-ourbond/"
```

**Production:**
```powershell
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@24.199.118.174 "ls -la /var/www/ourbond/"
```

### Rule 3: Test Config Before Reloading Nginx
When editing nginx config, ALWAYS test first:

```powershell
ssh ... "nginx -t" on the appropriate server:

**Production:**
```powershell
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@24.199.118.174 "cat /etc/nginx/sites-available/adalane-static-sites | grep -A 20 'map \$host'"
```

**Staging:**
```powershell
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@137.184.116.148 "cat /etc/nginx/sites-available/adalane-static-sites | grep -A 20 'map \$host'"
```

### Rule 5: Backup Before Major Changes
Before editing nginx config or deploying significant updates:

```powershell
# Backup nginx config (replace IP with correct server)
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@<SERVER_IP> "cp /etc/nginx/sites-available/adalane-static-sites /etc/nginx/sites-available/adalane-static-sites.backup-$(date +%Y%m%d)"

# Backup site folder (optional)
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@<SERVER_IP> "tar -czf /var/backups/<sitename>-$(date +%Y%m%d).tar.gz -C /var/www <sitename>
```powershell
# Backup nginx config
ssh ... "cp /etc/nginx/sites-available/adalane-static-sites /etc/nginx/sites-available/adalane-static-sites.backup-$(date +%Y%m%d)"

# Backup site folder (optional)
ssh ... "tar -czf /var/backups/ourbond-$(date +%Y%m%d).tar.gz -C /var/www ourbond"
```

## Post-Deployment Verification

### 1. Check File Permissions
Ensure nginx can read the files:

```powershell
ssh ... "ls -la /var/www/ourbond/ | head -20"
# Should show root:root ownership, readable by others
```

### 2. Test Domain Resolution
Verify the domain resolves correctly:

```powershell
# Check DNS
nslookup try.ourbond.com

# Test HTTP response
curl -I https://try.ourbond.com
```

### 3. Check Nginx Logs
If issues occur, check lStaging
Example: Update lp-ourbond.adalane.com (staging)

```powershell
# 1. Build
npm run build

# 2. Deploy to staging server (137.184.116.148)
npm run deploy:safe ourbond staging

# 3. Verify
curl -I http://lp-ourbond.adalane.com
```

### Scenario: Deploy to Production
Example: Update try.ourbond.com (production)
```powershell
# Error log
ssh ... "tail -50 /var/log/nginx/error.log"

# Access log (shows which site_folder was used)
ssh ... "tail -50 /var/log/nginx/access.log | grep ourbond"
```

### 4. Verify Other Sites Still Work
Quick spot-check that other domains still resolve:

```powershell
curl -I https://lp-sitefuel.adalane.com
curl -I https://hercules.adalane.com
```

## Common Scenarios

### Scenario: Deploy to Existing Domain
Example: Update try.ourbond.com

1. Read nginx config (confirm mapping exists)
2. Build locally: `npm run build`
3. Deploy: `npm run deploy:safe ourbond production`
4. Verify: `curl -I https://try.ourbond.com`

### Scenario: Add New Domain
Example: Add new-client.com → /var/www/newclient/

1. SSH to server and edit nginx config:
   ```bash
   nano /etc/nginx/sites-available/adalane-static-sites
   ```
2. Add to map block:
   ```nginx
   new-client.com    newclient;
   ```
3. Test and reload nginx:
   ```bash
   nginx -t && systemctl reload nginx
   ```
4. Create web root:
   ```bash
   mkdir -p /var/www/newclient
   ```
5. Deploy files via SCP
6. If HTTPS needed, run certbot:
   ```bash
   certbot --nginx -d new-client.com
   ```

### Scenario: Hashed URL Routing
ourbond uses hashed URLs like `/lw-7e48d4ef` that map to service pages.

These are handled in the build process (see `hashed-urls.csv`). Nginx serves them as static files — no special config needed. Just deploy the dist folder.

## Server Details

### Production Server
- **Host:** 24.199.118.174
- **Domain:** try.ourbond.com
- **Web Root:** /var/www/ourbond
- **SSH User:** root
- **SSH Key:** `$env:USERPROFILE\.ssh\id_rsa_nopass`
- **SSL:** Let's Encrypt (auto-renew)

### Staging Server
- **Host:** 137.184.116.148
- **Domain:** lp-ourbond.adalane.com
- **Web Root:** /var/www/lp-ourbond
- **SSH User:** root
- **SSH Key:** `$env:USERPROFILE\.ssh\id_rsa_nopass`
- **SSL:** None (HTTP only)
- **Nginx Config:** `/etc/nginx/sites-available/adalane-static-sites`
- **Enabled Config:** `/etc/nginx/sites-enabled/` (symlinked)
- **Web Roots:** `/var/www/<site_folder>/`
- **Nginx Type:** Host-based (not Docker)

### Current Sites on Server
Based on nginx map (verify with step 1):
- `try.ourbond.com` → `/var/www/ourbond/`
- `lp-sitefuel.adalane.com` → `/var/www/lp-sitefuel/`
- `hercules.adalane.com` → `/var/www/hercules/`
- `intro.sitefuel.com` → `/var/www/hercules/`
- `herculesstage.adalane.com` → `/var/www/herculesstage/`

## DNS Configuration Notes

**IP-based domains:** Point A record directly to 24.199.118.174  
**CNAME-based domains:** Point to another domain that resolves to the droplet

Both work with the map-based routing as long as the domain is in the nginx map.

## Troubleshooting

### Issue: 404 for Valid Domain
**Cause:** Domain not in nginx map, or map variable not matching.

**Solution:**
1. Check if domain is in map block
2. Test with curl: `curl -H "Host: try.ourbond.com" http://24.199.118.174`
3. Check nginx error log for specifics

### Issue: Changes Not Appearing
**Cause:** Browser cache, CDN cache, or old files not replaced.

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Check file timestamps on server: `ssh ... "ls -lt /var/www/ourbond/ | head"`
3. Verify SCP completed successfully

### Issue: Other Sites Broken After Deployment
**Cause:** Nginx config error or typo in map block.

**Solution:**
1. Restore nginx backup: `ssh ... "cp /etc/nginx/sites-available/adalane-static-sites.backup-YYYYMMDD /etc/nginx/sites-available/adalane-static-sites"`
2. Reload nginx: `ssh ... "systemctl reload nginx"`
3. Review what changed with diff

## Related Files

- `manager/deploy-safe.js` — Safe deployment script with validation
- `manager/deploy-droplet.js` — Alternative droplet deployment script
- `deployment.config.json` — Site and environment configuration
- `nginx/adalane-static-sites-updated.conf` — Local reference copy of nginx config
- `docs/CTA_MANAGEMENT.md` — Related to landing page updates
- User memory: `adalane-server.md` — Server access details

## Anti-Patterns to Avoid

❌ Deploying without checking nginx config first  
❌ Editing nginx config without running `nginx -t`  
❌ Deploying to wrong folder (breaks other sites)  
❌ Skipping post-deployment verification  
❌ Making changes during high-traffic hours without testing  
❌ Using `rm -rf` commands on server web roots  
❌ Modifying nginx without backing up config

## When NOT to Use This Skill

- **Construction CRM deployment:** Use server 146.190.123.160 (different process)
- **Plane/Projects server:** Use 147.182.232.23 (different architecture)
- **Digital Ocean Spaces:** Use `manager/deploy.js` (CDN, not droplet)
- **Local development:** Use `npm run dev` (no deployment)

## Workflow Example

```powershell
# 1. Check nginx config
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@24.199.118.174 "cat /etc/nginx/sites-available/adalane-static-sites"

# 2. Verify mapping exists for try.ourbond.com → ourbond
# (Look for line in map block)

# 3. Build locally
npm run build

# 4. Deploy
npm run deploy:safe ourbond production

# 5. Verify
curl -I https://try.ourbond.com

# 6. Spot-check other sites
curl -I https://lp-sitefuel.adalane.com
```

**Remember:** The nginx map is the source of truth for routing. Always read it first.
