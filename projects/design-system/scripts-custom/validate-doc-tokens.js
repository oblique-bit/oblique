#!/usr/bin/env node

/**
 * Documentation Token Validation
 * 
 * Validates that token examples in documentation match actual token files.
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if a specific token path exists in a JSON file.
 */
function checkTokenExists(tokenPath, filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        // Navigate through the token path
        const parts = tokenPath.split('.');
        let current = data;
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return false;
            }
        }
        
        // Check if this is a final token (has $value)
        return current && typeof current === 'object' && '$value' in current;
    } catch (error) {
        return false;
    }
}

/**
 * Find tokens with similar structure to the base path.
 */
function findSimilarTokens(basePath, filePath, maxResults = 5) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        function extractAllPaths(obj, currentPath = '') {
            const paths = [];
            if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                for (const [key, value] of Object.entries(obj)) {
                    const fullPath = currentPath ? `${currentPath}.${key}` : key;
                    if (value && typeof value === 'object') {
                        if ('$value' in value) {
                            paths.push(fullPath);
                        } else {
                            paths.push(...extractAllPaths(value, fullPath));
                        }
                    }
                }
            }
            return paths;
        }
        
        const allPaths = extractAllPaths(data);
        
        // Find paths that contain similar elements
        const baseParts = basePath.split('.');
        const similar = [];
        
        for (const tokenPath of allPaths) {
            const pathParts = tokenPath.split('.');
            
            // Check for common elements
            let commonCount = 0;
            for (const part of baseParts) {
                if (pathParts.includes(part)) {
                    commonCount += 1;
                }
            }
            
            if (commonCount >= 2) {  // At least 2 parts in common
                similar.push(tokenPath);
            }
        }
        
        return similar.slice(0, maxResults);
    } catch (error) {
        return [];
    }
}

/**
 * Extract sample token paths from a file.
 */
function extractSamplePaths(obj, currentPath = '', maxDepth = 4, currentDepth = 0) {
    if (currentDepth >= maxDepth) {
        return [];
    }
    
    const paths = [];
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        for (const [key, value] of Object.entries(obj)) {
            const fullPath = currentPath ? `${currentPath}.${key}` : key;
            if (value && typeof value === 'object') {
                if ('$value' in value) {
                    paths.push(fullPath);
                    if (paths.length >= 3) {  // Limit sample
                        break;
                    }
                } else {
                    paths.push(...extractSamplePaths(value, fullPath, maxDepth, currentDepth + 1));
                    if (paths.length >= 3) {
                        break;
                    }
                }
            }
        }
    }
    return paths;
}

/**
 * Main validation function.
 */
