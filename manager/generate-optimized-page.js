#!/usr/bin/env node

/**
 * Generate an optimized landing page from analysis results
 * 
 * Usage:
 *   node manager/generate-optimized-page.js <analysis-json-path> <output-site-name>
 * 
 * Example:
 *   node manager/generate-optimized-page.js _analysis/2026-02-24_analysis.json adalane-seo-services-lp
 */

import OpenAI from 'openai';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  const analysisPath = process.argv[2];
  const siteName = process.argv[3];
  
  if (!analysisPath || !siteName) {
    console.error('Usage: node manager/generate-optimized-page.js <analysis-json> <site-name>');
    console.error('Example: node manager/generate-optimized-page.js _analysis/data.json adalane-seo-lp');
    process.exit(1);
  }
  
  console.log('='.repeat(60));
  console.log('OPTIMIZED PAGE GENERATOR');
  console.log('='.repeat(60));
  console.log(`Analysis: ${analysisPath}`);
  console.log(`Output Site: ${siteName}`);
  console.log('');
  
  try {
    // Load analysis data
    console.log('[1/4] Loading analysis data...');
    const analysisData = JSON.parse(await readFile(analysisPath, 'utf-8'));
    console.log('✓ Analysis loaded');
    console.log('');
    
    // Generate page components
    console.log('[2/4] Generating optimized page components...');
    const pageComponents = await generatePageComponents(analysisData);
    console.log('✓ Components generated');
    console.log('');
    
    // Create Astro page
    console.log('[3/4] Creating Astro page files...');
    const siteDir = join(__dirname, '..', 'sites', siteName);
    await createAstroSite(siteDir, siteName, pageComponents);
    console.log('✓ Site created');
    console.log('');
    
    // Generate readme
    console.log('[4/4] Generating documentation...');
    await generateReadme(siteDir, analysisData, pageComponents);
    console.log('✓ Documentation complete');
    console.log('');
    
    console.log('='.repeat(60));
    console.log('SITE GENERATED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log(`Location: ${siteDir}`);
    console.log('');
    console.log('Next steps:');
    console.log(`1. Review the page: cd ${siteDir} && npm install && npm run dev`);
    console.log('2. Customize components in src/components/');
    console.log('3. Deploy: npm run build');
    console.log('');
    
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

/**
 * Generate page components using AI
 */
async function generatePageComponents(analysisData) {
  const { pageData, aiRecommendations } = analysisData;
  
  const prompt = `Based on this landing page analysis, generate the following components:

# Analysis Summary
${aiRecommendations.raw}

# Original Page Content
${pageData.analysis_data.current_content_markdown}

# Business Objectives
${pageData.analysis_data.objectives_markdown}

---

Generate optimized content for:

1. **Hero Section**
   - Headline (clear, benefit-driven, includes top keyword)
   - Subheadline (expands on promise)
   - Primary CTA button text

2. **Value Propositions (3-5 items)**
   - Short title
   - 1-2 sentence description
   - Icon suggestion

3. **Social Proof**
   - 3 testimonial ideas (if none exist, create realistic examples)
   - Trust badges/certifications to highlight
   - Key statistics to showcase

4. **FAQ Section (5-7 questions)**
   - Common objections/questions
   - Clear answers

5. **Final CTA Section**
   - Headline
   - Supporting text
   - CTA button text

Return as valid JSON in this structure:
{
  "hero": {
    "headline": "",
    "subheadline": "",
    "ctaText": "",
    "ctaUrl": "/contact"
  },
  "valueProps": [
    { "title": "", "description": "", "icon": "check" }
  ],
  "testimonials": [
    { "quote": "", "author": "", "role": "" }
  ],
  "trustSignals": ["", ""],
  "stats": [
    { "number": "", "label": "" }
  ],
  "faqs": [
    { "question": "", "answer": "" }
  ],
  "finalCta": {
    "headline": "",
    "text": "",
    "ctaText": ""
  }
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are an expert copywriter. Generate compelling, conversion-focused landing page content. Return ONLY valid JSON, no markdown formatting."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 2500,
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(completion.choices[0].message.content);
}

/**
 * Create Astro site structure
 */
async function createAstroSite(siteDir, siteName, components) {
  // Create directories
  await mkdir(join(siteDir, 'src', 'components'), { recursive: true });
  await mkdir(join(siteDir, 'src', 'layouts'), { recursive: true });
  await mkdir(join(siteDir, 'src', 'pages'), { recursive: true });
  await mkdir(join(siteDir, 'public'), { recursive: true });
  
  // Create package.json
  const packageJson = {
    name: siteName,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "astro dev",
      build: "astro build",
      preview: "astro preview"
    },
    dependencies: {
      astro: "^4.0.0"
    }
  };
  await writeFile(
    join(siteDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create astro.config.mjs
  const astroConfig = `import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  output: 'static'
});
`;
  await writeFile(join(siteDir, 'astro.config.mjs'), astroConfig);
  
  // Create layout
  const layout = `---
const { title = 'Landing Page' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    section {
      padding: 60px 0;
    }
  </style>
</head>
<body>
  <slot />
</body>
</html>
`;
  await writeFile(join(siteDir, 'src', 'layouts', 'Layout.astro'), layout);
  
  // Create Hero component
  const hero = `---
const { headline, subheadline, ctaText, ctaUrl } = Astro.props;
---

<section class="hero">
  <div class="container">
    <h1>{headline}</h1>
    <p class="subheadline">{subheadline}</p>
    <a href={ctaUrl} class="cta-button">{ctaText}</a>
  </div>
</section>

<style>
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 100px 0;
  }
  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    font-weight: 700;
  }
  .subheadline {
    font-size: 1.5rem;
    margin-bottom: 30px;
    opacity: 0.95;
  }
  .cta-button {
    display: inline-block;
    background: white;
    color: #667eea;
    padding: 15px 40px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: transform 0.2s;
  }
  .cta-button:hover {
    transform: scale(1.05);
  }
