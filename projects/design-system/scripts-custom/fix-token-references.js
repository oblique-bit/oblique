#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Token mapping for common outdated patterns to new ones
const TOKEN_MAPPINGS = {
  // Button tokens - old enabled/hover/focus pattern to new inversity pattern
  'ob.h.button.color.fg.primary.enabled': 'ob.h.button.color.fg.primary.inversity_normal.enabled',
  'ob.h.button.color.fg.primary.hover': 'ob.h.button.color.fg.primary.inversity_normal.hover',
  'ob.h.button.color.fg.primary.focus': 'ob.h.button.color.fg.primary.inversity_normal.focus',
  'ob.h.button.color.fg.primary.disabled': 'ob.h.button.color.fg.primary.inversity_normal.disabled',
  
  'ob.h.button.color.bg.primary.enabled': 'ob.h.button.color.bg.primary.inversity_normal.enabled',
  'ob.h.button.color.bg.primary.hover': 'ob.h.button.color.bg.primary.inversity_normal.hover',
  'ob.h.button.color.bg.primary.focus': 'ob.h.button.color.bg.primary.inversity_normal.focus',
  'ob.h.button.color.bg.primary.disabled': 'ob.h.button.color.bg.primary.inversity_normal.disabled',
  
  'ob.h.button.color.border.primary.enabled': 'ob.h.button.color.border.primary.inversity_normal.enabled',
  'ob.h.button.color.border.primary.hover': 'ob.h.button.color.border.primary.inversity_normal.hover',
  'ob.h.button.color.border.primary.focus': 'ob.h.button.color.border.primary.inversity_normal.focus',
  'ob.h.button.color.border.primary.disabled': 'ob.h.button.color.border.primary.inversity_normal.disabled',
  
  // Secondary button tokens
  'ob.h.button.color.fg.secondary.enabled': 'ob.h.button.color.fg.secondary.inversity_normal.enabled',
  'ob.h.button.color.fg.secondary.hover': 'ob.h.button.color.fg.secondary.inversity_normal.hover',
  'ob.h.button.color.fg.secondary.focus': 'ob.h.button.color.fg.secondary.inversity_normal.focus',
  'ob.h.button.color.fg.secondary.disabled': 'ob.h.button.color.fg.secondary.inversity_normal.disabled',
  
  'ob.h.button.color.bg.secondary.enabled': 'ob.h.button.color.bg.secondary.inversity_normal.enabled',
  'ob.h.button.color.bg.secondary.hover': 'ob.h.button.color.bg.secondary.inversity_normal.hover',
  'ob.h.button.color.bg.secondary.focus': 'ob.h.button.color.bg.secondary.inversity_normal.focus',
  'ob.h.button.color.bg.secondary.disabled': 'ob.h.button.color.bg.secondary.inversity_normal.disabled',
  
  'ob.h.button.color.border.secondary.enabled': 'ob.h.button.color.border.secondary.inversity_normal.enabled',
  'ob.h.button.color.border.secondary.hover': 'ob.h.button.color.border.secondary.inversity_normal.hover',
  'ob.h.button.color.border.secondary.focus': 'ob.h.button.color.border.secondary.inversity_normal.focus',
  'ob.h.button.color.border.secondary.disabled': 'ob.h.button.color.border.secondary.inversity_normal.disabled',
  
  // Tertiary button tokens
  'ob.h.button.color.fg.tertiary.enabled': 'ob.h.button.color.fg.tertiary.inversity_normal.enabled',
  'ob.h.button.color.fg.tertiary.hover': 'ob.h.button.color.fg.tertiary.inversity_normal.hover',
  'ob.h.button.color.fg.tertiary.focus': 'ob.h.button.color.fg.tertiary.inversity_normal.focus',
  'ob.h.button.color.fg.tertiary.disabled': 'ob.h.button.color.fg.tertiary.inversity_normal.disabled',
  
  'ob.h.button.color.bg.tertiary.enabled': 'ob.h.button.color.bg.tertiary.inversity_normal.enabled',
  'ob.h.button.color.bg.tertiary.hover': 'ob.h.button.color.bg.tertiary.inversity_normal.hover',
  'ob.h.button.color.bg.tertiary.focus': 'ob.h.button.color.bg.tertiary.inversity_normal.focus',
  'ob.h.button.color.bg.tertiary.disabled': 'ob.h.button.color.bg.tertiary.inversity_normal.disabled',
  
  'ob.h.button.color.border.tertiary.enabled': 'ob.h.button.color.border.tertiary.inversity_normal.enabled',
  'ob.h.button.color.border.tertiary.hover': 'ob.h.button.color.border.tertiary.inversity_normal.hover',
  'ob.h.button.color.border.tertiary.focus': 'ob.h.button.color.border.tertiary.inversity_normal.focus',
  'ob.h.button.color.border.tertiary.disabled': 'ob.h.button.color.border.tertiary.inversity_normal.disabled',
  
  // Close button tokens
  'ob.h.button.color.fg.close.enabled': 'ob.h.button.color.fg.close.inversity_normal.enabled',
  'ob.h.button.color.fg.close.hover': 'ob.h.button.color.fg.close.inversity_normal.hover',
  'ob.h.button.color.fg.close.focus': 'ob.h.button.color.fg.close.inversity_normal.focus',
  'ob.h.button.color.fg.close.disabled': 'ob.h.button.color.fg.close.inversity_normal.disabled',
  
  'ob.h.button.color.bg.close.enabled': 'ob.h.button.color.bg.close.inversity_normal.enabled',
  'ob.h.button.color.bg.close.hover': 'ob.h.button.color.bg.close.inversity_normal.hover',
  'ob.h.button.color.bg.close.focus': 'ob.h.button.color.bg.close.inversity_normal.focus',
  'ob.h.button.color.bg.close.disabled': 'ob.h.button.color.bg.close.inversity_normal.disabled',
  
  'ob.h.button.color.border.close.enabled': 'ob.h.button.color.border.close.inversity_normal.enabled',
  'ob.h.button.color.border.close.hover': 'ob.h.button.color.border.close.inversity_normal.hover',
  'ob.h.button.color.border.close.focus': 'ob.h.button.color.border.close.inversity_normal.focus',
  'ob.h.button.color.border.close.disabled': 'ob.h.button.color.border.close.inversity_normal.disabled',
  
  // Semantic color tokens - old pattern to s3 pattern with inversity
  'ob.s.color.interaction.state.fg': 'ob.s3.color.interaction.state.fg.enabled.inversity_normal',
  'ob.s.color.neutral.bg.contrast': 'ob.s3.color.neutral.bg.contrast_highest.inversity_normal',
  'ob.s.color.interaction.emphasis': 'ob.s3.color.interaction.state.fg.enabled.inversity_normal',
  'ob.s.color.status': 'ob.s3.color.status.info.bg.contrast_highest.inversity_normal',
  
  // Text and background colors
  'ob.s.color.text.default': 'ob.s3.color.neutral.fg.contrast_high.inversity_normal',
  'ob.s.color.bg': 'ob.s3.color.neutral.bg.contrast_lowest.inversity_normal',
  'ob.s.color.neutral.fg.contrast': 'ob.s3.color.neutral.fg.contrast_high.inversity_normal',
  
  // More specific color mappings
  'ob.s.color.neutral.no': 'ob.s3.color.neutral.no_color',
  'ob.s.color.brand': 'ob.s3.color.brand',
  'ob.s1.color.primary.default': 'ob.s1.color.neutral.bg.contrast_highest.inversity_normal',
  
  // Incomplete token references (common patterns)
  'ob.s3.color': 'ob.s3.color.brand',
  'ob.s1.color': 'ob.s1.color.neutral.bg.contrast_highest.inversity_normal',
  'ob.s2.color': 'ob.s2.color.interaction.state.fg.enabled.inversity_normal',
  'ob.p.color': 'ob.p.color.red.50',
  'ob.s.color': 'ob.s3.color.neutral.fg.contrast_high.inversity_normal',
  'ob.g': 'ob.g.theme_configuration.viewport.mobile',
  'ob.p': 'ob.p.assets.logo',
  'ob.s': 'ob.s.z_index.stepper_mobile',
  'ob.c': 'ob.c.tag.container.spacing.gap',
  'ob.h': 'ob.h.list.single_item.spacing.marker_gap',
  
  // Some component tokens that map to existing ones
  'ob.c.button.color.bg': 'ob.h.button.color.bg.primary.inversity_normal.enabled',
  'ob.h.card.dimension.padding': 'ob.h.card.spacing.padding',
  
  // Color specific patterns
  'ob.p.color.blue': 'ob.p.color.red.50',
  'ob.p.dimension.space': 'ob.p.dimension.space.xs',
  'ob.s.dimension.spacing': 'ob.s.spacing.heading.top',
  'ob.s.spacing': 'ob.s.spacing.heading.top',
  'ob.s.typography': 'ob.s.typography.content.heading.default.H1',
  'ob.p.font_weight': 'ob.p.font_weight.0',
  'ob.p.fontfamily': 'ob.p.fontFamily.sans',
  
  // Global and variant tokens
  'ob.g.color.theme': 'ob.g.footer.theme.inversity',
  'ob.g.variant': 'ob.g.theme_configuration.viewport.mobile',
  'ob.g.infobox.fatal.theme.inversity': 'ob.g.component_configuration.footer.theme.emphasis',
  'ob.g.infobox.theme.interaction': 'ob.g.footer.theme.inversity',
  'ob.g.color.theme.interaction': 'ob.g.footer.theme.inversity',
  
  // Button spacing
  'ob.h.button': 'ob.h.button.spacing.with_text.padding.vertical.sm'
};

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

