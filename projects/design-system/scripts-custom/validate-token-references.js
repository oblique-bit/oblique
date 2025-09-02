#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Colors for terminal output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

class TokenValidator {
    constructor() {
        this.tokenDatabase = new Map();
        this.invalidReferences = [];
        this.validReferences = [];
        this.totalReferences = 0;
    }

    // Load all token files and build database
    loadTokenDatabase() {
        console.log(`${colors.blue}Loading token database...${colors.reset}`);
        
        const tokenDirs = [
            'src/lib/themes/html',
            'src/lib/themes/css',
            'src/lib/themes'
        ];

        for (const dir of tokenDirs) {
            if (fs.existsSync(dir)) {
                this.loadTokensFromDirectory(dir);
            }
        }

        console.log(`${colors.green}Loaded ${this.tokenDatabase.size} tokens${colors.reset}`);
    }

    loadTokensFromDirectory(dirPath) {
        const files = glob.sync(`${dirPath}/**/*.json`, { ignore: '**/node_modules/**' });
        
        for (const file of files) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const data = JSON.parse(content);
                this.extractTokensFromObject(data, '');
            } catch (error) {
                console.warn(`${colors.yellow}Warning: Could not parse ${file}: ${error.message}${colors.reset}`);
            }
        }
    }

    extractTokensFromObject(obj, prefix) {
        if (typeof obj !== 'object' || obj === null) return;

        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof value === 'object' && value !== null) {
                if (value.hasOwnProperty('$value')) {
                    // This is a token definition
                    this.tokenDatabase.set(fullKey, value);
                } else {
                    // Continue traversing
                    this.extractTokensFromObject(value, fullKey);
                }
            }
        }
    }

    // Validate token references in markdown files
    validateMarkdownFiles() {
        console.log(`${colors.blue}Validating markdown files...${colors.reset}`);
        
        const markdownFiles = glob.sync('**/*.md', { 
            ignore: ['node_modules/**', '.git/**', 'CHANGELOG.md']
        });

        for (const file of markdownFiles) {
            this.validateFile(file);
        }
    }

    validateFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const tokenPattern = /ob\.[a-z0-9_]+(?:\.[a-z0-9_]+)*/gi;
            const matches = content.match(tokenPattern) || [];

            for (const match of matches) {
                this.totalReferences++;
                const normalizedToken = match.toLowerCase();
                
                if (this.tokenDatabase.has(normalizedToken)) {
                    this.validReferences.push({
                        file: filePath,
                        token: match,
                        line: this.getLineNumber(content, match)
                    });
                } else {
                    // Check for similar tokens
                    const suggestions = this.findSimilarTokens(normalizedToken);
                    
                    this.invalidReferences.push({
                        file: filePath,
                        token: match,
                        line: this.getLineNumber(content, match),
                        suggestions
                    });
                }
            }
        } catch (error) {
            console.warn(`${colors.yellow}Warning: Could not read ${filePath}: ${error.message}${colors.reset}`);
        }
    }

    getLineNumber(content, searchTerm) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(searchTerm)) {
                return i + 1;
            }
        }
        return 0;
    }

    findSimilarTokens(token) {
        const suggestions = [];
        const tokenParts = token.split('.');
        
        // Look for tokens with similar structure
        for (const [existingToken] of this.tokenDatabase) {
            const existingParts = existingToken.split('.');
            
            // Calculate similarity
            let similarity = 0;
            const minLength = Math.min(tokenParts.length, existingParts.length);
            
            for (let i = 0; i < minLength; i++) {
                if (tokenParts[i] === existingParts[i]) {
                    similarity += 1;
                }
            }
            
            if (similarity >= Math.min(3, minLength)) {
                suggestions.push(existingToken);
            }
        }
        
        return suggestions.slice(0, 3); // Return top 3 suggestions
    }

    // Generate report
    generateReport() {
        console.log(`\n${colors.bold}=== TOKEN REFERENCE VALIDATION REPORT ===${colors.reset}`);
        console.log(`${colors.green}Valid references: ${this.validReferences.length}${colors.reset}`);
        console.log(`${colors.red}Invalid references: ${this.invalidReferences.length}${colors.reset}`);
        console.log(`${colors.cyan}Total references: ${this.totalReferences}${colors.reset}`);

        if (this.invalidReferences.length > 0) {
            console.log(`\n${colors.bold}${colors.red}INVALID REFERENCES:${colors.reset}`);
            
            // Group by file for better readability
            const byFile = this.groupByFile(this.invalidReferences);
            
            for (const [file, references] of Object.entries(byFile)) {
                console.log(`\n${colors.yellow}${file}:${colors.reset}`);
                
                for (const ref of references) {
                    console.log(`  ${colors.red}Line ${ref.line}: ${ref.token}${colors.reset}`);
                    
                    if (ref.suggestions.length > 0) {
                        console.log(`    ${colors.cyan}Suggestions: ${ref.suggestions.join(', ')}${colors.reset}`);
                    }
                }
            }
        }

        // Show some example valid tokens
        if (this.tokenDatabase.size > 0) {
            console.log(`\n${colors.bold}${colors.green}EXAMPLE VALID TOKENS:${colors.reset}`);
            const examples = Array.from(this.tokenDatabase.keys()).slice(0, 10);
            examples.forEach(token => {
                console.log(`  ${colors.green}${token}${colors.reset}`);
            });
        }
    }

    groupByFile(references) {
        const grouped = {};
        for (const ref of references) {
            if (!grouped[ref.file]) {
                grouped[ref.file] = [];
            }
            grouped[ref.file].push(ref);
        }
        return grouped;
    }

    // Generate fixes for common patterns
    generateFixes() {
        console.log(`\n${colors.bold}=== SUGGESTED FIXES ===${colors.reset}`);
        
        // Analyze common patterns in invalid references
        const patterns = {};
        
        for (const ref of this.invalidReferences) {
            const token = ref.token.toLowerCase();
            const parts = token.split('.');
            
            // Look for common prefixes that might be outdated
            if (parts.length >= 3) {
                const prefix = parts.slice(0, 3).join('.');
                if (!patterns[prefix]) {
                    patterns[prefix] = [];
                }
                patterns[prefix].push(ref);
            }
        }

        for (const [pattern, refs] of Object.entries(patterns)) {
            if (refs.length > 1) {
                console.log(`\n${colors.yellow}Pattern: ${pattern}* (${refs.length} occurrences)${colors.reset}`);
                
                // Find the most likely replacement
                const suggestions = refs[0].suggestions;
                if (suggestions.length > 0) {
                    console.log(`  ${colors.cyan}Likely replacement: ${suggestions[0]}${colors.reset}`);
                }
            }
        }
    }
}

// Main execution
async function main() {
    console.log(`${colors.bold}${colors.blue}Token Reference Validator${colors.reset}`);
    console.log(`${colors.gray}Validating token references in markdown files...${colors.reset}\n`);

    const validator = new TokenValidator();
    
    try {
        validator.loadTokenDatabase();
        validator.validateMarkdownFiles();
        validator.generateReport();
        validator.generateFixes();
        
        // Exit with error code if there are invalid references
        process.exit(validator.invalidReferences.length > 0 ? 1 : 0);
        
    } catch (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = TokenValidator;
