/**
 * Update Location Pages - Replace heroImage with showForm
 * 
 * This script updates all location pages to show a form in the hero section
 * instead of an image.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCATIONS_DIR = path.join(__dirname, '../sites/sitefuelppc/src/pages/locations');

function updateLocationPage(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract location and state from the file
  const locationMatch = content.match(/const location = "(.+?)";/);
  const stateMatch = content.match(/const state = "(.+?)";/);
  
  if (!locationMatch || !stateMatch) {
    console.log(`Skipping ${path.basename(filePath)} - couldn't extract location/state`);
    return false;
  }
  
  const location = locationMatch[1];
  const state = stateMatch[1];
  
  // Replace the Hero component props
  // Update ctaText to call
  content = content.replace(
    /ctaText="Get Your Free Quote"/g,
    'ctaText="Call 866-751-4771"'
  );
  
  // Update ctaUrl to phone link
  content = content.replace(
    /ctaUrl="#quote-form"/g,
    'ctaUrl="tel:866-751-4771"'
  );
  
  // Replace heroImage with showForm and location
  content = content.replace(
    /heroImage="https:\/\/images\.unsplash\.com\/photo-\d+\?w=\d+&h=\d+&fit=crop"/,
    `showForm={true}\n    location={\`\${location}, \${state}\`}`
  );
  
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

// Get all .astro files in locations directory
const files = fs.readdirSync(LOCATIONS_DIR)
  .filter(file => file.endsWith('.astro'))
  .filter(file => file !== 'houston.astro'); // Skip houston, already updated

console.log(`Found ${files.length} location pages to update (excluding houston.astro)`);

let updated = 0;
let skipped = 0;

files.forEach(file => {
  const filePath = path.join(LOCATIONS_DIR, file);
  if (updateLocationPage(filePath)) {
    updated++;
    console.log(`✓ Updated ${file}`);
  } else {
    skipped++;
  }
});

console.log(`\nUpdate complete!`);
console.log(`Updated: ${updated} files`);
console.log(`Skipped: ${skipped} files`);
