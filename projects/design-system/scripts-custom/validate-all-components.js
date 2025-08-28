#!/usr/bin/env node

/**
 * Component Token Validation Script
 * 
 * Validates that all component token references point to existing S3 semantic tokens.
 * Ensures component layer integration with semantic layer is complete and correct.
 * 
 * COMMANDS:
 *     node validate-all-components.js  - Validate all component token references
 *     (no command line arguments - runs automatically)
 * 
 * USAGE CONTEXT:
 * After OUI-4001 token refactoring from L1/L2/L3 to S1/S2/S3 structure, many component
 * files contained broken token references causing build failures. The team discovered
 * 19 broken references across 4 components (tag, popover, pill, infobox) that were
 * causing production issues. Manual validation of 50+ component files was time-consuming
 * and error-prone. This script automates the validation process by cross-referencing
 * all component token paths against actual S3 semantic token definitions, preventing
 * broken references from reaching production. Essential for post-refactoring validation
 * workflow and ongoing component-semantic layer integrity. Ticket: OUI-4001.
 * 
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 * CREATED: 2025-08-27
 * LAST_EDITED: 2025-08-28
 * LAST_RUN: Not executed yet
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Console colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bold: '\x1b[1m'
};

console.log(`${colors.cyan}🔍 Component Files Broken Token Reference Detection${colors.reset}\n`);

try {
    // Find all component JSON files
    console.log(`${colors.green}✅ Scanning for component files...${colors.reset}`);
    const componentPattern = 'src/lib/themes/component/**/*.json';
    const componentFiles = require('glob').sync(componentPattern);
    
    console.log(`${colors.green}✅ Found ${componentFiles.length} component files${colors.reset}`);

    // Load S3 semantic tokens
    console.log(`${colors.green}✅ Loading S3 semantic file...${colors.reset}`);
    const s3File = 'src/lib/themes/semantic/color/s3-semantic/semantic.json';
    const s3Content = fs.readFileSync(s3File, 'utf8');
    const s3Data = JSON.parse(s3Content);

    // Extract all S3 token definitions
    const s3Definitions = new Set();
    
    function extractTokens(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = prefix ? `${prefix}.${key}` : key;
            
            if (value && typeof value === 'object' && value.$value !== undefined) {
                s3Definitions.add(currentPath);
            } else if (value && typeof value === 'object') {
                extractTokens(value, currentPath);
            }
        }
    }
    
    extractTokens(s3Data);
    console.log(`${colors.green}✅ Found ${s3Definitions.size} S3 definitions${colors.reset}`);

    const brokenComponents = [];
    const validComponents = [];
    let totalBrokenReferences = 0;

    // Check each component file
    for (const componentFile of componentFiles) {
        try {
            const componentContent = fs.readFileSync(componentFile, 'utf8');
            const s3References = new Set();
            
            // Extract all ob.s3.* references from the component file
            const s3Refs = componentContent.match(/\{ob\.s3\.[^}]+\}/g) || [];
            
            s3Refs.forEach(ref => {
                const cleanRef = ref.slice(1, -1);
                s3References.add(cleanRef);
            });

            if (s3References.size === 0) {
                // No S3 references, skip this component
                continue;
            }

            const invalidReferences = [];
            
            // Check each S3 reference
            s3References.forEach(ref => {
                if (!s3Definitions.has(ref)) {
                    invalidReferences.push(ref);
                }
            });

            const componentName = path.relative('src/lib/themes/component', componentFile);
            
            if (invalidReferences.length > 0) {
                brokenComponents.push({
                    file: componentName,
                    fullPath: componentFile,
                    totalS3Refs: s3References.size,
                    brokenRefs: invalidReferences.length,
                    brokenTokens: invalidReferences
                });
                totalBrokenReferences += invalidReferences.length;
            } else {
                validComponents.push({
                    file: componentName,
                    totalS3Refs: s3References.size
                });
            }
            
        } catch (error) {
            console.error(`   ${colors.red}❌ Error processing ${componentFile}: ${error.message}${colors.reset}`);
        }
    }

    // Report results
    console.log(`\n${colors.cyan}${colors.bold}🔍 Broken Token Reference Report${colors.reset}`);
    console.log(`${colors.cyan}=================================${colors.reset}`);

    if (brokenComponents.length === 0) {
        console.log(`${colors.green}🎉 No broken token references found!${colors.reset}`);
        console.log(`${colors.green}✅ All component S3 token references are valid${colors.reset}`);
    } else {
        console.log(`${colors.red}❌ Found ${brokenComponents.length} components with broken references${colors.reset}`);
        console.log(`${colors.red}💥 Total broken references: ${totalBrokenReferences}${colors.reset}`);
        
        console.log(`\n${colors.red}🚨 COMPONENTS WITH BROKEN REFERENCES:${colors.reset}`);
        brokenComponents.forEach((component, index) => {
            console.log(`\n${colors.red}${index + 1}. ${component.file}${colors.reset}`);
            console.log(`   📊 S3 References: ${component.totalS3Refs} (${component.brokenRefs} broken)`);
            console.log(`   🔥 Broken tokens:`);
            component.brokenTokens.slice(0, 5).forEach(token => {
                console.log(`     ${colors.red}• ${token}${colors.reset}`);
            });
            if (component.brokenTokens.length > 5) {
                console.log(`     ${colors.red}• ... and ${component.brokenTokens.length - 5} more${colors.reset}`);
            }
        });
    }

    if (validComponents.length > 0) {
        console.log(`\n${colors.green}✅ COMPONENTS WITH VALID REFERENCES (${validComponents.length}):${colors.reset}`);
        validComponents.forEach(component => {
            console.log(`   ${colors.green}✅ ${component.file} (${component.totalS3Refs} refs)${colors.reset}`);
        });
    }

    console.log(`\n${colors.cyan}📋 Summary:${colors.reset}`);
    console.log(`   • Total components scanned: ${componentFiles.length}`);
    console.log(`   • Components with S3 references: ${brokenComponents.length + validComponents.length}`);
    console.log(`   • Components with broken references: ${brokenComponents.length}`);
    console.log(`   • Components with valid references: ${validComponents.length}`);
    console.log(`   • Total broken references: ${totalBrokenReferences}`);

    if (brokenComponents.length > 0) {
        console.log(`\n${colors.yellow}🔧 RECOMMENDATION: Fix broken token references in the listed components${colors.reset}`);
        process.exit(1);
    } else {
        console.log(`\n${colors.green}🎉 All component token references are valid!${colors.reset}`);
    }

} catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
}