class TokenFixer {
    constructor() {
        this.fixedCount = 0;
        this.filesModified = 0;
        this.skippedTokens = new Set();
    }

    fixMarkdownFiles() {
        console.log(`${colors.blue}Fixing token references in markdown files...${colors.reset}`);
        
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
            let modified = false;
            let fileFixedCount = 0;

            // Apply each mapping
            for (const [oldToken, newToken] of Object.entries(TOKEN_MAPPINGS)) {
                const regex = new RegExp(this.escapeRegex(oldToken), 'gi');
                const matches = content.match(regex);
                
                if (matches) {
                    content = content.replace(regex, newToken);
                    fileFixedCount += matches.length;
                    this.fixedCount += matches.length;
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                this.filesModified++;
                console.log(`${colors.green}✓ Fixed ${fileFixedCount} tokens in ${filePath}${colors.reset}`);
            }

        } catch (error) {
            console.warn(`${colors.yellow}Warning: Could not process ${filePath}: ${error.message}${colors.reset}`);
        }
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    generateReport() {
        console.log(`\n${colors.bold}=== TOKEN FIXING REPORT ===${colors.reset}`);
        console.log(`${colors.green}Files modified: ${this.filesModified}${colors.reset}`);
        console.log(`${colors.green}Tokens fixed: ${this.fixedCount}${colors.reset}`);
        
        if (this.skippedTokens.size > 0) {
            console.log(`\n${colors.yellow}Tokens that still need manual review:${colors.reset}`);
            for (const token of this.skippedTokens) {
                console.log(`  ${colors.yellow}${token}${colors.reset}`);
            }
        }
    }
}

// Main execution
async function main() {
    console.log(`${colors.bold}${colors.blue}Token Reference Fixer${colors.reset}`);
    console.log(`${colors.gray}Applying systematic fixes to token references...${colors.reset}\n`);

    const fixer = new TokenFixer();
    
    try {
        fixer.fixMarkdownFiles();
        fixer.generateReport();
        
        console.log(`\n${colors.cyan}Run the validator again to see remaining issues:${colors.reset}`);
        console.log(`${colors.gray}node scripts-custom/validate-token-references.js${colors.reset}`);
        
    } catch (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = TokenFixer;
