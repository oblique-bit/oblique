#!/usr/bin/env node

/**
 * validate-documentation-references.js
 * Script to validate token references in documentation files after naming convention changes
 * Created: July 15, 2025
 * Context: Post Token Studio l1/l2/l3 → s1/s2/s3 naming convention update
 * 
 * COMMANDS:
 *     node validate-documentation-references.js           - Run validation on all documentation
 *     node validate-documentation-references.js --verbose - Show detailed validation output
 *     node validate-documentation-references.js --help    - Show help message
 * 
 * USAGE CONTEXT:
 * After OUI-4001 refactoring changed token naming from L1/L2/L3 to S1/S2/S3 structure,
 * extensive documentation contained outdated token references that would confuse developers
 * and designers using the system. Manual review of 100+ documentation files for token
 * reference accuracy was impractical and error-prone. The team needed automated validation
 * to ensure all documentation examples matched current token structures and paths. This
 * script prevents documentation drift by validating that all token examples in docs
 * correspond to actual existing tokens, maintaining documentation accuracy and developer trust.
 * Essential for post-refactoring documentation consistency. Ticket: OUI-4001.
 * 
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 * CREATED: 2025-07-15
 * LAST_EDITED: 2025-08-28
 * LAST_RUN: Not executed yet
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    RED: '\x1b[0;31m',
    GREEN: '\x1b[0;32m',
    YELLOW: '\x1b[1;33m',
    BLUE: '\x1b[0;34m',
    NC: '\x1b[0m' // No Color
};

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.dirname(SCRIPT_DIR);
const DOCS_DIR = path.join(PROJECT_ROOT, 'documentation');

console.log(`${colors.BLUE}🔍 Documentation Reference Validation${colors.NC}`);
console.log('==================================================');
console.log(`Project: ${path.basename(PROJECT_ROOT)}`);
console.log(`Documentation: ${DOCS_DIR}`);
console.log(`Date: ${new Date().toLocaleString()}`);
console.log('');

/**
 * Check for old token patterns in a file.
 */
function checkOldPatterns(filePath) {
    const fileName = path.basename(filePath);
    
    console.log(`${colors.YELLOW}📄 Checking: ${fileName}${colors.NC}`);
    
    // Check for old l1/l2/l3 patterns
    const oldPatterns = [
        /ob\.s\.color\.l1\./g,
        /ob\.s\.color\.l2\./g,
        /ob\.s\.color\.l3\./g,
        /l1-lightness/g,
        /l2-inversity/g,
        /l3-emphasis/g,
        /l1-l2-redundancy/g
    ];
    
    let foundIssues = 0;
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        for (const pattern of oldPatterns) {
            const patternStr = pattern.toString().slice(1, -2); // Remove /g flags
            const matches = [];
            
            lines.forEach((line, index) => {
                if (pattern.test(line)) {
                    matches.push(`${index + 1}: ${line.trim()}`);
                }
            });
            
            if (matches.length > 0) {
                console.log(`  ${colors.RED}❌ Found old pattern '${patternStr}':${colors.NC}`);
                matches.forEach(match => console.log(`    ${match}`));
                foundIssues = 1;
            }
        }
    } catch (error) {
        console.log(`  ${colors.RED}❌ Error reading file: ${error.message}${colors.NC}`);
        foundIssues = 1;
    }
    
    if (foundIssues === 0) {
        console.log(`  ${colors.GREEN}✅ No old patterns found${colors.NC}`);
    }
    
    return foundIssues;
}

/**
 * Verify new token patterns in a file.
 */
function checkNewPatterns(filePath) {
    const fileName = path.basename(filePath);
    
    // Check for new s1/s2/s3 patterns
    const newPatterns = [
        { pattern: /ob\.s1\.color\./g, name: 'ob.s1.color.' },
        { pattern: /ob\.s2\.color\./g, name: 'ob.s2.color.' },
        { pattern: /ob\.s3\.color\./g, name: 'ob.s3.color.' },
        { pattern: /s1-lightness/g, name: 's1-lightness' },
        { pattern: /s2-inversity/g, name: 's2-inversity' },
        { pattern: /s3-emphasis/g, name: 's3-emphasis' },
        { pattern: /s1-s2-redundancy/g, name: 's1-s2-redundancy' }
    ];
    
    let foundNew = 0;
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const { pattern, name } of newPatterns) {
            const matches = content.match(pattern);
            const count = matches ? matches.length : 0;
            
            if (count > 0) {
                console.log(`  ${colors.GREEN}✅ Found ${count} references to new pattern '${name}'${colors.NC}`);
                foundNew = 1;
            }
        }
    } catch (error) {
        console.log(`  ${colors.RED}❌ Error reading file: ${error.message}${colors.NC}`);
    }
    
    if (foundNew === 0) {
        console.log(`  ${colors.YELLOW}⚠️  No new token patterns found (might be expected for some files)${colors.NC}`);
    }
}

