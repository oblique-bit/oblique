#!/usr/bin/env node

/**
 * @file validate-dimension-refactoring.js
 * @description Validates the comprehensive refactoring of the dimension token system.
 * @created 2025-09-14
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const THEME_DIR = path.join(__dirname, '../src/lib/themes');
const SEMANTIC_DIMENSION_PATH = path.join(THEME_DIR, 'semantic/dimension.json');

// Helper to print colored output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m"
};

const log = (message, color = colors.reset) => console.log(color + message + colors.reset);

let issuesFound = false;

/**
 * Checks if the semantic dimension file has the correct new structure.
 */
function validateSemanticStructure() {
    log('\n[1/3] 🔍 Validating semantic structure in dimension.json...', colors.cyan);
    try {
        const fileContent = fs.readFileSync(SEMANTIC_DIMENSION_PATH, 'utf8');
        const dimensionTokens = JSON.parse(fileContent);
        const staticGroups = dimensionTokens.ob.s.dimension.static;
        const dynamicGroups = dimensionTokens.ob.s.dimension.dynamic;

        const expectedGroups = ['detail', 'element', 'surface', 'container', 'layout'];
        let allGroupsPresent = true;

        expectedGroups.forEach(group => {
            if (!staticGroups[group] || !dynamicGroups[group]) {
                log(`  ❌ ERROR: Group "${group}" is missing from static or dynamic tokens.`, colors.red);
                allGroupsPresent = false;
                issuesFound = true;
            } else {
                log(`  ✅ Group "${group}" found in static and dynamic tokens.`);
            }
        });

        if (allGroupsPresent) {
            log('  👍 Semantic structure is correct.', colors.green);
        }
    } catch (error) {
        log(`  ❌ ERROR: Could not read or parse ${SEMANTIC_DIMENSION_PATH}`, colors.red);
        log(`     ${error.message}`);
        issuesFound = true;
    }
}

/**
 * Searches for any remaining legacy/broken primitive references.
 */
function checkForBrokenReferences() {
    log('\n[2/3] 🔍 Searching for broken or legacy primitive references...', colors.cyan);
    const brokenPatterns = [
        'ob.p.dimension.px.100', 'ob.p.dimension.px.125', 'ob.p.dimension.px.150',
        'ob.p.dimension.px.200', 'ob.p.dimension.px.250', 'ob.p.dimension.px.300',
        'ob.p.dimension.px.350', 'ob.p.dimension.px.400', 'ob.p.dimension.px.450',
        'ob.p.dimension.px.600', 'ob.p.dimension.px.800', 'ob.p.dimension.px.1000',
        'ob.p.dimension.px.1200', 'ob.p.dimension.px.2000', 'ob.p.dimension.px.3600'
    ];
    const grepPattern = brokenPatterns.join('\\|');
    const command = `grep -r -E "${grepPattern}" "${path.join(THEME_DIR)}"`;

    try {
        execSync(command);
        // If grep finds something, it exits with 0, which is a failure for us
        log('  ❌ ERROR: Found lingering broken primitive references in the theme files.', colors.red);
        issuesFound = true;
    } catch (error) {
        // Grep exits with 1 if no matches are found, which is what we want
        if (error.status === 1) {
            log('  ✅ No broken primitive references found.', colors.green);
        } else {
            log(`  ❌ ERROR: An error occurred during grep search: ${error.message}`, colors.red);
            issuesFound = true;
        }
    }
}

/**
 * Validates that the consumer files have been updated correctly.
 */
function validateConsumerFiles() {
    log('\n[3/3] 🔍 Validating consumer files (ob.h, ob.c)...', colors.cyan);
    const filesToValidate = {
        'html/button_aug/05 size.json': [
            'ob.s.dimension.dynamic.element.sm.rem',
            'ob.s.dimension.dynamic.element.md.rem',
            'ob.s.dimension.dynamic.container.xs.rem'
        ],
        'component/atom/icon_holder/size.json': [
            'ob.s.dimension.dynamic.surface.md.rem',
            'ob.s.dimension.dynamic.surface.xs.rem'
        ]
    };

    let allConsumersValid = true;
    for (const [filePath, expectedTokens] of Object.entries(filesToValidate)) {
        const fullPath = path.join(THEME_DIR, filePath);
        try {
            const content = fs.readFileSync(fullPath, 'utf8');
            let fileIsValid = true;
            expectedTokens.forEach(token => {
                if (!content.includes(token)) {
                    log(`  ❌ ERROR in ${filePath}: Expected token "${token}" not found.`, colors.red);
                    fileIsValid = false;
                    issuesFound = true;
                }
            });
            if (fileIsValid) {
                log(`  ✅ ${filePath} contains the correct new tokens.`);
            }
            allConsumersValid = allConsumersValid && fileIsValid;
        } catch (error) {
            log(`  ❌ ERROR: Could not read file ${filePath}`, colors.red);
            issuesFound = true;
            allConsumersValid = false;
        }
    }

    if (allConsumersValid) {
        log('  👍 All consumer files are correctly updated.', colors.green);
    }
}


function main() {
    log('Running Dimension Refactoring Validation...', colors.yellow);
    log('='.repeat(40), colors.yellow);

    validateSemanticStructure();
    checkForBrokenReferences();
    validateConsumerFiles();

    log('\n' + '='.repeat(40), colors.yellow);
    if (issuesFound) {
        log('⚠️  Validation Failed. Issues were found.', colors.red);
        process.exit(1);
    } else {
        log('🎉 All dimension refactoring validations passed successfully!', colors.green);
        process.exit(0);
    }
}

main();
