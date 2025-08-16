#!/usr/bin/env node

/**
 * Style Dictionary Integration Setup & Maintenance Utility
 * 
 * This script helps set up and maintain the style dictionary integration tracking system.
 * 
 * USAGE:
 *     node setup-token-tracking.js [command]
 *     
 * COMMANDS:
 *     setup     - Initial setup and configuration validation
 *     validate  - Validate configuration and tracked tokens
 *     add-token - Interactive tool to add new tracked tokens
 *     cron      - Show cron job setup instructions
 *     git-hook  - Setup git pre-commit hook
 *     help      - Show this help message
 * 
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class StyleDictionaryIntegrationSetup {
    constructor(projectRoot) {
        this.projectRoot = path.resolve(projectRoot);
        this.reportsDir = path.join(this.projectRoot, 'documentation', 'reports', 'style-dictionary-integration');
        this.configPath = path.join(this.projectRoot, '_private', 'data', 'tracked-tokens-config.json');
        this.scriptsDir = path.join(this.projectRoot, 'scripts-custom');
    }

    /**
     * Initial setup and validation.
     */
    async setup() {
        console.log('🚀 Setting up Style Dictionary Integration Tracking System...');
        
        // Check if files exist
        if (!fs.existsSync(this.configPath)) {
            console.log(`❌ Configuration file not found: ${this.configPath}`);
            return false;
        }
        
        const trackingScript = path.join(this.scriptsDir, 'track-token-changes.js');
        if (!fs.existsSync(trackingScript)) {
            console.log(`❌ Tracking script not found: ${trackingScript}`);
            return false;
        }
        
        // Validate configuration
        console.log('✅ Files found, validating configuration...');
        if (!this.validateConfig()) {
            return false;
        }
        
        // Run initial scan
        console.log('🔍 Running initial scan...');
        try {
            execSync(`node "${trackingScript}" --manual --project-root "${this.projectRoot}"`, {
                cwd: this.projectRoot,
                stdio: 'inherit'
            });
            
            console.log('✅ Initial scan completed successfully!');
            console.log(`📁 Reports saved in: ${this.reportsDir}`);
            return true;
        } catch (error) {
            console.log(`❌ Initial scan failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Validate configuration file.
     */
    validateConfig() {
        try {
            const configContent = fs.readFileSync(this.configPath, 'utf8');
            const config = JSON.parse(configContent);
            
            // Check required sections
            const requiredSections = ['trackedTokens', 'watchPatterns', 'breakingChangeRules'];
            for (const section of requiredSections) {
                if (!(section in config)) {
                    console.log(`❌ Missing required section in config: ${section}`);
                    return false;
                }
            }
            
            // Count tracked tokens
            let totalTracked = 0;
            const trackedTokens = config.trackedTokens || {};
            for (const categoryData of Object.values(trackedTokens)) {
                if (categoryData && typeof categoryData === 'object' && 'paths' in categoryData) {
                    totalTracked += categoryData.paths.length;
                }
            }
            
            console.log('✅ Configuration valid:');
            console.log(`   - ${Object.keys(trackedTokens).length} token categories`);
            console.log(`   - ${totalTracked} tracked token paths`);
            console.log(`   - ${(config.watchPatterns?.includes || []).length} watch patterns`);
            
            return true;
            
        } catch (error) {
            console.log(`❌ Configuration validation failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Create readline interface for user input.
     */
    createReadlineInterface() {
        return readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Prompt user for input.
     */
    async promptUser(question) {
        const rl = this.createReadlineInterface();
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }

    /**
     * Interactive tool to add new tracked tokens.
     */
    async addTokenInteractive() {
        console.log('🎯 Add New Tracked Token');
        console.log('='.repeat(40));
        
        // Load current config
        let config;
        try {
            const configContent = fs.readFileSync(this.configPath, 'utf8');
            config = JSON.parse(configContent);
        } catch (error) {
            console.log(`❌ Could not load config: ${error.message}`);
            return;
        }
        
        // Show current categories
        const categories = Object.keys(config.trackedTokens || {});
        console.log(`\nCurrent categories: ${categories.join(', ')}`);
        
        // Get input
        const tokenPath = await this.promptUser('\n🏷️  Enter token path (e.g., ob.s.color.neutral.no-color): ');
        if (!tokenPath) {
            console.log('❌ Token path cannot be empty');
            return;
        }
        
        // Choose category
        console.log('\n📂 Choose category:');
        categories.forEach((cat, i) => {
            console.log(`   ${i + 1}. ${cat}`);
        });
        console.log(`   ${categories.length + 1}. Create new category`);
        
        const choiceStr = await this.promptUser(`\nEnter choice (1-${categories.length + 1}): `);
        const choice = parseInt(choiceStr);
        
        let category;
        if (choice >= 1 && choice <= categories.length) {
            category = categories[choice - 1];
        } else if (choice === categories.length + 1) {
            category = await this.promptUser('Enter new category name: ');
            if (!category) {
                console.log('❌ Category name cannot be empty');
                return;
            }
            // Initialize new category
            config.trackedTokens[category] = {
                description: `${category.charAt(0).toUpperCase() + category.slice(1)} tokens that are hardcoded in style dictionary`,
                paths: []
            };
        } else {
            console.log('❌ Invalid choice');
            return;
        }
        
        // Add usage context
        const usageContext = await this.promptUser('\n💬 Usage context (optional): ');
        
        // Add to config
        if (!config.trackedTokens[category].paths.includes(tokenPath)) {
            config.trackedTokens[category].paths.push(tokenPath);
            config.lastUpdated = '2025-07-15';  // Update timestamp
            
            // Save config
            try {
                fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf8');
                console.log(`✅ Added '${tokenPath}' to category '${category}'`);
                if (usageContext) {
                    console.log(`   Context: ${usageContext}`);
                }
                console.log(`📄 Config updated: ${this.configPath}`);
            } catch (error) {
                console.log(`❌ Could not save config: ${error.message}`);
            }
        } else {
            console.log(`⚠️  Token '${tokenPath}' already exists in category '${category}'`);
        }
    }

    /**
     * Show cron job setup instructions.
     */
    showCronSetup() {
        const scriptPath = path.join(this.scriptsDir, 'track-token-changes.js');
        
        console.log('⏰ Cron Job Setup Instructions');
        console.log('='.repeat(40));
        console.log('\n1. Open your crontab:');
        console.log('   crontab -e');
        console.log('\n2. Add this line for daily execution at 2 AM:');
        console.log(`   0 2 * * * cd ${this.projectRoot} && node ${scriptPath} >/dev/null 2>&1`);
        console.log('\n3. For more frequent checks (every 4 hours):');
        console.log(`   0 */4 * * * cd ${this.projectRoot} && node ${scriptPath} >/dev/null 2>&1`);
        console.log('\n4. To receive email notifications on changes:');
        console.log(`   0 2 * * * cd ${this.projectRoot} && node ${scriptPath} || echo 'Token changes detected' | mail -s 'Design System Alert' your-email@company.com`);
        console.log('\nNote: Make sure to update the email address above.');
    }

    /**
     * Setup git pre-commit hook.
     */
    setupGitHook() {
        const gitDir = path.join(this.projectRoot, '.git');
        if (!fs.existsSync(gitDir)) {
            console.log('❌ Not a git repository');
            return;
        }
        
        const hooksDir = path.join(gitDir, 'hooks');
        if (!fs.existsSync(hooksDir)) {
            fs.mkdirSync(hooksDir, { recursive: true });
        }
        
        const hookFile = path.join(hooksDir, 'pre-commit');
        const scriptPath = path.join(this.scriptsDir, 'track-token-changes.js');
        
        const hookContent = `#!/bin/bash
# Oblique Design System - Token Change Detection Pre-commit Hook

# Check if any token files have been modified
token_files_changed=$(git diff --cached --name-only | grep -E "src/lib/themes.*\\\\.(json|js|ts)$" | wc -l)

if [ "$token_files_changed" -gt 0 ]; then
    echo "🔍 Token files detected in commit, running change detection..."
    
    # Run token change tracking
    cd "${this.projectRoot}"
    node "${scriptPath}" --project-root "${this.projectRoot}"
    
    # Check if breaking changes were detected
    if [ $? -eq 1 ]; then
        echo ""
        echo "🚨 BREAKING TOKEN CHANGES DETECTED!"
        echo "   Review the generated report before committing."
        echo "   Report location: documentation/reports/style-dictionary-integration/"
        echo ""
        echo "   To bypass this check: git commit --no-verify"
        exit 1
    else
        echo "✅ Token change detection completed"
    fi
fi
`;
        
        try {
            fs.writeFileSync(hookFile, hookContent, 'utf8');
            
            // Make executable
            fs.chmodSync(hookFile, 0o755);
            
            console.log('✅ Git pre-commit hook installed successfully!');
            console.log(`📁 Location: ${hookFile}`);
            console.log('\nThe hook will:');
            console.log('- Detect when token files are modified in commits');
            console.log('- Run automatic token change detection');
            console.log('- Block commits with breaking token changes');
            console.log('- Generate reports for review');
            
        } catch (error) {
            console.log(`❌ Could not setup git hook: ${error.message}`);
        }
    }

    /**
     * Show help message.
     */
    showHelp() {
        console.log(`Style Dictionary Integration Setup & Maintenance Utility

This script helps set up and maintain the style dictionary integration tracking system.

USAGE:
    node setup-token-tracking.js [command]
    
COMMANDS:
    setup     - Initial setup and configuration validation
    validate  - Validate configuration and tracked tokens
    add-token - Interactive tool to add new tracked tokens
    cron      - Show cron job setup instructions
    git-hook  - Setup git pre-commit hook
    help      - Show this help message

AUTHORS: Design System Team
VERSION: 1.0.0`);
    }
}

/**
 * Main execution function.
 */
async function main() {
    const command = process.argv[2]?.toLowerCase() || 'help';
    
    // Get project root
    const projectRoot = path.dirname(__dirname);
    const setup = new StyleDictionaryIntegrationSetup(projectRoot);
    
    try {
        switch (command) {
            case 'setup':
                const setupSuccess = await setup.setup();
                process.exit(setupSuccess ? 0 : 1);
                break;
            case 'validate':
                const validateSuccess = setup.validateConfig();
                process.exit(validateSuccess ? 0 : 1);
                break;
            case 'add-token':
                await setup.addTokenInteractive();
                break;
            case 'cron':
                setup.showCronSetup();
                break;
            case 'git-hook':
                setup.setupGitHook();
                break;
            case 'help':
                setup.showHelp();
                break;
            default:
                console.log(`❌ Unknown command: ${command}`);
                setup.showHelp();
                process.exit(1);
        }
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { StyleDictionaryIntegrationSetup };
