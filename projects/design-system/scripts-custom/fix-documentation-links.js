#!/usr/bin/env node
/**
 * Link Fixer for Documentation Reorganization
 * Fixes common broken links after documentation restructuring
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const LINK_FIXES = {
    // Foundation structure updates
    'foundation/principles.md': '02-foundation/01-principles.md',
    'foundation/personas.md': '02-foundation/02-personas.md', 
    'design-tokens/': '03-design-tokens/',
    
    // Design tokens structure updates
    './glossary.md': '../glossary.md',
    './component-identification.md': '../07-workflow/maintainers/02-component-identification.md',
    './underscore-migration-plan.md': './style-dictionary-underscore-setup.md',
    
    // Color file naming fixes
    './colors/colors.md': './colors/colors-overview.md',
    'colors.md': 'colors-overview.md',
    
    // Workflow structure updates
    '../design-tokens/guidelines-token-consumption.md': '../../03-design-tokens/guidelines-token-consumption.md',
    '../design-tokens/responsiveness.md': '../../03-design-tokens/responsiveness.md',
    '../design-tokens/theming.md': '../../03-design-tokens/theming.md',
    './protected-files.md': './04-protected-files.md',
    './figma-token-debugging.md': './02-figma-token-debugging.md'
};

class LinkFixer {
    constructor() {
        this.fixedCount = 0;
        this.filesChanged = 0;
    }
    
    fixLinksInFile(filePath) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        
        // Fix each known broken link
        for (const [oldLink, newLink] of Object.entries(LINK_FIXES)) {
            const regex = new RegExp(`\\]\\(${oldLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
            if (content.includes(`](${oldLink})`)) {
                content = content.replace(regex, `](${newLink})`);
                this.fixedCount++;
                changed = true;
            }
        }
        
        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            this.filesChanged++;
            const relativePath = path.relative(process.cwd(), filePath);
            console.log(`✅ Fixed links in: ${relativePath}`);
        }
        
        return changed;
    }
    
    fixAllLinks(directory) {
        console.log(`🔧 Fixing documentation links in: ${directory}`);
        console.log('─'.repeat(60));
        
        const markdownFiles = glob.sync(path.join(directory, '**/*.md'));
        console.log(`📚 Found ${markdownFiles.length} markdown files\n`);
        
        for (const file of markdownFiles) {
            this.fixLinksInFile(file);
        }
        
        console.log('\n' + '═'.repeat(60));
        console.log('📊 LINK FIXING REPORT');
        console.log('═'.repeat(60));
        console.log(`📄 Files changed: ${this.filesChanged}`);
        console.log(`🔗 Links fixed: ${this.fixedCount}`);
        
        if (this.fixedCount > 0) {
            console.log('\n🎉 Links have been fixed! Run validate-links.js again to check.');
        } else {
            console.log('\n ℹ️ No broken links found to fix.');
        }
        
        console.log('═'.repeat(60));
    }
}

// Command line usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const directory = args[0] || '../documentation/';
    
    if (!fs.existsSync(directory)) {
        console.error(`❌ Directory not found: ${directory}`);
        process.exit(1);
    }
    
    const fixer = new LinkFixer();
    fixer.fixAllLinks(directory);
}

module.exports = LinkFixer;
