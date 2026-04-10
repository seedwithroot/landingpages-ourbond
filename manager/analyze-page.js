#!/usr/bin/env node

/**
 * Analyze a landing page using Django data and AI
 * 
 * Usage:
 *   node manager/analyze-page.js <page-url>
 * 
 * Example:
 *   node manager/analyze-page.js https://adalane.com/seo-services
 */

import { fetchPageAnalysis, analyzeWithAI, exportAnalysis } from '../lib/page-intelligence.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const OUTPUT_DIR = join(__dirname, '..', '_analysis');

async function main() {
  const pageUrl = process.argv[2];
  
  if (!pageUrl) {
    console.error('Usage: node manager/analyze-page.js <page-url>');
    console.error('Example: node manager/analyze-page.js https://adalane.com/seo-services');
    process.exit(1);
  }
  
  // Validate environment
  if (!process.env.DJANGO_API_KEY) {
    console.error('Error: DJANGO_API_KEY environment variable not set');
    console.error('Set it in your .env file');
    process.exit(1);
  }
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable not set');
    console.error('Set it in your .env file');
    process.exit(1);
  }
  
  console.log('='.repeat(60));
  console.log('LANDING PAGE ANALYZER');
  console.log('='.repeat(60));
  console.log(`Page URL: ${pageUrl}`);
  console.log('');
  
  try {
    // Step 1: Fetch data from Django
    console.log('[1/3] Fetching page analysis from Django...');
    const pageData = await fetchPageAnalysis(pageUrl);
    console.log('✓ Analysis data retrieved');
    console.log('');
    
    // Step 2: Analyze with AI
    console.log('[2/3] Analyzing with AI...');
    const aiRecommendations = await analyzeWithAI(pageData);
    console.log('✓ AI analysis complete');
    console.log('');
    
    // Step 3: Export results
    console.log('[3/3] Exporting results...');
    const files = await exportAnalysis(pageData, aiRecommendations, OUTPUT_DIR);
    console.log('✓ Results exported');
    console.log('');
    
    // Display summary
    console.log('='.repeat(60));
    console.log('ANALYSIS COMPLETE');
    console.log('='.repeat(60));
    console.log(`Page UUID: ${pageData.page_uuid}`);
    console.log(`Traffic CSV: ${files.csvPath}`);
    console.log(`Full Report: ${files.reportPath}`);
    console.log(`JSON Data: ${files.jsonPath}`);
    console.log('');
    
    // Show key recommendations
    if (aiRecommendations.sections.priority_actions) {
      console.log('TOP PRIORITY ACTIONS:');
      console.log(aiRecommendations.sections.priority_actions);
      console.log('');
    }
    
    console.log('Next steps:');
    console.log('1. Review the full report: ' + files.reportPath);
    console.log('2. Generate optimized page: node manager/generate-optimized-page.js ' + files.jsonPath);
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('ERROR');
    console.error('='.repeat(60));
    console.error(error.message);
    console.error('');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('Cannot connect to Django API. Make sure:');
      console.error('1. Django is running: cd C:\\Users\\seedw\\Projects\\django-alleius && docker-compose up');
      console.error('2. You are on the same Docker network');
    }
    
    process.exit(1);
  }
}

main();