</style>
`;
  await writeFile(join(siteDir, 'src', 'components', 'Hero.astro'), hero);
  
  // Create Features component
  const features = `---
const { valueProps } = Astro.props;
---

<section class="features">
  <div class="container">
    <div class="grid">
      {valueProps.map(prop => (
        <div class="feature-card">
          <h3>{prop.title}</h3>
          <p>{prop.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .features {
    background: #f8f9fa;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }
  .feature-card {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #667eea;
  }
</style>
`;
  await writeFile(join(siteDir, 'src', 'components', 'Features.astro'), features);
  
  // Create main index page
  const indexPage = `---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';

const pageData = ${JSON.stringify(components, null, 2)};
---

<Layout title="${siteName}">
  <Hero {...pageData.hero} />
  <Features valueProps={pageData.valueProps} />
  
  <section class="testimonials">
    <div class="container">
      <h2>What Our Clients Say</h2>
      <div class="testimonial-grid">
        {pageData.testimonials.map(t => (
          <blockquote>
            <p>"{t.quote}"</p>
            <cite>— {t.author}, {t.role}</cite>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
  
  <section class="faq">
    <div class="container">
      <h2>Frequently Asked Questions</h2>
      {pageData.faqs.map(faq => (
        <details>
          <summary>{faq.question}</summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  </section>
  
  <section class="final-cta">
    <div class="container">
      <h2>{pageData.finalCta.headline}</h2>
      <p>{pageData.finalCta.text}</p>
      <a href="/contact" class="cta-button">{pageData.finalCta.ctaText}</a>
    </div>
  </section>
</Layout>

<style>
  .testimonials, .faq, .final-cta {
    padding: 80px 0;
  }
  .testimonials {
    background: white;
  }
  h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 50px;
  }
  .testimonial-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }
  blockquote {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 10px;
    border-left: 4px solid #667eea;
  }
  cite {
    display: block;
    margin-top: 15px;
    font-style: normal;
    color: #666;
  }
  details {
    background: white;
    margin-bottom: 15px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  summary {
    cursor: pointer;
    font-weight: 600;
    font-size: 1.1rem;
  }
  .final-cta {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
  }
  .final-cta h2 {
    color: white;
  }
  .cta-button {
    display: inline-block;
    background: white;
    color: #667eea;
    padding: 15px 40px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 20px;
  }
</style>
`;
  await writeFile(join(siteDir, 'src', 'pages', 'index.astro'), indexPage);
}

/**
 * Generate README with analysis summary
 */
async function generateReadme(siteDir, analysisData, components) {
  const readme = `# ${analysisData.pageData.page_uuid} - Optimized Landing Page

Generated: ${new Date().toISOString()}

## Analysis Summary

### Original Performance
- Total Clicks: ${analysisData.pageData.stats.total_clicks}
- Total Conversions: ${analysisData.pageData.stats.total_conversions}
- Cost Per Conversion: $${analysisData.pageData.stats.avg_cost_per_conversion?.toFixed(2)}

### Key Improvements Made

${analysisData.aiRecommendations.sections.priority_actions || 'See analysis file for details'}

## Generated Components

- **Hero**: ${components.hero.headline}
- **Value Props**: ${components.valueProps.length} sections
- **Testimonials**: ${components.testimonials.length} testimonials
- **FAQs**: ${components.faqs.length} questions

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Customization

Edit components in \`src/components/\` to customize styling and content.

## Source Analysis

See original analysis data for full traffic breakdown and recommendations.
`;
  
  await writeFile(join(siteDir, 'README.md'), readme);
}

main();
