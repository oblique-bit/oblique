#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Find all JSON files in themes directory (excluding _ignore-in-ds)
function findTokenFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      if (!item.startsWith('_ignore-in-ds')) {
        findTokenFiles(itemPath, files);
      }
    } else if (item.endsWith('.json')) {
      files.push(itemPath);
    }
  }
  
  return files;
}

// Extract token references from a string value
function extractTokenReferences(value) {
  const tokenPattern = /\{([^}]+)\}/g;
  const references = [];
  let match;
  
  while ((match = tokenPattern.exec(value)) !== null) {
    references.push(match[1]);
  }
  
  return references;
}

// Get all tokens from a file
function getAllTokensFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.trim()) {
      console.warn(`⚠️  Empty file: ${filePath}`);
      return {};
    }
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    return {};
  }
}

// Recursively get all token paths from a token object
function getTokenPaths(obj, prefix = '') {
  const paths = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Check both 'value' and '$value' for W3C Design Token format
      const tokenValue = value.value || value.$value;
      if (tokenValue !== undefined) {
        // This is a token definition
        paths.push(currentPath);
      } else {
        // This is a nested object, recurse
        paths.push(...getTokenPaths(value, currentPath));
      }
    }
  }
  
  return paths;
}

// Get all token references from a token object
function getTokenReferences(obj, filePath, references = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Check both 'value' and '$value' properties for W3C Design Token format
      const tokenValue = value.value || value.$value;
      if (tokenValue !== undefined && typeof tokenValue === 'string') {
        // This is a token definition, check its value for references
        const refs = extractTokenReferences(tokenValue);
        for (const ref of refs) {
          references.push({ reference: ref, file: filePath });
        }
      } else {
        // Recurse into nested objects
        getTokenReferences(value, filePath, references);
      }
    }
  }
  
  return references;
}

// Main validation function
function checkBrokenTokenChains() {
  console.log('🔗 CHECKING FOR BROKEN TOKEN CHAINS');
  console.log('===================================\n');
  
  const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
  const tokenFiles = findTokenFiles(themesDir);
  
  console.log(`Found ${tokenFiles.length} token files to analyze...\n`);
  
  // First pass: collect all valid token paths
  const allValidTokens = new Set();
  
  for (const filePath of tokenFiles) {
    const tokens = getAllTokensFromFile(filePath);
    const tokenPaths = getTokenPaths(tokens);
    
    for (const tokenPath of tokenPaths) {
      allValidTokens.add(tokenPath);
    }
  }
  
  console.log(`📊 Found ${allValidTokens.size} valid token definitions\n`);
  
  // Second pass: collect all token references
  const allReferences = [];
  
  for (const filePath of tokenFiles) {
    const tokens = getAllTokensFromFile(filePath);
    const references = getTokenReferences(tokens, filePath);
    allReferences.push(...references);
  }
  
  console.log(`🔍 Found ${allReferences.length} token references to validate\n`);
  
  // Check for broken references
  const brokenReferences = [];
  
  for (const { reference, file } of allReferences) {
    if (!allValidTokens.has(reference)) {
      brokenReferences.push({ reference, file });
    }
  }
  
  // Report results
  if (brokenReferences.length === 0) {
    console.log('✅ No broken token chains found!');
  } else {
    console.log(`❌ Found ${brokenReferences.length} broken token references:\n`);
    
    // Group by file for better readability
    const byFile = {};
    for (const { reference, file } of brokenReferences) {
      const relativeFile = path.relative(themesDir, file);
      if (!byFile[relativeFile]) {
        byFile[relativeFile] = [];
      }
      byFile[relativeFile].push(reference);
    }
    
    for (const [file, references] of Object.entries(byFile)) {
      console.log(`📁 ${file}:`);
      for (const ref of references) {
        console.log(`   ❌ {${ref}}`);
      }
      console.log('');
    }
    
    // Show some suggestions for common patterns
    console.log('💡 COMMON PATTERNS & SUGGESTIONS:');
    console.log('=================================\n');
    
    const uniqueRefs = [...new Set(brokenReferences.map(b => b.reference))];
    
    // Group by common prefixes
    const prefixGroups = {};
    for (const ref of uniqueRefs) {
      const parts = ref.split('.');
      const prefix = parts.slice(0, 3).join('.');
      if (!prefixGroups[prefix]) {
        prefixGroups[prefix] = [];
      }
      prefixGroups[prefix].push(ref);
    }
    
    for (const [prefix, refs] of Object.entries(prefixGroups)) {
      console.log(`🏷️  ${prefix}.* (${refs.length} references)`);
      refs.slice(0, 3).forEach(ref => console.log(`   • {${ref}}`));
      if (refs.length > 3) {
        console.log(`   ... and ${refs.length - 3} more`);
      }
      console.log('');
    }
  }
  
  return brokenReferences.length === 0;
}

// Run the validation
const success = checkBrokenTokenChains();
process.exit(success ? 0 : 1);
