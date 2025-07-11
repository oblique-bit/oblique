#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Helper function to read JSON files
function readJsonFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

// Function to flatten JSON structure and extract tokens
function flattenTokens(obj, prefix = '') {
    let tokens = [];
    
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object') {
            if (value.$value) {
                tokens.push({
                    name: currentPath,
                    value: value.$value,
                    type: value.$type,
                    description: value.$description || ''
                });
            } else {
                tokens.push(...flattenTokens(value, currentPath));
            }
        }
    }
    
    return tokens;
}

// Main analysis function
function analyzeEmphasisStructure() {
    const basePath = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantics/colors';
    
    // Read emphasis layer files
    const emphasisMedium = readJsonFile(path.join(basePath, 'emphasis/medium.json'));
    const emphasisLow = readJsonFile(path.join(basePath, 'emphasis/low.json'));
    
    // Read inversity layer files
    const inversityNormal = readJsonFile(path.join(basePath, 'inversity/normal.json'));
    const inversityFlipped = readJsonFile(path.join(basePath, 'inversity/flipped.json'));
    
    // Read button component
    const buttonComponent = readJsonFile('/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/html/button/color-static.json');
    
    console.log('=== EMPHASIS LAYER ANALYSIS ===\n');
    
    // Analyze emphasis layer
    if (emphasisMedium) {
        console.log('EMPHASIS MEDIUM TOKENS:');
        const emphasisMediumTokens = flattenTokens(emphasisMedium);
        emphasisMediumTokens.forEach(token => {
            console.log(`  ${token.name} -> ${token.value}`);
        });
        console.log(`Total: ${emphasisMediumTokens.length} tokens\n`);
    }
    
    if (emphasisLow) {
        console.log('EMPHASIS LOW TOKENS:');
        const emphasisLowTokens = flattenTokens(emphasisLow);
        emphasisLowTokens.forEach(token => {
            console.log(`  ${token.name} -> ${token.value}`);
        });
        console.log(`Total: ${emphasisLowTokens.length} tokens\n`);
    }
    
    // Analyze inversity layer tokens that reference emphasis
    if (inversityNormal) {
        console.log('INVERSITY NORMAL TOKENS (interaction.emphasis-medium):');
        const inversityTokens = flattenTokens(inversityNormal);
        const emphasisTokens = inversityTokens.filter(token => 
            token.name.includes('interaction.emphasis-medium')
        );
        emphasisTokens.forEach(token => {
            console.log(`  ${token.name} -> ${token.value}`);
        });
        console.log(`Total emphasis-medium tokens: ${emphasisTokens.length}\n`);
    }
    
    // Analyze button component references
    if (buttonComponent) {
        console.log('BUTTON COMPONENT REFERENCES:');
        const buttonTokens = flattenTokens(buttonComponent);
        buttonTokens.forEach(token => {
            if (token.value.includes('interaction.state') || token.value.includes('interaction.emphasis-medium')) {
                console.log(`  ${token.name} -> ${token.value}`);
            }
        });
    }
    
    console.log('\n=== REFACTORING RECOMMENDATIONS ===\n');
    
    // Provide recommendations
    console.log('1. The emphasis layer should contain tokens like:');
    console.log('   - ob.s.color.interaction.state.fg.enabled');
    console.log('   - ob.s.color.interaction.state.bg.enabled');
    console.log('   - etc.');
    
    console.log('\n2. The inversity layer should contain tokens like:');
    console.log('   - ob.s.color.interaction.emphasis-medium.fg-base.contrast-low');
    console.log('   - ob.s.color.interaction.emphasis-medium.bg-base.contrast-low');
    console.log('   - etc.');
    
    console.log('\n3. The button component should reference emphasis layer tokens:');
    console.log('   - ob.s.color.interaction.state.fg.enabled');
    console.log('   - ob.s.color.interaction.state.bg.enabled');
    console.log('   - etc.');
}

// Run the analysis
analyzeEmphasisStructure();
