#!/usr/bin/env node

/**
 * Extract Compound Units
 * Analyzes JSON files in the design system to find all hyphenated token keys
 * 
 * This script scans the src/lib/themes directory to find all compound units 
 * (token keys containing hyphens) and generates a comprehensive list.
 * The list can be used to update the compound-units.md documentation.
 * 
 * Usage:
 *   node scripts-custom/extract-compound-units.js
 * 
 * Output:
 *   - List of all compound units sorted alphabetically
 *   - Count of unique compound units found
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all JSON files under src/lib/themes
const themesDir = path.join(process.cwd(), 'src/lib/themes');
const jsonFiles = execSync(`find "${themesDir}" -type f -name "*.json"`, { encoding: 'utf8' })
  .trim()
  .split('\n');

console.log(`Found ${jsonFiles.length} JSON files to analyze...`);

// Set to store unique compound units (actual token names)
const compoundUnits = new Set();

// Path segments to exclude (not actual token names)
const pathsToExclude = [
  // Directory paths that are not token names
  'global/themes-scoped/dark',
  'global/themes-scoped/light',
  'global/themes-scoped/static',
  'global/themes-user/lightness/static',
  'global/themes-user/viewport/desktop',
  'global/themes-user/viewport/mobile',
  'global/themes-user/viewport/static',
  
  // Token category paths
  'semantic/color/l1-lightness/dark',
  'semantic/color/l1-lightness/light',
  'semantic/color/l2-inversity/flipped',
  'semantic/color/l2-inversity/normal',
  'semantic/color/l3-emphasis/high',
  'semantic/color/l3-emphasis/low',
  
  // Ignored and special files
  '_ignore-in-ds/figma-doc/colors-static',
  '_ignore-in-ds/figma-doc/theme/lightness/dark',
  '_ignore-in-ds/figma-doc/theme/lightness/light',
  '_ignore-in-ds/typography-styles-R13',
  'html/button/color-static',
  'primitive/z-index',
  'semantic/z-index',
  'figma-doc'
];

// Function to recursively traverse object and find compound units in keys
function findCompoundUnits(obj) {
  if (!obj || typeof obj !== 'object') return;
  
  for (const key of Object.keys(obj)) {
    // Skip metadata keys that start with $
    if (key.startsWith('$')) continue;
    
    // Check if the current key is a compound unit (contains hyphen)
    if (key.includes('-') && !pathsToExclude.includes(key)) {
      compoundUnits.add(key);
    }
    
    // Recursively process nested objects
    findCompoundUnits(obj[key]);
  }
}

// Process each file
jsonFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    findCompoundUnits(json);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
});

// Convert set to sorted array and print results
const sortedResults = Array.from(compoundUnits).sort();
console.log('\nFound compound units in token keys:');
sortedResults.forEach(unit => console.log(unit));
console.log(`\nTotal unique compound units found: ${sortedResults.length}`);
