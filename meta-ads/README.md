# Meta Ads Creative System

**Last Updated:** April 13, 2026  
**Status:** Active Development

---

## Directory Structure

```
meta-ads/
├── single-image/           # High-impact statements + remarketing fuel
│   ├── testimonials/       # Customer & expert social proof
│   ├── features/           # Service/feature highlights
│   ├── pricing/            # Pricing offers & promotions
│   └── problem-solution/   # Pain point → solution ads
│
├── carousel/               # Conversion engine (mid-funnel)
│   ├── education/          # How it works sequences
│   ├── proof/              # Testimonial + feature breakdowns
│   └── comparison/         # Before/after, us vs. them
│
├── video/                  # Attention gate (top-funnel)
│   ├── hooks/              # Hook concepts & variations
│   ├── scripts/            # Full video scripts
│   └── storyboards/        # Visual direction per video
│
├── _assets/                # Shared resources
│   └── brand-guidelines.md
│
└── README.md              # You are here
```

---

## The Three-Format System

### **Video** — The Attention Gate
- **Job:** Stop the scroll, get engaged users into funnel
- **Audience:** Cold audiences
- **Critical Element:** First 5 seconds (the hook)
- **KPI:** ThruPlay rate, 3-second video views

### **Carousel** — The Conversion Engine
- **Job:** Build the case, drive the click
- **Audience:** Video viewers, post engagers
- **Critical Element:** Card 1 (the headline), card sequence
- **KPI:** CTR, outbound clicks

### **Single Image** — High-Impact + Remarketing Fuel
- **Job:** Make sharp statements, keep queue fresh
- **Audience:** Mid-funnel + remarketing (clickers, non-converters)
- **Critical Element:** One visual, one message, one CTA
- **KPI:** CTR from warm audiences, engagement rate

---

## How to Use This System

1. **Start with single image** — fastest to produce, fills remarketing queue
2. **Build carousel** — converts the engaged users from video/organic
3. **Develop video** — opens the top-of-funnel gate (highest production lift)

Each format hands off to the next:
- Video creates engaged users
- Carousel converts engaged users  
- Single image recaptures non-converters and keeps brand visible

---

## Current Status

### ✅ Completed
- **Single Image / Testimonials** — 6 ads ready (Ken P., Raymond Kelly, Bill Craig, Jennifer J.)

### 🚧 In Progress
- TBD

### 📋 Planned
- Single Image: Features, Pricing, Problem-Solution
- Carousel: Education sequences, Proof sequences
- Video: Hook concepts, Scripts

---

## Testing Philosophy

**Test one variable at a time.**

- Video: Test hook type first (problem vs. outcome vs. founder)
- Carousel: Test first card, then card order
- Single Image: Test offer vs. visual/headline (one change only)

Track learnings in each creative file.

---

## Quick Start

Building a new ad creative? Use this checklist:

**Single Image:**
- [ ] One clear message
- [ ] Visual supports message (doesn't distract)
- [ ] CTA is obvious
- [ ] Text overlay is readable (white on dark, good contrast)
- [ ] 3 sizes: 1:1, 4:5, 9:16

**Carousel:**
- [ ] Card 1 is the strongest (acts as billboard)
- [ ] Each card adds new value (not repetition)
- [ ] Clear visual hierarchy per card
- [ ] CTA on final card
- [ ] Consider: turn off auto card ordering if sequence matters

**Video:**
- [ ] First frame stops the scroll
- [ ] 5-second hook creates curiosity/emotion/recognition
- [ ] Clear who it's for within 5 seconds
- [ ] Keep it short (15-30 seconds for top funnel)
- [ ] Captions on (80% watch with sound off)

---

## File Naming Convention

Use this format for all creative files:

**Format:** `[format]-[category]-[name]-[variant].md`

Examples:
- `single-image-testimonials-ken-p-v1.md`
- `carousel-proof-security-features-v2.md`
- `video-hook-problem-led-walking-home.md`

Variants: v1, v2, etc. or a/b/c for testing different executions of same concept.

---

## Resources

**Data Sources:**
- `/data/bond-testimonials.csv` — customer & expert quotes
- `/data/bond-services.csv` — service features & benefits
- `/data/features.json` — feature list with benefits
- `/src/data/pricing.js` — pricing tiers & plans
- `/client-ad-copy.csv` — existing ad copy database
- `/data/bond-display-ads.csv` — display ad concepts (adaptable)

**Blueprint Reference:**
- See project root for "Meta Ads Creative Blueprint" (the three-format system)

---

## Notes & Learnings

**April 13, 2026:**
- Started with single image testimonials (fastest to produce, validates proof points)
- Built 6 testimonial ads: authority (Kelly, Craig), customer proof (Ken P.), use case (Jennifer J.)
- Priority: affordability objection (Ken P.), authority (Kelly), use case (Jennifer J.)
