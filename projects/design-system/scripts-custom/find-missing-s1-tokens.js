#!/usr/bin/env node

/**
 * Find Missing S1 Tokens
 * ======================
 * 
 * Analyzes S2 (inversity) tokens to find missing S1 (lightness) token references
 * and reports which tokens need to be added to light.json and dark.json files.
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract all S1 token references from S2 file.
 */
function extractS1References(s2File) {
    try {
        const content = fs.readFileSync(s2File, 'utf8');
        
        // Find all {ob.s1.color.* references
        const s1RefPattern = /\{ob\.s1\.color\.([^}]+)\}/g;
        const s1Refs = new Set();
        let match;
        
        while ((match = s1RefPattern.exec(content)) !== null) {
            s1Refs.add(match[1]);
        }
        
        return s1Refs;
    } catch (error) {
        console.error(`Error reading ${s2File}: ${error.message}`);
        return new Set();
    }
}

/**
 * Extract all token paths from S1 file.
 */
function getExistingS1Tokens(s1File) {
    try {
        const content = fs.readFileSync(s1File, 'utf8');
        const data = JSON.parse(content);
        
        function extractPaths(obj, currentPath = '') {
            const paths = [];
            if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                for (const [key, value] of Object.entries(obj)) {
                    const fullPath = currentPath ? `${currentPath}.${key}` : key;
                    if (value && typeof value === 'object') {
                        if ('$value' in value) {
                            // This is a token definition
                            paths.push(fullPath);
                        } else {
                            // Continue traversing
                            paths.push(...extractPaths(value, fullPath));
                        }
                    }
                }
            }
            return paths;
        }
        
        // Extract from ob.s1.color
        if (data.ob && data.ob.s1 && data.ob.s1.color) {
            return new Set(extractPaths(data.ob.s1.color));
        }
        return new Set();
    } catch (error) {
        console.error(`Error parsing ${s1File}: ${error.message}`);
        return new Set();
    }
}

/**
 * Categorize tokens by type.
 */
function categorizeTokens(tokens) {
    const categories = {
        status: [],
        interaction: [],
        other: []
    };
    
    for (const token of Array.from(tokens).sort()) {
        if (token.startsWith('status.')) {
            categories.status.push(token);
        } else if (token.startsWith('interaction.')) {
            categories.interaction.push(token);
        } else {
            categories.other.push(token);
        }
    }
    
    return categories;
}

/**
 * Main analysis function.
 */
function main() {
    const basePath = path.join(process.cwd(), 'src/lib/themes/semantic/color');
    
    // Files to check
    const s2File = path.join(basePath, 's2-inversity/normal.json');
    const s1LightFile = path.join(basePath, 's1-lightness/light.json');
    const s1DarkFile = path.join(basePath, 's1-lightness/dark.json');
    
    console.log('🔍 MISSING S1 TOKEN ANALYSIS');
    console.log('='.repeat(50));
    
    // Get S1 references from S2
    const s1Refs = extractS1References(s2File);
    console.log(`📝 S1 references found in S2: ${s1Refs.size}`);
    
    // Debug: show first few references
    const sortedRefs = Array.from(s1Refs).sort();
    console.log(`📝 First 5 S1 references: ${sortedRefs.slice(0, 5)}`);
    
    // Get existing S1 tokens
    const lightTokens = getExistingS1Tokens(s1LightFile);
    const darkTokens = getExistingS1Tokens(s1DarkFile);
    
    console.log(`📝 Existing tokens in light.json: ${lightTokens.size}`);
    console.log(`📝 Existing tokens in dark.json: ${darkTokens.size}`);
    
    // Debug: show first few existing tokens
    const sortedLightTokens = Array.from(lightTokens).sort();
    console.log(`📝 First 5 existing light tokens: ${sortedLightTokens.slice(0, 5)}`);
    
    // Find missing tokens
    const missingInLight = new Set([...s1Refs].filter(token => !lightTokens.has(token)));
    const missingInDark = new Set([...s1Refs].filter(token => !darkTokens.has(token)));
    
    console.log(`\n❌ Missing in light.json: ${missingInLight.size}`);
    console.log(`❌ Missing in dark.json: ${missingInDark.size}`);
    
    // Debug: show some missing tokens if any
    if (missingInLight.size > 0) {
        const sortedMissingLight = Array.from(missingInLight).sort();
        console.log(`📝 First 5 missing in light: ${sortedMissingLight.slice(0, 5)}`);
    }
    if (missingInDark.size > 0) {
        const sortedMissingDark = Array.from(missingInDark).sort();
        console.log(`📝 First 5 missing in dark: ${sortedMissingDark.slice(0, 5)}`);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📍 MISSING IN LIGHT.JSON:');
    console.log('='.repeat(50));
    
    const lightCategories = categorizeTokens(missingInLight);
    
    for (const [category, tokens] of Object.entries(lightCategories)) {
        if (tokens.length > 0) {
            console.log(`\n🏷️  ${category.toUpperCase()} TOKENS (${tokens.length}):`);
            tokens.forEach((token, i) => {
                console.log(`   ${String(i + 1).padStart(3)}. ${token}`);
            });
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📍 MISSING IN DARK.JSON:');
    console.log('='.repeat(50));
    
    const darkCategories = categorizeTokens(missingInDark);
    
    for (const [category, tokens] of Object.entries(darkCategories)) {
        if (tokens.length > 0) {
            console.log(`\n🏷️  ${category.toUpperCase()} TOKENS (${tokens.length}):`);
            tokens.forEach((token, i) => {
                console.log(`   ${String(i + 1).padStart(3)}. ${token}`);
            });
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 SUMMARY:');
    console.log('='.repeat(50));
    console.log(`• S2 references ${s1Refs.size} S1 tokens`);
    console.log(`• light.json has ${lightTokens.size} tokens, missing ${missingInLight.size}`);
    console.log(`• dark.json has ${darkTokens.size} tokens, missing ${missingInDark.size}`);
    
    // Check if both files are missing the same tokens
    const missingInLightArray = Array.from(missingInLight).sort();
    const missingInDarkArray = Array.from(missingInDark).sort();
    const sameMissing = JSON.stringify(missingInLightArray) === JSON.stringify(missingInDarkArray);
    console.log(`• Both files missing same tokens: ${sameMissing}`);
    
    if (sameMissing) {
        console.log('\n✅ Both light.json and dark.json need the same missing tokens added');
    } else {
        const onlyLight = new Set([...missingInLight].filter(token => !missingInDark.has(token)));
        const onlyDark = new Set([...missingInDark].filter(token => !missingInLight.has(token)));
        console.log(`\n⚠️  Only missing in light.json: ${onlyLight.size}`);
        console.log(`⚠️  Only missing in dark.json: ${onlyDark.size}`);
    }
    
    console.log('\n📂 FILES TO UPDATE:');
    console.log(`   • ${s1LightFile}`);
    console.log(`   • ${s1DarkFile}`);
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { 
    extractS1References, 
    getExistingS1Tokens, 
    categorizeTokens 
};
