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
      findTokenFiles(itemPath, files);
    } else if (item.endsWith('.json')) {
      files.push(itemPath);
    }
  }
  
  return files;
}

// Patterns that indicate tooling restrictions
const TOOLING_PATTERNS = {
  'NO-FIGMA': [
    /must be applied manually in figma/i,
    /figma cannot handle/i,
    /not supported in figma/i,
    /figma limitation/i,
    /apply manually/i,
    /figma doesn't support/i,
    /manual application in figma/i
  ],
  'FIGMA-ONLY': [
    /developers can ignore/i,
    /figma only/i,
    /not for development/i,
    /design tool only/i,
    /figma specific/i,
    /ignore in code/i
  ]
};

// Check if description already has a tooling tag
function hasToolingTag(description) {
  return /^\[(NO-FIGMA|FIGMA-ONLY)\]/i.test(description.trim());
}

// Detect tooling restriction from description content
function detectToolingRestriction(description, filePath) {
  if (!description || hasToolingTag(description)) {
    return null;
  }
  
  // Check if file is in _FIGMA-ONLY directory
  if (filePath.includes('/_FIGMA-ONLY/')) {
    return 'FIGMA-ONLY';
  }
  
  // Check for NO-FIGMA patterns
  for (const pattern of TOOLING_PATTERNS['NO-FIGMA']) {
    if (pattern.test(description)) {
      return 'NO-FIGMA';
    }
  }
  
  // Check for FIGMA-ONLY patterns
  for (const pattern of TOOLING_PATTERNS['FIGMA-ONLY']) {
    if (pattern.test(description)) {
      return 'FIGMA-ONLY';
    }
  }
  
  return null;
}

// Add tooling tag to description
function addToolingTag(description, tag) {
  const cleanDescription = description.trim();
  return `[${tag}]\n${cleanDescription}`;
}

// Process token descriptions recursively
function processTokenDescriptions(obj, filePath, changes = []) {
  const isFigmaOnly = filePath.includes('/_FIGMA-ONLY/');
  
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const description = value.$description || value.description;
      const isToken = value.$value !== undefined || value.value !== undefined;
      
      if (description && typeof description === 'string') {
        // Check existing descriptions for patterns
        const restriction = detectToolingRestriction(description, filePath);
        
        if (restriction) {
          const updatedDescription = addToolingTag(description, restriction);
          
          // Update the description in the object
          if (value.$description) {
            value.$description = updatedDescription;
          } else if (value.description) {
            value.description = updatedDescription;
          }
          
          changes.push({
            file: filePath,
            token: key,
            restriction,
            oldDescription: description,
            newDescription: updatedDescription
          });
        }
      } else if (isFigmaOnly && isToken) {
        // Add FIGMA-ONLY tag to all tokens in _FIGMA-ONLY folder without descriptions
        const newDescription = '[FIGMA-ONLY]\nToken for Figma design workflow only.';
        
        value.$description = newDescription;
        
        changes.push({
          file: filePath,
          token: key,
          restriction: 'FIGMA-ONLY',
          oldDescription: '(no description)',
          newDescription: newDescription
        });
      } else if (isFigmaOnly && description && !hasToolingTag(description)) {
        // Add FIGMA-ONLY tag to existing descriptions in _FIGMA-ONLY folder
        const updatedDescription = addToolingTag(description, 'FIGMA-ONLY');
        
        if (value.$description) {
          value.$description = updatedDescription;
        } else if (value.description) {
          value.description = updatedDescription;
        }
        
        changes.push({
          file: filePath,
          token: key,
          restriction: 'FIGMA-ONLY',
          oldDescription: description,
          newDescription: updatedDescription
        });
      }
      
      // Recurse into nested objects
      processTokenDescriptions(value, filePath, changes);
    }
  }
  
  return changes;
}

// Main function to scan and update tooling restrictions
function scanAndUpdateToolingRestrictions() {
  console.log('🔧 SCANNING FOR TOOLING RESTRICTIONS IN TOKEN DESCRIPTIONS');
  console.log('=========================================================\n');
  
  const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
  const tokenFiles = findTokenFiles(themesDir);
  
  console.log(`Found ${tokenFiles.length} token files to analyze...\n`);
  
  let totalChanges = 0;
  const changesByFile = {};
  const allChanges = [];
  
  for (const filePath of tokenFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim()) {
        continue;
      }
      
      const tokens = JSON.parse(content);
      const changes = processTokenDescriptions(tokens, filePath);
      
      if (changes.length > 0) {
        // Write updated content back to file
        fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2) + '\n', 'utf8');
        
        const relativePath = path.relative(themesDir, filePath);
        changesByFile[relativePath] = changes.length;
        totalChanges += changes.length;
        allChanges.push(...changes);
        
        console.log(`📝 ${relativePath}: Added ${changes.length} tooling tag(s)`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log('
📊 ANALYSIS RESULTS:');
  console.log('====================');
  
  if (totalChanges === 0) {
    console.log('✅ No tooling restrictions detected in token descriptions.');
    console.log('All tokens are compatible with both Figma and development workflows.');
  } else {
    console.log(`🎯 Added ${totalChanges} tooling tag(s) across ${Object.keys(changesByFile).length} file(s):
`);
    
    // Group changes by restriction type
    const byRestriction = {
      'NO-FIGMA': allChanges.filter(c => c.restriction === 'NO-FIGMA'),
      'FIGMA-ONLY': allChanges.filter(c => c.restriction === 'FIGMA-ONLY')
    };
    
    console.log(`📋 Summary by restriction type:`);
    console.log(`   • [NO-FIGMA]: ${byRestriction['NO-FIGMA'].length} token(s)`);
    console.log(`   • [FIGMA-ONLY]: ${byRestriction['FIGMA-ONLY'].length} token(s)
`);
    
    console.log(`📁 Files modified:`);
    for (const [file, count] of Object.entries(changesByFile)) {
      console.log(`   • ${file}: ${count} tag(s) added`);
    }
    
    // Show examples
    if (allChanges.length > 0) {
      console.log('
📝 EXAMPLES OF CHANGES MADE:');
      console.log('=============================');
      
      const examples = allChanges.slice(0, 3); // Show first 3 examples
      for (const change of examples) {
        const relativePath = path.relative(themesDir, change.file);
        console.log(`
📁 ${relativePath} - ${change.token}:`);
        console.log(`   BEFORE: "${change.oldDescription.substring(0, 60)}${change.oldDescription.length > 60 ? '...' : ''}"`);
        console.log(`   AFTER:  "${change.newDescription.substring(0, 60)}${change.newDescription.length > 60 ? '...' : ''}"`);
      }
      
      if (allChanges.length > 3) {
        console.log(`
   ... and ${allChanges.length - 3} more changes`);
      }
    }
  }
  
  return totalChanges > 0;
}

// Run the analysis
const hasChanges = scanAndUpdateToolingRestrictions();
console.log(`
${hasChanges ? '🎯' : '✅'} Analysis ${hasChanges ? 'completed with updates' : 'completed - no restrictions found'}!`);
process.exit(0);
