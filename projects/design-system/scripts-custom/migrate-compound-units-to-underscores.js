#!/usr/bin/env node

/**
 * Migrate Compound Units to Underscores
 * 
 * This script converts compound units from hyphens to underscores in all token JSON files.
 * Only affects compound units (multi-word parts within tokens), preserving the overall 
 * token structure and dot separators.
 * 
 * Examples:
 * - alert-notification → alert_notification
 * - contrast-high → contrast_high  
 * - font-family → font_family
 * 
 * The script:
 * 1. Reads the compound units list from compound-units.md
 * 2. Creates backup of all JSON files
 * 3. Processes each JSON file to replace compound units
 * 4. Updates the compound-units.md documentation
 * 5. Validates the changes
 * 
 * Usage:
 *     node scripts-custom/migrate-compound-units-to-underscores.js [--dry-run] [--no-backup]
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class CompoundUnitMigrator {
    constructor(projectRoot, dryRun = false, createBackup = true) {
        this.projectRoot = path.resolve(projectRoot);
        this.dryRun = dryRun;
        this.createBackup = createBackup;
        this.compoundUnits = new Set();
        this.processedFiles = [];
        this.migrationLog = [];
    }

    /**
     * Load compound units from the compound-units.md file.
     */
    loadCompoundUnits() {
        const compoundUnitsFile = path.join(this.projectRoot, 'documentation', 'design-tokens', 'compound-units.md');
        
        if (!fs.existsSync(compoundUnitsFile)) {
            throw new Error(`Compound units file not found: ${compoundUnitsFile}`);
        }
        
        const compoundUnits = new Set();
        const content = fs.readFileSync(compoundUnitsFile, 'utf8');
        
        // Extract compound units from the markdown list
        let inCompoundList = false;
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed === '### All Compound Units') {
                inCompoundList = true;
                continue;
            } else if (trimmed.startsWith('### ') && inCompoundList) {
                break;
            } else if (inCompoundList && trimmed.startsWith('- `') && trimmed.endsWith('`')) {
                // Extract compound unit from markdown list item
                const compoundUnit = trimmed.substring(3, trimmed.length - 1); // Remove "- `" and "`"
                if (compoundUnit.includes('-')) { // Only hyphenated compounds need migration
                    compoundUnits.add(compoundUnit);
                }
            }
        }
        
        this.compoundUnits = compoundUnits;
        console.log(`Loaded ${compoundUnits.size} compound units for migration`);
        return compoundUnits;
    }

    /**
     * Create backup of all JSON files before migration.
     */
    createBackups() {
        if (!this.createBackup || this.dryRun) {
            return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const backupDir = path.join(this.projectRoot, '_private', 'backups', `compound-unit-migration-${timestamp}`);
        
        // Create backup directory
        fs.mkdirSync(backupDir, { recursive: true });
        
        const jsonFiles = glob.sync('src/lib/themes/**/*.json', { cwd: this.projectRoot });
        
        for (const jsonFile of jsonFiles) {
            const sourcePath = path.join(this.projectRoot, jsonFile);
            const backupPath = path.join(backupDir, jsonFile);
            
            // Create backup directory structure
            fs.mkdirSync(path.dirname(backupPath), { recursive: true });
            fs.copyFileSync(sourcePath, backupPath);
        }
        
        console.log(`Created backup in: ${backupDir}`);
        this.migrationLog.push(`Backup created: ${backupDir}`);
    }

    /**
     * Replace compound units in text, returning modified text and list of changes.
     */
    migrateCompoundUnitsInText(text) {
        const changes = [];
        let modifiedText = text;
        
        for (const compoundUnit of this.compoundUnits) {
            // Create the underscore version
            const underscoreVersion = compoundUnit.replace(/-/g, '_');
            
            // Count occurrences before replacement
            const regex = new RegExp(compoundUnit, 'g');
            const matches = modifiedText.match(regex);
            const count = matches ? matches.length : 0;
            
            if (count > 0) {
                // Replace the compound unit
                modifiedText = modifiedText.replace(regex, underscoreVersion);
                changes.push(`${compoundUnit} → ${underscoreVersion} (${count} occurrences)`);
            }
        }
        
        return { modifiedText, changes };
    }

    /**
     * Process a single JSON file to migrate compound units.
     */
    processJsonFile(jsonFile) {
        try {
            // Read the original content as text first to preserve formatting
            const originalContent = fs.readFileSync(jsonFile, 'utf8');
            
            // Migrate compound units
            const { modifiedContent, changes } = this.migrateCompoundUnitsInText(originalContent);
            
            if (changes.length === 0) {
                return false; // No changes made
            }
            
            // Validate that the modified content is still valid JSON
            try {
                JSON.parse(modifiedContent);
            } catch (e) {
                console.log(`ERROR: Modified content is not valid JSON in ${jsonFile}: ${e.message}`);
                return false;
            }
            
            // Record changes
            const relativePath = path.relative(this.projectRoot, jsonFile);
            this.migrationLog.push(`\n${relativePath}:`);
            for (const change of changes) {
                this.migrationLog.push(`  - ${change}`);
            }
            
            if (!this.dryRun) {
                // Write the modified content
                fs.writeFileSync(jsonFile, modifiedContent, 'utf8');
            }
            
            this.processedFiles.push(jsonFile);
            return true;
            
        } catch (error) {
            console.log(`ERROR processing ${jsonFile}: ${error.message}`);
            return false;
        }
    }

    /**
     * Find all JSON files in the themes directory.
     */
    findJsonFiles() {
        const themesDir = path.join(this.projectRoot, 'src', 'lib', 'themes');
        if (!fs.existsSync(themesDir)) {
            throw new Error(`Themes directory not found: ${themesDir}`);
        }
        
        const jsonFiles = glob.sync('**/*.json', { 
            cwd: themesDir,
            absolute: true 
        });
        
        return jsonFiles;
    }

    /**
     * Update the compound-units.md file to reflect the underscore format.
     */
    updateCompoundUnitsDocumentation() {
        const compoundUnitsFile = path.join(this.projectRoot, 'documentation', 'design-tokens', 'compound-units.md');
        
        if (!fs.existsSync(compoundUnitsFile)) {
            return;
        }
        
        let content = fs.readFileSync(compoundUnitsFile, 'utf8');
        
        // Update the overview to mention underscore format
        const oldOverview = 'The transformation follows camelCase conventions where subsequent words are capitalized.';
        const newOverview = 'Compound units now use underscores instead of hyphens, eliminating the need for camelCase transformations in CSS.';
        
        if (content.includes(oldOverview)) {
            content = content.replace(oldOverview, newOverview);
        }
        
        // Update the Style Dictionary integration section
        const oldStyleDict = 'from their documentation format (hyphenated) to their implementation format (camelCase) for CSS variables.';
        const newStyleDict = 'preserving the underscore format in CSS variables, eliminating transformation complexity.';
        
        if (content.includes(oldStyleDict)) {
            content = content.replace(oldStyleDict, newStyleDict);
        }
        
        // Update examples to show underscore format
        const oldExample = `\`\`\`scss
/* ❌ Incorrect - using documentation format */
color: var(--ob-s-color-status-critical-fg-contrast-high-inversity-normal);

/* ✅ Correct - using camelCase format */
color: var(--ob-s-color-status-critical-fg-contrastHigh-inversityNormal);
\`\`\``;
        
        const newExample = `\`\`\`scss
/* ❌ Old format - using hyphens */
color: var(--ob-s-color-status-critical-fg-contrast-high-inversity-normal);

/* ✅ New format - using underscores */
color: var(--ob-s-color-status-critical-fg-contrast_high-inversity_normal);
\`\`\``;
        
        if (content.includes(oldExample)) {
            content = content.replace(oldExample, newExample);
        }
        
        // Update the compound units list to show underscore format
        for (const compoundUnit of this.compoundUnits) {
            const underscoreVersion = compoundUnit.replace(/-/g, '_');
            content = content.replace(`- \`${compoundUnit}\``, `- \`${underscoreVersion}\``);
        }
        
        // Update transformation table to show underscore format
        const transformationsToUpdate = [
            ['contrast-high', 'contrast_high'],
            ['contrast-medium', 'contrast_medium'],
            ['contrast-low', 'contrast_low'],
            ['inversity-normal', 'inversity_normal'],
            ['inversity-flipped', 'inversity_flipped'],
            ['border-radius', 'border_radius'],
            ['font-family', 'font_family'],
            ['font-size', 'font_size'],
            ['font-weight', 'font_weight'],
            ['letter-spacing', 'letter_spacing']
        ];
        
        for (const [oldFormat, newFormat] of transformationsToUpdate) {
            // Update in transformation tables
            const tableRegex = new RegExp(`\`${oldFormat.replace(/-/g, '\\-')}\`\\s*\\|\\s*\`\\w+\``, 'g');
            content = content.replace(tableRegex, `\`${newFormat}\` | \`${newFormat}\``);
            
            // Update in transformation lists
            const listRegex = new RegExp(`- \`${oldFormat.replace(/-/g, '\\-')}\` -> \`\\w+\``, 'g');
            content = content.replace(listRegex, `- \`${newFormat}\` -> \`${newFormat}\``);
        }
        
        if (!this.dryRun) {
            fs.writeFileSync(compoundUnitsFile, content, 'utf8');
            console.log('Updated compound-units.md documentation');
        }
    }

    /**
     * Generate a detailed migration report.
     */
    generateMigrationReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const reportPath = path.join(this.projectRoot, '_private', 'reports', `compound-unit-migration-${timestamp}.md`);
        
        // Create reports directory
        fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        
        let reportContent = `# Compound Unit Migration Report

**Date:** ${new Date().toLocaleString()}
**Mode:** ${this.dryRun ? 'DRY RUN' : 'LIVE MIGRATION'}

## Summary

- **Compound units migrated:** ${this.compoundUnits.size}
- **Files processed:** ${this.processedFiles.length}
- **Backup created:** ${this.createBackup && !this.dryRun ? 'Yes' : 'No'}

## Migrated Compound Units

`;
        
        const sortedUnits = Array.from(this.compoundUnits).sort();
        for (const compoundUnit of sortedUnits) {
            const underscoreVersion = compoundUnit.replace(/-/g, '_');
            reportContent += `- \`${compoundUnit}\` → \`${underscoreVersion}\`\n`;
        }
        
        reportContent += '\n## File Changes\n';
        reportContent += this.migrationLog.join('\n');
        
        if (!this.dryRun) {
            fs.writeFileSync(reportPath, reportContent, 'utf8');
            console.log(`Migration report saved: ${reportPath}`);
        } else {
            console.log('\n' + '='.repeat(50));
            console.log('DRY RUN REPORT');
            console.log('='.repeat(50));
            console.log(reportContent);
        }
    }

    /**
     * Run the complete migration process.
     */
    runMigration() {
        console.log('Starting compound unit migration...');
        console.log(`Mode: ${this.dryRun ? 'DRY RUN' : 'LIVE MIGRATION'}`);
        
        // Load compound units
        this.loadCompoundUnits();
        
        if (this.compoundUnits.size === 0) {
            console.log('No compound units found for migration.');
            return;
        }
        
        // Create backups
        if (!this.dryRun) {
            this.createBackups();
        }
        
        // Find and process JSON files
        const jsonFiles = this.findJsonFiles();
        console.log(`Found ${jsonFiles.length} JSON files to process`);
        
        let processedCount = 0;
        for (const jsonFile of jsonFiles) {
            if (this.processJsonFile(jsonFile)) {
                processedCount++;
            }
        }
        
        console.log(`Processed ${processedCount} files with changes`);
        
        // Update documentation
        if (!this.dryRun) {
            this.updateCompoundUnitsDocumentation();
        }
        
        // Generate report
        this.generateMigrationReport();
        
        if (this.dryRun) {
            console.log('\nDRY RUN COMPLETE - No changes made to files');
        } else {
            console.log('\nMIGRATION COMPLETE!');
            console.log('Next steps:');
            console.log('1. Review the changes in your files');
            console.log('2. Update Style Dictionary configuration to preserve underscores');
            console.log('3. Test the build process');
            console.log('4. Update any hardcoded references in CSS/SCSS files');
        }
    }
}

