#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths
const S1_DARK_PATH = 'src/lib/themes/semantic/color/s1-lightness/dark.json';
const S1_LIGHT_PATH = 'src/lib/themes/semantic/color/s1-lightness/light.json';
const S3_SEMANTIC_PATH = 'src/lib/themes/semantic/color/s3-semantic/semantic.json';

/**
 * Extract S1 token references from a JSON structure
 */
function extractS1References(obj, currentPath = '') {
  const references = new Set();
  
  if (typeof obj === 'string' && obj.includes('{ob.s1.')) {
    const match = obj.match(/\{([^}]+)\}/);
    if (match) {
      references.add(match[1]);
    }
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      const childRefs = extractS1References(value, newPath);
      childRefs.forEach(ref => references.add(ref));
    });
  }
  
  return references;
}

/**
 * Extract actual S1 token definitions from S1 files
 */
function extractS1Definitions(s1Data, prefix = '') {
  const definitions = new Set();
  
  function traverse(obj, path = '') {
    if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const fullPath = path ? `${path}.${key}` : key;
        
        if (value && typeof value === 'object' && value.$value !== undefined) {
          // This is a token definition - add with prefix
          definitions.add(`${prefix}${fullPath}`);
        } else if (typeof value === 'object') {
          traverse(value, fullPath);
        }
      });
    }
  }
  
  // Start traversing from the root, but the S1 data already includes "ob.s1.color" structure
  traverse(s1Data);
  return definitions;
}

/**
 * Main validation function
 */
function validateS1S3Mirroring() {
  console.log('🔍 S1↔S3 Mirroring Validation\n');
  
  try {
    // Load S3 semantic file
    const s3Data = JSON.parse(fs.readFileSync(S3_SEMANTIC_PATH, 'utf8'));
    console.log('✅ Loaded S3 semantic file');
    
    // Extract S1 references from S3 file
    const s1References = extractS1References(s3Data);
    console.log(`✅ Found ${s1References.size} S1 references in S3 file`);
    
    // Load S1 files if they exist
    let s1Definitions = new Set();
    
    if (fs.existsSync(S1_DARK_PATH)) {
      const s1DarkData = JSON.parse(fs.readFileSync(S1_DARK_PATH, 'utf8'));
      const darkDefs = extractS1Definitions(s1DarkData);
      darkDefs.forEach(def => s1Definitions.add(def));
      console.log(`✅ Loaded S1 dark file - found ${darkDefs.size} definitions`);
    }
    
    if (fs.existsSync(S1_LIGHT_PATH)) {
      const s1LightData = JSON.parse(fs.readFileSync(S1_LIGHT_PATH, 'utf8'));
      const lightDefs = extractS1Definitions(s1LightData);
      lightDefs.forEach(def => s1Definitions.add(def));
      console.log(`✅ Loaded S1 light file - found ${lightDefs.size} additional definitions`);
    }
    
    console.log(`\n📊 Total S1 definitions available: ${s1Definitions.size}`);
    
    // Validate mirroring
    const missingReferences = [];
    const validReferences = [];
    
    s1References.forEach(ref => {
      if (s1Definitions.has(ref)) {
        validReferences.push(ref);
      } else {
        missingReferences.push(ref);
      }
    });
    
    console.log(`\n✅ Valid S1↔S3 references: ${validReferences.size}`);
    
    if (missingReferences.length > 0) {
      console.log(`\n❌ Missing S1 definitions (${missingReferences.length}):`);
      missingReferences.forEach(ref => {
        console.log(`   - ${ref}`);
      });
    }
    
    // Check for status token patterns
    console.log('\n🎯 Status Token Analysis:');
    const statusTypes = ['pending', 'confirmed', 'progress', 'scheduled', 'waiting', 'resolved', 'attention', 'critical'];
    
    statusTypes.forEach(status => {
      const statusRefs = Array.from(s1References).filter(ref => ref.includes(`.status.${status}.`));
      console.log(`   ${status}: ${statusRefs.length} tokens`);
      
      // Check for proper structure
      const fgTokens = statusRefs.filter(ref => ref.includes('.fg.'));
      const bgTokens = statusRefs.filter(ref => ref.includes('.bg.'));
      const contrastLevels = ['contrast_highest', 'contrast_high', 'contrast_medium', 'contrast_low'];
      const inversityLevels = ['inversity_normal', 'inversity_flipped'];
      
      let expectedTokens = 0;
      contrastLevels.forEach(contrast => {
        inversityLevels.forEach(inversity => {
          expectedTokens += 2; // fg + bg
        });
      });
      
      if (statusRefs.length === expectedTokens) {
        console.log(`     ✅ Complete structure (${expectedTokens} tokens)`);
      } else {
        console.log(`     ⚠️  Expected ${expectedTokens}, found ${statusRefs.length}`);
      }
    });
    
    // Final summary
    console.log('\n📋 Summary:');
    console.log(`   • S3 references: ${s1References.size}`);
    console.log(`   • Valid mirroring: ${validReferences.length}`);
    console.log(`   • Missing S1 definitions: ${missingReferences.length}`);
    
    if (missingReferences.length === 0) {
      console.log('\n🎉 Perfect S1↔S3 mirroring achieved!');
      return true;
    } else {
      console.log('\n⚠️  S1↔S3 mirroring needs attention');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  }
}

// Run validation
if (require.main === module) {
  const success = validateS1S3Mirroring();
  process.exit(success ? 0 : 1);
}

module.exports = { validateS1S3Mirroring };
