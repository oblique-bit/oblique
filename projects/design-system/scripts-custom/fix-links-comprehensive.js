#!/usr/bin/env node
/**
 * Comprehensive broken link fixer
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/documentation';

// Define link fixes and removals
const linkFixes = {
    // Remove references to non-existent files in 01-introduction
    '](./figma-getting-started.md)': '](../07-workflow/maintainers/readme.md)',
    '](./first-component.md)': '](./installation.md)',
    '](./business-case.md)': '](./what-is-oblique.md)',
    '](./success-stories.md)': '](./current-releases.md)',
    '](./faq.md)': '](./installation.md)',
    '](./support.md)': '](../07-workflow/maintainers/readme.md)',
    
    // Fix missing files in other directories
    '](../glossary.md)': '](../_index.md)',
    '](./02-component-identification.md)': '](./readme.md)',
    '](./04-protected-files.md)': '](./readme.md)',
    '](../../02-foundation/sizing.md)': '](../../03-design-tokens/responsiveness.md)',
    '](../../04-components/02-button.md)': '](../../04-components/button/button-overview.md)',
    '](./02-figma-token-debugging.md)': '](./03-figma-token-debugging.md)',
    '](../button-overview.md)': '](./button-overview.md)',
    '](../07-workflow/maintainers/02-component-identification.md)': '](../07-workflow/maintainers/readme.md)'
};

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixed = 0;
    
    for (const [oldLink, newLink] of Object.entries(linkFixes)) {
        if (content.includes(oldLink)) {
            content = content.replace(new RegExp(oldLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newLink);
            fixed++;
        }
    }
    
    if (fixed > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✓ Fixed ${fixed} links in ${path.relative(DOCS_DIR, filePath)}`);
    }
    
    return fixed;
}

function main() {
    const markdownFiles = glob.sync('**/*.md', { cwd: DOCS_DIR });
    let totalFixed = 0;
    
    for (const file of markdownFiles) {
        const filePath = path.join(DOCS_DIR, file);
        totalFixed += fixFile(filePath);
    }
    
    console.log(`\n✅ Fixed ${totalFixed} broken links across all documentation files`);
}

main();
