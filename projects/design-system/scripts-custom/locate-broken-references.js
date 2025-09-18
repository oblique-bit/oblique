#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of broken references from our analysis
const brokenReferences = [
  'ob.p.fontSizeUnitless.400',
  'ob.s.font_family.code',
  'ob.s.letter_spacing.normal',
  'ob.p.fontSizeUnitless.500',
  'ob.s.font_family.body',
  'ob.s.font_weight.extraBold',
  'ob.p.fontSizeUnitless.1100',
  'ob.s.typography.type_scale.xs.normal',
  'ob.s.typography.type_scale.lg.normal',
  'ob.s.typography.type_scale.sm.normal',
  'ob.s.typography.type_scale.md.normal',
  'ob.s.typography.type_scale.xl.normal'
];

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

// Find broken references in files
function findBrokenReferences() {
  console.log('🔍 LOCATING BROKEN REFERENCES');
  console.log('=============================\n');
  
  const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
  const tokenFiles = findTokenFiles(themesDir);
  
  const referenceLocations = {};
  
  for (const filePath of tokenFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.trim()) continue;
      
      const relativePath = path.relative(themesDir, filePath);
      
      // Check each broken reference
      for (const brokenRef of brokenReferences) {
        const refPattern = `{${brokenRef}}`;
        if (content.includes(refPattern)) {
          if (!referenceLocations[brokenRef]) {
            referenceLocations[brokenRef] = [];
          }
          
          // Find line numbers
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.includes(refPattern)) {
              referenceLocations[brokenRef].push({
                file: relativePath,
                line: index + 1,
                content: line.trim()
              });
            }
          });
        }
      }
      
    } catch (error) {
      // Skip files with errors
    }
  }
  
  console.log('📍 BROKEN REFERENCE LOCATIONS:');
  console.log('==============================\n');
  
  if (Object.keys(referenceLocations).length === 0) {
    console.log('✅ No broken references found in current files!');
    return;
  }
  
  for (const [brokenRef, locations] of Object.entries(referenceLocations)) {
    console.log(`🚫 ${brokenRef}:`);
    locations.forEach(loc => {
      console.log(`   📁 ${loc.file}:${loc.line}`);
      console.log(`      ${loc.content}`);
    });
    console.log('');
  }
  
  // Group by file for easier fixing
  const byFile = {};
  for (const [brokenRef, locations] of Object.entries(referenceLocations)) {
    locations.forEach(loc => {
      if (!byFile[loc.file]) {
        byFile[loc.file] = [];
      }
      byFile[loc.file].push({
        reference: brokenRef,
        line: loc.line,
        content: loc.content
      });
    });
  }
  
  console.log('📁 SUMMARY BY FILE:');
  console.log('===================');
  for (const [file, refs] of Object.entries(byFile)) {
    console.log(`\n📄 ${file} (${refs.length} broken references):`);
    refs.forEach(ref => {
      console.log(`   • Line ${ref.line}: ${ref.reference}`);
    });
  }
  
  console.log('\n💡 QUICK ANALYSIS:');
  console.log('==================');
  
  // Analyze patterns
  const typeScaleRefs = Object.keys(referenceLocations).filter(ref => ref.includes('type_scale'));
  const fontSizeRefs = Object.keys(referenceLocations).filter(ref => ref.includes('fontSizeUnitless'));
  const fontFamilyRefs = Object.keys(referenceLocations).filter(ref => ref.includes('font_family'));
  const otherRefs = Object.keys(referenceLocations).filter(ref => 
    !ref.includes('type_scale') && !ref.includes('fontSizeUnitless') && !ref.includes('font_family')
  );
  
  if (typeScaleRefs.length > 0) {
    console.log(`🏷️  ${typeScaleRefs.length} type_scale references - these should be migrated to "grouped"`);
  }
  
  if (fontSizeRefs.length > 0) {
    console.log(`📏 ${fontSizeRefs.length} fontSizeUnitless references - these tokens might be missing`);
  }
  
  if (fontFamilyRefs.length > 0) {
    console.log(`🔤 ${fontFamilyRefs.length} font_family references - these semantic tokens might be missing`);
  }
  
  if (otherRefs.length > 0) {
    console.log(`⚡ ${otherRefs.length} other broken references`);
  }
  
  return referenceLocations;
}

// Run the analysis
const brokenRefs = findBrokenReferences();
process.exit(0);
