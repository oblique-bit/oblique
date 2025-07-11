#!/usr/bin/env node

/**
 * Token Chain Resolution Validator
 * 
 * This script performs deep validation of token reference chains:
 * - Validates that all token references resolve correctly
 * - Detects circular reference loops
 * - Checks token existence and accessibility
 * - Provides detailed chain analysis for debugging
 * 
 * USAGE:
 *   node scripts-custom/validate-token-chain-resolution.js
 * 
 * This is more comprehensive than quick syntax validation.
 */

const fs = require('fs');
const path = require('path');

// Base directory for themes
const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';

console.log('🔍 Validating token reference chain...');

// Function to get all JSON files in a directory
function getJsonFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const entries = fs.readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !entry.startsWith('.')) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && entry.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Load all tokens from all files
const allTokens = {};
const tokenFiles = getJsonFiles(themesDir);

console.log(`📁 Found ${tokenFiles.length} token files`);

// Load all tokens into a single map
tokenFiles.forEach(file => {
  try {
    const content = JSON.parse(fs.readFileSync(file, 'utf8'));
    const relativePath = path.relative(themesDir, file);
    
    // Extract tokens from the nested structure
    function extractTokens(obj, prefix = '') {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj[key].$value) {
            // This is a token
            const tokenPath = prefix ? `${prefix}.${key}` : key;
            allTokens[tokenPath] = {
              value: obj[key].$value,
              file: relativePath,
              description: obj[key].$description
            };
          } else {
            // This is a nested object
            const newPrefix = prefix ? `${prefix}.${key}` : key;
            extractTokens(obj[key], newPrefix);
          }
        }
      }
    }
    
    extractTokens(content);
  } catch (error) {
    console.warn(`⚠️  Error reading ${file}: ${error.message}`);
  }
});

console.log(`🎨 Loaded ${Object.keys(allTokens).length} tokens total`);

// Function to check if a reference resolves correctly
function validateTokenReference(tokenPath, visitedTokens = new Set()) {
  if (visitedTokens.has(tokenPath)) {
    return { valid: false, reason: 'Circular reference detected', chain: Array.from(visitedTokens) };
  }
  
  const token = allTokens[tokenPath];
  if (!token) {
    return { valid: false, reason: 'Token not found', chain: [tokenPath] };
  }
  
  // Check if the value is a reference
  const refMatch = token.value.match(/^\{(.+)\}$/);
  if (!refMatch) {
    // This is a primitive value, validation successful
    return { valid: true, reason: 'Primitive value', chain: [tokenPath] };
  }
  
  // This is a reference, validate recursively
  const referencedToken = refMatch[1];
  visitedTokens.add(tokenPath);
  
  const result = validateTokenReference(referencedToken, visitedTokens);
  return {
    valid: result.valid,
    reason: result.reason,
    chain: [tokenPath, ...result.chain]
  };
}

// Validate the emphasis layer specifically
const emphasisTokens = Object.keys(allTokens).filter(key => 
  allTokens[key].file.includes('emphasis/') && 
  (allTokens[key].file.includes('medium.json') || allTokens[key].file.includes('low.json'))
);

console.log(`\n🎯 Validating emphasis layer (${emphasisTokens.length} tokens):`);

let emphasisValid = 0;
let emphasisInvalid = 0;

emphasisTokens.forEach(tokenPath => {
  const result = validateTokenReference(tokenPath);
  if (result.valid) {
    emphasisValid++;
  } else {
    emphasisInvalid++;
    console.log(`❌ ${tokenPath}: ${result.reason}`);
    console.log(`   Chain: ${result.chain.join(' → ')}`);
  }
});

console.log(`✅ Emphasis layer: ${emphasisValid} valid, ${emphasisInvalid} invalid`);

// Validate the inversity layer specifically
const inversityTokens = Object.keys(allTokens).filter(key => 
  allTokens[key].file.includes('inversity/') && 
  (allTokens[key].file.includes('normal.json') || allTokens[key].file.includes('flipped.json'))
);

console.log(`\n🔄 Validating inversity layer (${inversityTokens.length} tokens):`);

let inversityValid = 0;
let inversityInvalid = 0;

inversityTokens.forEach(tokenPath => {
  const result = validateTokenReference(tokenPath);
  if (result.valid) {
    inversityValid++;
  } else {
    inversityInvalid++;
    console.log(`❌ ${tokenPath}: ${result.reason}`);
    console.log(`   Chain: ${result.chain.join(' → ')}`);
  }
});

console.log(`✅ Inversity layer: ${inversityValid} valid, ${inversityInvalid} invalid`);

// Overall summary
console.log(`\n📊 SUMMARY:`);
console.log(`✅ Total valid tokens: ${emphasisValid + inversityValid}`);
console.log(`❌ Total invalid tokens: ${emphasisInvalid + inversityInvalid}`);

if (emphasisInvalid === 0 && inversityInvalid === 0) {
  console.log(`\n🎉 SUCCESS: All emphasis and inversity tokens are valid!`);
} else {
  console.log(`\n⚠️  Some tokens still have issues that need to be resolved.`);
}
