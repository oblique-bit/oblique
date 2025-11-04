#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Find all JSON files in themes directory (now including _FIGMA-ONLY)
function findTokenFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      if (!item.startsWith('_FIGMA-ONLY')) {
        findTokenFiles(itemPath, files);
      }
    } else if (item.endsWith('.json') && !item.startsWith('$')) {
      files.push(itemPath);
    }
  }
  
  return files;
}

// Load Token Studio configuration files
function loadTokenStudioConfig(themesDir) {
  const metadataPath = path.join(themesDir, '$metadata.json');
  const themesPath = path.join(themesDir, '$themes.json');
  
  let metadata = null;
  let themes = [];
  
  try {
    if (fs.existsSync(metadataPath)) {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    }
  } catch (error) {
    console.warn(`⚠️  Could not load $metadata.json: ${error.message}`);
  }
  
  try {
    if (fs.existsSync(themesPath)) {
      themes = JSON.parse(fs.readFileSync(themesPath, 'utf8'));
    }
  } catch (error) {
    console.warn(`⚠️  Could not load $themes.json: ${error.message}`);
  }
  
  return { metadata, themes };
}

// Get token set path from file path
function getTokenSetPath(filePath, themesDir) {
  const relativePath = path.relative(themesDir, filePath);
  return relativePath.replace(/\.json$/, '').replace(/\\/g, '/');
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

// Get tokens available for a specific theme
function getAvailableTokensForTheme(theme, tokenFilesBySet, metadata) {
  const availableTokens = new Set();
  
  // Process token sets based on theme configuration
  const selectedTokenSets = theme.selectedTokenSets || {};
  
  // Add tokens from "source" and "enabled" token sets
  for (const [tokenSetPath, state] of Object.entries(selectedTokenSets)) {
    if (state === 'source' || state === 'enabled') {
      const tokenSet = tokenFilesBySet[tokenSetPath];
      if (tokenSet) {
        for (const tokenPath of tokenSet.tokens) {
          availableTokens.add(tokenPath);
        }
      }
    }
  }
  
  return availableTokens;
}

// Validate tokens for a specific theme
function validateTheme(theme, tokenFilesBySet, allReferences, metadata) {
  const availableTokens = getAvailableTokensForTheme(theme, tokenFilesBySet, metadata);
  const brokenReferences = [];
  
  // Only check references from enabled/source token sets
  const selectedTokenSets = theme.selectedTokenSets || {};
  
  for (const { reference, file, tokenSetPath } of allReferences) {
    const tokenSetState = selectedTokenSets[tokenSetPath];
    
    // Only validate references from active token sets
    if (tokenSetState === 'source' || tokenSetState === 'enabled') {
      if (!availableTokens.has(reference)) {
        brokenReferences.push({ reference, file, tokenSetPath });
      }
    }
  }
  
  return brokenReferences;
}

// Main validation function
function checkBrokenTokenChains() {
  console.log('🔗 CHECKING FOR BROKEN TOKEN CHAINS (Token Studio Aware)');
  console.log('=========================================================\n');
  
  const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
  const tokenFiles = findTokenFiles(themesDir);
  
  console.log(`Found ${tokenFiles.length} token files to analyze...\n`);
  
  // Load Token Studio configuration
  const { metadata, themes } = loadTokenStudioConfig(themesDir);
  
  // Organize tokens by token set
  const tokenFilesBySet = {};
  const allTokens = new Set();
  
  for (const filePath of tokenFiles) {
    const tokenSetPath = getTokenSetPath(filePath, themesDir);
    const tokens = getAllTokensFromFile(filePath);
    const tokenPaths = getTokenPaths(tokens);
    
    tokenFilesBySet[tokenSetPath] = {
      filePath,
      tokens: tokenPaths
    };
    
    // Add to global token set for fallback validation
    for (const tokenPath of tokenPaths) {
      allTokens.add(tokenPath);
    }
  }
  
  console.log(`📊 Found ${allTokens.size} valid token definitions across ${Object.keys(tokenFilesBySet).length} token sets\n`);
  
  // Collect all token references with their token set context
  const allReferences = [];
  
  for (const filePath of tokenFiles) {
    const tokenSetPath = getTokenSetPath(filePath, themesDir);
    const tokens = getAllTokensFromFile(filePath);
    const references = getTokenReferences(tokens, filePath);
    
    for (const ref of references) {
      allReferences.push({
        ...ref,
        tokenSetPath
      });
    }
  }
  
  console.log(`🔍 Found ${allReferences.length} token references to validate\n`);
  
  // Validate based on Token Studio themes or fallback to simple validation
  let hasThemeIssues = false;
  
  if (themes && themes.length > 0) {
    console.log(`🎨 Validating ${themes.length} Token Studio themes...\n`);
    
    for (const theme of themes) {
      console.log(`🔍 Theme: "${theme.name}" (${theme.id || 'no-id'})`);
      
      const themeBrokenRefs = validateTheme(theme, tokenFilesBySet, allReferences, metadata);
      
      if (themeBrokenRefs.length === 0) {
        console.log(`   ✅ All token references valid in this theme\n`);
      } else {
        console.log(`   ❌ Found ${themeBrokenRefs.length} broken references in this theme:`);
        
        // Group by file
        const byFile = {};
        for (const { reference, file } of themeBrokenRefs) {
          const relativeFile = path.relative(themesDir, file);
          if (!byFile[relativeFile]) {
            byFile[relativeFile] = [];
          }
          byFile[relativeFile].push(reference);
        }
        
        for (const [file, references] of Object.entries(byFile)) {
          console.log(`     📁 ${file}:`);
          for (const ref of references) {
            console.log(`        ❌ {${ref}}`);
          }
        }
        console.log('');
        hasThemeIssues = true;
      }
    }
  } else {
    console.log('📋 No Token Studio themes found, running simple validation...\n');
    
    // Fallback to simple validation when no themes are configured
    const brokenReferences = [];
    
    for (const { reference, file } of allReferences) {
      if (!allTokens.has(reference)) {
        brokenReferences.push({ reference, file });
      }
    }
    
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
      
      hasThemeIssues = brokenReferences.length > 0;
    }
  }
  
  // Summary
  if (!hasThemeIssues) {
    console.log('🎉 All token references are valid across all themes!');
  } else {
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('===================');
    console.log('• Check if missing tokens should be added to the appropriate token sets');
    console.log('• Verify theme configurations in $themes.json');
    console.log('• Ensure token set paths match actual file structure');
    console.log('• Consider if references should be in different token sets\n');
  }
  
  return !hasThemeIssues;
}

// Run the validation
const success = checkBrokenTokenChains();
process.exit(success ? 0 : 1);
