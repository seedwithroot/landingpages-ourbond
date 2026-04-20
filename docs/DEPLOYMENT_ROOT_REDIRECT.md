# Deployment Notes

## Root Redirect Configuration

The root URL `https://try.ourbond.com/` redirects to `https://www.ourbond.com/`

## Important: Root index.html

**DO NOT deploy `dist/index.html` to production.**

The `index.html` at the project root is a page directory/index for development purposes only. If it exists in production, it will prevent the root redirect from working.

### After each deployment:

```powershell
# Remove the root index.html after deploying
ssh -i "$env:USERPROFILE\.ssh\id_rsa_nopass" root@24.199.118.174 "rm /var/www/ourbond/index.html"
```

### Or use rsync with exclude:

```powershell
# Deploy with rsync and exclude root index.html
rsync -avz --delete --exclude='index.html' -e "ssh -i \"$env:USERPROFILE\.ssh\id_rsa_nopass\"" dist/ root@24.199.118.174:/var/www/ourbond/
```

## Current nginx configuration

The redirect is configured in `/etc/nginx/sites-available/adalane-static-sites`:

```nginx
# Redirect root to main website
location = / {
    return 301 https://www.ourbond.com/;
}
```

This exact-match location block has priority over the general `location /` block, but only if there's no file at the root path to serve.
