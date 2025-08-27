#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths
const S1_DARK_PATH = 'src/lib/themes/semantic/color/s1-lightness/dark.json';
const S1_LIGHT_PATH = 'src/lib/themes/semantic/color/s1-lightness/light.json';
const S2_HIGH_PATH = 'src/lib/themes/semantic/color/s2-emphasis/high.json';
const S2_LOW_PATH = 'src/lib/themes/semantic/color/s2-emphasis/low.json';
const S3_SEMANTIC_PATH = 'src/lib/themes/semantic/color/s3-semantic/semantic.json';

/**
 * Extract token references from a JSON structure (S1, S2, etc.)
 */
function extractTokenReferences(obj, prefixPattern, currentPath = '') {
  const references = new Set();
  
  if (typeof obj === 'string' && obj.includes(prefixPattern)) {
    const match = obj.match(/\{([^}]+)\}/);
    if (match) {
      references.add(match[1]);
    }
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      const childRefs = extractTokenReferences(value, prefixPattern, newPath);
      childRefs.forEach(ref => references.add(ref));
    });
  }
  
  return references;
}

/**
 * Extract actual token definitions from semantic files (S1, S2)
 */
function extractTokenDefinitions(semanticData, prefix = '') {
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
  
  // Start traversing from the root, but the semantic data already includes "ob.s1.color" or "ob.s2.color" structure
  traverse(semanticData);
  return definitions;
}

/**
 * Extract S3 token definitions (what S3 declares it has)
 */
function extractS3Definitions(s3Data) {
  const definitions = new Set();
  
  function traverse(obj, path = '') {
    if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const fullPath = path ? `${path}.${key}` : key;
        
        if (value && typeof value === 'object' && value.$value !== undefined) {
          // This is a token definition in S3
          definitions.add(fullPath);
        } else if (typeof value === 'object') {
          traverse(value, fullPath);
        }
      });
    }
  }
  
  traverse(s3Data);
  return definitions;
}

/**
 * Extract S3 token definitions (what S3 declares it has)
 */
function extractS3Definitions(s3Data) {
  const definitions = new Set();
  
  function traverse(obj, path = '') {
    if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const fullPath = path ? `${path}.${key}` : key;
        
        if (value && typeof value === 'object' && value.$value !== undefined) {
          // This is a token definition in S3
          definitions.add(fullPath);
        } else if (typeof value === 'object') {
          traverse(value, fullPath);
        }
      });
    }
  }
  
  traverse(s3Data);
  return definitions;
}

/**
 * Check for architectural violations - S3 tokens that don't mirror S1/S2
 */
function findArchitecturalViolations(s3Definitions, s1Definitions, s2Definitions) {
  const violations = [];
  
  s3Definitions.forEach(s3Token => {
    // Skip if it starts with ob. prefix (this is the full token path)
    if (!s3Token.startsWith('ob.s3.')) return;
    
    // Convert S3 token to expected S1/S2 equivalent
    const s1Equivalent = s3Token.replace('ob.s3.', 'ob.s1.');
    const s2Equivalent = s3Token.replace('ob.s3.', 'ob.s2.');
    
    // Check if S3 token should mirror S1 or S2
    const shouldMirrorS1 = s1Definitions.has(s1Equivalent);
    const shouldMirrorS2 = s2Definitions.has(s2Equivalent);
    
    if (!shouldMirrorS1 && !shouldMirrorS2) {
      violations.push({
        s3Token,
        expectedS1: s1Equivalent,
        expectedS2: s2Equivalent,
        type: 'orphan'
      });
    }
  });
  
  return violations;
}

/**
 * Load and extract definitions from a semantic layer
 */
function loadSemanticLayer(layerName, filePaths) {
  const definitions = new Set();
  let totalFiles = 0;
  
  filePaths.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const defs = extractTokenDefinitions(data);
        defs.forEach(def => definitions.add(def));
        totalFiles++;
        console.log(`✅ Loaded ${layerName} ${path.basename(filePath)} - found ${defs.size} definitions`);
      } catch (error) {
        console.warn(`⚠️  Failed to load ${filePath}: ${error.message}`);
      }
    } else {
      console.warn(`⚠️  File not found: ${filePath}`);
    }
  });
  
  console.log(`📊 Total ${layerName} definitions: ${definitions.size} (from ${totalFiles} files)`);
  return definitions;
}

/**
 * Validate mirroring between S3 and a semantic layer (S1 or S2)
 */
function validateLayerMirroring(layerName, s3References, layerDefinitions) {
  const missingReferences = [];
  const validReferences = [];
  
  s3References.forEach(ref => {
    if (layerDefinitions.has(ref)) {
      validReferences.push(ref);
    } else {
      missingReferences.push(ref);
    }
  });
  
  console.log(`\n🔍 ${layerName}↔S3 Mirroring:`);
  console.log(`   ✅ Valid references: ${validReferences.length}/${s3References.size}`);
  
  if (missingReferences.length > 0) {
    console.log(`   ❌ Missing ${layerName} definitions (${missingReferences.length}):`);
    missingReferences.slice(0, 5).forEach(ref => {
      console.log(`      - ${ref}`);
    });
    if (missingReferences.length > 5) {
      console.log(`      ... and ${missingReferences.length - 5} more`);
    }
    return false;
  }
  
  console.log(`   🎉 Perfect ${layerName}↔S3 mirroring!`);
  return true;
}

/**
 * Main validation function - checks both S1↔S3 and S2↔S3 mirroring
 */
