#!/usr/bin/env node

/**
 * Validation script for semantic sizing token refactoring
 * Checks that all legacy references resolve correctly
 */

const fs = require('fs');
const path = require('path');

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`❌ Error loading ${filePath}: ${error.message}`);
    return null;
  }
}

function main() {
  console.log('🔍 SEMANTIC SIZING REFACTORING VALIDATION');
  console.log('==========================================\n');

  // Load the main sizing token file
  const sizingPath = path.join(__dirname, '../src/lib/themes/semantic/sizing.json');
  const sizing = loadJSON(sizingPath);
  
  if (!sizing) {
    console.error('❌ Failed to load sizing.json');
    return;
  }

  // Check new structure exists
  const newStructure = sizing.ob.s.size;
  const hasNewStructure = !!(
    newStructure.detail &&
    newStructure.element &&
    newStructure.surface &&
    newStructure.container
  );

  console.log(`✅ New semantic structure: ${hasNewStructure ? 'PRESENT' : 'MISSING'}`);

  // Check legacy compatibility layer
  const legacy = newStructure._legacy;
  const hasLegacy = !!legacy;
  console.log(`✅ Legacy compatibility layer: ${hasLegacy ? 'PRESENT' : 'MISSING'}`);

  if (hasLegacy) {
    const legacyTokens = Object.keys(legacy);
    console.log(`📊 Legacy tokens available: ${legacyTokens.length}`);
    console.log(`   Examples: ${legacyTokens.slice(0, 5).join(', ')}...\n`);
  }

  // Test component files for broken references
  const componentPaths = [
    'src/lib/themes/component/atom/badge.json',
    'src/lib/themes/component/molecule/tag.json',
    'src/lib/themes/component/molecule/popover.json',
    'src/lib/themes/component/molecule/pill.json',
    'src/lib/themes/component/atom/spinner.json'
  ];

  let allValid = true;

  for (const componentPath of componentPaths) {
    const fullPath = path.join(__dirname, '..', componentPath);
    const component = loadJSON(fullPath);
    
    if (!component) {
      console.error(`❌ Failed to load ${componentPath}`);
      allValid = false;
      continue;
    }

    const content = JSON.stringify(component);
    const legacyRefs = content.match(/ob\.s\.size\._legacy\.\w+/g) || [];
    const directRefs = content.match(/ob\.s\.size\.(?!_legacy\.|detail\.|element\.|surface\.|container\.)\w+/g) || [];

    console.log(`📄 ${path.basename(componentPath)}:`);
    console.log(`   Legacy references: ${legacyRefs.length}`);
    console.log(`   Direct old references: ${directRefs.length}`);
    
    if (directRefs.length > 0) {
      console.error(`   ⚠️  Found unmigrated references: ${directRefs.slice(0, 3).join(', ')}`);
      allValid = false;
    } else {
      console.log(`   ✅ All references migrated`);
    }
  }

  console.log('\n==========================================');
  console.log(`🎯 OVERALL STATUS: ${allValid ? '✅ VALID' : '❌ ISSUES FOUND'}`);
  
  if (allValid) {
    console.log('🚀 Refactoring complete! All component references use legacy compatibility.');
  } else {
    console.log('🔧 Some issues found. Please check the details above.');
  }
}

main();
