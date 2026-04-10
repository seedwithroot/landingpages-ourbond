# CTA Links Management

## Overview

All call-to-action (CTA) links for the OurBond site are centralized in one file for easy management. **Google Ads tracking parameters are automatically preserved** when visitors click CTAs.

## Automatic Parameter Tracking

### How It Works

When visitors arrive from Google Ads (or other campaigns) with tracking parameters in the URL:
```
https://try.ourbond.com/?gclid=abc123&utm_source=google&utm_campaign=spring2026
```

The tracking script **automatically maps and appends** those parameters to all OneLink URLs using AppsFlyer's parameter format:
```
Original:  https://tg17.onelink.me/a7NX?...&af_sub5=ios-hero
Becomes:   https://tg17.onelink.me/a7NX?...&af_sub5=ios-hero&af_sub3=abc123&pid=google&c=spring2026
```

### Parameter Mapping

Standard marketing parameters are automatically converted to AppsFlyer OneLink parameters:

| URL Parameter | → | AppsFlyer Parameter | Description |
|---------------|---|---------------------|-------------|
| `gclid` | → | `af_sub3` | Google Ads Click ID |
| `fbclid` | → | `af_sub4` | Facebook Click ID |
| `msclkid` | → | `af_sub4` | Microsoft Ads Click ID |
| `utm_source` | → | `pid` | Media Source (e.g., "google", "facebook") |
| `utm_medium` | → | `af_adset` | Ad Set (e.g., "cpc", "display") |
| `utm_campaign` | → | `c` | Campaign Name |
| `utm_content` | → | `af_ad` | Ad Variation |
| `utm_term` | → | `af_keywords` | Keywords |

**Why map parameters?** AppsFlyer uses its own parameter names for attribution. This mapping ensures campaign data flows correctly into AppsFlyer analytics.

### Implementation

The tracking script is loaded on every page from `public/scripts/track-params.js` and automatically:
1. Reads tracking parameters from the page URL
2. Maps them to AppsFlyer parameter names
3. Stores them in sessionStorage for multi-page tracking
4. Appends them to all OneLink URLs (only)
5. Watches for dynamically added links and updates them too

**Important:** Only OneLink URLs (tg17.onelink.me) are modified. Other links are left unchanged.

No manual configuration needed - it works automatically on all pages.

## GA4 Click Event Tracking

### Automatic Event Tracking

Every time a user clicks on any download button (App Store or Google Play), an event is automatically sent to Google Analytics 4 via the dataLayer. **No additional code needed** - it works automatically for all OneLink buttons.

### Event Structure

When a button is clicked, the following event is pushed to the dataLayer:

```javascript
{
  event: 'download_button_click',
  button_type: 'download',
  platform: 'ios',              // or 'android'
  section: 'hero',               // e.g., 'hero', 'features', 'pricing'
  button_location: 'ios-hero',   // Full identifier from af_sub5
  link_url: 'https://tg17.onelink.me/...' // Complete OneLink URL
}
```

### Event Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `event` | `download_button_click` | Event name for GA4 |
| `button_type` | `download` | Always "download" for app download buttons |
| `platform` | `ios` or `android` | Which app store the user clicked |
| `section` | `hero`, `features`, `pricing`, etc. | Page section where button was clicked |
| `button_location` | `ios-hero`, `android-features` | Full section identifier from af_sub5 parameter |
| `link_url` | Full OneLink URL | Complete URL including all tracking parameters |

### How to View Events in GA4

1. **Go to GA4 Dashboard** → Reports → Realtime
2. **Click a download button** on any page
3. **Event will appear** as `download_button_click` in the event stream
4. **View parameters** by clicking on the event to see platform, section, button_location

### Creating Custom Reports

In GA4, you can create custom reports to analyze:
- **Which sections drive most downloads** (group by `section`)
- **iOS vs Android preference** (group by `platform`)
- **Specific button performance** (group by `button_location`)
- **Download conversion rate** (compare page views to download_button_click events)

### Testing Click Tracking

To verify click tracking is working:

1. **Open browser console** (F12) and visit any page with download buttons
2. **Click any download button**
3. **Look for console message:**
   ```
   [OneLink Tracking] Button click tracked: {
     platform: "ios",
     section: "hero",
     button_location: "ios-hero"
   }
   ```
4. **Check dataLayer** in console:
   ```javascript
   window.dataLayer
   // Should show the download_button_click event
   ```
5. **Verify in GA4 Realtime** report that event appears

**Important:** Only OneLink URLs (tg17.onelink.me) are modified. Other links are left unchanged.

No manual configuration needed - it works automatically on all pages.

## Testing Parameter Tracking

To test if tracking parameters are being captured and mapped correctly:

1. **Visit a page with test parameters:**
   ```
   http://localhost:4321/?gclid=test123&utm_source=google&utm_campaign=testcampaign
   ```

2. **Open browser console** (F12) and look for:
   ```
   [OneLink Tracking] Links updated with params: {af_sub3: "test123", pid: "google", c: "testcampaign"}
   ```

3. **Inspect any download button link** - you should see the href with mapped AppsFlyer parameters:
   ```
   https://tg17.onelink.me/a7NX?...&af_sub5=ios-hero&af_sub3=test123&pid=google&c=testcampaign
   ```

