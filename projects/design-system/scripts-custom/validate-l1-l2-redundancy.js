#!/usr/bin/env node

/**
 * L1/L2 Token Redundancy Validator
 * ===============================
 * 
 * Validates the assumption that L2 tokens are just direct references to L1 tokens
 * without any transformation, creating redundancy that could be simplified.
 * 
 * Usage:
 *     node scripts-custom/validate-l1-l2-redundancy.js
 */

const fs = require('fs');
const path = require('path');

/**
 * Load and parse a JSON file.
 */
function loadJsonFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.log(`❌ Error loading ${filePath}: ${error.message}`);
        return null;
    }
}

/**
 * Extract all token references from nested JSON structure.
 */
function extractTokenReferences(data, currentPath = '') {
    const references = {};
    
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        if ('$value' in data) {
            // This is a token with a value
            references[currentPath] = data.$value;
        } else {
            // Recurse into nested structure
            for (const [key, value] of Object.entries(data)) {
                if (!key.startsWith('$')) {  // Skip metadata keys
                    const newPath = currentPath ? `${currentPath}.${key}` : key;
                    const nestedRefs = extractTokenReferences(value, newPath);
                    Object.assign(references, nestedRefs);
                }
            }
        }
    }
    
    return references;
}

/**
 * Analyze the relationship between L1 and L2 tokens.
 */
