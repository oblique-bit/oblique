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

class TokenCleaner {
    constructor() {
        this.tokenDatabase = new Map();
        this.fixesApplied = 0;
        this.filesProcessed = 0;
    }

    // Load all valid tokens to reference
    loadTokenDatabase() {
        console.log(`${colors.blue}Loading token database for reference...${colors.reset}`);
        
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

        console.log(`${colors.green}Loaded ${this.tokenDatabase.size} valid tokens${colors.reset}`);
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

    // Clean up malformed tokens in markdown files
    cleanupMarkdownFiles() {
        console.log(`${colors.blue}Cleaning up malformed tokens in markdown files...${colors.reset}`);
        
        const markdownFiles = glob.sync('**/*.md', { 
            ignore: ['node_modules/**', '.git/**', 'CHANGELOG.md']
        });

        for (const file of markdownFiles) {
            this.cleanupFile(file);
        }
    }

    cleanupFile(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            
            // Define cleanup patterns for malformed tokens
            const cleanupPatterns = [
                // Fix concatenated tokens that got joined by previous fixes
                {
                    pattern: /ob\.h\.list\.single_item\.spacing\.marker_gap\.button\./g,
                    replacement: 'ob.h.button.'
                },
                {
                    pattern: /ob\.h\.list\.single_item\.spacing\.marker_gap\.card\./g,
                    replacement: 'ob.h.card.'
                },
                {
                    pattern: /ob\.s\.z_index\.stepperMobile\.spacing/g,
                    replacement: 'ob.s.spacing'
                },
                {
                    pattern: /ob\.s\.z_index\.stepperMobile\.typography/g,
                    replacement: 'ob.s.typography'
                },
                {
                    pattern: /ob\.s\.z_index\.stepperMobile\.dimension/g,
                    replacement: 'ob.s.dimension'
                },
                {
                    pattern: /ob\.s\.z_index\.stepperMobile3\./g,
                    replacement: 'ob.s3.'
                },
                {
                    pattern: /ob\.s\.z_index\.stepperMobile2\./g,
                    replacement: 'ob.s2.'
                },
                {
                    pattern: /ob\.s\.z_index\.stepperMobile1\./g,
                    replacement: 'ob.s1.'
                },
                {
                    pattern: /ob\.s\.z_index\.stepperMobilevg/g,
                    replacement: 'ob.g'
                },
                {
                    pattern: /ob\.p\.assets\.logo\.color\.red\.50([^\w])/g,
                    replacement: 'ob.p.color.red.50$1'
                },
                {
                    pattern: /ob\.p\.assets\.logo\.font_weight/g,
                    replacement: 'ob.p.font_weight'
                },
                {
                    pattern: /ob\.p\.assets\.logo\.dimension\.space/g,
                    replacement: 'ob.p.dimension.space'
                },
                {
                    pattern: /ob\.g\.theme_configuration\.viewport\.mobile\.color\.theme/g,
                    replacement: 'ob.g.color.theme'
                },
                {
                    pattern: /ob\.g\.theme_configuration\.viewport\.mobile\.variant/g,
                    replacement: 'ob.g.variant'
                },
                {
                    pattern: /ob\.g\.theme_configuration\.viewport\.mobile\.infobox\./g,
                    replacement: 'ob.g.infobox.'
                },
                {
                    pattern: /ob\.h\.list\.single_item\.spacing\.marker_gap(?=\s|$|[^.])/g,
                    replacement: 'ob.h.list.single_item.spacing.marker_gap'
                },
                
                // Fix specific malformed semantic tokens
                {
                    pattern: /ob\.s3\.color\.brand\.neutral\./g,
                    replacement: 'ob.s3.color.neutral.'
                },
                {
                    pattern: /ob\.s3\.color\.brand\.interaction\./g,
                    replacement: 'ob.s3.color.interaction.'
                },
                {
                    pattern: /ob\.s3\.color\.brand\.status\./g,
                    replacement: 'ob.s3.color.status.'
                },
                {
                    pattern: /ob\.s3\.color\.brand(?=\s|$|[^.])/g,
                    replacement: 'ob.s3.color.brand'
                },
                
                // Clean up any remaining 's[digit]' patterns that got mangled
                {
                    pattern: /ob\.s\d+(?=\s|$|[^.])/g,
                    replacement: (match) => {
                        const num = match.match(/\d+/)[0];
                        return `ob.s${num}`;
                    }
                }
            ];

            // Apply each cleanup pattern
            for (const { pattern, replacement } of cleanupPatterns) {
                const matches = content.match(pattern);
                if (matches) {
                    content = content.replace(pattern, replacement);
                    this.fixesApplied += matches.length;
                }
            }

            // Only write if changes were made
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                this.filesProcessed++;
                console.log(`${colors.cyan}Cleaned up: ${filePath}${colors.reset}`);
            }

        } catch (error) {
            console.warn(`${colors.yellow}Warning: Could not process ${filePath}: ${error.message}${colors.reset}`);
        }
    }

    // Generate summary report
    generateReport() {
        console.log(`\n${colors.bold}=== TOKEN CLEANUP REPORT ===${colors.reset}`);
        console.log(`${colors.green}Files processed: ${this.filesProcessed}${colors.reset}`);
        console.log(`${colors.green}Total fixes applied: ${this.fixesApplied}${colors.reset}`);
        
        if (this.fixesApplied > 0) {
            console.log(`${colors.yellow}Note: Run the validator again to see remaining issues${colors.reset}`);
        }
    }
}

// Main execution
async function main() {
    console.log(`${colors.bold}${colors.blue}Token Cleanup Tool${colors.reset}`);
    console.log(`${colors.gray}Fixing malformed tokens in markdown files...${colors.reset}\n`);

    const cleaner = new TokenCleaner();
    
    try {
        cleaner.loadTokenDatabase();
        cleaner.cleanupMarkdownFiles();
        cleaner.generateReport();
        
    } catch (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = TokenCleaner;