/**
 * Main function.
 */
function main() {
    const args = process.argv.slice(2);
    
    const options = {
        dryRun: false,
        noBackup: false
    };
    
    for (const arg of args) {
        switch (arg) {
            case '--dry-run':
                options.dryRun = true;
                break;
            case '--no-backup':
                options.noBackup = true;
                break;
            case '--help':
            case '-h':
                console.log(`Compound Unit Migration Tool

Usage: node migrate-compound-units-to-underscores.js [options]

Options:
  --dry-run     Show what would be changed without making changes
  --no-backup   Skip creating backups
  --help, -h    Show this help message

This script migrates compound units from hyphens to underscores in JSON token files.

Examples:
  node migrate-compound-units-to-underscores.js --dry-run
  node migrate-compound-units-to-underscores.js --no-backup`);
                return 0;
        }
    }
    
    const projectRoot = path.dirname(__dirname); // Parent of scripts-custom
    
    const migrator = new CompoundUnitMigrator(
        projectRoot,
        options.dryRun,
        !options.noBackup
    );
    
    try {
        migrator.runMigration();
        return 0;
    } catch (error) {
        console.log(`ERROR: Migration failed: ${error.message}`);
        return 1;
    }
}

// Run main function if this script is executed directly
if (require.main === module) {
    process.exit(main());
}

module.exports = { CompoundUnitMigrator };
