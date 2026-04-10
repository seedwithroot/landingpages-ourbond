# OurBond Landing Pages

**Primary Domain:** lp.ourbond.com  
**Theme:** Based on sitefuelppc Houston page design  
**Focus:** App download CTAs instead of quote forms

## 📄 Page Structure

### Main Pages

- **`index.astro`** - Main landing page with app download focus
- **`index-showcase.astro`** - Showcase page listing all 4 segment pages

### Segment Landing Pages (for Paid Ads)

All segment pages use [PLACEHOLDER] tags for content that needs to be updated:

#### Families Segment
- **`families-fear.astro`** - Dark theme, fear-based messaging
  - Colors: Dark backgrounds (#0a0a0a, #1a1a1a)
  - CTA: Red urgency button (#dc3545)
  - Messaging: Urgent/time-sensitive, emphasizes risks
  - Trust line: "⚠️ Urgent ⚠️ Time Sensitive ⚠️ Act Now"

- **`families-peace.astro`** - Light theme, peace of mind messaging
  - Colors: Light backgrounds (white, #f8f9fa)
  - CTA: Blue primary button (#2563eb)
  - Messaging: Reassuring/connection-focused
  - Trust line: "✓ Trusted by Families ✓ Easy to Use ✓ Secure & Private"

#### Individuals Segment
- **`individuals-fear.astro`** - Dark theme, fear-based messaging
  - Colors: Dark backgrounds (#0a0a0a, #1a1a1a)
  - CTA: Red urgency button (#dc3545)
  - Messaging: Emphasizes protection gaps and time sensitivity
  - Trust line: "⚠️ Urgent ⚠️ Time Sensitive ⚠️ Act Now"

- **`individuals-peace.astro`** - Light theme, peace of mind messaging
  - Colors: Light backgrounds (white, #f8f9fa)
  - CTA: Blue primary button (#2563eb)
  - Messaging: Personal support and confidence-building
  - Trust line: "✓ Trusted Protection ✓ Simple Process ✓ Personal Support"

## 🎨 Theme Variants

This site has 2 additional theme variants in separate site directories:

- **ourbond-dark** (lp-dark.ourbond.com) - Black background theme
- **ourbond-black** (lp-black.ourbond.com) - Black accent theme

## 🧩 Components

All components imported from sitefuelppc theme:

- `Hero` - Main hero section with app image (replaces form)
- `PhoneCTA` - Converted to "Download App" CTAs
- `CheckmarkList` - Bullet lists with checkmarks
- `FeaturesGrid` - Grid layout for service features (2/3/4 columns)
- `BenefitsColumn` - Detailed benefits with icons
- `CTA` - Final call-to-action section (3 variants)
- `QuoteForm` - Available but not used (app download focus)

## 📊 Data Repository

All content is stored in structured JSON files in the `data/` directory:

### `data/reviews.json`
- 12 real user reviews parsed from OurBond website
- Includes author, rating, text, persona, use case, and segment
- 6 featured reviews marked for prominent display
- Can be filtered by segment (families/individuals) or persona

### `data/features.json`
- 8 core product features with descriptions and benefits
- Tagged by segment (families/individuals/both)
- Use cases mapped to personas
- Peace vs. fear messaging variants for each benefit

### `data/content.json`
- Headlines and subheadlines for all segments (families/individuals × peace/fear)
- CTAs (primary, secondary, urgent variants)
- Trust lines for peace and fear messaging
- Value propositions by segment
- Statistics and social proof
- 8 FAQs covering common questions

### `data/tracks.json` ⭐ ENRICHED
Complete Individual and Family content tracks with detailed service information:
- **Individuals track**: 11 services with detailed "how it works" explanations, features, and categories (PREVENTATIVE, URGENT, INFORMATIVE)
- **Families track**: 10 family-specific services adapted for household use
- **Pricing tiers**: Complete pricing for Basic ($0), Premium ($50/mo), Premium Plus ($100/mo)
  - Detailed feature breakdowns for each tier
  - Agent engagement limits (0, 5, 30 per month)
  - Third-party service availability
- **Shared content**: Brand messaging, Command Center description, endorsements from law enforcement officials
- **Service categories**: Each service tagged as PREVENTATIVE, URGENT, INFORMATIVE, SUPPORT, or PREMIUM
- **Real testimonials**: Including Ken P.'s experience with former FBI/Homeland Security bodyguards

## ✏️ Using Data in Pages

Import data into your Astro pages:

```astro
---
import reviews from '../data/reviews.json';
import features from '../data/features.json';
import content from '../data/content.json';

// Filter reviews for specific segment
const familyReviews = reviews.reviews.filter(r => r.segment === 'families');
const featuredReviews = reviews.reviews.filter(r => r.featured);

// Get content for specific audience
const headline = content.headlines.families.peace[0];
const cta = content.ctas.primary[0];
---
```

### Content Updates Needed:

While data files contain structured content, segment pages still have [PLACEHOLDER] tags that should be replaced with dynamic imports from the data files:

1. **Import data files** - Add imports at top of each page
2. **Replace static content** - Use data instead of hardcoded arrays
3. **Apply segment filtering** - Show families vs individuals content
4. **Apply tone filtering** - Peace vs fear messaging variants
5. **Update page titles/meta** - SEO optimization with real content

### In `src/layouts/Layout.astro`:

1. **Logo** - Already updated with OurBond WordPress logo
2. **Download App button** - Update URL when app is published
3. **Customize colors** - Current blue (#2563eb) can be adjusted via CSS variables

## 🚀 Development

```bash
# Start dev server
npm run dev ourbond

# View at
http://localhost:4321/
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build ourbond

# Deploy to droplet
npm run deploy:droplet ourbond
```

## 🎨 Color Variables

Current theme uses these CSS variables (edit in `Layout.astro`):

```css
--accent: #2563eb;              /* Primary blue */
--accent-dim: #1e40af;          /* Darker blue for hovers */
--color-secondary: #0ea5e9;     /* Light blue accent */
```

## 📝 TODO

- [ ] Add actual OurBond business content
- [ ] Replace placeholder phone number
- [ ] Add real logo image
- [ ] Set up Google Analytics/Tag Manager
- [ ] Configure form submission endpoint
- [ ] Add images to hero section
- [ ] Customize meta descriptions for SEO
- [ ] Add favicon

## 🔗 Nginx Configuration

Nginx config created at: `nginx/lp-ourbond.conf`

Deploy to server:
```bash
ssh user@server
sudo cp lp-ourbond.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/lp-ourbond /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Then run certbot for SSL:
```bash
sudo certbot --nginx -d lp.ourbond.com
```
