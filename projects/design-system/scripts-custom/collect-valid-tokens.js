#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class TokenCollector {
    constructor() {
        this.validTokens = new Set();
    }

    // Extract tokens from a JSON object recursively
    extractTokensFromObject(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = prefix ? `${prefix}.${key}` : key;
            
            if (typeof value === 'object' && value !== null) {
                // Check if it's a token (has $type or $value)
                if (value.$type || value.$value) {
                    this.validTokens.add(currentPath);
                }
                
                // Recursively check for nested objects
                this.extractTokensFromObject(value, currentPath);
            }
        }
    }

    // Load all tokens from JSON files
    collectAllTokens() {
        console.log('🔍 Collecting all valid tokens from the token system...');
        
        const tokenFiles = glob.sync('src/lib/themes/**/*.json', { 
            ignore: ['**/node_modules/**', '**/.DS_Store'] 
        });

        for (const file of tokenFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const tokens = JSON.parse(content);
                this.extractTokensFromObject(tokens);
            } catch (error) {
                console.warn(`⚠️  Could not parse ${file}: ${error.message}`);
            }
        }

        console.log(`✅ Found ${this.validTokens.size} valid tokens`);
        return Array.from(this.validTokens).sort();
    }

    // Find size/dimension related tokens
    findSizeRelatedTokens() {
        const allTokens = this.collectAllTokens();
        const sizeTokens = allTokens.filter(token => 
            token.includes('size') || 
            token.includes('dimension') || 
            token.includes('height') || 
            token.includes('width') || 
            token.includes('sizing')
        );

        console.log('\n🎯 Size-related tokens found:');
        sizeTokens.forEach(token => console.log(`  - ${token}`));
        
        return sizeTokens;
    }

    // Find component-specific tokens (button, input, badge, etc.)
    findComponentTokens() {
        const allTokens = this.collectAllTokens();
        const componentTypes = ['button', 'input', 'badge', 'tag', 'tooltip', 'infobox', 'icon_holder'];
        
        const componentTokens = {};
        
        componentTypes.forEach(component => {
            componentTokens[component] = allTokens.filter(token => 
                token.includes(component)
            );
        });

        console.log('\n🧩 Component-specific tokens:');
        Object.entries(componentTokens).forEach(([component, tokens]) => {
            if (tokens.length > 0) {
                console.log(`\n  ${component.toUpperCase()}:`);
                tokens.slice(0, 5).forEach(token => console.log(`    - ${token}`));
                if (tokens.length > 5) {
                    console.log(`    ... and ${tokens.length - 5} more`);
                }
            }
        });

        return componentTokens;
    }

    // Generate suggested token examples for documentation
    generateDocumentationExamples() {
        const sizeTokens = this.findSizeRelatedTokens();
        const componentTokens = this.findComponentTokens();

        console.log('\n📝 Suggested documentation examples:');
        console.log('\n### Token examples for documentation:');
        
        // Find some good examples
        const examples = [];
        
        // Look for badge height tokens
        const badgeTokens = sizeTokens.filter(t => t.includes('badge'));
        if (badgeTokens.length > 0) {
            examples.push(badgeTokens[0]);
        }

        // Look for icon_holder tokens  
        const iconTokens = sizeTokens.filter(t => t.includes('icon_holder'));
        if (iconTokens.length > 0) {
            examples.push(iconTokens[0]);
        }

        // Look for semantic dimension tokens
        const semanticTokens = sizeTokens.filter(t => t.includes('s.dimension'));
        if (semanticTokens.length > 0) {
            examples.push(semanticTokens.slice(0, 3));
        }

        examples.flat().forEach(token => {
            console.log(`  "${token}": { "sm": "XXXpx", "md": "XXXpx", "lg": "XXXpx" }`);
        });

        return { sizeTokens, componentTokens };
    }
}

// Run if called directly
if (require.main === module) {
    const collector = new TokenCollector();
    collector.generateDocumentationExamples();
}

module.exports = TokenCollector;