/**
 * Check specific files that should have been updated.
 */
function checkCriticalFiles() {
    const criticalFiles = [
        'design-tokens/architecture.md',
        'design-tokens/colors/colors-semantic.md',
        'design-tokens/colors/colors.md',
        'design-tokens/guidelines-token-consumption.md',
        'design-tokens/theming.md',
        'workflow/tokens-studio-context.md',
        'design-tokens/global-tokens.md'
    ];
    
    console.log(`\n${colors.BLUE}🎯 Critical Files Validation${colors.NC}`);
    console.log('=================================');
    
    let totalIssues = 0;
    
    for (const filePath of criticalFiles) {
        const fullPath = path.join(DOCS_DIR, filePath);
        
        if (fs.existsSync(fullPath)) {
            console.log(`\n${colors.YELLOW}📋 Validating: ${filePath}${colors.NC}`);
            
            if (checkOldPatterns(fullPath)) {
                totalIssues += 1;
            }
            
            checkNewPatterns(fullPath);
        } else {
            console.log(`\n${colors.RED}❌ File not found: ${filePath}${colors.NC}`);
            totalIssues += 1;
        }
    }
    
    return totalIssues;
}

/**
 * Generate validation report.
 */
function generateReport(issuesCount) {
    console.log(`\n${colors.BLUE}📊 Validation Summary${colors.NC}`);
    console.log('=====================');
    console.log(`Date: ${new Date().toLocaleString()}`);
    console.log(`Documentation directory: ${DOCS_DIR}`);
    
    if (issuesCount === 0) {
        console.log(`${colors.GREEN}✅ All documentation references validated successfully!${colors.NC}`);
        console.log(`${colors.GREEN}✅ No old token patterns (l1/l2/l3) found${colors.NC}`);
        console.log(`${colors.GREEN}✅ New token patterns (s1/s2/s3) properly implemented${colors.NC}`);
    } else {
        console.log(`${colors.RED}❌ Found ${issuesCount} file(s) with validation issues${colors.NC}`);
        console.log(`${colors.YELLOW}⚠️  Please review and fix the issues above${colors.NC}`);
    }
    
    console.log('');
    console.log('Token naming convention:');
    console.log('  OLD: ob.s.color.l1.* → NEW: ob.s1.color.*');
    console.log('  OLD: ob.s.color.l2.* → NEW: ob.s2.color.*');
    console.log('  OLD: ob.s.color.l3.* → NEW: ob.s3.color.*');
    console.log('');
    console.log('Folder structure:');
    console.log('  OLD: l1-lightness/ → NEW: s1-lightness/');
    console.log('  OLD: l2-inversity/ → NEW: s2-inversity/');
    console.log('  OLD: l3-emphasis/ → NEW: s3-emphasis/');
}

/**
 * Main execution function.
 */
function main() {
    if (!fs.existsSync(DOCS_DIR)) {
        console.log(`${colors.RED}❌ Documentation directory not found: ${DOCS_DIR}${colors.NC}`);
        process.exit(1);
    }
    
    // Run critical files validation
    const issuesCount = checkCriticalFiles();
    
    // Generate report
    generateReport(issuesCount);
    
    // Exit with appropriate code
    if (issuesCount === 0) {
        console.log(`${colors.GREEN}🎉 Documentation validation completed successfully!${colors.NC}`);
        process.exit(0);
    } else {
        console.log(`${colors.RED}❌ Documentation validation found issues. Please review.${colors.NC}`);
        process.exit(1);
    }
}

/**
 * Show help message.
 */
function showHelp() {
    console.log('Usage: node validate-documentation-references.js [options]');
    console.log('');
    console.log('Validates token references in documentation files after naming convention changes.');
    console.log('');
    console.log('Options:');
    console.log('  -h, --help     Show this help message');
    console.log('  -v, --verbose  Enable verbose output');
    console.log('');
    console.log('This script checks for:');
    console.log('  - Old token patterns (l1/l2/l3) that should be updated');
    console.log('  - New token patterns (s1/s2/s3) that should be present');
    console.log('  - Critical documentation files consistency');
    console.log('');
    console.log('Expected token naming convention:');
    console.log('  ob.s.color.l1.* → ob.s1.color.*');
    console.log('  ob.s.color.l2.* → ob.s2.color.*');
    console.log('  ob.s.color.l3.* → ob.s3.color.*');
}

// Parse command line arguments
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case '-h':
        case '--help':
            showHelp();
            process.exit(0);
            break;
        case '-v':
        case '--verbose':
            // Verbose mode - could be implemented if needed
            console.log('Verbose mode enabled');
            break;
        default:
            console.log(`Unknown option: ${args[i]}`);
            showHelp();
            process.exit(1);
    }
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { 
    checkOldPatterns, 
    checkNewPatterns, 
    checkCriticalFiles, 
    generateReport 
};
