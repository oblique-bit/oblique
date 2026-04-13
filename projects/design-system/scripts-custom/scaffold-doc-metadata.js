#!/usr/bin/env node
/**
 * scaffold-doc-metadata.js
 *
 * Adds the three missing metadata fields to every doc/ JSON file:
 *   recommended, not_recommended, semantic_assigned
 *
 * Rules (per token-description-guidelines.md):
 * - Skips any file where these fields already exist (safe to re-run)
 * - Preserves all existing content and indentation (2-space JSON)
 * - Adds new fields after page_intro, inside the "doc" object
 * - Never uses regex/string replacement — parses and re-serializes JSON
 */

const fs = require('fs');
const path = require('path');

const DOC_ROOT = path.resolve(__dirname, '../src/lib/themes/doc');

const NEW_FIELDS = {
  recommended: { $type: 'other', $value: '' },
  not_recommended: { $type: 'other', $value: '' },
  semantic_assigned: { $type: 'other', $value: '' },
};

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`  PARSE ERROR: ${filePath}\n  ${e.message}`);
    return 'error';
  }

  const doc = data.doc;
  if (!doc || typeof doc !== 'object') {
    console.warn(`  SKIP (no "doc" key): ${filePath}`);
    return 'skip';
  }

  // Check if all new fields already present
  const already = Object.keys(NEW_FIELDS).every((k) => k in doc);
  if (already) {
    return 'skip';
  }

  // Add missing fields only
  for (const [key, value] of Object.entries(NEW_FIELDS)) {
    if (!(key in doc)) {
      doc[key] = value;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  return 'updated';
}

function findJsonFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findJsonFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(full);
    }
  }
  return results;
}

const files = findJsonFiles(DOC_ROOT);
let updated = 0;
let skipped = 0;
let errors = 0;

for (const f of files) {
  const result = processFile(f);
  if (result === 'updated') updated++;
  else if (result === 'skip') skipped++;
  else errors++;
}

console.log(`\nDone.`);
console.log(`  Updated : ${updated}`);
console.log(`  Skipped : ${skipped}`);
console.log(`  Errors  : ${errors}`);
console.log(`  Total   : ${files.length}`);
