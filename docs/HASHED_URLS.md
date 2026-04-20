# Hashed URLs for OurBond Landing Pages

This file tracks the obfuscated URLs that map to actual landing pages.

## Active Hashed URLs

| Hashed URL | Maps To | Hash Algorithm |
|------------|---------|----------------|
| `/lw-7e48d4ef` | `/services/merged-lone-workers-individual-pricing/` | SHA256(first 8 chars) |
| `/fs-573c4f54` | `/services/family/safety/` | SHA256(first 8 chars) |

## Full URLs

**Lone Workers:**
- **Hashed:** https://try.ourbond.com/lw-7e48d4ef
- **Actual:** https://try.ourbond.com/services/merged-lone-workers-individual-pricing/

**Family Safety:**
- **Hashed:** https://try.ourbond.com/fs-573c4f54
- **Actual:** https://try.ourbond.com/services/family/safety/

## How It Works

The nginx rewrite happens server-side, so:
- ✅ User sees the hashed URL in their browser
- ✅ Google/analytics see the hashed URL
- ✅ No redirect - it's an internal rewrite
- ✅ Same page, same tracking, just a different URL

## Adding New Hashed URLs

1. **Generate hash:**
   ```powershell
   $pageName = "your-page-name"
   [System.BitConverter]::ToString([System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($pageName))).Replace('-','').Substring(0,8).ToLower()
   ```

2. **Add rewrite to nginx config** (`nginx/adalane-static-sites-ssl.conf`):
   ```nginx
   rewrite ^/lw-HASH/?$ /services/your-page-name/ last;
   ```

3. **Deploy:**
   ```bash
   scp -i ~/.ssh/id_rsa_nopass nginx/adalane-static-sites-ssl.conf root@24.199.118.174:/etc/nginx/sites-available/adalane-static-sites
   ssh -i ~/.ssh/id_rsa_nopass root@24.199.118.174 "nginx -t && systemctl reload nginx"
   ```

4. **Update this file*for "Lone Workers" campaigns
- Using `/fs-` prefix for "Family Safety" campaigns

## Notes

- Hash is deterministic (same input = same output)
- Using `/lw-` prefix to indicate "Lone Workers" campaign
- Can use different prefixes for different campaigns/audiences
- Hash is URL-safe and SEO-neutral
