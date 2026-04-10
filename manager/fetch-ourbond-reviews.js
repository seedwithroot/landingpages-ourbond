#!/usr/bin/env node
/**
 * Fetch Bond app reviews from Apple RSS feed and write to reviews.js
 * Grabs up to 50 most recent reviews (Apple's max), filters by min rating.
 *
 * Usage: node manager/fetch-ourbond-reviews.js
 * Options:
 *   --min-rating=4   Minimum star rating to include (default: 5)
 *   --out=path       Output file path (default: sites/ourbond/src/data/reviews.js)
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';

const APP_ID = '1439903736';
const FEED_URL = `https://itunes.apple.com/us/rss/customerreviews/id=${APP_ID}/sortBy=mostRecent/json`;

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => a.slice(2).split('='))
);

const minRating = parseInt(args['min-rating'] ?? '5', 10);
const outPath = resolve(args['out'] ?? 'sites/ourbond/src/data/reviews.js');

console.log(`Fetching reviews for app ${APP_ID}...`);

const res = await fetch(FEED_URL);
if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);

const json = await res.json();
const entries = json?.feed?.entry ?? [];

console.log(`Got ${entries.length} total reviews`);

const reviews = entries
  .filter(e => parseInt(e['im:rating']?.label ?? '0', 10) >= minRating)
  .map((e, i) => ({
    id: i + 1,
    author: 'Verified User',
    rating: parseInt(e['im:rating'].label, 10),
    title: e.title?.label ?? '',
    text: e.content?.label ?? '',
    date: e.updated?.label?.slice(0, 10) ?? '',
    version: e['im:version']?.label ?? '',
  }));

console.log(`Filtered to ${reviews.length} reviews with rating >= ${minRating}`);

const output = `export default ${JSON.stringify({ reviews }, null, 2)};\n`;

writeFileSync(outPath, output, 'utf8');
console.log(`Written to ${outPath}`);
