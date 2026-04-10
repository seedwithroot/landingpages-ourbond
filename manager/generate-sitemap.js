#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

/**
 * Generates sitemap.xml for a site
 * Following: https://www.sitemaps.org/protocol.html
 */

function generateSitemap(siteName) {
  const sitesDir = join(rootDir, 'sites');
  const siteDir = join(sitesDir, siteName);
  const distDir = join(siteDir, 'dist');

  if (!existsSync(distDir)) {
    console.error(`❌ Error: ${siteName} hasn't been built yet. Run: npm run build ${siteName}`);
    process.exit(1);
  }

  // Read site URL from astro.config.mjs
  const configPath = join(siteDir, 'astro.config.mjs');
  let siteUrl = 'https://www.example.com'; // Default fallback
  
  if (existsSync(configPath)) {
    try {
      const configContent = readFileSync(configPath, 'utf-8');
      const siteMatch = configContent.match(/site:\s*['"](https?:\/\/[^'"]+)['"]/);
      if (siteMatch) {
        siteUrl = siteMatch[1].replace(/\/$/, ''); // Remove trailing slash
      }
    } catch (error) {
      console.warn(`⚠️  Could not read site URL from astro.config.mjs, using default`);
    }
  }

  console.log(`\n🗺️  Generating sitemap.xml for ${siteName}...\n`);

  // Find all HTML files
  const htmlFiles = glob.sync('**/*.html', {
    cwd: distDir,
    ignore: ['**/_astro/**'] // Skip asset files
  });

  // Build sitemap entries
  const urls = htmlFiles.map(file => {
    const htmlPath = join(distDir, file);
    const stats = statSync(htmlPath);
    
    // Convert file path to URL path
    let urlPath = file
      .replace(/\\/g, '/')  // Normalize to forward slashes
      .replace('/index.html', '') // Remove /index.html
      .replace('index.html', ''); // Remove index.html from root
    
    // Build full URL
    const url = `${siteUrl}/${urlPath}`;
    
    // Get last modified date
    const lastmod = stats.mtime.toISOString().split('T')[0];
    
    // Set priority based on page depth
    let priority = '0.8';
    if (urlPath === '') priority = '1.0'; // Homepage
    else if (!urlPath.includes('/')) priority = '0.9'; // Top-level pages
    
    // Set change frequency based on page type
    let changefreq = 'monthly';
    if (urlPath === '') changefreq = 'weekly'; // Homepage changes more
    else if (urlPath.includes('blog')) changefreq = 'weekly';
    
    return {
      url,
      lastmod,
      changefreq,
      priority
    };
  });

  // Sort by priority (highest first), then alphabetically
  urls.sort((a, b) => {
    if (b.priority !== a.priority) {
      return parseFloat(b.priority) - parseFloat(a.priority);
    }
    return a.url.localeCompare(b.url);
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write sitemap.xml
  const sitemapPath = join(distDir, 'sitemap.xml');
  writeFileSync(sitemapPath, xml, 'utf-8');

  console.log(`   ✅ Generated sitemap.xml with ${urls.length} URLs`);
  console.log(`   📍 Location: ${sitemapPath}`);
  console.log(`   🌐 Access at: ${siteUrl}/sitemap.xml\n`);
  
  // Log pages included
  urls.forEach(entry => {
    console.log(`      ${entry.priority} - ${entry.url}`);
  });
  
  console.log(`\n✨ Sitemap generation complete!\n`);
}

// Get site name from command line
const siteName = process.argv[2];

if (!siteName) {
  console.error('❌ Error: Please specify a site name');
  console.error('Usage: npm run sitemap <site-name>');
  process.exit(1);
}

generateSitemap(siteName);
