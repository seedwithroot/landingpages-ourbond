#!/usr/bin/env node

/**
 * Generate Location-Specific Landing Pages from CSV Data
 * Creates F-shape pattern pages for SiteFuel PPC
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const CSV_PATH = path.join(process.cwd(), 'sites', 'sitefuelppc', 'data', 'Locations-Diesel (5).csv');
const PAGES_DIR = path.join(process.cwd(), 'sites', 'sitefuelppc', 'src', 'pages', 'locations');

// Read and parse CSV (strip BOM if present)
let csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
if (csvContent.charCodeAt(0) === 0xFEFF) {
  csvContent = csvContent.slice(1);
}
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true
});

console.log(`📊 Found ${records.length} locations in CSV`);

// Ensure pages directory exists
if (!fs.existsSync(PAGES_DIR)) {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
  console.log(`📁 Created directory: ${PAGES_DIR}`);
}

// Generate page for each location
records.forEach((record, index) => {
  const location = record.Title;
  const slug = location.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  console.log(`\n🏙️  Processing: ${location} (${index + 1}/${records.length})`);
  
  // Extract data from CSV
  const data = {
    title: location,
    state: record.State || extractStateFromText(record.text_1),
    mainHeadline: record.text_1 || `On-Site Diesel Fuel Delivery Service in ${location}`,
    introParagraph: record.text_2 || '',
    servicesHeadline: record.text_3 || `${location} Diesel Fuel Delivery Services`,
    servicesIntro: record.text_4 || '',
    
    // Services - extract key services with proper descriptions
    services: [
      { title: 'On-site Diesel Refueling', content: record.text_6 || record.text_5 || '' },
      { title: 'Emergency & After-hours Delivery', content: record.text_8 || record.text_7 || '' },
      { title: 'Bulk Diesel Tank Filling', content: record.text_10 || record.text_9 || '' },
      { title: 'Construction Site Delivery', content: record.text_12 || record.text_11 || '' }
    ].filter(s => s.content),
    
    // How it works section
    howItWorksHeadline: record.text_13 || 'How Our Service Works',
    howItWorksIntro: record.text_14 || '',
    
    // Benefits - use actual benefit descriptions
    benefitsHeadline: record.text_21 || 'Benefits of Our Diesel Fuel Delivery Service',
    benefitsIntro: record.text_22 || '',
    benefits: [
      { title: 'Saves Time & Improves Productivity', content: record.text_24 || record.text_23 || '' },
      { title: '24/7 On-Site Refueling', content: record.text_26 || record.text_25 || '' },
      { title: 'Reliable Quality Fuel Supply', content: record.text_28 || record.text_27 || '' },
      { title: 'Competitive & Transparent Pricing', content: record.text_30 || record.text_29 || '' }
    ].filter(b => b.content),
    
    // Why choose us
    whyChooseHeadline: record.text_33 || `Why Choose Us in ${location}`,
    whyChooseIntro: record.text_34 || ''
  };
  
  const pageContent = generateFShapePage(data);
  const filePath = path.join(PAGES_DIR, `${slug}.astro`);
  
  fs.writeFileSync(filePath, pageContent);
  console.log(`   ✅ Created: /locations/${slug}.astro`);
});

console.log(`\n🎉 Generated ${records.length} location pages!`);

/**
 * Generate F-Shape Astro page content
 */
