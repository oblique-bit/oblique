#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple debug script to see what tokens exist
const themesDir = path.join(__dirname, '../../src/lib/themes');

console.log('🔍 Debug: Available tokens in emphasis layer...\n');

// Load emphasis files from current structure
const emphasisHighPath = path.join(themesDir, 'semantic/color/l3-emphasis/high.json');
const emphasisLowPath = path.join(themesDir, 'semantic/color/l3-emphasis/low.json');
const staticPath = path.join(themesDir, 'semantic/color/static.json');

function loadAndPrintTokens(filePath, name) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filePath}`);
        return;
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        console.log(`📋 ${name}:`);
        console.log(`   File: ${filePath}`);
        
        // Find all tokens
        function findTokens(obj, currentPath = '') {
            const tokens = [];
            
            for (const [key, value] of Object.entries(obj)) {
                const fullPath = currentPath ? `${currentPath}.${key}` : key;
                
                if (typeof value === 'object' && value !== null) {
                    if (value.$value !== undefined) {
                        tokens.push({
                            path: `ob.${fullPath}`,
                            value: value.$value,
                            description: value.$description || ''
                        });
                    } else {
                        tokens.push(...findTokens(value, fullPath));
                    }
                }
            }
            
            return tokens;
        }
        
        const tokens = findTokens(data);
        console.log(`   Found ${tokens.length} tokens:`);
        
        tokens.slice(0, 10).forEach(token => {
            console.log(`     - ${token.path}`);
            console.log(`       Value: ${token.value}`);
            if (token.description) {
                console.log(`       Description: ${token.description}`);
            }
        });
        
        if (tokens.length > 10) {
            console.log(`     ... and ${tokens.length - 10} more`);
        }
        
        console.log('');
        return tokens;
        
    } catch (error) {
        console.log(`❌ Error loading ${filePath}: ${error.message}`);
    }
}

// Test specific tokens
const testTokens = [
    'ob.s.color.interaction.state.fg.enabled',
    'ob.s.color.neutral.no-color',
    'ob.s.color.interaction.emphasis-high.bg-base.contrast-medium'
];

console.log('🧪 Testing specific token lookup...\n');

testTokens.forEach(tokenPath => {
    const filesToCheck = [
        { path: emphasisHighPath, name: 'emphasis-high' },
        { path: emphasisLowPath, name: 'emphasis-low' },
        { path: staticPath, name: 'static' }
    ];
    
    console.log(`Looking for: ${tokenPath}`);
    
    filesToCheck.forEach(file => {
        if (fs.existsSync(file.path)) {
            try {
                const content = fs.readFileSync(file.path, 'utf8');
                const data = JSON.parse(content);
                
                const pathParts = tokenPath.replace('ob.', '').split('.');
                let current = data;
                
                for (const part of pathParts) {
                    if (current && typeof current === 'object' && current[part] !== undefined) {
                        current = current[part];
                    } else {
                        current = null;
                        break;
                    }
                }
                
                if (current && typeof current === 'object' && current.$value !== undefined) {
                    console.log(`  ✅ Found in ${file.name}: ${current.$value}`);
                } else {
                    console.log(`  ❌ Not found in ${file.name}`);
                }
            } catch (error) {
                console.log(`  ❌ Error reading ${file.name}: ${error.message}`);
            }
        } else {
            console.log(`  ❌ File not found: ${file.name}`);
        }
    });
    
    console.log('');
});

// Load and show all available tokens
loadAndPrintTokens(emphasisHighPath, 'Emphasis High');
loadAndPrintTokens(emphasisLowPath, 'Emphasis Low');
loadAndPrintTokens(staticPath, 'Static');
