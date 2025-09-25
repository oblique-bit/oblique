#!/usr/bin/env node

/**
 * S2 Emphasis Symmetry Validator
 * 
 * Compares high.json and low.json files to ensure they have symmetric token structures.
 * Identifies missing tokens in either file.
 * 
 * Usage: node compare-s2-emphasis-symmetry.js
 */

const fs = require('fs');
const path = require('path');

// File paths
const HIGH_PATH = 'src/lib/themes/03_semantic/color/s2-emphasis/high.json';
const LOW_PATH = 'src/lib/themes/03_semantic/color/s2-emphasis/low.json';

/**
 * Extract all token paths from a JSON structure
 */
function extractTokenPaths(obj, currentPath = '') {
  const paths = new Set();
  
  if (typeof obj === 'object' && obj !== null) {
    if (obj.$value !== undefined) {
      // This is a token definition
      paths.add(currentPath);
    } else {
      // Traverse deeper
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        const childPaths = extractTokenPaths(value, newPath);
        childPaths.forEach(path => paths.add(path));
      });
    }
  }
  
  return paths;
}

/**
 * Main validation function
 */
function validateS2EmphasisSymmetry() {
  console.log('🔍 S2 Emphasis Symmetry Validation\n');
  
  try {
    // Read both files
    if (!fs.existsSync(HIGH_PATH)) {
      console.error(`❌ High emphasis file not found: ${HIGH_PATH}`);
      return;
    }
    
    if (!fs.existsSync(LOW_PATH)) {
      console.error(`❌ Low emphasis file not found: ${LOW_PATH}`);
      return;
    }
    
    const highData = JSON.parse(fs.readFileSync(HIGH_PATH, 'utf8'));
    const lowData = JSON.parse(fs.readFileSync(LOW_PATH, 'utf8'));
    
    console.log('📊 Token Counts:');
    
    // Extract all token paths
    const highPaths = extractTokenPaths(highData);
    const lowPaths = extractTokenPaths(lowData);
    
    console.log(`   High emphasis:  ${highPaths.size} tokens`);
    console.log(`   Low emphasis:   ${lowPaths.size} tokens`);
    
    // Find differences
    const onlyInHigh = [...highPaths].filter(path => !lowPaths.has(path));
    const onlyInLow = [...lowPaths].filter(path => !highPaths.has(path));
    
    if (onlyInHigh.length === 0 && onlyInLow.length === 0) {
      console.log('\n✅ Perfect symmetry! Both files have identical token structures.');
      return;
    }
    
    console.log('\n❌ Asymmetry detected:\n');
    
    if (onlyInHigh.length > 0) {
      console.log(`🔼 Tokens only in HIGH emphasis (${onlyInHigh.length}):`);
      onlyInHigh.sort().forEach(path => console.log(`   - ${path}`));
      console.log();
    }
    
    if (onlyInLow.length > 0) {
      console.log(`🔽 Tokens only in LOW emphasis (${onlyInLow.length}):`);
      onlyInLow.sort().forEach(path => console.log(`   - ${path}`));
      console.log();
    }
    
    // Summary
    console.log('📋 Summary:');
    console.log(`   Total asymmetric tokens: ${onlyInHigh.length + onlyInLow.length}`);
    console.log(`   Tokens missing from low:   ${onlyInHigh.length}`);
    console.log(`   Tokens missing from high:  ${onlyInLow.length}`);
    
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
  }
}

// Run validation
validateS2EmphasisSymmetry();