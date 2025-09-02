#!/usr/bin/env node
/**
 * Documentation Link Validator
 * Validates all internal links in markdown files
 * 
 * Usage: node validate-links.js [directory]
 * Example: node validate-links.js ../documentation/
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class LinkValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.checkedFiles = new Set();
        this.validFiles = new Set();
    }
    
    findMarkdownFiles(directory) {
        const pattern = path.join(directory, '**/*.md');
        return glob.sync(pattern);
    }
    
    extractLinks(content, filePath) {
        // Match markdown links [text](link)
        const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
        const links = [];
        let match;
        
        while ((match = linkRegex.exec(content)) !== null) {
            const [fullMatch, text, url] = match;
            const lineNumber = content.substring(0, match.index).split('\n').length;
            
            links.push({
                text: text.trim(),
                url: url.trim(),
                line: lineNumber,
                fullMatch
            });
        }
        
        return links;
    }
    
    validateLink(link, sourceFile, baseDir) {
        const { url, text, line } = link;
        
        // Skip external links (http/https)
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return { valid: true, type: 'external' };
        }
        
        // Skip mailto and other protocols
        if (url.includes('://') || url.startsWith('mailto:')) {
            return { valid: true, type: 'protocol' };
        }
        
        // Skip anchors within same file
        if (url.startsWith('#')) {
            return { valid: true, type: 'anchor' };
        }
        
        // Handle relative links
        const sourceDir = path.dirname(sourceFile);
        let targetPath;
        
        if (url.startsWith('./') || url.startsWith('../')) {
            // Relative path
            targetPath = path.resolve(sourceDir, url);
        } else if (url.startsWith('/')) {
            // Absolute path from base
            targetPath = path.resolve(baseDir, url.substring(1));
        } else {
            // Relative to current directory
            targetPath = path.resolve(sourceDir, url);
        }
        
        // Remove anchor fragments
        const cleanPath = targetPath.split('#')[0];
        
        // Check if file exists
        if (fs.existsSync(cleanPath)) {
            this.validFiles.add(cleanPath);
            return { valid: true, type: 'internal', resolvedPath: cleanPath };
        } else {
            return { 
                valid: false, 
                type: 'internal', 
                resolvedPath: cleanPath,
                error: 'File not found' 
            };
        }
    }
    
    validateFile(filePath, baseDir) {
        console.log(`📄 Checking: ${path.relative(baseDir, filePath)}`);
        
        const content = fs.readFileSync(filePath, 'utf8');
        const links = this.extractLinks(content, filePath);
        
        let fileErrors = 0;
        let fileWarnings = 0;
        
        for (const link of links) {
            const result = this.validateLink(link, filePath, baseDir);
            
            if (!result.valid) {
                this.errors.push({
                    file: filePath,
                    line: link.line,
                    text: link.text,
                    url: link.url,
                    error: result.error,
                    resolvedPath: result.resolvedPath
                });
                fileErrors++;
            }
        }
        
        if (fileErrors > 0) {
            console.log(`   ❌ ${fileErrors} broken links`);
        } else if (links.length > 0) {
            console.log(`   ✅ All ${links.length} links valid`);
        } else {
            console.log(`   ℹ️  No links found`);
        }
        
        return { errors: fileErrors, warnings: fileWarnings };
    }
    
    async validateDirectory(directory) {
        const baseDir = path.resolve(directory);
        console.log(`🔍 Validating links in: ${baseDir}`);
        console.log('─'.repeat(60));
        
        const markdownFiles = this.findMarkdownFiles(baseDir);
        console.log(`📚 Found ${markdownFiles.length} markdown files\n`);
        
        for (const file of markdownFiles) {
            this.validateFile(file, baseDir);
            this.checkedFiles.add(file);
        }
        
        this.printReport(baseDir);
    }
    
    printReport(baseDir) {
        console.log('\n' + '═'.repeat(60));
        console.log('📊 LINK VALIDATION REPORT');
        console.log('═'.repeat(60));
        
        console.log(`📄 Files checked: ${this.checkedFiles.size}`);
        console.log(`✅ Valid target files: ${this.validFiles.size}`);
        console.log(`❌ Broken links: ${this.errors.length}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);
        
        if (this.errors.length > 0) {
            console.log('\n🚨 BROKEN LINKS:');
            console.log('─'.repeat(40));
            
            this.errors.forEach((error, index) => {
                const relativeFile = path.relative(baseDir, error.file);
                console.log(`${index + 1}. ${relativeFile}:${error.line}`);
                console.log(`   Text: "${error.text}"`);
                console.log(`   URL: ${error.url}`);
                console.log(`   Error: ${error.error}`);
                console.log(`   Resolved: ${error.resolvedPath}`);
                console.log('');
            });
        }
        
        if (this.errors.length === 0) {
            console.log('\n🎉 All links are valid!');
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
    
    const validator = new LinkValidator();
    validator.validateDirectory(directory)
        .then(() => {
            process.exit(validator.errors.length > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('❌ Validation failed:', error);
            process.exit(1);
        });
}

module.exports = LinkValidator;
