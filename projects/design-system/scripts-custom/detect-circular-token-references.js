#!/usr/bin/env node

/**
 * Circular Token Reference Detection Script
 * 
 * Analyzes all design token JSON files to detect circular references where
 * tokens reference each other in a loop (e.g., A → B → C → A).
 * 
 * Circular references can cause infinite loops in token resolution and
 * compilation failures in style dictionary. This script helps identify
 * and debug such issues in the design token system.
 */

const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '../../src/lib/themes');

// Helper function to recursively find all JSON files
function findJsonFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
            files.push(...findJsonFiles(itemPath));
        } else if (item.endsWith('.json') && !item.startsWith('$')) {
            files.push(itemPath);
        }
    }
    
    return files;
}

// Helper function to extract token references from a value
function extractReferences(value) {
    if (typeof value !== 'string') return [];
    const matches = value.match(/\{[^}]+\}/g);
    return matches || [];
}

// Helper function to get all tokens from a JSON file
function getTokensFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    const tokens = [];
    
    function traverse(obj, currentPath = '') {
        for (const [key, value] of Object.entries(obj)) {
            const fullPath = currentPath ? `${currentPath}.${key}` : key;
            
            if (typeof value === 'object' && value !== null) {
                if (value.$value) {
                    tokens.push({
                        path: fullPath,
                        value: value.$value,
                        references: extractReferences(value.$value)
                    });
                } else {
                    traverse(value, fullPath);
                }
            }
        }
    }
    
    traverse(data);
    return tokens;
}

// Main function to find circular references
function findCircularReferences() {
    const jsonFiles = findJsonFiles(themesDir);
    const circularReferences = [];
    
    for (const filePath of jsonFiles) {
        const relativePath = path.relative(themesDir, filePath);
        const tokens = getTokensFromFile(filePath);
        
        for (const token of tokens) {
            for (const reference of token.references) {
                // Remove the curly braces
                const cleanRef = reference.slice(1, -1);
                
                // Check if this is a self-reference within the same layer
                if (cleanRef.includes(token.path)) {
                    circularReferences.push({
                        file: relativePath,
                        tokenPath: token.path,
                        tokenValue: token.value,
                        circularReference: reference
                    });
                }
            }
        }
    }
    
    return circularReferences;
}

// Run the analysis
const circularRefs = findCircularReferences();

console.log('=== CIRCULAR REFERENCES FOUND ===\n');

if (circularRefs.length === 0) {
    console.log('No circular references found!');
} else {
    // Group by file for better readability
    const groupedRefs = circularRefs.reduce((acc, ref) => {
        if (!acc[ref.file]) acc[ref.file] = [];
        acc[ref.file].push(ref);
        return acc;
    }, {});
    
    for (const [file, refs] of Object.entries(groupedRefs)) {
        console.log(`\n📁 ${file}:`);
        for (const ref of refs) {
            console.log(`  🔄 ${ref.tokenPath}`);
            console.log(`     Value: ${ref.tokenValue}`);
            console.log(`     Circular ref: ${ref.circularReference}`);
        }
    }
    
    console.log(`\n📊 Total circular references found: ${circularRefs.length}`);
}
