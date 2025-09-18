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

// Update token keys in an object recursively
function updateTokenKeys(obj, path = '') {
  const updates = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (key === 'scale' && currentPath.includes('typography')) {
      // This is a typography scale object that should be renamed to grouped
      obj['grouped'] = value;
      delete obj['scale'];
      updates.push({
        type: 'rename_key',
        oldPath: currentPath,
        newPath: currentPath.replace('.scale', '.grouped'),
        oldKey: 'scale',
        newKey: 'grouped'
      });
      
      // Continue processing the renamed object
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const nestedUpdates = updateTokenKeys(value, currentPath.replace('.scale', '.grouped'));
        updates.push(...nestedUpdates);
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recurse into nested objects
      const nestedUpdates = updateTokenKeys(value, currentPath);
      updates.push(...nestedUpdates);
    }
  }
  
  return updates;
}

// Update token references in string values
function updateTokenReferences(obj, updates = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Check if this is a token reference
      if (value.includes('ob.s.typography.scale.')) {
        const updatedValue = value.replace(/ob\.s\.typography\.scale\./g, 'ob.s.typography.grouped.');
        obj[key] = updatedValue;
        updates.push({
          type: 'update_reference',
          key,
          oldValue: value,
          newValue: updatedValue
        });
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recurse into nested objects
      updateTokenReferences(value, updates);
    }
  }
  
  return updates;
}

// Main migration function
function migrateScaleToGrouped() {
  console.log('🔄 MIGRATING TYPOGRAPHY SCALE → GROUPED TOKENS');
  console.log('===============================================\n');
  
  const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
  const tokenFiles = findTokenFiles(themesDir);
  
  // Exclude the external typography-styles-R13.json file
  const filteredFiles = tokenFiles.filter(file => 
    !file.includes('typography-styles-R13.json')
  );
  
  console.log(`Found ${filteredFiles.length} token files to process...\n`);
  console.log(`⚠️  Excluding typography-styles-R13.json (external file)\n`);
  
  let totalKeyRenames = 0;
  let totalReferenceUpdates = 0;
  const changesByFile = {};
  
  for (const filePath of filteredFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim()) {
        continue;
      }
      
      const tokens = JSON.parse(content);
      let fileModified = false;
      
      // Step 1: Update token keys (scale → grouped)
      const keyUpdates = updateTokenKeys(tokens);
      
      // Step 2: Update token references in $value strings
      const referenceUpdates = updateTokenReferences(tokens);
      
      const totalUpdates = keyUpdates.length + referenceUpdates.length;
      
      if (totalUpdates > 0) {
        // Write updated content back to file
        fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2) + '\n', 'utf8');
        
        const relativePath = path.relative(themesDir, filePath);
        changesByFile[relativePath] = {
          keyRenames: keyUpdates.length,
          referenceUpdates: referenceUpdates.length,
          total: totalUpdates
        };
        
        totalKeyRenames += keyUpdates.length;
        totalReferenceUpdates += referenceUpdates.length;
        fileModified = true;
        
        console.log(`📝 ${relativePath}:`);
        if (keyUpdates.length > 0) {
          console.log(`   • Renamed ${keyUpdates.length} token key(s): scale → grouped`);
        }
        if (referenceUpdates.length > 0) {
          console.log(`   • Updated ${referenceUpdates.length} token reference(s)`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log('\n📊 MIGRATION RESULTS:');
  console.log('=====================');
  
  if (totalKeyRenames === 0 && totalReferenceUpdates === 0) {
    console.log('✅ No scale tokens found - migration not needed.');
    console.log('All typography tokens already use the grouped structure.');
  } else {
    console.log(`🎯 Successfully migrated typography tokens:`);
    console.log(`   • ${totalKeyRenames} token key(s) renamed: scale → grouped`);
    console.log(`   • ${totalReferenceUpdates} reference(s) updated`);
    console.log(`   • ${Object.keys(changesByFile).length} file(s) modified\n`);
    
    console.log(`📁 Modified files:`);
    for (const [file, changes] of Object.entries(changesByFile)) {
      console.log(`   • ${file}: ${changes.keyRenames} renames, ${changes.referenceUpdates} references`);
    }
    
    // Show examples if we have changes
    if (Object.keys(changesByFile).length > 0) {
      console.log('\n📝 EXAMPLES OF CHANGES:');
      console.log('========================');
      console.log('Token keys renamed:');
      console.log('   BEFORE: ob.s.typography.scale.static.xs.normal');
      console.log('   AFTER:  ob.s.typography.grouped.static.xs.normal');
      console.log('');
      console.log('Token references updated:');
      console.log('   BEFORE: "{ob.s.typography.scale.static.xs.normal}"');
      console.log('   AFTER:  "{ob.s.typography.grouped.static.xs.normal}"');
    }
  }
  
  return totalKeyRenames > 0 || totalReferenceUpdates > 0;
}

// Run the migration
const hasChanges = migrateScaleToGrouped();
console.log(`\n${hasChanges ? '🎯' : '✅'} Migration ${hasChanges ? 'completed with updates' : 'completed - no changes needed'}!`);
process.exit(0);
