# Family Safety Campaign - Deployment Summary

**Date:** April 18, 2026

## ✅ Production Deployment Complete

The family safety landing page has been deployed to production and is live with a hashed URL.

## 🔗 URLs

**Use this URL for all Meta ads:**
```
https://try.ourbond.com/fs-573c4f54
```

**Full path (for reference only):**
```
https://try.ourbond.com/services/family/safety/
```

**Staging (for testing):**
```
https://lp-ourbond.adalane.com/services/family/safety/
```

## 📊 Campaign Structure

### Audiences (8 Total)
**Top of Funnel (TOFU) - 6 audiences:**
1. Parents With Adult Children 45-55
2. Parents With Teenagers 45-55
3. Parents With Children 45-55
4. Parents With Adult Children 55-65+
5. Parents With Teenagers 55-65+
6. Parents With Children 55-65+

**Mid Funnel (MOFU) - 2 audiences:**
7. Remarketing for Lone Workers
8. Remarketing for Families

### Ad Formats

**1. Video Ads**
- Anthem video (brand overview)
- 8 service-specific videos:
  - Track Me On The Go
  - Ready An Agent
  - Video Monitor Me
  - Send Me A Car
  - Siren
  - Dial 911
  - Road Assistance
  - Security Check

**2. Testimonial Ads (Static Images)**
- Sarah M. - Mother of Two Teenagers
- 3AM Emergency Response
- Solo Female Safety
- Elderly Parent (76 years old)
- Life-Saving Impact
- Road Safety & Travel

### Ad Copy Files

All ad copy with variations (A/B/C versions) located in:
```
d:\astro-ourbond\research\family-safety-meta-ads\
├── README.md (campaign overview)
├── targeting-audiences.md (detailed audience breakdown)
├── audience-insights.md (persona analysis from reviews)
├── video\
│   └── anthem-video.md (anthem video copy variations)
├── service-specific-videos.md (8 service videos, 3 variations each)
└── testimonial-ads.md (6 testimonial ads, 3 variations each)
```

## 🎯 Next Steps

1. **Create creative assets:**
   - Export anthem video
   - Export 8 service-specific videos
   - Design 6 testimonial cards (use design notes in testimonial-ads.md)

2. **Set up Meta Ads campaigns:**
   - Create 8 ad sets (one per audience)
   - Upload creative assets
   - Use ad copy variations from research files
   - Set landing page URL to: `https://try.ourbond.com/fs-573c4f54`

3. **Test before launch:**
   - Verify landing page loads: https://try.ourbond.com/fs-573c4f54
   - Test on mobile and desktop
   - Check all service videos on page
   - Verify CTA buttons work

4. **Budget allocation:**
   - 70% TOFU (cold audiences)
   - 30% MOFU (remarketing)

## 🔐 Technical Details

**Hashed URL Configuration:**
- Hash algorithm: SHA256 (first 8 chars)
- Input: "family-safety"
- Output hash: 573c4f54
- Prefix: `/fs-` (family safety campaigns)
- Nginx rewrite: `/fs-573c4f54` → `/services/family/safety/`

**Server:**
- Production: 24.199.118.174
- Domain: try.ourbond.com
- SSL: Let's Encrypt (HTTPS enabled)
- Web root: /var/www/ourbond/

**Deployment method:**
```powershell
npm run build
scp -i "$env:USERPROFILE\.ssh\id_rsa_nopass" -r dist/* root@24.199.118.174:/var/www/ourbond/
```

## 📝 Notes

- All URLs in ad copy have been updated to use the hashed production URL
- The hashed URL provides privacy and prevents competitors from easily identifying landing pages
- URL tracking parameters can be added: `https://try.ourbond.com/fs-573c4f54?utm_source=meta&utm_campaign=family-safety`
