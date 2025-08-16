#!/usr/bin/env node
/**
 * Validation Orchestrator
 * =======================
 * 
 * Runs a sequence of recommended validation scripts based on auto-detected changes.
 * 
 * Usage:
 *     node scripts-custom/validate-orchestrator.js

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
            command: 'node scripts-custom/detect-plural-references.js',
            description: 'Checking naming conventions'
        },
        {
            command: 'node scripts-custom/validate-token-syntax.js',
            description: 'Validating token syntax'
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