function validateSemanticMirroring() {
  console.log('🔍 S1↔S3 & S2↔S3 Mirroring Validation\n');
  
  try {
    // Load S3 semantic file
    const s3Data = JSON.parse(fs.readFileSync(S3_SEMANTIC_PATH, 'utf8'));
    console.log('✅ Loaded S3 semantic file');
    
    // Extract S1 and S2 references from S3 file
    const s1References = extractTokenReferences(s3Data, '{ob.s1.');
    const s2References = extractTokenReferences(s3Data, '{ob.s2.');
    
    console.log(`✅ Found ${s1References.size} S1 references in S3 file`);
    console.log(`✅ Found ${s2References.size} S2 references in S3 file`);
    
    // Load S1 semantic layer (lightness)
    const s1Definitions = loadSemanticLayer('S1', [S1_DARK_PATH, S1_LIGHT_PATH]);
    
    // Load S2 semantic layer (emphasis)  
    const s2Definitions = loadSemanticLayer('S2', [S2_HIGH_PATH, S2_LOW_PATH]);
    
    // Extract S3 definitions (what S3 declares it has)
    const s3Definitions = extractS3Definitions(s3Data);
    console.log(`✅ Found ${s3Definitions.size} S3 token definitions`);
    
    // Check for architectural violations - S3 tokens that don't mirror S1/S2
    const violations = findArchitecturalViolations(s3Definitions, s1Definitions, s2Definitions);
    
    if (violations.length > 0) {
      console.log(`\n❌ ARCHITECTURAL VIOLATIONS (${violations.length}):`);
      violations.forEach(violation => {
        console.log(`   - ${violation.s3Token}`);
        console.log(`     Missing S1: ${violation.expectedS1}`);
        console.log(`     Missing S2: ${violation.expectedS2}`);
      });
    }
    
    // Validate S1↔S3 mirroring
    const s1Valid = validateLayerMirroring('S1', s1References, s1Definitions);
    
    // Validate S2↔S3 mirroring
    const s2Valid = validateLayerMirroring('S2', s2References, s2Definitions);
    
    // Status token analysis (for S1 references only - S2 focuses on interactions)
    if (s1References.size > 0) {
      console.log('\n🎯 Status Token Analysis (S1↔S3):');
      const statusTypes = ['pending', 'confirmed', 'progress', 'scheduled', 'waiting', 'resolved', 'attention', 'critical'];
      
      statusTypes.forEach(status => {
        const statusRefs = Array.from(s1References).filter(ref => ref.includes(`.status.${status}.`));
        if (statusRefs.length > 0) {
          console.log(`   ${status}: ${statusRefs.length} tokens`);
          
          const contrastLevels = ['contrast_highest', 'contrast_high', 'contrast_medium', 'contrast_low'];
          const inversityLevels = ['inversity_normal', 'inversity_flipped'];
          const expectedTokens = contrastLevels.length * inversityLevels.length * 2; // fg + bg
          
          if (statusRefs.length === expectedTokens) {
            console.log(`     ✅ Complete structure (${expectedTokens} tokens)`);
          } else {
            console.log(`     ⚠️  Expected ${expectedTokens}, found ${statusRefs.length}`);
          }
        }
      });
    }
    
    // Interaction token analysis (for S2 references)
    if (s2References.size > 0) {
      console.log('\n🎯 Interaction Token Analysis (S2↔S3):');
      const interactionStates = ['enabled', 'hover', 'focus', 'pressed', 'disabled', 'visited'];
      
      interactionStates.forEach(state => {
        const stateRefs = Array.from(s2References).filter(ref => ref.includes(`.interaction.state.fg.${state}.`));
        if (stateRefs.length > 0) {
          console.log(`   ${state}: ${stateRefs.length} tokens`);
          
          const inversityLevels = ['inversity_normal', 'inversity_flipped'];
          const expectedTokens = inversityLevels.length;
          
          if (stateRefs.length >= expectedTokens) {
            console.log(`     ✅ Complete structure (${stateRefs.length} tokens)`);
          } else {
            console.log(`     ⚠️  Expected at least ${expectedTokens}, found ${stateRefs.length}`);
          }
        }
      });
    }
    
    // Final summary
    console.log('\n📋 Mirroring Summary:');
    console.log(`   • S1↔S3 references: ${s1References.size} (${s1Valid ? '✅ VALID' : '❌ INVALID'})`);
    console.log(`   • S2↔S3 references: ${s2References.size} (${s2Valid ? '✅ VALID' : '❌ INVALID'})`);
    console.log(`   • S3 definitions: ${s3Definitions.size}`);
    console.log(`   • Architectural violations: ${violations.length} (${violations.length === 0 ? '✅ NONE' : '❌ CONTAMINATED'})`);
    console.log(`   • Total S3 semantic references: ${s1References.size + s2References.size}`);
    
    const allValid = s1Valid && s2Valid && violations.length === 0;
    
    if (allValid) {
      console.log('\n🎉 Perfect architectural mirroring achieved!');
      console.log('   🏗️  S3 semantic layer perfectly mirrors S1 & S2 with no violations');
      return true;
    } else {
      console.log('\n❌ Architectural integrity compromised');
      if (!s1Valid) console.log('   • Fix S1↔S3 mirroring issues');
      if (!s2Valid) console.log('   • Fix S2↔S3 mirroring issues');
      if (violations.length > 0) console.log(`   • Remove ${violations.length} orphaned S3 tokens`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  }
}

// Run validation
if (require.main === module) {
  const success = validateSemanticMirroring();
  process.exit(success ? 0 : 1);
}

module.exports = { validateSemanticMirroring };
