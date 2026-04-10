#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const csvFile = process.argv[2];

if (!csvFile) {
  console.error('❌ Usage: node csv-to-json.js <file.csv>');
  console.error('\n📋 CSV Format Examples:\n');
  console.error('Services CSV:');
  console.error('title,description,icon');
  console.error('Web Development,"Custom websites and apps",🌐');
  console.error('\nTestimonials CSV:');
  console.error('text,author,handle,role');
  console.error('"Great service!",John Doe,@johndoe,CEO');
  process.exit(1);
}

try {
  const csvContent = readFileSync(csvFile, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  
  console.log('\n✅ Converted to JSON:\n');
  console.log(JSON.stringify(records, null, 2));
  
  const outputFile = csvFile.replace('.csv', '.json');
  writeFileSync(outputFile, JSON.stringify(records, null, 2));
  
  console.log(`\n💾 Saved to: ${outputFile}`);
  console.log('\n📝 Copy this JSON array into your content.json file');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
