/**
 * Page Intelligence Module
 * 
 * Connects to Django API to analyze landing page performance
 * and generate recommendations using AI
 */

import OpenAI from 'openai';

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://web:8000';
const DJANGO_API_KEY = process.env.DJANGO_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * Fetch page analysis data from Django
 * @param {string} pageUrl - URL of the page to analyze
 * @returns {Promise<Object>} Analysis data with dataframe, objectives, and content
 */
export async function fetchPageAnalysis(pageUrl) {
  console.log(`[Page Intelligence] Analyzing: ${pageUrl}`);
  
  const response = await fetch(`${DJANGO_API_URL}/api/v1/page/analyze/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Api-Key ${DJANGO_API_KEY}`
    },
    body: JSON.stringify({ page_url: pageUrl })
  });
  
  if (!response.ok) {
    throw new Error(`Django API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`[Page Intelligence] Received analysis for page: ${data.page_uuid}`);
  console.log(`[Page Intelligence] Stats:`, data.stats);
  
  return data;
}

/**
 * Analyze page data using AI to generate recommendations
 * @param {Object} pageData - Analysis data from Django
 * @returns {Promise<Object>} AI-generated recommendations
 */
export async function analyzeWithAI(pageData) {
  const { analysis_data, stats } = pageData;
  
  console.log(`[AI Analysis] Processing page analysis...`);
  
  const prompt = buildAnalysisPrompt(analysis_data, stats);
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert digital marketing analyst specializing in landing page optimization. 
Analyze traffic data, business objectives, and current page content to provide actionable recommendations.
Focus on: message-match, conversion optimization, and alignment with business goals.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });
    
    const analysis = completion.choices[0].message.content;
    console.log(`[AI Analysis] Complete. Generated ${analysis.length} characters of recommendations.`);
    
    return parseAIRecommendations(analysis);
    
  } catch (error) {
    console.error(`[AI Analysis] Error:`, error.message);
    throw error;
  }
}

/**
 * Build prompt for AI analysis
 */
function buildAnalysisPrompt(analysisData, stats) {
  const { dataframe_json, objectives_markdown, current_content_markdown } = analysisData;
  
  // Format traffic data as a readable table
  const trafficTable = formatTrafficTable(dataframe_json);
  
  return `
# Landing Page Performance Analysis

## Current Performance Metrics
- Total Clicks: ${stats.total_clicks}
- Total Conversions: ${stats.total_conversions}
- Cost Per Conversion: $${stats.avg_cost_per_conversion?.toFixed(2)}
- Average Bounce Rate: ${(stats.bounce_rate_avg * 100)?.toFixed(1)}%

## Traffic Sources & Keywords
${trafficTable}

## Business Objectives & Value Propositions
${objectives_markdown}

## Current Page Content
${current_content_markdown}

---

# Your Analysis Task

Analyze the gaps between:
1. What keywords/campaigns are driving traffic (see traffic data)
2. What the business wants to achieve (see objectives)
3. What the current page says (see content)

Provide:

## 1. Message-Match Analysis
- Which traffic sources are poorly aligned with current content?
- What user intent gaps exist?
- Are we speaking to the right audience?

## 2. Content Recommendations
- New headline that matches top-performing keywords
- Key sections needed (don't exist or are weak)
- Content to remove (not aligned with objectives)
- Specific value props to emphasize

## 3. Conversion Optimization
- CTA improvements (placement, copy, design)
- Trust signals needed (testimonials, guarantees, social proof)
- Form optimization (if applicable)

## 4. New Page Structure (Outline)
Provide a section-by-section outline for the optimized page:
- Hero section (headline, subheadline, CTA)
- Key sections in order
- Supporting content
- Final CTA

## 5. Priority Actions (Top 3)
What are the 3 highest-impact changes?

Format your response in clear markdown sections.
`;
}

/**
 * Format traffic data as markdown table
 */
function formatTrafficTable(dataframeJson) {
  if (!dataframeJson || dataframeJson.length === 0) {
    return "No traffic data available.";
  }
  
  let table = "| Source | Campaign | Keyword | Clicks | Conversions | Cost | Bounce Rate |\n";
  table += "|--------|----------|---------|--------|-------------|------|-------------|\n";
  
  // Sort by clicks descending
  const sorted = [...dataframeJson].sort((a, b) => b.clicks - a.clicks);
  
  // Take top 20 rows
  sorted.slice(0, 20).forEach(row => {
    table += `| ${row.source_type} | ${row.campaign || '-'} | ${row.keyword || '-'} | `;
    table += `${row.clicks} | ${row.conversions || 0} | $${row.cost?.toFixed(2) || '0.00'} | `;
    table += `${row.bounce_rate ? (row.bounce_rate * 100).toFixed(1) : '-'}% |\n`;
  });
  
  return table;
}

/**
 * Parse AI recommendations into structured format
 */
function parseAIRecommendations(analysisText) {
  return {
    raw: analysisText,
    sections: extractSections(analysisText),
    timestamp: new Date().toISOString()
  };
}

/**
 * Extract markdown sections from AI response
 */
function extractSections(text) {
  const sections = {};
  
  // Simple regex to find ## headers and content
  const headerRegex = /^##\s+(.+)$/gm;
  let match;
  let lastIndex = 0;
  let lastTitle = 'introduction';
  
  while ((match = headerRegex.exec(text)) !== null) {
    if (lastIndex > 0) {
      const content = text.substring(lastIndex, match.index).trim();
      sections[lastTitle] = content;
    }
    lastTitle = match[1].toLowerCase().replace(/\s+/g, '_');
    lastIndex = headerRegex.lastIndex;
  }
  
  // Get content after last header
  if (lastIndex > 0) {
    sections[lastTitle] = text.substring(lastIndex).trim();
  }
  
  return sections;
}

/**
 * Export analysis results to files
 */
export async function exportAnalysis(pageData, aiRecommendations, outputPath) {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const basename = path.basename(new URL(pageData.analysis_data.current_content_markdown.split('\n')[0]).pathname);
  
  // Create output directory
  await fs.mkdir(outputPath, { recursive: true });
  
  // Save traffic data as CSV
  const csvPath = path.join(outputPath, `${timestamp}_${basename}_traffic.csv`);
  const csv = convertToCSV(pageData.analysis_data.dataframe_json);
  await fs.writeFile(csvPath, csv);
  console.log(`[Export] Saved traffic data: ${csvPath}`);
  
  // Save full analysis as markdown
  const reportPath = path.join(outputPath, `${timestamp}_${basename}_analysis.md`);
  const report = buildFullReport(pageData, aiRecommendations);
  await fs.writeFile(reportPath, report);
  console.log(`[Export] Saved full report: ${reportPath}`);
  
  // Save structured JSON
  const jsonPath = path.join(outputPath, `${timestamp}_${basename}_data.json`);
  await fs.writeFile(jsonPath, JSON.stringify({
    pageData,
    aiRecommendations
  }, null, 2));
  console.log(`[Export] Saved JSON data: ${jsonPath}`);
  
  return {
    csvPath,
    reportPath,
    jsonPath
  };
}

/**
 * Convert dataframe to CSV
 */
function convertToCSV(dataframeJson) {
  if (!dataframeJson || dataframeJson.length === 0) return '';
  
  const headers = Object.keys(dataframeJson[0]);
  const rows = dataframeJson.map(row => 
    headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Build full markdown report
 */
function buildFullReport(pageData, aiRecommendations) {
  const { analysis_data, stats } = pageData;
  
  return `# Landing Page Analysis Report
Generated: ${new Date().toISOString()}

---

## Current Performance
- Total Clicks: ${stats.total_clicks}
- Total Conversions: ${stats.total_conversions}
- Cost Per Conversion: $${stats.avg_cost_per_conversion?.toFixed(2)}
- Average Bounce Rate: ${(stats.bounce_rate_avg * 100)?.toFixed(1)}%

---

${analysis_data.objectives_markdown}

---

${analysis_data.current_content_markdown}

---

# AI Analysis & Recommendations

${aiRecommendations.raw}

---

## Traffic Data

See accompanying CSV file for full traffic breakdown.
`;
}