function main() {
    console.log('🔍 DOCUMENTATION TOKEN VALIDATION');
    console.log('='.repeat(60));
    
    // Token examples from the glossary
    const docExamples = [
        ['ob.p.color.blue.500', 'src/lib/themes/primitive/color.json'],
        ['ob.s1.color.neutral.bg.contrast-highest.inversity-normal', 'src/lib/themes/semantic/color/s1-lightness/light.json'],
        ['ob.s2.color.neutral.bg.contrast-highest.inversity-normal', 'src/lib/themes/semantic/color/s2-inversity/normal.json'],
        ['ob.s3.color.interaction.state.fg.enabled.inversity-normal', 'src/lib/themes/semantic/color/s3-emphasis/high.json']
    ];
    
    // File patterns from glossary
    const filePatterns = [
        ['s1-lightness-light', 's1-lightness/light.json'],
        ['s1-lightness-dark', 's1-lightness/dark.json'],
        ['s2-inversity-normal', 's2-inversity/normal.json'],
        ['s2-inversity-flipped', 's2-inversity/flipped.json'],
        ['s3-emphasis-high', 's3-emphasis/high.json'],
        ['s3-emphasis-low', 's3-emphasis/low.json']
    ];
    
    console.log('📋 CHECKING TOKEN EXAMPLES:');
    console.log('-'.repeat(60));
    
    let allValid = true;
    
    for (const [tokenExample, expectedFile] of docExamples) {
        const fileExists = fs.existsSync(expectedFile);
        
        if (fileExists) {
            const tokenExists = checkTokenExists(tokenExample, expectedFile);
            const status = tokenExists ? '✅' : '❌';
            
            console.log(`${status} ${tokenExample}`);
            console.log(`   File: ${expectedFile}`);
            
            if (!tokenExists) {
                allValid = false;
                console.log('   ⚠️  Token not found!');
                
                // Find similar tokens
                const similar = findSimilarTokens(tokenExample, expectedFile);
                if (similar.length > 0) {
                    console.log('   🔍 Similar tokens found:');
                    for (const sim of similar) {
                        console.log(`      • ${sim}`);
                    }
                } else {
                    console.log('   🔍 No similar tokens found');
                }
            }
        } else {
            console.log(`❌ ${tokenExample}`);
            console.log(`   File: ${expectedFile} (FILE NOT FOUND)`);
            allValid = false;
        }
        
        console.log();
    }
    
    console.log('📂 CHECKING FILE PATTERNS:');
    console.log('-'.repeat(60));
    
    const baseSemanticPath = 'src/lib/themes/semantic/color';
    
    for (const [patternName, filePath] of filePatterns) {
        const fullPath = path.join(baseSemanticPath, filePath);
        const fileExists = fs.existsSync(fullPath);
        const status = fileExists ? '✅' : '❌';
        
        console.log(`${status} ${patternName}`);
        console.log(`   Expected: ${fullPath}`);
        
        if (!fileExists) {
            allValid = false;
            // Check what files do exist in that directory
            const dirPath = path.dirname(fullPath);
            if (fs.existsSync(dirPath)) {
                try {
                    const actualFiles = fs.readdirSync(dirPath)
                        .filter(file => file.endsWith('.json'));
                    if (actualFiles.length > 0) {
                        console.log('   📁 Actual files in directory:');
                        for (const file of actualFiles) {
                            console.log(`      • ${file}`);
                        }
                    }
                } catch (error) {
                    console.log(`   ❌ Error reading directory: ${error.message}`);
                }
            }
        }
        console.log();
    }
    
    console.log('='.repeat(60));
    if (allValid) {
        console.log('✅ ALL DOCUMENTATION EXAMPLES ARE VALID');
    } else {
        console.log('❌ SOME DOCUMENTATION EXAMPLES NEED UPDATES');
        console.log();
        console.log('🔧 RECOMMENDATIONS:');
        console.log('   • Update token examples in glossary.md');
        console.log('   • Verify file path references');
        console.log('   • Check if tokens have been renamed or moved');
    }
    
    console.log();
    console.log('📊 ACTUAL TOKEN STRUCTURE SAMPLE:');
    console.log('-'.repeat(60));
    
    // Show some real token examples
    const sampleFiles = [
        ['s0 (primitive)', 'src/lib/themes/primitive/color.json'],
        ['s1 (lightness)', 'src/lib/themes/semantic/color/s1-lightness/light.json'],
        ['s2 (inversity)', 'src/lib/themes/semantic/color/s2-inversity/normal.json'],
        ['s3 (emphasis)', 'src/lib/themes/semantic/color/s3-emphasis/high.json']
    ];
    
    for (const [levelName, filePath] of sampleFiles) {
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(content);
                
                const samplePaths = extractSamplePaths(data).slice(0, 3);
                
                console.log(`🏷️  ${levelName}:`);
                for (const tokenPath of samplePaths) {
                    console.log(`   • ${tokenPath}`);
                }
                console.log();
                
            } catch (error) {
                console.log(`❌ Error reading ${filePath}: ${error.message}`);
            }
        }
    }
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { 
    checkTokenExists, 
    findSimilarTokens, 
    extractSamplePaths 
};
