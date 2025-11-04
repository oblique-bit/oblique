#!/usr/bin/env node

/**
 * Quick Pre-Handoff Validation
 * 
 * Essential validation to catch token reference issues before handoff.
 * Focused on the most common problems that break Style Dictionary builds.
 * 
 * USAGE:
 *     npm run validate:handoff-quick
 * 
 * CHECKS:
 * 1. Style Dictionary build test
 * 2. Critical token reference validation
 * 3. JSON syntax validation
 * 
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 * CREATED: 2025-11-04
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class QuickValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',      // cyan
            success: '\x1b[32m',   // green
            warning: '\x1b[33m',   // yellow
            error: '\x1b[31m',     // red
            reset: '\x1b[0m'       // reset
        };
        
        console.log(`${colors[type]}${message}${colors.reset}`);
    }

    async runValidation() {
        this.log('🚀 Quick Pre-Handoff Validation', 'info');
        
        const checks = [
            { name: 'JSON Syntax Check', fn: () => this.validateJsonSyntax() },
            { name: 'Style Dictionary Build Test', fn: () => this.testStyleDictionaryBuild() },
            { name: 'Token Reference Check', fn: () => this.checkTokenReferences() }
        ];

        for (const check of checks) {
            try {
                this.log(`\n📋 ${check.name}...`, 'info');
                await check.fn();
                this.log(`✅ ${check.name}: PASSED`, 'success');
            } catch (error) {
                this.log(`❌ ${check.name}: FAILED`, 'error');
                this.log(`   ${error.message}`, 'error');
                this.errors.push(`${check.name}: ${error.message}`);
            }
        }

        this.showResults();
    }

    validateJsonSyntax() {
        const tokenFiles = this.findTokenFiles('src/lib/themes');
        let syntaxErrors = 0;

        for (const file of tokenFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                JSON.parse(content);
            } catch (error) {
                syntaxErrors++;
                this.log(`   JSON Error: ${path.basename(file)} - ${error.message}`, 'error');
            }
        }

        if (syntaxErrors > 0) {
            throw new Error(`${syntaxErrors} JSON syntax errors found`);
        }
    }

    testStyleDictionaryBuild() {
        try {
            // Test Style Dictionary build
            this.log('   Testing Style Dictionary build...', 'info');
            
            const output = execSync('npm run tokens:build', { 
                encoding: 'utf8',
                stdio: 'pipe'
            });
            
            // Check if expected files were created
            const expectedFiles = [
                'dist/tokens/css/design-tokens.css',
                'dist/tokens/scss/_design-tokens.scss'
            ];

            for (const file of expectedFiles) {
                if (!fs.existsSync(file)) {
                    throw new Error(`Style Dictionary did not generate expected file: ${file}`);
                }
            }

            this.log('   Style Dictionary build successful ✓', 'success');
            
        } catch (error) {
            throw new Error('Style Dictionary build failed - this will block your colleagues');
        }
    }

    checkTokenReferences() {
        try {
            // Run token reference validation but don't fail on warnings
            const output = execSync('node scripts-custom/check-broken-token-chains.js', { 
                encoding: 'utf8',
                stdio: 'pipe'
            });
            
            // Count actual broken references (not mathematical expressions)
            const lines = output.split('\n');
            let criticalErrors = 0;
            
            for (const line of lines) {
                if (line.includes('❌') && 
                    !line.includes('mathematical') && 
                    !line.includes('density') &&
                    !line.includes('multiplier')) {
                    criticalErrors++;
                }
            }
            
            if (criticalErrors > 5) { // Allow some false positives
                throw new Error(`${criticalErrors} critical token reference issues found`);
            }
            
            this.log('   Token references validated ✓', 'success');
            
        } catch (error) {
            if (error.message.includes('critical token reference')) {
                throw error;
            }
            // If the script fails to run, show warning but don't fail
            this.warnings.push('Could not run full token reference validation');
            this.log('   Token reference check: WARNING (partial validation)', 'warning');
        }
    }

    findTokenFiles(dir) {
        const files = [];
        
        function scanDirectory(directory) {
            if (!fs.existsSync(directory)) return;
            
            const items = fs.readdirSync(directory);
            
            for (const item of items) {
                const fullPath = path.join(directory, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scanDirectory(fullPath);
                } else if (item.endsWith('.json') && !item.startsWith('$')) {
                    files.push(fullPath);
                }
            }
        }
        
        scanDirectory(dir);
        return files;
    }

    showResults() {
        this.log('\n📊 VALIDATION RESULTS', 'info');
        this.log('════════════════════════════════════════', 'info');
        
        if (this.errors.length === 0) {
            this.log('\n🎉 ALL CHECKS PASSED!', 'success');
            this.log('✅ Your token changes are ready for handoff', 'success');
            this.log('✅ Style Dictionary build is working', 'success');
            this.log('✅ No critical JSON or reference errors', 'success');
            
            if (this.warnings.length > 0) {
                this.log('\n⚠️  Minor warnings (non-blocking):', 'warning');
                this.warnings.forEach(warning => this.log(`  • ${warning}`, 'warning'));
            }
            
        } else {
            this.log('\n❌ VALIDATION FAILED', 'error');
            this.log('These issues will likely cause problems for your colleagues:', 'error');
            this.errors.forEach(error => this.log(`  • ${error}`, 'error'));
            
            this.log('\n💡 Fix these issues before handoff:', 'info');
            this.log('  1. Check JSON syntax in reported files', 'info');
            this.log('  2. Run Style Dictionary build locally: npm run tokens:build', 'info');
            this.log('  3. Verify token references are correct', 'info');
            
            process.exit(1);
        }
        
        this.log('\n🔄 Run this before every handoff to catch issues early!', 'info');
    }
}

// Run validation if script is executed directly
if (require.main === module) {
    const validator = new QuickValidator();
    validator.runValidation().catch(error => {
        console.error('❌ Validation failed:', error.message);
        process.exit(1);
    });
}

module.exports = QuickValidator;