function analyzeL1L2Relationship() {
    const projectRoot = path.dirname(__dirname);
    
    // Find L1 and L2 files
    const l1File = path.join(projectRoot, 'src/lib/themes/semantic/color/l1-lightness/light.json');
    const l2File = path.join(projectRoot, 'src/lib/themes/semantic/color/l2-inversity/normal.json');
    
    if (!fs.existsSync(l1File)) {
        console.log(`❌ L1 file not found: ${l1File}`);
        return false;
    }
    
    if (!fs.existsSync(l2File)) {
        console.log(`❌ L2 file not found: ${l2File}`);
        return false;
    }
    
    console.log('📄 Analyzing L1/L2 token relationship...');
    console.log(`📁 L1 file: ${path.basename(l1File)}`);
    console.log(`📁 L2 file: ${path.basename(l2File)}`);
    console.log('-'.repeat(60));
    
    // Load both files
    const l1Data = loadJsonFile(l1File);
    const l2Data = loadJsonFile(l2File);
    
    if (!l1Data || !l2Data) {
        return false;
    }
    
    // Extract token references
    const l1TokensData = l1Data?.ob?.s?.color?.l1 || {};
    const l2TokensData = l2Data?.ob?.s?.color?.l2 || {};
    
    const l1Tokens = extractTokenReferences(l1TokensData, 'l1');
    const l2Tokens = extractTokenReferences(l2TokensData, 'l2');
    
    console.log(`🔍 Found ${Object.keys(l1Tokens).length} L1 tokens`);
    console.log(`🔍 Found ${Object.keys(l2Tokens).length} L2 tokens`);
    console.log();
    
    // Analyze L2 token references
    let redundantCount = 0;
    let nonRedundantCount = 0;
    const directReferences = [];
    const transformedReferences = [];
    
    for (const [l2Path, l2Value] of Object.entries(l2Tokens)) {
        if (typeof l2Value === 'string' && l2Value.startsWith('{ob.s.color.l1')) {
            // This L2 token references an L1 token
            redundantCount += 1;
            
            // Extract the referenced L1 path
            const l1Ref = l2Value.slice(1, -1); // Remove curly braces
            const l1PathParts = l1Ref.split('.');
            if (l1PathParts.length >= 4) {
                // Convert to our internal path format
                const l1InternalPath = l1PathParts.slice(3).join('.'); // Remove 'ob.s.color.l1'
                const l2InternalPath = l2Path.split('.').slice(1).join('.'); // Remove 'l2'
                
                if (l1InternalPath === l2InternalPath) {
                    directReferences.push([l2Path, l2Value]);
                } else {
                    transformedReferences.push([l2Path, l2Value, l1InternalPath, l2InternalPath]);
                }
            }
        } else {
            nonRedundantCount += 1;
        }
    }
    
    // Report findings
    const totalL2Tokens = Object.keys(l2Tokens).length;
    const redundancyPercentage = totalL2Tokens > 0 ? (redundantCount / totalL2Tokens) * 100 : 0;
    
    console.log('📊 ANALYSIS RESULTS:');
    console.log(`   Total L2 tokens: ${totalL2Tokens}`);
    console.log(`   Redundant (reference L1): ${redundantCount} (${redundancyPercentage.toFixed(1)}%)`);
    console.log(`   Non-redundant: ${nonRedundantCount}`);
    console.log();
    
    console.log('🔗 REFERENCE TYPES:');
    console.log(`   Direct references (same path): ${directReferences.length}`);
    console.log(`   Transformed references: ${transformedReferences.length}`);
    console.log();
    
    // Show examples
    if (directReferences.length > 0) {
        console.log('✅ DIRECT REFERENCE EXAMPLES (L2 = L1):');
        directReferences.slice(0, 5).forEach(([l2Path, l2Value], i) => {
            console.log(`   ${i + 1}. ${l2Path} → ${l2Value}`);
        });
        if (directReferences.length > 5) {
            console.log(`   ... and ${directReferences.length - 5} more`);
        }
        console.log();
    }
    
    if (transformedReferences.length > 0) {
        console.log('🔄 TRANSFORMED REFERENCE EXAMPLES:');
        transformedReferences.slice(0, 3).forEach(([l2Path, l2Value, l1Internal, l2Internal], i) => {
            console.log(`   ${i + 1}. ${l2Path}`);
            console.log(`      L2 path: ${l2Internal}`);
            console.log(`      L1 path: ${l1Internal}`);
            console.log(`      Reference: ${l2Value}`);
        });
        if (transformedReferences.length > 3) {
            console.log(`   ... and ${transformedReferences.length - 3} more`);
        }
        console.log();
    }
    
    // Conclusion
    console.log('🎯 CONCLUSION:');
    if (redundancyPercentage > 90) {
        console.log('   ✅ ASSUMPTION CONFIRMED: L2 is almost entirely redundant with L1');
        console.log('   💡 RECOMMENDATION: Create build script to generate L2 from L1');
        console.log('   📉 IMPACT: Could reduce CSS variable count significantly');
    } else if (redundancyPercentage > 70) {
        console.log('   ⚠️  ASSUMPTION PARTIALLY CONFIRMED: High redundancy detected');
        console.log('   💡 RECOMMENDATION: Consider partial optimization');
    } else {
        console.log('   ❌ ASSUMPTION NOT CONFIRMED: L2 has significant unique content');
        console.log('   💡 RECOMMENDATION: Keep current structure');
    }
    
    console.log();
    console.log('🛠️  POTENTIAL BUILD SCRIPT BENEFITS:');
    console.log(`   - Reduce CSS variables by ~${redundantCount} tokens`);
    console.log(`   - Simplify maintenance (single source of truth)`);
    console.log(`   - Automatic consistency between L1/L2`);
    console.log(`   - Smaller bundle size`);
    
    return redundancyPercentage > 90;
}

/**
 * Main function.
 */
function main() {
    console.log('🔍 L1/L2 Token Redundancy Analysis');
    console.log('='.repeat(50));
    
    const isRedundant = analyzeL1L2Relationship();
    
    if (isRedundant) {
        console.log('\n💡 NEXT STEPS:');
        console.log('   1. Create build script to generate L2 from L1');
        console.log('   2. Update build process to include token transformation');
        console.log('   3. Test CSS output matches current behavior');
        console.log('   4. Update documentation about simplified workflow');
    }
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { 
    loadJsonFile, 
    extractTokenReferences, 
    analyzeL1L2Relationship 
};
