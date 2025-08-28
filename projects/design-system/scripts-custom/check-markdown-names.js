#!/usr/bin/env node

/**
 * Pre-commit Markdown File Validation
 * 
 * Pre-commit hook that prevents uppercase .md files from being committed,
 * ensuring consistent lowercase naming conventions across documentation.
 * 
 * COMMANDS:
 *     node check-markdown-names.js  - Check for uppercase .md files and block commit if found
 *     (no command line arguments - designed for git pre-commit hook usage)
 * 
 * USAGE CONTEXT:
 * After establishing lowercase naming conventions for documentation files,
 * team members occasionally still created uppercase .md files out of habit,
 * leading to naming inconsistencies in the repository. Manual enforcement
 * was inconsistent and relied on code review catching these issues. This
 * pre-commit hook automatically blocks commits containing uppercase .md files,
 * providing immediate feedback and automatic prevention of naming violations.
 * Essential for maintaining documentation naming standard compliance and
 * preventing uppercase files from entering the repository. Used as git
 * pre-commit hook to enforce naming conventions at commit time.
 * 
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 * CREATED: 2025-08-28
 * LAST_EDITED: 2025-08-28
 * LAST_RUN: 2025-08-28
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Find all .md files in the repository
 * @param {string} dir - Directory to search
 * @param {Array} files - Array to accumulate results
 * @returns {Array} Array of .md file paths
 */
function findMarkdownFiles(dir = '.', files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip node_modules and other common ignore patterns
        if (entry.name === 'node_modules' || entry.name.startsWith('.git')) {
            continue;
        }
        
        if (entry.isDirectory()) {
            findMarkdownFiles(fullPath, files);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

/**
 * Check if a filename contains uppercase letters
 * @param {string} filePath - Path to check
 * @returns {boolean} True if contains uppercase letters
 */
function hasUppercaseLetters(filePath) {
    const filename = path.basename(filePath);
    return /[A-Z]/.test(filename);
}

/**
 * Main validation function
 */
function main() {
    console.log('🔍 Checking for uppercase .md files before commit...');
    
    try {
        // Find all markdown files
        const markdownFiles = findMarkdownFiles();
        
        // Filter for files with uppercase letters
        const uppercaseFiles = markdownFiles.filter(hasUppercaseLetters);
        
        if (uppercaseFiles.length > 0) {
            console.log('🚫 COMMIT BLOCKED: Found uppercase .md files:');
            uppercaseFiles.forEach(file => {
                console.log(`   ${file}`);
            });
            console.log();
            console.log('Run this to fix automatically:');
            console.log('node scripts-custom/validate-documentation-structure.js');
            console.log();
            console.log('Then try commit again.');
            process.exit(1);
        } else {
            console.log('✅ All .md files use lowercase names');
            process.exit(0);
        }
        
    } catch (error) {
        console.error('❌ Error during pre-commit validation:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { findMarkdownFiles, hasUppercaseLetters, main };