function generateFShapePage(data) {
  const { title, state, mainHeadline, introParagraph, services, benefits } = data;
  
  // Create benefits list for CheckmarkList component
  const benefitsList = benefits.map(b => b.title);
  
  // Create features for grid
  const serviceFeatures = services.slice(0, 3).map((service, i) => {
    const icons = ['truck', 'clock', 'fuel-pump'];
    return {
      icon: icons[i] || 'check',
      title: service.title,
      description: extractFirstSentence(service.content)
    };
  });
  
  // Construct phone number (using main SiteFuel number)
  const phoneNumber = '866-751-4771';
  const displayNumber = state ? `Call ${title}, ${state}` : `Call ${title}`;
  
  return `---
import Layout from '../../layouts/Layout.astro';
import Hero from '../../components/Hero.astro';
import PhoneCTA from '../../components/PhoneCTA.astro';
import CheckmarkList from '../../components/CheckmarkList.astro';
import FeaturesGrid from '../../components/FeaturesGrid.astro';
import BenefitsColumn from '../../components/BenefitsColumn.astro';
import CTA from '../../components/CTA.astro';

const location = "${title}";
const state = "${state || ''}";

// Benefits for F-pattern left column
const benefits = ${JSON.stringify(benefitsList, null, 2)};

// Key service features
const features = ${JSON.stringify(serviceFeatures, null, 2)};

// Detailed benefits for column
const detailedBenefits = ${JSON.stringify(benefits.map(b => ({
  icon: 'check-circle',
  title: b.title,
  desc: extractFirstSentence(b.content)
})), null, 2)};
---

<Layout 
  title="${escapeQuotes(mainHeadline)}"
  description="Expert diesel fuel delivery in ${title}${state ? ', ' + state : ''}. 24/7 on-site refueling, emergency delivery, bulk tank filling. Call ${phoneNumber} for a free quote."
>
  <!-- F-Pattern: Top Horizontal Bar (F1) - Hero -->
  <Hero 
    headline="${escapeQuotes(mainHeadline)}"
    subheadline="${escapeQuotes(cleanText(introParagraph).substring(0, 180))}..."
    ctaText="Get Your Free Quote"
    ctaUrl="#quote-form"
    heroImage="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop"
    trustLine="✓ 24/7 Delivery ✓ Competitive Pricing ✓ Reliable Service"
    pattern="f-shaped"
  />
  
  <!-- Prominent CTA Strip (F2) -->
  <section style="padding: 2rem 0; background: white; border-bottom: 1px solid #e8ecef;">
    <div class="container">
      <div style="display: flex; justify-content: center; align-items: center; gap: 2rem; flex-wrap: wrap;">
        <PhoneCTA phoneNumber="${phoneNumber}" displayNumber="Call or Text ${phoneNumber}" size="large" />
        <a href="#quote-form" class="cta-primary" style="padding: 1.25rem 2.5rem; font-size: 1.25rem;">GET YOUR FREE QUOTE</a>
      </div>
      <p style="text-align: center; margin-top: 1rem; color: #666; font-size: 0.9375rem;">
        Serving ${title}${state ? ', ' + state : ''} with reliable diesel delivery
      </p>
    </div>
  </section>

  <!-- F-Pattern: Vertical Column (F Stem) - Benefits -->
  <section style="padding: 4rem 0; background: #f8f9fa;">
    <div class="container">
      <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;">
        Diesel Fuel Delivery in ${title}
      </h2>
      <p style="font-size: 1.125rem; color: #555; margin-bottom: 3rem; max-width: 800px;">
        ${escapeQuotes(cleanText(introParagraph).substring(0, 250))}
      </p>
      
      <!-- Left-aligned benefits list for F-pattern scanning -->
      <div style="max-width: 800px;">
        <CheckmarkList items={benefits} columns={1} size="large" />
      </div>
      
      <div style="margin-top: 3rem;">
        <a href="#quote-form" class="cta-primary">Request a Free Quote</a>
      </div>
    </div>
  </section>

  <!-- Services Grid (still scannable in F-pattern) -->
  <section style="padding: 4rem 0; background: white;">
    <div class="container">
      <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; text-align: center;">
        Our ${title} Services
      </h2>
      <FeaturesGrid features={features} columns={3} />
    </div>
  </section>

  <!-- Detailed Benefits Column (F-pattern vertical) -->
  <section style="padding: 4rem 0; background: #f8f9fa;">
    <div class="container">
      <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 3rem;">
        Why Choose Our Diesel Delivery Service?
      </h2>
      <BenefitsColumn 
        benefits={detailedBenefits}
        alignment="left"
      />
    </div>
  </section>

  <!-- Bottom CTA (F-pattern end) -->
  <CTA 
    headline="Ready for Reliable Diesel Delivery in ${title}?"
    subheadline="Get a free quote today. No contracts, no hassle."
    ctaText="Get Your Free Quote"
    ctaUrl="#quote-form"
    phoneNumber="${phoneNumber}"
    variant="centered"
  />

  <!-- Quote Form Section -->
  <section id="quote-form" style="padding: 4rem 0; background: white;">
    <div class="container" style="max-width: 600px;">
      <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 2rem; text-align: center;">
        Get Your Free Quote
      </h2>
      <form style="display: flex; flex-direction: column; gap: 1.5rem;">
        <input type="text" placeholder="Your Name" required style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;" />
        <input type="email" placeholder="Email Address" required style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;" />
        <input type="tel" placeholder="Phone Number" required style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;" />
        <input type="text" placeholder="Company Name" style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;" />
        <input type="hidden" name="location" value="${title}" />
        <textarea placeholder="Tell us about your fuel delivery needs..." rows="4" style="padding: 1rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
        <button type="submit" class="cta-primary" style="padding: 1.25rem; font-size: 1.125rem;">
          Submit Quote Request
        </button>
      </form>
    </div>
  </section>
</Layout>

<style>
  /* F-Pattern optimized styles */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  
  .cta-primary {
    display: inline-block;
    background: #0066cc;
    color: white;
    padding: 1rem 2rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    transition: background 0.3s;
  }
  
  .cta-primary:hover {
    background: #0052a3;
  }
</style>
`;
}

/**
 * Helper functions
 */
function extractStateFromText(text) {
  const stateMatch = text?.match(/\b([A-Z]{2})\b/);
  return stateMatch ? stateMatch[1] : '';
}

function extractFirstSentence(text) {
  if (!text) return '';
  const cleaned = cleanText(text);
  const match = cleaned.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : cleaned.substring(0, 120) + '...';
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/Site Fuel/gi, 'our')
    .replace(/We offer|We provide|We ensure/gi, 'We offer')
    .trim();
}

function escapeQuotes(text) {
  return text.replace(/"/g, '\\"');
}
