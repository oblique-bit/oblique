#!/usr/bin/env node
/**
 * Quick link validation script for documentation
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, '../documentation');

function validateLinks() {
    const markdownFiles = glob.sync('**/*.md', { cwd: DOCS_DIR });
    let brokenLinks = [];
    
    for (const file of markdownFiles) {
        const filePath = path.join(DOCS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const dir = path.dirname(filePath);
        
        // Find markdown links
        const linkRegex = /\]\(([^)]+\.md)\)/g;
        let match;
        
        while ((match = linkRegex.exec(content)) !== null) {
            const linkPath = match[1];
            
            // Skip external links and anchors
            if (linkPath.startsWith('http') || linkPath.includes('#')) continue;
            
            // Resolve relative path
            const resolvedPath = path.resolve(dir, linkPath);
            
            if (!fs.existsSync(resolvedPath)) {
                brokenLinks.push({
                    file: file,
                    link: linkPath,
                    context: match[0]
                });
            }
        }
    }
    
    if (brokenLinks.length === 0) {
        console.log('✅ No broken links found!');
        return true;
    }
    
    console.log(`❌ Found ${brokenLinks.length} broken links:`);
    for (const broken of brokenLinks) {
        console.log(`  ${broken.file}: ${broken.context}`);
    }
    
    return false;
}

validateLinks();
