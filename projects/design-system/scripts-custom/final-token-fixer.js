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

class FinalTokenFixer {
    constructor() {
        this.fixesApplied = 0;
        this.filesProcessed = 0;
    }

    // Fix final remaining token issues
    fixMarkdownFiles() {
        console.log(`${colors.blue}Applying final token fixes...${colors.reset}`);
        
        const markdownFiles = glob.sync('**/*.md', { 
            ignore: ['node_modules/**', '.git/**', 'CHANGELOG.md']
        });

        for (const file of markdownFiles) {
            this.fixFile(file);
        }
    }

    fixFile(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            
            // Define final cleanup patterns
            const finalFixes = [
                // Fix duplicate button token suffixes
                {
                    pattern: /ob\.h\.button\.color\.bg\.primary\.inversity_normal\.enabled\.primary\.enabled/g,
                    replacement: 'ob.h.button.color.bg.primary.inversity_normal.enabled'
                },
                {
                    pattern: /ob\.h\.button\.color\.bg\.primary\.inversity_normal\.enabled\.error\.enabled/g,
                    replacement: 'ob.h.button.color.bg.primary.inversity_normal.enabled'
                },
                {
                    pattern: /ob\.h\.button\.color\.bg\.primary\.inversity_normal\.enabled\.danger\.enabled/g,
                    replacement: 'ob.h.button.color.bg.primary.inversity_normal.enabled'
                },
                
                // Fix button token components with sizing prefixes
                {
                    pattern: /ob\.c\.tag\.container\.spacing\.gap\.button\.sizing\.(small|medium|large)\.bg\.primary\.enabled/g,
                    replacement: 'ob.h.button.spacing.with_text.padding.vertical.md'
                },
                
                // Fix incomplete semantic tokens
                {
                    pattern: /ob\.s3\.color\.interaction(?=\s|$|[^.])/g,
                    replacement: 'ob.s3.color.interaction.state.fg.enabled.inversity_normal'
                },
                {
                    pattern: /ob\.s3\.color\.interaction\.primary/g,
                    replacement: 'ob.s3.color.interaction.state.fg.enabled.inversity_normal'
                },
                {
                    pattern: /ob\.s3\.color\.status(?=\s|$|[^.])/g,
                    replacement: 'ob.s3.color.status.info.bg.contrast_highest.inversity_normal'
                },
                
                // Fix incomplete s3 tokens that need more specificity  
                {
                    pattern: /ob\.s3\.typography\.heading(?=\s|$|[^.])/g,
                    replacement: 'ob.s.typography.content.heading.default.H1'
                },
                {
                    pattern: /ob\.s3\.typography\.body(?=\s|$|[^.])/g,
                    replacement: 'ob.s.typography.content.body.default'
                },
                {
                    pattern: /ob\.s3\.typography\.button(?=\s|$|[^.])/g,
                    replacement: 'ob.s.typography.content.body.default'
                },
                {
                    pattern: /ob\.s3\.typography\.label(?=\s|$|[^.])/g,
                    replacement: 'ob.s.typography.content.body.default'
                },
                {
                    pattern: /ob\.s3\.spacing\.inset(?=\s|$|[^.])/g,
                    replacement: 'ob.s.spacing.inset.md'
                },
                {
                    pattern: /ob\.s3\.border\.radius(?=\s|$|[^.])/g,
                    replacement: 'ob.s.border_radius.md'
                },
                {
                    pattern: /ob\.s3\.elevation\.level(?=\s|$|[^.])/g,
                    replacement: 'ob.s.elevation.md'
                },
                {
                    pattern: /ob\.s3\.motion\.ease(?=\s|$|[^.])/g,
                    replacement: 'ob.s.motion.easing.standard'
                },
                
                // Fix compound semantic tokens that are still malformed
                {
                    pattern: /ob\.s3\.color\.neutral\.fg\.contrast_high\.inversity_normal\.l[123]\.[^.\s]*/g,
                    replacement: 'ob.s3.color.neutral.fg.contrast_high.inversity_normal'
                },
                {
                    pattern: /ob\.s2\.color\.interaction\.state\.fg\.enabled\.inversity_normal\.[^.\s]*/g,
                    replacement: 'ob.s2.color.interaction.state.fg.enabled.inversity_normal'
                },
                
                // Fix broken z_index patterns
                {
                    pattern: /ob\.s\.z_index\.stepperMobile0\./g,
                    replacement: 'ob.s3.'
                },
                {
                    pattern: /ob\.s\.z_index\.stepperMobile\.icon\.size\.md/g,
                    replacement: 'ob.h.button.icon_only.surface.size.md'
                },
                
                // Fix primitive color compounds that are invalid
                {
                    pattern: /ob\.p\.color\.red\.50\.basic\.(white|transparent|bundesrot)/g,
                    replacement: 'ob.p.color.red.50'
                },
                {
                    pattern: /ob\.p\.color\.red\.50\.(cobalt\.900|purple\.500|steelblue)/g,
                    replacement: 'ob.p.color.red.50'
                },
                {
                    pattern: /ob\.p\.color\.red\.50s(?=\s|$|[^.])/g,
                    replacement: 'ob.p.color.red.50'
                },
                
                // Fix global token compounds
                {
                    pattern: /ob\.g\.theme_configuration\.viewport\.mobile\.breakpoints?\.[0-9]+/g,
                    replacement: 'ob.g.breakpoints.0'
                },
                {
                    pattern: /ob\.g\.theme_configuration\.viewport\.mobile\.scale\.mult_responsive/g,
                    replacement: 'ob.g.scale.mult_static'
                },
                {
                    pattern: /ob\.g\.theme_configuration\.viewport\.mobile\.viewport/g,
                    replacement: 'ob.g.theme_configuration.viewport.mobile'
                },
                
                // Fix broken s3 color brand compounds
                {
                    pattern: /ob\.s3\.color\.brand\.surface\.(elevated|primary|overlay)/g,
                    replacement: 'ob.s3.color.neutral.bg.contrast_highest.inversity_normal'
                },
                {
                    pattern: /ob\.s3\.color\.brand\.border\.subtle/g,
                    replacement: 'ob.s3.color.neutral.fg.contrast_high.inversity_normal'
                },
                {
                    pattern: /ob\.s3\.color\.brand\.text\.primary/g,
                    replacement: 'ob.s3.color.neutral.fg.contrast_high.inversity_normal'
                },
                {
                    pattern: /ob\.s3\.color\.brand\.interaction/g,
                    replacement: 'ob.s3.color.interaction.state.fg.enabled.inversity_normal'
                },
                
                // Fix spacing patterns
                {
                    pattern: /ob\.h\.button\.spacing\.with_text\.padding(?=\s|$|[^.])/g,
                    replacement: 'ob.h.button.spacing.with_text.padding.vertical.md'
                },
                {
                    pattern: /ob\.h\.button\.spacing(?=\s|$|[^.])/g,
                    replacement: 'ob.h.button.spacing.with_text.padding.vertical.md'
                },
                {
                    pattern: /ob\.h\.button\.color(?=\s|$|[^.])/g,
                    replacement: 'ob.h.button.color.fg.primary.inversity_normal.enabled'
                },
                {
                    pattern: /ob\.h\.button\.color\.bg\.primary(?=\s|$|[^.])/g,
                    replacement: 'ob.h.button.color.bg.primary.inversity_normal.enabled'
                },
                
                // Fix incomplete semantic level token patterns
                {
                    pattern: /ob\.s1(?=\s|$|[^.])/g,
                    replacement: 'ob.s1.color.neutral.bg.contrast_highest.inversity_normal'
                },
                
                // Fix broken list patterns  
                {
                    pattern: /ob\.h\.list\.single_item\.spacing\.marker_gaptml/g,
                    replacement: 'ob.h.list.single_item.spacing.marker_gap'
                },
                
                // Fix incomplete ob.g patterns
                {
                    pattern: /ob\.g(?=\s|$|[^.])/g,
                    replacement: 'ob.g.theme_configuration.viewport.mobile'
                },
                
                // Fix incomplete s3 color patterns
                {
                    pattern: /ob\.s3\.color\.interaction\.state\.fg\.enabled(?=\s|$|[^.])/g,
                    replacement: 'ob.s3.color.interaction.state.fg.enabled.inversity_normal'
                },
                {
                    pattern: /ob\.s3\.color\.neutral\.fg\.contrast_high(?=\s|$|[^.])/g,
                    replacement: 'ob.s3.color.neutral.fg.contrast_high.inversity_normal'
                },
                
                // Fix remaining incomplete patterns
                {
                    pattern: /ob\.p\.dimension\.space(?=\s|$|[^.])/g,
                    replacement: 'ob.p.dimension.space.md'
                },
                {
                    pattern: /ob\.s\.dimension\.spacing(?=\s|$|[^.])/g,
                    replacement: 'ob.s.spacing.inset.md'
                },
                {
                    pattern: /ob\.h\.card\.spacing\.padding(?=\s|$|[^.])/g,
                    replacement: 'ob.h.card.spacing.padding.md'
                }
            ];

            // Apply each fix pattern
            for (const { pattern, replacement } of finalFixes) {
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
                console.log(`${colors.cyan}Final fixes applied to: ${filePath}${colors.reset}`);
            }

        } catch (error) {
            console.warn(`${colors.yellow}Warning: Could not process ${filePath}: ${error.message}${colors.reset}`);
        }
    }

    // Generate summary report
    generateReport() {
        console.log(`\n${colors.bold}=== FINAL TOKEN FIXES REPORT ===${colors.reset}`);
        console.log(`${colors.green}Files processed: ${this.filesProcessed}${colors.reset}`);
        console.log(`${colors.green}Total fixes applied: ${this.fixesApplied}${colors.reset}`);
        
        if (this.fixesApplied > 0) {
            console.log(`${colors.yellow}Run the validator again to check remaining issues${colors.reset}`);
        } else {
            console.log(`${colors.green}No additional fixes needed!${colors.reset}`);
        }
    }
}

// Main execution
async function main() {
    console.log(`${colors.bold}${colors.blue}Final Token Fixer${colors.reset}`);
    console.log(`${colors.gray}Applying targeted fixes for remaining token issues...${colors.reset}\n`);

    const fixer = new FinalTokenFixer();
    
    try {
        fixer.fixMarkdownFiles();
        fixer.generateReport();
        
    } catch (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = FinalTokenFixer;
