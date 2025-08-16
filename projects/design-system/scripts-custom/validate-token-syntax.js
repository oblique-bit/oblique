#!/usr/bin/env node
/**
 * Quick Token Syntax Validation
 * 
 * This script performs fast validation of token reference syntax:
 * - Checks for plural forms in token references (colors → color)
 * - Validates inversity suffix requirements for color tokens
 * - Identifies common syntax issues after refactoring
 * 
 * USAGE:
 *     node scripts-custom/validate-token-syntax.js
 * 
 * Run from project root for quick validation after changes.
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * Load all tokens from JSON files
 */
async function loadAllTokens() {
    const tokens = {};
    const themesDir = 'src/lib/themes';
    
    try {
        const jsonFiles = await glob('**/*.json', { cwd: themesDir });
        
        for (const jsonFile of jsonFiles) {
            const fullPath = path.join(themesDir, jsonFile);
            
            if (path.basename(jsonFile).startsWith('$') || jsonFile.includes('_ignore-in-ds')) {
                continue;
            }
            
            try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const data = JSON.parse(content);
                tokens[fullPath] = data;
            } catch (error) {
                if (error instanceof SyntaxError) {
                    console.log(`JSON error in ${jsonFile}: ${error.message}`);
                } else {
                    console.log(`Error loading ${jsonFile}: ${error.message}`);
                }
            }
        }
    } catch (error) {
        console.log(`Error scanning themes directory: ${error.message}`);
    }
    
    return tokens;
}

/**
 * Extract all token references from a JSON object
 */
function extractReferences(obj, currentPath = '') {
    const references = [];
    
    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                const itemPath = `${currentPath}[${i}]`;
                references.push(...extractReferences(obj[i], itemPath));
            }
        } else {
            for (const [key, value] of Object.entries(obj)) {
                const keyPath = currentPath ? `${currentPath}.${key}` : key;
                
                if (key === '$value' && typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
                    // Extract the reference
                    const ref = value.slice(1, -1); // Remove { and }
                    references.push([keyPath, ref]);
                } else if (typeof value === 'object' && value !== null) {
                    references.push(...extractReferences(value, keyPath));
                }
            }
        }
    }
    
    return references;
}

/**
 * Check all token references for validity
 */
async function checkReferences() {
    const tokens = await loadAllTokens();
    const allReferences = [];
    
    // Extract all references
    for (const [filePath, data] of Object.entries(tokens)) {
        const refs = extractReferences(data);
        for (const [tokenPath, ref] of refs) {
            allReferences.push([filePath, tokenPath, ref]);
        }
    }
    
    console.log(`Found ${allReferences.length} token references`);
    
    // Check for common issues
    const issues = [];
    
    for (const [filePath, tokenPath, ref] of allReferences) {
        // Check for plural forms in references
        if (/\b(colors|components|semantics|primitives)\b/.test(ref)) {
            issues.push(`Plural reference in ${filePath} at ${tokenPath}: ${ref}`);
        }
        
        // Check for missing inversity suffixes in color references
        if (ref.includes('ob.s.color') && 
            !ref.endsWith('.inversity-normal') && 
            !ref.endsWith('.inversity-flipped') && 
            !ref.endsWith('.inversity-flipped-alpha')) {
            
            // Check if it's a theme reference or needs inversity suffix
            const skipPatterns = ['theme-configuration', 'static', 'brand'];
            if (!skipPatterns.some(pattern => ref.includes(pattern))) {
                issues.push(`Missing inversity suffix in ${filePath} at ${tokenPath}: ${ref}`);
            }
        }
    }
    
    if (issues.length > 0) {
        console.log(`\nFound ${issues.length} potential issues:`);
        for (const issue of issues) {
            console.log(`  ${issue}`);
        }
    } else {
        console.log('\nNo major issues found!');
    }
    
    return issues.length === 0;
}

/**
 * Main function
 */
async function main() {
    try {
        const success = await checkReferences();
        if (!success) {
            process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { loadAllTokens, extractReferences, checkReferences, main };
