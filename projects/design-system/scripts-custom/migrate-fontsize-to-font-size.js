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
    } else if (item.endsWith('.json')) {
      files.push(itemPath);
    }
  }
  
  return files;
}

// Main migration function
function migrateFontSizeNaming() {
  console.log('🔤 MIGRATING FONTSIZE → FONT_SIZE NAMING');
  console.log('========================================\n');
  
  const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
  const tokenFiles = findTokenFiles(themesDir);
  
  console.log(`Found ${tokenFiles.length} token files to process...\n`);
  
  let totalChanges = 0;
  const changesByFile = {};
  
  for (const filePath of tokenFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim()) {
        console.log(`⚠️  Skipping empty file: ${path.relative(themesDir, filePath)}`);
        continue;
      }
      
      let updatedContent = content;
      let fileChanges = 0;
      
      // 1. Rename token keys: "fontSizeUnitless" → "font_size_unitless"
      const keyPattern = /"fontSizeUnitless"/g;
      const keyMatches = content.match(keyPattern);
      if (keyMatches) {
        updatedContent = updatedContent.replace(keyPattern, '"font_size_unitless"');
        fileChanges += keyMatches.length;
        console.log(`📝 ${path.relative(themesDir, filePath)}: Renamed ${keyMatches.length} token key(s)`);
      }
      
      // 2. Update token references: {ob.p.fontSizeUnitless.XXX} → {ob.p.font_size_unitless.XXX}
      const refPattern = /\{ob\.p\.fontSizeUnitless\./g;
      const refMatches = content.match(refPattern);
      if (refMatches) {
        updatedContent = updatedContent.replace(refPattern, '{ob.p.font_size_unitless.');
        fileChanges += refMatches.length;
        console.log(`🔗 ${path.relative(themesDir, filePath)}: Updated ${refMatches.length} token reference(s)`);
      }
      
      // 3. Update type values: "fontSizes" → "font_sizes" (if exists)
      const typePattern = /"fontSizes"/g;
      const typeMatches = content.match(typePattern);
      if (typeMatches) {
        updatedContent = updatedContent.replace(typePattern, '"font_sizes"');
        fileChanges += typeMatches.length;
        console.log(`📋 ${path.relative(themesDir, filePath)}: Updated ${typeMatches.length} type value(s)`);
      }
      
      if (fileChanges > 0) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        changesByFile[path.relative(themesDir, filePath)] = fileChanges;
        totalChanges += fileChanges;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log('\n📊 MIGRATION SUMMARY:');
  console.log('====================');
  
  if (totalChanges === 0) {
    console.log('✅ No fontSize naming inconsistencies found!');
  } else {
    console.log(`✅ Successfully processed ${totalChanges} changes across ${Object.keys(changesByFile).length} files:\n`);
    
    for (const [file, changes] of Object.entries(changesByFile)) {
      console.log(`   📁 ${file}: ${changes} change(s)`);
    }
    
    console.log('\n🔄 CHANGES MADE:');
    console.log('• "fontSizeUnitless" → "font_size_unitless" (token keys)');
    console.log('• {ob.p.fontSizeUnitless.XXX} → {ob.p.font_size_unitless.XXX} (references)');
    console.log('• "fontSizes" → "font_sizes" (type values)');
  }
  
  return totalChanges > 0;
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

// Comprehensive validation function
function validateMigration() {
  console.log('\n🔍 VALIDATING MIGRATION RESULTS');
  console.log('===============================\n');
  
  const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
  const tokenFiles = findTokenFiles(themesDir);
  
  const issues = [];
  let validationPassed = true;
  
  // Step 1: Check for remaining old patterns
  console.log('📋 Step 1: Checking for remaining old patterns...');
  for (const filePath of tokenFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim()) continue;
      
      // Check for remaining old patterns
      const oldKeyMatches = content.match(/"fontSizeUnitless"/g);
      const oldRefMatches = content.match(/\{ob\.p\.fontSizeUnitless\./g);
      const oldTypeMatches = content.match(/"fontSizes"/g);
      
      if (oldKeyMatches || oldRefMatches || oldTypeMatches) {
        const relativePath = path.relative(themesDir, filePath);
        issues.push({
          type: 'old_pattern',
          file: relativePath,
          oldKeys: oldKeyMatches?.length || 0,
          oldRefs: oldRefMatches?.length || 0,
          oldTypes: oldTypeMatches?.length || 0
        });
        validationPassed = false;
      }
    } catch (error) {
      console.error(`❌ Error validating ${filePath}:`, error.message);
    }
  }
  
  // Step 2: Validate all token chains are intact
  console.log('🔗 Step 2: Validating token reference chains...');
  
  // Collect all valid token paths
  const allValidTokens = new Set();
  for (const filePath of tokenFiles) {
    const tokens = getAllTokensFromFile(filePath);
    const tokenPaths = getTokenPaths(tokens);
    for (const tokenPath of tokenPaths) {
      allValidTokens.add(tokenPath);
    }
  }
  
  // Collect all token references
  const allReferences = [];
  for (const filePath of tokenFiles) {
    const tokens = getAllTokensFromFile(filePath);
    const references = getTokenReferences(tokens, filePath);
    allReferences.push(...references);
  }
  
  // Check for broken references
  const brokenReferences = [];
  for (const { reference, file } of allReferences) {
    if (!allValidTokens.has(reference)) {
      brokenReferences.push({ reference, file });
    }
  }
  
  if (brokenReferences.length > 0) {
    console.log(`❌ Found ${brokenReferences.length} broken token references after migration!`);
    
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
      issues.push({
        type: 'broken_reference',
        file,
        brokenRefs: references
      });
    }
    
    validationPassed = false;
  } else {
    console.log('✅ All token reference chains are intact!');
  }
  
  // Step 3: Report results
  if (validationPassed) {
    console.log('\n✅ VALIDATION PASSED!');
    console.log('• No remaining old fontSize patterns');
    console.log('• All token reference chains intact');
    console.log(`• Validated ${allValidTokens.size} token definitions`);
    console.log(`• Validated ${allReferences.length} token references`);
  } else {
    console.log('\n❌ VALIDATION FAILED!');
    console.log(`Found ${issues.length} issue(s):\n`);
    
    for (const issue of issues) {
      if (issue.type === 'old_pattern') {
        console.log(`📁 ${issue.file} - Old patterns remaining:`);
        if (issue.oldKeys) console.log(`   • ${issue.oldKeys} old key(s): "fontSizeUnitless"`);
        if (issue.oldRefs) console.log(`   • ${issue.oldRefs} old reference(s): {ob.p.fontSizeUnitless.*}`);
        if (issue.oldTypes) console.log(`   • ${issue.oldTypes} old type(s): "fontSizes"`);
      } else if (issue.type === 'broken_reference') {
        console.log(`📁 ${issue.file} - Broken references:`);
        for (const ref of issue.brokenRefs) {
          console.log(`   ❌ {${ref}}`);
        }
      }
      console.log('');
    }
  }
  
  return validationPassed;
}

// Run the migration
const hasChanges = migrateFontSizeNaming();

// Run validation
const validationPassed = validateMigration();

console.log(`\n${hasChanges ? '🎯' : '✅'} Migration ${hasChanges ? 'completed' : 'verified'} successfully!`);
console.log(`${validationPassed ? '✅' : '❌'} Validation ${validationPassed ? 'passed' : 'failed'}!`);

process.exit(validationPassed ? 0 : 1);
