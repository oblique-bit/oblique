#!/usr/bin/env node

/**
 * Theme Symmetry Validator
 * 
 * Compares dark.json and light.json files to ensure they have symmetric token structures.
 * Identifies missing tokens in either file.
 * 
 * Usage: node compare-theme-symmetry.js
 */

const fs = require('fs');
const path = require('path');

// File paths
const DARK_PATH = 'src/lib/themes/03_semantic/color/s1-lightness/dark.json';
const LIGHT_PATH = 'src/lib/themes/03_semantic/color/s1-lightness/light.json';

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
function validateThemeSymmetry() {
  console.log('🔍 Theme Symmetry Validation\n');
  
  try {
    // Read both files
    if (!fs.existsSync(DARK_PATH)) {
      console.error(`❌ Dark theme file not found: ${DARK_PATH}`);
      return;
    }
    
    if (!fs.existsSync(LIGHT_PATH)) {
      console.error(`❌ Light theme file not found: ${LIGHT_PATH}`);
      return;
    }
    
    const darkData = JSON.parse(fs.readFileSync(DARK_PATH, 'utf8'));
    const lightData = JSON.parse(fs.readFileSync(LIGHT_PATH, 'utf8'));
    
    console.log('📊 Token Counts:');
    
    // Extract all token paths
    const darkPaths = extractTokenPaths(darkData);
    const lightPaths = extractTokenPaths(lightData);
    
    console.log(`   Dark theme:  ${darkPaths.size} tokens`);
    console.log(`   Light theme: ${lightPaths.size} tokens`);
    
    // Find differences
    const onlyInDark = [...darkPaths].filter(path => !lightPaths.has(path));
    const onlyInLight = [...lightPaths].filter(path => !darkPaths.has(path));
    
    if (onlyInDark.length === 0 && onlyInLight.length === 0) {
      console.log('\n✅ Perfect symmetry! Both files have identical token structures.');
      return;
    }
    
    console.log('\n❌ Asymmetry detected:\n');
    
    if (onlyInDark.length > 0) {
      console.log(`🌙 Tokens only in DARK theme (${onlyInDark.length}):`);
      onlyInDark.sort().forEach(path => console.log(`   - ${path}`));
      console.log();
    }
    
    if (onlyInLight.length > 0) {
      console.log(`☀️  Tokens only in LIGHT theme (${onlyInLight.length}):`);
      onlyInLight.sort().forEach(path => console.log(`   - ${path}`));
      console.log();
    }
    
    // Summary
    console.log('📋 Summary:');
    console.log(`   Total asymmetric tokens: ${onlyInDark.length + onlyInLight.length}`);
    console.log(`   Tokens missing from dark:  ${onlyInLight.length}`);
    console.log(`   Tokens missing from light: ${onlyInDark.length}`);
    
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
  }
}

// Run validation
validateThemeSymmetry();