#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Find all JSON files in themes directory
function findTokenFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      findTokenFiles(itemPath, files);
    } else if (item.endsWith('.json')) {
      files.push(itemPath);
    }
  }
  
  return files;
}

// Extract all token definitions from a file
function extractTokenDefinitions(obj, prefix = '', definitions = new Set()) {
  for (const [key, value] of Object.entries(obj)) {
    const tokenPath = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Check if this is a token definition (has $value or value)
      if (value.$value !== undefined || value.value !== undefined) {
        definitions.add(tokenPath);
      }
      
      // Recurse into nested objects
      extractTokenDefinitions(value, tokenPath, definitions);
    }
  }
  
  return definitions;
}

// Extract all token references from string values
function extractTokenReferences(obj, references = new Set()) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Find token references in the format {token.path}
      const matches = value.match(/\{([^}]+)\}/g);
      if (matches) {
        matches.forEach(match => {
          const tokenRef = match.slice(1, -1); // Remove { and }
          references.add(tokenRef);
        });
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      extractTokenReferences(value, references);
    }
  }
  
  return references;
}

// Analyze token patterns to identify outdated or non-standard tokens
function analyzeTokenPatterns(tokenPath) {
  const issues = [];
  
  // Check for old naming patterns
  if (tokenPath.includes('type_scale')) {
    issues.push('OLD_PATTERN: Uses old "type_scale" instead of "grouped"');
  }
  
  if (tokenPath.includes('fontSizeUnitless')) {
    issues.push('OLD_PATTERN: Uses old "fontSizeUnitless" instead of "font_size_unitless"');
  }
  
  // Check for non-standard paths
  if (tokenPath.includes('_ignore-in-ds')) {
    issues.push('OUTDATED_FOLDER: Uses old "_ignore-in-ds" folder name');
  }
  
  // Check for isolated single tokens outside standard structure
  if (!tokenPath.startsWith('ob.') && !tokenPath.startsWith('r13.')) {
    issues.push('NON_STANDARD: Token outside standard "ob." or "r13." namespaces');
  }
  
  // Check for potential legacy tokens
  if (tokenPath.includes('.legacy.') || tokenPath.includes('.old.') || tokenPath.includes('.deprecated.')) {
    issues.push('LEGACY_TOKEN: Contains legacy/deprecated marker');
  }
  
  return issues;
}

