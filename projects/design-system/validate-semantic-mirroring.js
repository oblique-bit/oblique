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
 * Comprehensive validation - checks that ALL S1 and S2 tokens are mirrored in S3
 * AND that S3 has no orphaned tokens
 */
function validateCompleteArchitecturalMirroring(s1Definitions, s2Definitions, s3Definitions) {
  console.log('\n🔍 Complete Architectural Mirroring Validation');
  console.log('='.repeat(50));
  
  const issues = [];
  
  // Check 1: Every S1 token should have S3 mirror
  s1Definitions.forEach(s1Token => {
    const s3Mirror = s1Token.replace('ob.s1.', 'ob.s3.');
    if (!s3Definitions.has(s3Mirror)) {
      issues.push({
        type: 'missing_s3_for_s1',
        s1Token,
        expectedS3: s3Mirror
      });
    }
  });
  
  // Check 2: Every S2 token should have S3 mirror
  s2Definitions.forEach(s2Token => {
    const s3Mirror = s2Token.replace('ob.s2.', 'ob.s3.');
    if (!s3Definitions.has(s3Mirror)) {
      issues.push({
        type: 'missing_s3_for_s2',
        s2Token,
        expectedS3: s3Mirror
      });
    }
  });
  
  // Check 3: Every S3 token should mirror either S1 or S2 (except S0 exceptions)
  const s0Exceptions = new Set([
    'ob.s3.color.brand',
    'ob.s3.color.neutral.no_color'
  ]);
  
  s3Definitions.forEach(s3Token => {
    if (s0Exceptions.has(s3Token)) return;
    
    const s1Mirror = s3Token.replace('ob.s3.', 'ob.s1.');
    const s2Mirror = s3Token.replace('ob.s3.', 'ob.s2.');
    
    const hasS1Mirror = s1Definitions.has(s1Mirror);
    const hasS2Mirror = s2Definitions.has(s2Mirror);
    
    if (!hasS1Mirror && !hasS2Mirror) {
      issues.push({
        type: 'orphaned_s3',
        s3Token,
        expectedS1: s1Mirror,
        expectedS2: s2Mirror
      });
    }
  });
  
  // Report results
  if (issues.length === 0) {
    console.log('✅ Perfect complete architectural mirroring!');
    return true;
  } else {
    console.log(`❌ Found ${issues.length} architectural issues:`);
    
    const missingS3ForS1 = issues.filter(i => i.type === 'missing_s3_for_s1');
    const missingS3ForS2 = issues.filter(i => i.type === 'missing_s3_for_s2');
    const orphanedS3 = issues.filter(i => i.type === 'orphaned_s3');
    
    if (missingS3ForS1.length > 0) {
      console.log(`\n❌ Missing S3 mirrors for S1 tokens (${missingS3ForS1.length}):`);
      missingS3ForS1.forEach(issue => {
        console.log(`   - ${issue.s1Token} → missing ${issue.expectedS3}`);
      });
    }
    
    if (missingS3ForS2.length > 0) {
      console.log(`\n❌ Missing S3 mirrors for S2 tokens (${missingS3ForS2.length}):`);
      missingS3ForS2.forEach(issue => {
        console.log(`   - ${issue.s2Token} → missing ${issue.expectedS3}`);
      });
    }
    
    if (orphanedS3.length > 0) {
      console.log(`\n❌ Orphaned S3 tokens (${orphanedS3.length}):`);
      orphanedS3.forEach(issue => {
        console.log(`   - ${issue.s3Token} (no S1/S2 equivalent)`);
      });
    }
    
    return false;
  }
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
    const isArchitecturallySound = validateCompleteArchitecturalMirroring(s1Definitions, s2Definitions, s3Definitions);
    
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
      const interactionStates = ['enabled', 'hover', 'focus', 'pressed', 'disabled', 'visited', 'selected'];
      
      interactionStates.forEach(state => {
        const stateRefs = Array.from(s2References).filter(ref => 
          ref.includes(`.interaction.state.fg.${state}.`) || 
          ref.includes(`.interaction.state.bg.${state}.`)
        );
        if (stateRefs.length > 0) {
          console.log(`   ${state}: ${stateRefs.length} tokens`);
          
          const inversityLevels = ['inversity_normal', 'inversity_flipped'];
          const expectedTokens = inversityLevels.length * 2; // fg + bg
          
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
    console.log(`   • Architectural violations: ${isArchitecturallySound ? '0 (✅ NONE)' : 'DETECTED (❌ CONTAMINATED)'}`);
    console.log(`   • Total S3 semantic references: ${s1References.size + s2References.size}`);
    
    const allValid = s1Valid && s2Valid && isArchitecturallySound;
    
    if (allValid) {
      console.log('\n🎉 Perfect architectural mirroring achieved!');
      console.log('   🏗️  S3 semantic layer perfectly mirrors S1 & S2 with no violations');
      return true;
    } else {
      console.log('\n❌ Architectural integrity compromised');
      if (!s1Valid) console.log('   • Fix S1↔S3 mirroring issues');
      if (!s2Valid) console.log('   • Fix S2↔S3 mirroring issues');
      if (!isArchitecturallySound) console.log('   • Fix architectural violations detected above');
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
