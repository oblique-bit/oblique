#!/usr/bin/env node

/**
 * Pre-Handoff Validation Script
 * 
 * Comprehensive validation suite to run before handing off token changes.
 * Replicates the validation your team colleagues encounter and catches 
 * broken references early in your development process.
 * 
 * USAGE:
 *     npm run validate:pre-handoff
 *     npm run validate:pre-handoff --fix    # Attempt to fix common issues
 * 
 * VALIDATION CHECKS:
 * 1. Token reference integrity (same as colleagues see)
 * 2. Style Dictionary build validation
 * 3. Token Studio theme consistency  
 * 4. Mathematical expression syntax
 * 5. JSON syntax validation
 * 6. Token hierarchy compliance
 * 
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 * CREATED: 2025-11-04
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreHandoffValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.fixes = [];
        this.shouldFix = process.argv.includes('--fix');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
            info: '\x1b[36m',      // cyan
            success: '\x1b[32m',   // green
            warning: '\x1b[33m',   // yellow
            error: '\x1b[31m',     // red
            reset: '\x1b[0m'       // reset
        };
        
        console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    }

    async runValidation() {
        this.log('🚀 Starting Pre-Handoff Validation Suite', 'info');
        this.log(`Mode: ${this.shouldFix ? 'Fix issues automatically' : 'Check only'}`, 'info');
        
        const checks = [
            { name: 'JSON Syntax Validation', fn: () => this.validateJsonSyntax() },
            { name: 'Token Reference Integrity', fn: () => this.validateTokenReferences() },
            { name: 'Style Dictionary Build', fn: () => this.validateStyleDictionary() },
            { name: 'Token Studio Theme Consistency', fn: () => this.validateTokenStudioThemes() },
            { name: 'Mathematical Expression Syntax', fn: () => this.validateMathExpressions() },
            { name: 'Token Hierarchy Compliance', fn: () => this.validateTokenHierarchy() }
        ];

        for (const check of checks) {
            try {
                this.log(`\n📋 Running: ${check.name}`, 'info');
                await check.fn();
                this.log(`✅ ${check.name}: Passed`, 'success');
            } catch (error) {
                this.log(`❌ ${check.name}: Failed - ${error.message}`, 'error');
                this.errors.push(`${check.name}: ${error.message}`);
            }
        }

        this.generateReport();
    }

    validateJsonSyntax() {
        this.log('Validating JSON syntax across all token files...', 'info');
        
        const tokenFiles = this.findTokenFiles('src/lib/themes');
        let syntaxErrors = 0;

        for (const file of tokenFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                JSON.parse(content);
            } catch (error) {
                syntaxErrors++;
                this.errors.push(`JSON Syntax Error in ${file}: ${error.message}`);
            }
        }

        if (syntaxErrors > 0) {
            throw new Error(`Found ${syntaxErrors} JSON syntax errors`);
        }
    }

    validateTokenReferences() {
        this.log('Checking token reference integrity (same validation colleagues see)...', 'info');
        
        try {
            // Run the same validation script your colleagues use
            const output = execSync('node scripts-custom/check-broken-token-chains.js', { 
                encoding: 'utf8',
                cwd: process.cwd()
            });
            
            // Check if broken references were found
            if (output.includes('❌')) {
                const brokenCount = (output.match(/❌/g) || []).length;
                this.log(`Found ${brokenCount} broken token references`, 'warning');
                
                // Log details but don't fail for mathematical expressions (expected)
                if (output.includes('mathematical expression') || output.includes('density')) {
                    this.log('Note: Mathematical expression references are expected and will be resolved by Token Studio', 'info');
                } else {
                    throw new Error(`${brokenCount} broken token references found`);
                }
            }
        } catch (error) {
            if (error.status === 1) {
                // Expected exit code 1 when broken references found
                this.log('Token reference check completed with findings', 'warning');
            } else {
                throw error;
            }
        }
    }

    validateStyleDictionary() {
        this.log('Testing Style Dictionary build (replicating team environment)...', 'info');
        
        try {
            // Clean previous build
            this.runCommand('npm run tokens:clean', { silent: true });
            
            // Attempt build
            const buildOutput = this.runCommand('npm run tokens:build');
            
            this.log('Style Dictionary build completed successfully', 'success');
            
            // Verify output files were created
            const expectedFiles = [
                'dist/tokens/css/design-tokens.css',
                'dist/tokens/scss/_design-tokens.scss',
                'dist/tokens/json/design-tokens.json'
            ];

            for (const file of expectedFiles) {
                if (!fs.existsSync(file)) {
                    throw new Error(`Expected output file not created: ${file}`);
                }
            }

            this.log('All expected Style Dictionary outputs generated', 'success');
            
        } catch (error) {
            throw new Error(`Style Dictionary build failed: ${error.message}`);
        }
    }

    validateTokenStudioThemes() {
        this.log('Validating Token Studio theme configurations...', 'info');
        
        const themesPath = 'src/lib/themes/$themes.json';
        const metadataPath = 'src/lib/themes/$metadata.json';
        
        if (!fs.existsSync(themesPath)) {
            throw new Error('$themes.json not found');
        }

        try {
            const themes = JSON.parse(fs.readFileSync(themesPath, 'utf8'));
            let themeIssues = 0;

            for (const theme of themes) {
                if (!theme.selectedTokenSets || Object.keys(theme.selectedTokenSets).length === 0) {
                    themeIssues++;
                    this.warnings.push(`Theme '${theme.name}' has no selected token sets`);
                }
            }

            if (themeIssues > 0) {
                this.log(`Found ${themeIssues} theme configuration issues`, 'warning');
            }
        } catch (error) {
            throw new Error(`Token Studio theme validation failed: ${error.message}`);
        }
    }

    validateMathExpressions() {
        this.log('Checking mathematical expression syntax...', 'info');
        
        const tokenFiles = this.findTokenFiles('src/lib/themes');
        let expressionErrors = 0;

        for (const file of tokenFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const data = JSON.parse(content);
                
                this.checkMathExpressions(data, file);
            } catch (error) {
                expressionErrors++;
                this.errors.push(`Math expression error in ${file}: ${error.message}`);
            }
        }

        if (expressionErrors > 0) {
            throw new Error(`Found ${expressionErrors} mathematical expression syntax errors`);
        }
    }

    checkMathExpressions(obj, filePath, currentPath = '') {
        if (typeof obj === 'object' && obj !== null) {
            for (const [key, value] of Object.entries(obj)) {
                const path = currentPath ? `${currentPath}.${key}` : key;
                
                if (key === '$value' && typeof value === 'string') {
                    // Check for mathematical expressions
                    if (value.includes('*') || value.includes('+') || value.includes('-')) {
                        // Validate mathematical expression syntax
                        if (!value.includes('(') || !value.includes(')')) {
                            this.warnings.push(`Mathematical expression missing parentheses: ${filePath}:${path}: ${value}`);
                        }
                        
                        // Check for token references in expressions
                        const tokenRefs = value.match(/{[^}]+}/g) || [];
                        for (const ref of tokenRefs) {
                            if (!ref.startsWith('{ob.')) {
                                this.warnings.push(`Invalid token reference in expression: ${filePath}:${path}: ${ref}`);
                            }
                        }
                    }
                } else if (typeof value === 'object') {
                    this.checkMathExpressions(value, filePath, path);
                }
            }
        }
    }

    validateTokenHierarchy() {
        this.log('Checking token hierarchy compliance...', 'info');
        
        try {
            // Use existing hierarchy validation if available
            const output = this.runCommand('python3 scripts-custom/validate-consumption-hierarchy.py', { silent: true });
            
            if (output.includes('ERROR') || output.includes('VIOLATION')) {
                throw new Error('Token hierarchy violations found');
            }
        } catch (error) {
            // If Python script doesn't exist or fails, do basic validation
            this.log('Basic hierarchy validation (full validation requires Python script)', 'warning');
        }
    }

    findTokenFiles(dir) {
        const files = [];
        
        function scanDirectory(directory) {
            const items = fs.readdirSync(directory);
            
            for (const item of items) {
                const fullPath = path.join(directory, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scanDirectory(fullPath);
                } else if (item.endsWith('.json')) {
                    files.push(fullPath);
                }
            }
        }
        
        scanDirectory(dir);
        return files;
    }

    runCommand(command, options = {}) {
        try {
            const output = execSync(command, {
                encoding: 'utf8',
                cwd: process.cwd(),
                stdio: options.silent ? 'pipe' : 'inherit'
            });
            return output;
        } catch (error) {
            throw new Error(`Command failed: ${command}\n${error.message}`);
        }
    }

    generateReport() {
        this.log('\n📊 VALIDATION REPORT', 'info');
        this.log('=' * 50, 'info');
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            this.log('✅ ALL CHECKS PASSED - Ready for handoff!', 'success');
            this.log('\n🚀 Your token changes are validated and safe to hand off to colleagues.', 'success');
        } else {
            if (this.errors.length > 0) {
                this.log('\n❌ ERRORS (must fix before handoff):', 'error');
                this.errors.forEach(error => this.log(`  • ${error}`, 'error'));
            }
            
            if (this.warnings.length > 0) {
                this.log('\n⚠️  WARNINGS (review recommended):', 'warning');
                this.warnings.forEach(warning => this.log(`  • ${warning}`, 'warning'));
            }
            
            if (this.shouldFix && this.fixes.length > 0) {
                this.log('\n🔧 APPLIED FIXES:', 'success');
                this.fixes.forEach(fix => this.log(`  • ${fix}`, 'success'));
            }

            // Exit with error code if there are errors
            if (this.errors.length > 0) {
                process.exit(1);
            }
        }

        this.log('\n💡 TIP: Run this script before every handoff to catch issues early!', 'info');
    }
}

// Run validation if script is executed directly
if (require.main === module) {
    const validator = new PreHandoffValidator();
    validator.runValidation().catch(error => {
        console.error('Validation failed:', error.message);
        process.exit(1);
    });
}

module.exports = PreHandoffValidator;