// Categorize files by type
function categorizeFiles(files) {
  const categories = {
    figmaOnly: [],
    primitive: [],
    semantic: [],
    component: [],
    global: [],
    html: [],
    other: []
  };
  
  for (const file of files) {
    const relativePath = file.replace(/.*\/themes\//, '');
    
    if (relativePath.includes('_FIGMA-ONLY/')) {
      categories.figmaOnly.push(file);
    } else if (relativePath.startsWith('primitive/')) {
      categories.primitive.push(file);
    } else if (relativePath.startsWith('semantic/')) {
      categories.semantic.push(file);
    } else if (relativePath.startsWith('component/')) {
      categories.component.push(file);
    } else if (relativePath.startsWith('global/')) {
      categories.global.push(file);
    } else if (relativePath.startsWith('html/')) {
      categories.html.push(file);
    } else {
      categories.other.push(file);
    }
  }
  
  return categories;
}

// Main analysis function
function analyzeUnusedTokens() {
  console.log('🔍 ANALYZING UNUSED AND OUTDATED TOKENS');
  console.log('========================================\n');
  
  const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
  const tokenFiles = findTokenFiles(themesDir);
  
  console.log(`Found ${tokenFiles.length} token files to analyze...\n`);
  
  // Categorize files
  const categories = categorizeFiles(tokenFiles);
  
  console.log('📁 FILE CATEGORIES:');
  console.log('==================');
  console.log(`• Figma-only files: ${categories.figmaOnly.length}`);
  console.log(`• Primitive tokens: ${categories.primitive.length}`);
  console.log(`• Semantic tokens: ${categories.semantic.length}`);
  console.log(`• Component tokens: ${categories.component.length}`);
  console.log(`• Global tokens: ${categories.global.length}`);
  console.log(`• HTML tokens: ${categories.html.length}`);
  console.log(`• Other files: ${categories.other.length}\n`);
  
  // Collect all token definitions and references
  const allDefinitions = new Set();
  const allReferences = new Set();
  const definitionsByFile = {};
  const referencesByFile = {};
  const problematicTokens = {};
  
  for (const filePath of tokenFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim()) {
        continue;
      }
      
      const tokens = JSON.parse(content);
      const relativePath = path.relative(themesDir, filePath);
      
      // Extract definitions and references
      const definitions = extractTokenDefinitions(tokens);
      const references = extractTokenReferences(tokens);
      
      definitionsByFile[relativePath] = definitions;
      referencesByFile[relativePath] = references;
      
      // Add to global sets
      definitions.forEach(def => allDefinitions.add(def));
      references.forEach(ref => allReferences.add(ref));
      
      // Analyze patterns for issues
      definitions.forEach(tokenPath => {
        const issues = analyzeTokenPatterns(tokenPath);
        if (issues.length > 0) {
          if (!problematicTokens[relativePath]) {
            problematicTokens[relativePath] = [];
          }
          problematicTokens[relativePath].push({
            token: tokenPath,
            issues
          });
        }
      });
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log('📊 TOKEN ANALYSIS RESULTS:');
  console.log('==========================');
  console.log(`• Total token definitions: ${allDefinitions.size}`);
  console.log(`• Total token references: ${allReferences.size}\n`);
  
  // Find unused tokens (defined but never referenced)
  const unusedTokens = [];
  for (const definition of allDefinitions) {
    if (!allReferences.has(definition)) {
      unusedTokens.push(definition);
    }
  }
  
  // Find orphaned references (referenced but not defined)
  const orphanedReferences = [];
  for (const reference of allReferences) {
    if (!allDefinitions.has(reference)) {
      orphanedReferences.push(reference);
    }
  }
  
  // Report unused tokens
  console.log('🚫 UNUSED TOKENS (defined but never referenced):');
  console.log('===============================================');
  if (unusedTokens.length === 0) {
    console.log('✅ No unused tokens found!');
  } else {
    console.log(`Found ${unusedTokens.length} unused tokens:\n`);
    
    // Group by category for better organization
    const unusedByCategory = {};
    unusedTokens.forEach(token => {
      let category = 'other';
      if (token.startsWith('ob.p.')) category = 'primitive';
      else if (token.startsWith('ob.s.')) category = 'semantic';
      else if (token.startsWith('ob.c.')) category = 'component';
      else if (token.startsWith('ob.g.')) category = 'global';
      else if (token.startsWith('r13.')) category = 'r13-legacy';
      
      if (!unusedByCategory[category]) unusedByCategory[category] = [];
      unusedByCategory[category].push(token);
    });
    
    for (const [category, tokens] of Object.entries(unusedByCategory)) {
      console.log(`📂 ${category.toUpperCase()} (${tokens.length} tokens):`);
      tokens.slice(0, 10).forEach(token => console.log(`   • ${token}`));
      if (tokens.length > 10) {
        console.log(`   ... and ${tokens.length - 10} more`);
      }
      console.log('');
    }
  }
  
  // Report orphaned references
  console.log('💔 ORPHANED REFERENCES (referenced but not defined):');
  console.log('==================================================');
  if (orphanedReferences.length === 0) {
    console.log('✅ No orphaned references found!');
  } else {
    console.log(`Found ${orphanedReferences.length} orphaned references:\n`);
    orphanedReferences.slice(0, 20).forEach(ref => console.log(`   • ${ref}`));
    if (orphanedReferences.length > 20) {
      console.log(`   ... and ${orphanedReferences.length - 20} more`);
    }
  }
  
  // Report problematic tokens
  console.log('\n⚠️  PROBLEMATIC TOKENS (outdated patterns):');
  console.log('==========================================');
  const totalProblematic = Object.values(problematicTokens).reduce((sum, tokens) => sum + tokens.length, 0);
  
  if (totalProblematic === 0) {
    console.log('✅ No problematic token patterns found!');
  } else {
    console.log(`Found ${totalProblematic} tokens with issues:\n`);
    
    for (const [file, tokens] of Object.entries(problematicTokens)) {
      console.log(`📁 ${file}:`);
      tokens.forEach(({ token, issues }) => {
        console.log(`   • ${token}`);
        issues.forEach(issue => console.log(`     - ${issue}`));
      });
      console.log('');
    }
  }
  
  // Report empty or suspicious files
  console.log('🗂️  FILE ANALYSIS:');
  console.log('=================');
  const emptyFiles = [];
  const smallFiles = [];
  
  for (const filePath of tokenFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(themesDir, filePath);
      
      if (!content.trim()) {
        emptyFiles.push(relativePath);
      } else if (content.length < 50) {
        smallFiles.push({ path: relativePath, size: content.length });
      }
    } catch (error) {
      // Already handled above
    }
  }
  
  if (emptyFiles.length > 0) {
    console.log(`📭 Empty files (${emptyFiles.length}):`);
    emptyFiles.forEach(file => console.log(`   • ${file}`));
    console.log('');
  }
  
  if (smallFiles.length > 0) {
    console.log(`📄 Suspiciously small files (${smallFiles.length}):`);
    smallFiles.forEach(({ path, size }) => console.log(`   • ${path} (${size} bytes)`));
    console.log('');
  }
  
  // Summary recommendations
  console.log('💡 CLEANUP RECOMMENDATIONS:');
  console.log('===========================');
  
  if (unusedTokens.length > 0) {
    console.log(`🧹 Consider removing ${unusedTokens.length} unused token definitions`);
  }
  
  if (orphanedReferences.length > 0) {
    console.log(`🔧 Fix ${orphanedReferences.length} broken token references`);
  }
  
  if (totalProblematic > 0) {
    console.log(`📝 Update ${totalProblematic} tokens using outdated patterns`);
  }
  
  if (emptyFiles.length > 0) {
    console.log(`🗑️  Delete ${emptyFiles.length} empty files`);
  }
  
  console.log('\n🎯 Analysis complete! Use this information to clean up the token system.');
  
  return {
    unused: unusedTokens,
    orphaned: orphanedReferences,
    problematic: problematicTokens,
    empty: emptyFiles,
    categories
  };
}

// Run the analysis
const results = analyzeUnusedTokens();
process.exit(0);
