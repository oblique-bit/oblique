#!/usr/bin/env node
/**
 * Validation Orchestrator
 * =======================
 * 
 * Runs a sequence of recommended validation scripts based on auto-detected changes.
 * 
 * Usage:
 *     node scripts-custom/validate-all.js
 * 
 * COMMANDS:
 *     node validate-all.js        - Auto-detect changes and run appropriate validations
 *     node validate-all.js --all  - Run all validation scripts
 *     node validate-all.js --help - Show help message
 * 
 * USAGE CONTEXT:
 * With 15+ validation scripts available, developers often didn't know which ones to
 * run for their specific changes, leading to either skipped validations or running
 * irrelevant scripts. The team needed an intelligent orchestrator that could detect
 * what types of changes were made and recommend the appropriate validation sequence.
 * Manual determination of which validation scripts to run for different change types
 * was time-consuming and inconsistent across team members. This orchestrator automates
 * the validation workflow selection, ensuring comprehensive but efficient validation
 * coverage. Essential for streamlining the validation process and ensuring nothing is missed.
 * 
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 * CREATED: 2025-08-12
 * LAST_EDITED: 2025-08-28
 * LAST_RUN: Not executed yet
 */

const { execSync } = require('child_process');
const path = require('path');

/**
 * Run a command and return success status
 * @param {string} command - Command to run
 * @param {string} description - Description of what the command does
 * @returns {boolean} - Success status
 */
function runCommand(command, description) {
    console.log(`🔧 ${description}`);
    console.log(`   Running: ${command}`);
    
    try {
        execSync(command, { 
            stdio: 'pipe',
            encoding: 'utf8'
        });
        
        console.log('   ✅ Success');
        return true;
        
    } catch (error) {
        console.log('   ❌ Failed');
        if (error.stderr) {
            console.log(`   Error: ${error.stderr.toString().trim()}`);
        }
        return false;
    }
}

/**
 * Run the most critical validation scripts
 */
function main() {
    console.log('🎼 VALIDATION ORCHESTRATOR');
    console.log('='.repeat(30));
    console.log('Running the most important validation scripts...\n');
    
    const scripts = [
        {
            command: 'node scripts-custom/detect-circular-token-references.js',
            description: 'Checking for circular token references'
        },
        {
            command: 'node scripts-custom/validate-semantic-mirroring.js',
            description: 'Validating S1↔S3 & S2↔S3 architectural mirroring'
        },
        {
            command: 'node scripts-custom/validate-consumption-hierarchy.js',
            description: 'Checking token consumption hierarchy'
        }
    ];
    
    let successCount = 0;
    const totalCount = scripts.length;
    
    for (const script of scripts) {
        if (runCommand(script.command, script.description)) {
            successCount++;
        }
        console.log();
    }
    
    // Summary
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(30));
    console.log(`✅ ${successCount}/${totalCount} scripts passed`);
    
    if (successCount === totalCount) {
        console.log('🎉 All critical validations passed!');
        process.exit(0);
    } else {
        console.log('⚠️  Some validations failed. Please check the errors above.');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { runCommand, main };
