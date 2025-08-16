#!/usr/bin/env node

/**
 * Show Exact Missing S1 Tokens Analysis
 * 
 * Analyzes which S1 tokens are referenced by S2 but don't exist in S1 files.
 */

const fs = require('fs');
const path = require('path');

/**
 * Main analysis function.
 */
function main() {
    console.log('🔍 EXACT MISSING S1 TOKEN ANALYSIS');
    console.log('='.repeat(60));
    
    // Show exactly which tokens S2 is trying to reference that don't exist in S1
    const s2File = path.join(process.cwd(), 'src/lib/themes/semantic/color/s2-inversity/normal.json');
    
    let content;
    try {
        content = fs.readFileSync(s2File, 'utf8');
    } catch (error) {
        console.error(`Error reading S2 file: ${error.message}`);
        process.exit(1);
    }
    
    // Find all {ob.s1.color.* references
    const s1RefPattern = /\{ob\.s1\.color\.([^}]+)\}/g;
    const s1Refs = [];
    let match;
    
    while ((match = s1RefPattern.exec(content)) !== null) {
        s1Refs.push(match[1]);
    }
    
    // Check which ones actually exist in S1 files
    const s1Files = [
        'src/lib/themes/semantic/color/s1-lightness/light.json',
        'src/lib/themes/semantic/color/s1-lightness/dark.json'
    ];
    
    const missingTokens = [];
    const uniqueRefs = [...new Set(s1Refs)];
    
    for (const ref of uniqueRefs.sort()) {
        // Check if this token path exists in either S1 file
        let foundInLight = false;
        let foundInDark = false;
        
        for (const s1FilePath of s1Files) {
            const fullPath = path.join(process.cwd(), s1FilePath);
            
            try {
                const s1Content = fs.readFileSync(fullPath, 'utf8');
                
                // Convert token path to JSON structure check
                // e.g., "status.pending.bg.contrast-high.inversity-normal" 
                // should exist as ob.s1.color.status.pending.bg["contrast-high"]["inversity-normal"]
                
                // Simple check: does the exact path exist in the file
                const tokenPattern = ref.replace(/\./g, '\\W+');
                const regex = new RegExp(tokenPattern);
                
                if (regex.test(s1Content)) {
                    if (s1FilePath.includes('light.json')) {
                        foundInLight = true;
                    } else {
                        foundInDark = true;
                    }
                }
            } catch (error) {
                console.error(`Error reading ${s1FilePath}: ${error.message}`);
            }
        }
        
        if (!foundInLight || !foundInDark) {
            const missingInfo = {
                token: ref,
                missingInLight: !foundInLight,
                missingInDark: !foundInDark
            };
            missingTokens.push(missingInfo);
        }
    }
    
    console.log(`📊 Total S1 references in S2: ${uniqueRefs.length}`);
    console.log(`📊 Missing or incomplete tokens: ${missingTokens.length}`);
    
    if (missingTokens.length > 0) {
        console.log('\n❌ MISSING TOKENS:');
        console.log('='.repeat(60));
        
        // Group by category
        const statusTokens = [];
        const interactionTokens = [];
        const otherTokens = [];
        
        for (const tokenInfo of missingTokens) {
            const token = tokenInfo.token;
            if (token.startsWith('status.')) {
                statusTokens.push(tokenInfo);
            } else if (token.startsWith('interaction.')) {
                interactionTokens.push(tokenInfo);
            } else {
                otherTokens.push(tokenInfo);
            }
        }
        
        if (statusTokens.length > 0) {
            console.log(`\n🏷️  STATUS TOKENS (${statusTokens.length}):`);
            statusTokens.forEach((tokenInfo, i) => {
                const token = tokenInfo.token;
                const missingWhere = [];
                if (tokenInfo.missingInLight) {
                    missingWhere.push('light.json');
                }
                if (tokenInfo.missingInDark) {
                    missingWhere.push('dark.json');
                }
                console.log(`   ${String(i + 1).padStart(3)}. ${token}`);
                console.log(`        Missing in: ${missingWhere.join(', ')}`);
            });
        }
        
        if (interactionTokens.length > 0) {
            console.log(`\n🏷️  INTERACTION TOKENS (${interactionTokens.length}):`);
            interactionTokens.forEach((tokenInfo, i) => {
                const token = tokenInfo.token;
                const missingWhere = [];
                if (tokenInfo.missingInLight) {
                    missingWhere.push('light.json');
                }
                if (tokenInfo.missingInDark) {
                    missingWhere.push('dark.json');
                }
                console.log(`   ${String(i + 1).padStart(3)}. ${token}`);
                console.log(`        Missing in: ${missingWhere.join(', ')}`);
            });
        }
        
        if (otherTokens.length > 0) {
            console.log(`\n🏷️  OTHER TOKENS (${otherTokens.length}):`);
            otherTokens.forEach((tokenInfo, i) => {
                const token = tokenInfo.token;
                const missingWhere = [];
                if (tokenInfo.missingInLight) {
                    missingWhere.push('light.json');
                }
                if (tokenInfo.missingInDark) {
                    missingWhere.push('dark.json');
                }
                console.log(`   ${String(i + 1).padStart(3)}. ${token}`);
                console.log(`        Missing in: ${missingWhere.join(', ')}`);
            });
        }
        
        console.log('\n📂 FILES TO UPDATE:');
        console.log('   • src/lib/themes/semantic/color/s1-lightness/light.json');
        console.log('   • src/lib/themes/semantic/color/s1-lightness/dark.json');
        
        console.log('\n📋 SUMMARY:');
        console.log('   • Need to add missing tokens to both files');
        console.log('   • Most likely missing inversity variants of existing tokens');
        console.log('   • Status and interaction tokens that were never created in S1');
        
    } else {
        console.log('\n✅ All S1 references exist in both light.json and dark.json');
    }
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { main };