4. **Test parameter persistence:** Navigate to another page (without URL parameters). The stored parameters should still be appended to links.

5. **Test click tracking:** Click any download button and verify console shows:
   ```
   [OneLink Tracking] Button click tracked: {platform: "ios", section: "hero", button_location: "ios-hero"}
   ```

6. **Verify dataLayer events:** In console, run `window.dataLayer` to see all events, including `download_button_click` events with platform/section data.

7. **Check GA4 Realtime:** Open GA4 dashboard → Realtime report and verify `download_button_click` events appear when you click buttons.

8. **Verify in AppsFlyer:** When testing, check that AppsFlyer receives the parameters in the attribution dashboard.

## File Location

**`src/data/cta-links.js`**

## CTA Link Types

All CTAs now use the same base OneLink URL with automatic button tracking via `af_sub5` parameter.

### Base OneLink

```
https://tg17.onelink.me/a7NX?deep_link_value=redeem_code&af_sub1=redeem_code&pid=custom_paid_ad&c=2026sprintdtc&code=SPRINGBOND&deep_link_sub1=SPRINGBOND&af_sub2=SPRINGBOND
```

### Button Tracking with `af_sub5`

Every app store button includes an `af_sub5` parameter to track which specific button was clicked:

- **iOS buttons:** `af_sub5=ios-{section}`
- **Android buttons:** `af_sub5=android-{section}`

**Section identifiers:**
- `nav` - Navigation bar buttons
- `hero` - Hero section buttons
- `features` - Feature grid section buttons
- `feature-{id}` - Individual feature section buttons (e.g., `feature-location`, `feature-arrival`)
- `hook` - Hook CTA section buttons
- `social-proof` - Social proof section buttons
- `footer` - Footer buttons

**Example URLs:**
```
iOS Hero: ...&af_sub5=ios-hero
Android Nav: ...&af_sub5=android-nav
iOS Feature: ...&af_sub5=ios-feature-location
```

### Helper Functions

Use these functions to generate links with proper tracking:

```javascript
import { getAppStoreLink, getGooglePlayLink } from '../data/cta-links.js';

// In your component/page:
<a href={getAppStoreLink('hero')}>
  <img src="/buttons/apple-light.png" alt="Download on App Store" />
</a>

<a href={getGooglePlayLink('hero')}>
  <img src="/buttons/google-light.png" alt="Download on Google Play" />
</a>
```

### Legacy Links (for reference)

The following properties still exist in `ctaLinks` for backward compatibility:

1. **`ctaLinks.primary`** - General purpose CTA (Get Started, etc.)
2. **`ctaLinks.pricingIndividual`** - Individual plan CTAs
3. **`ctaLinks.pricingFamily`** - Family plan CTAs
4. **`ctaLinks.appStore`** - Base App Store link (no tracking)
5. **`ctaLinks.googlePlay`** - Base Google Play link (no tracking)

**⚠️ Use helper functions instead:** For proper button tracking, always use `getAppStoreLink(section)` and `getGooglePlayLink(section)` instead of the direct properties.

## How to Update Links

### Edit the Base URL

Open `src/data/cta-links.js` and update the `BASE_ONELINK` constant:

```javascript
export const ctaLinks = {
  primary: 'https://your-new-primary-link.com',
  pricingIndividual: 'https://individual-plan-link.com',
  pricingFamily: 'https://family-plan-link.com',
  appStore: 'https://apps.apple.com/...',
  googlePlay: 'https://play.google.com/...',
};
```

### Rebuild and Deploy

After editing, rebuild and deploy:

```bash
npm run build ourbond
npm run deploy:safe ourbond staging
```

## Usage in Code

### In Page/Component Files

```astro
---
import { ctaLinks } from '../data/cta-links.js';
---

<!-- General CTA button -->
<a href={ctaLinks.primary}>Get Started</a>

<!-- App store buttons -->
<a href={ctaLinks.appStore}>
  <img src="/buttons/apple-light.png" alt="App Store" />
</a>

<a href={ctaLinks.googlePlay}>
  <img src="/buttons/google-light.png" alt="Google Play" />
</a>
```

### In Pricing Tables

Pricing table CTAs are automatically handled by the `getPricingPlans()` function in `pricing.js`, which imports and applies the correct CTA links.

## Files Updated

The following files now use centralized CTA links:

- ✅ `src/data/pricing.js` - Pricing table CTAs
- ✅ `src/layouts/Layout.astro` - Header app store buttons
- ✅ `src/pages/individuals-fear.astro` - Primary CTA
- ✅ `src/pages/families-fear.astro` - Primary CTA
- ✅ `src/pages/individuals-peace.astro` - Primary CTA
- ✅ `src/pages/families-peace.astro` - Primary CTA

## Next Steps  

Provide the remaining 3 CTA links:

1. **Individual plan pricing table CTA** - Where should "Try 30 days free" go for Individual plans?
2. **Family plan pricing table CTA** - Where should "Try 30 days free" go for Family plans?
3. **App Store link** - Full Apple App Store URL
4. **Google Play link** - Full Google Play Store URL

Once provided, update them in `cta-links.js` and redeploy.
