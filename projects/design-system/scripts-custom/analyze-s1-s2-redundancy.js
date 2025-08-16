#!/usr/bin/env node

/**
 * S1/S2 Token Redundancy Analysis
 * ===============================
 * 
 * Analyzes redundancy between S1 (lightness) and S2 (inversity) tokens
 * to find the 0.8% exception tokens that are not redundant.
 * 
 * Usage:
 *     node scripts-custom/analyze-s1-s2-redundancy.js
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
 * Analyze the relationship between S1 and S2 tokens.
 */
function analyzeS1S2Relationship() {
    const projectRoot = path.dirname(__dirname);
    
    // Find S1 and S2 files
    const s1File = path.join(projectRoot, 'src/lib/themes/semantic/color/s1-lightness/light.json');
    const s2File = path.join(projectRoot, 'src/lib/themes/semantic/color/s2-inversity/normal.json');
    
    console.log('🔍 S1/S2 Token Redundancy Analysis');
    console.log('==================================');
    
    // Load files
    const s1Data = loadJsonFile(s1File);
    const s2Data = loadJsonFile(s2File);
    
    if (!s1Data || !s2Data) {
        return;
    }
    
    // Extract token references
    const s1Tokens = extractTokenReferences(s1Data);
    const s2Tokens = extractTokenReferences(s2Data);
    
    console.log(`📊 S1 tokens found: ${Object.keys(s1Tokens).length}`);
    console.log(`📊 S2 tokens found: ${Object.keys(s2Tokens).length}`);
    
    // Find matching and non-matching tokens
    const redundantTokens = [];
    const s2UniqueTokens = [];
    const s1UniqueTokens = [];
    
    // Check S2 tokens against S1
    for (const [s2Path, s2Value] of Object.entries(s2Tokens)) {
        const correspondingS1Path = s2Path;
        if (correspondingS1Path in s1Tokens) {
            const s1Value = s1Tokens[correspondingS1Path];
            // Check if S2 token directly references corresponding S1 token
            const expectedS1Ref = `{ob.s1.${s2Path}}`;
            if (s2Value === expectedS1Ref) {
                redundantTokens.push([s2Path, s2Value, s1Value]);
            } else {
                s2UniqueTokens.push([s2Path, s2Value, s1Value]);
            }
        } else {
            s2UniqueTokens.push([s2Path, s2Value, 'NOT_FOUND_IN_S1']);
        }
    }
    
    // Check S1 tokens not in S2
    for (const [s1Path, s1Value] of Object.entries(s1Tokens)) {
        if (!(s1Path in s2Tokens)) {
            s1UniqueTokens.push([s1Path, s1Value]);
        }
    }
    
    // Calculate redundancy percentage
    const totalS2Tokens = Object.keys(s2Tokens).length;
    const redundantCount = redundantTokens.length;
    const uniqueCount = s2UniqueTokens.length;
    const redundancyPercentage = totalS2Tokens > 0 ? (redundantCount / totalS2Tokens) * 100 : 0;
    const uniquePercentage = totalS2Tokens > 0 ? (uniqueCount / totalS2Tokens) * 100 : 0;
    
    console.log('\n📈 REDUNDANCY ANALYSIS');
    console.log(`   🔄 Redundant tokens: ${redundantCount} (${redundancyPercentage.toFixed(1)}%)`);
    console.log(`   ⚡ S2-unique tokens: ${uniqueCount} (${uniquePercentage.toFixed(1)}%)`);
    console.log(`   📋 S1-only tokens: ${s1UniqueTokens.length}`);
    
    // Show unique S2 tokens (the 0.8% exceptions)
    if (s2UniqueTokens.length > 0) {
        console.log(`\n🎯 S2 EXCEPTION TOKENS (Non-redundant ${uniquePercentage.toFixed(1)}%):`);
        console.log('='.repeat(60));
        s2UniqueTokens.forEach(([tokenPath, s2Value, s1Value], i) => {
            // Clean up the path by removing duplicate prefixes
            const cleanPath = tokenPath.replace('ob.s2.', '');
            console.log(`   ${String(i + 1).padStart(2)}. ${cleanPath}`);
            console.log(`       S2: ${s2Value}`);
            if (s1Value !== 'NOT_FOUND_IN_S1') {
                console.log(`       S1: ${s1Value}`);
            } else {
                console.log(`       S1: ❌ Missing in S1`);
            }
            console.log();
        });
        console.log(`📍 Location: ${s2File}`);
        console.log();
    }
    
    // Show ALL redundant tokens (the ones that ARE symmetrical)
    if (redundantTokens.length > 0) {
        console.log(`\n📋 REDUNDANT TOKENS (Symmetrical - ${redundantTokens.length} total):`);
        console.log('='.repeat(60));
        redundantTokens.forEach(([tokenPath, s2Value, s1Value], i) => {
            const cleanPath = tokenPath.replace('ob.s2.', '');
            console.log(`   ${String(i + 1).padStart(2)}. ${cleanPath}`);
            console.log(`       S2: ${s2Value}`);
            console.log(`       S1: ${s1Value}`);
            console.log();
        });
        console.log('💡 These tokens follow the symmetrical pattern - S2 directly references S1');
    }
    
    // Show S1-only tokens
    if (s1UniqueTokens.length > 0) {
        console.log('\n📝 S1-ONLY TOKENS (exist only in S1, showing first 5):');
        console.log('='.repeat(40));
        s1UniqueTokens.slice(0, 5).forEach(([tokenPath, value], i) => {
            const cleanPath = tokenPath.replace('ob.s1.', '');
            console.log(`   ${i + 1}. ${cleanPath}: ${value}`);
        });
        if (s1UniqueTokens.length > 5) {
            console.log(`   ... and ${s1UniqueTokens.length - 5} more`);
        }
        console.log();
    }
    
    return {
        redundantCount,
        uniqueCount,
        totalS2: totalS2Tokens,
        redundancyPercentage,
        uniquePercentage,
        s2UniqueTokens,
        s1UniqueTokens
    };
}

// Run analysis if this script is executed directly
if (require.main === module) {
    const results = analyzeS1S2Relationship();
}

module.exports = { analyzeS1S2Relationship };
