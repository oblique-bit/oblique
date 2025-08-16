#!/usr/bin/env node
/**
 * Comprehensive Plural Reference Finder for Oblique Design System
 * 
 * This script validates that all token names, file names, and documentation references
 * use singular naming conventions consistently throughout the design system.
 * 
 * VALIDATION SCOPE:
 * ✅ Token references in JSON files (e.g., {ob.s.color.l1.interaction})
 * ✅ File path references in documentation (e.g., semantic/color/)
 * ✅ JSON token definitions and structures
 * ✅ Documentation with explicit token mentions
 * ✅ Explicit token paths like ob.s.color.l1.interaction
 * ✅ File paths in documentation that reference token structure
 * 
 * EXCLUSIONS:
 * ❌ Generic descriptive text (e.g., "Interactive elements with emphasis levels")
 * ❌ $themes.json file (managed by Tokens Studio)
 * ❌ Figma metadata and parent references
 * ❌ Documentation titles and general descriptions where we don't explicitly mention files or tokens
 * ❌ Historical reports (singular-plural-inconsistency-report.md)
 * ❌ Script-generated report files
 * ❌ Generic descriptions like "status colors communicate state"
 * 
 * VALIDATION CRITERIA:
 * ✅ VALID: "Interactive elements with emphasis levels (high/low) and states"
 * ❌ INVALID: "ob.s.color.l1.interactions" or "semantic/colors/" or "colors.json"
 * 
 * The key distinction: Generic descriptions about colors/elements are OK,
 * but explicit token names and file references must always be singular.
 * 
 * USAGE:
 *     node scripts-custom/detect-plural-references.js
 * 
 * RECOMMENDED WORKFLOW:
 *     # Run after any changes to validate singular naming conventions
 *     npm run check:plural-references  # (if added to package.json)
 *     # OR
 *     node scripts-custom/detect-plural-references.js
 * 
 * SUCCESS CRITERIA:
 * When this script reports "NO PLURAL REFERENCES FOUND", the design system
 * maintains consistent singular naming conventions throughout all:
 * - Token names and references
 * - File and folder names
 * - Documentation that explicitly mentions tokens/files
 * 
 * STATUS: ✅ All plural references resolved as of July 11, 2025
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class PluralFinder {
    constructor(baseDir = '.') {
        this.baseDir = baseDir;
        this.issues = [];
    }

    /**
     * Find all plural references in the design system
     * @returns {Array} Array of issues found
     */
    async findAllIssues() {
        console.log('🔍 PLURAL REFERENCE FINDER');
        console.log('='.repeat(50));
        console.log('Checking token names, file names, and documentation references...');
        console.log();

        // Check JSON token files
        await this._checkJsonFiles();

        // Check documentation files
        await this._checkDocumentationFiles();

        // Check file and folder names
        await this._checkFileNames();

        return this.issues;
    }

    /**
     * Check JSON files for plural token references
     */
    async _checkJsonFiles() {
        console.log('📄 Checking JSON token files...');

        const jsonFiles = await glob('**/*.json', { cwd: this.baseDir });

        for (const jsonFile of jsonFiles) {
            const fullPath = path.join(this.baseDir, jsonFile);
            
            // Skip $themes.json (managed by Tokens Studio)
            if (path.basename(jsonFile).startsWith('$')) {
                continue;
            }

            // Skip files in _ignore-in-ds directory
            if (jsonFile.includes('_ignore-in-ds')) {
                continue;
            }

            try {
                const content = fs.readFileSync(fullPath, 'utf-8');

                // Check for plural token references in $value fields
                this._checkTokenReferences(content, fullPath);

                // Check JSON structure for plural keys (excluding Figma metadata)
                const data = JSON.parse(content);
                this._checkJsonStructure(data, fullPath);

            } catch (error) {
                console.log(`  ⚠️  Error reading ${jsonFile}: ${error.message}`);
            }
        }
    }

    /**
     * Check for plural references in token values and explicit token paths
     */
    _checkTokenReferences(content, filePath) {
        // Pattern for token references like {ob.s.colors.l1.interaction}
        const tokenPatterns = [
            /\{ob\.p\.colors\./g,  // Primitive colors (should be ob.p.color)
            /\{ob\.s\.colors\./g,  // Semantic colors (should be ob.s.color)
            /\{ob\.c\.colors\./g,  // Component colors (should be ob.c.color)
            /\{ob\.h\.colors\./g,  // HTML colors (should be ob.h.color)
            /ob\.p\.colors\./g,    // Direct primitive colors reference
            /ob\.s\.colors\./g,    // Direct semantic colors reference
            /ob\.c\.colors\./g,    // Direct component colors reference
            /ob\.h\.colors\./g,    // Direct HTML colors reference
            /semantics\/colors\//g,  // Should be semantic/color/
            /primitives\/colors\//g, // Should be primitive/color/
            /components\/colors\//g, // Should be component/color/
            /semantic\/colors\//g,   // Should be semantic/color/
            /primitive\/colors\//g,  // Should be primitive/color/
            /component\/colors\//g,  // Should be component/color/
        ];

        const lines = content.split('\n');

        for (const pattern of tokenPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                // Find the line number
                const lineNum = content.substring(0, match.index).split('\n').length;
                const lineContent = lines[lineNum - 1]?.trim() || '';

                this.issues.push({
                    type: 'token_reference',
                    file: filePath,
                    line: lineNum,
                    content: lineContent,
                    issue: `Plural token reference: ${match[0]}`
                });
            }
        }
    }

    /**
     * Check JSON structure for plural keys (excluding Figma metadata)
     */
    _checkJsonStructure(data, filePath, currentPath = '') {
        if (typeof data === 'object' && data !== null) {
            for (const [key, value] of Object.entries(data)) {
                const path = currentPath ? `${currentPath}.${key}` : key;

                // Skip Figma metadata fields
                if (['parent', 'description', 'oldValue'].includes(key)) {
                    continue;
                }

                // Skip $description fields (documentation)
                if (key.startsWith('$')) {
                    continue;
                }

                // Check for plural token names
                const pluralPatterns = [
                    /^colors$/,       // Root level "colors"
                    /^components$/,   // Root level "components"
                    /^semantics$/,    // Root level "semantics"
                    /^primitives$/,   // Root level "primitives"
                ];

                for (const pattern of pluralPatterns) {
                    if (pattern.test(key)) {
                        this.issues.push({
                            type: 'json_structure',
                            file: filePath,
                            path: path,
                            issue: `Plural key in JSON structure: '${key}'`
                        });
                    }
                }

                // Recurse into nested objects
                if (typeof value === 'object' && value !== null) {
                    this._checkJsonStructure(value, filePath, path);
                }
            }
        }
    }

    /**
     * Check documentation files for explicit token and file references
     */
    async _checkDocumentationFiles() {
        console.log('📝 Checking documentation files...');

        const docPatterns = ['**/*.md', '**/*.txt', '**/*.rst'];
        let docFiles = [];

        for (const pattern of docPatterns) {
            const files = await glob(pattern, { cwd: this.baseDir });
            docFiles = docFiles.concat(files);
        }

        for (const docFile of docFiles) {
            const fullPath = path.join(this.baseDir, docFile);

            // Skip script-generated report files
            if (docFile.includes('plural-references-report')) {
                continue;
            }

            // Skip historical reports that document old plural references
            if (docFile.includes('singular-plural-inconsistency-report')) {
                continue;
            }

            // Skip AI chat memory and historical reports
            if (docFile.includes('chat-memory') || docFile.includes('team-reports')) {
                continue;
            }

            try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                this._checkDocumentationContent(content, fullPath);
            } catch (error) {
                console.log(`  ⚠️  Error reading ${docFile}: ${error.message}`);
            }
        }
    }

    /**
     * Check documentation content for explicit token and file references
     */
    _checkDocumentationContent(content, filePath) {
        const lines = content.split('\n');

        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum];

            // Skip generic descriptions and titles
            if (this._isGenericDescription(line)) {
                continue;
            }

            // Check for explicit token references (these must be singular)
            const explicitPatterns = [
                /ob\.p\.colors\./g,    // Explicit primitive token reference
                /ob\.s\.colors\./g,    // Explicit semantic token reference
                /ob\.c\.colors\./g,    // Explicit component token reference
                /ob\.h\.colors\./g,    // Explicit HTML token reference
                /`semantics\/colors\//g,  // File path reference in code blocks
                /`primitives\/colors\//g, // File path reference in code blocks
                /`semantic\/colors\//g,   // File path reference in code blocks
                /`primitive\/colors\//g,  // File path reference in code blocks
                /`component\/colors\//g,  // File path reference in code blocks
                /`components\/colors\//g, // File path reference in code blocks
                /semantics\/colors\.json/g, // JSON file reference
                /primitives\/colors\.json/g, // JSON file reference
                /semantic\/colors\.json/g,   // JSON file reference
                /primitive\/colors\.json/g,  // JSON file reference
                /component\/colors\.json/g,  // JSON file reference
                /components\/colors\.json/g, // JSON file reference
                /colors\.json/g,           // Generic colors.json file reference
            ];

            for (const pattern of explicitPatterns) {
                let match;
                while ((match = pattern.exec(line)) !== null) {
                    this.issues.push({
                        type: 'documentation',
                        file: filePath,
                        line: lineNum + 1,
                        content: line.trim(),
                        issue: `Plural reference in documentation: ${match[0]}`
                    });
                }
            }
        }
    }

    /**
     * Check if a line contains generic description that should be excluded
     */
    _isGenericDescription(line) {
        // Skip headings and titles
        if (line.trim().startsWith('#')) {
            return true;
        }

        // Skip bullet points with generic descriptions
        if (/^\s*[-*]\s*\*\*\w+\s+Colors?\*\*\s*-/.test(line)) {
            return true;
        }

        // Skip table headers and generic content
        const genericPatterns = [
            /status colors/i,
            /interaction colors/i,
            /neutral colors/i,
            /emphasis colors/i,
            /semantic colors/i,
            /primitive colors/i,
            /component colors/i,
            /Colors?\s+(communicate|provide|handle)/i,
            /different\s+colors?/i,
            /color\s+system/i,
            /color\s+palette/i,
            /color\s+tokens?/i,
            /Interactive elements with emphasis levels/i,
            /elements with emphasis levels/i,
            /and states \(/i,
            /status\s+(states|information)/i,
            /different\s+(types|kinds|levels)/i,
            /various\s+(colors?|elements)/i,
        ];

        for (const pattern of genericPatterns) {
            if (pattern.test(line)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check file and folder names for plural patterns
     */
    async _checkFileNames() {
        console.log('📁 Checking file and folder names...');

        const allPaths = await glob('**/*', { cwd: this.baseDir });

        const pluralPatterns = [
            /\/colors\.json$/,      // File: colors.json (should be color.json)
            /\/colors\//,            // Folder: colors/ (should be color/)
            /\/components\.json$/,  // File: components.json
            /\/components\//,        // Folder: components/
            /\/semantics\.json$/,   // File: semantics.json
            /\/semantics\//,         // Folder: semantics/
            /\/primitives\.json$/,  // File: primitives.json
            /\/primitives\//,        // Folder: primitives/
        ];

        for (const pathStr of allPaths) {
            const fullPath = path.join(this.baseDir, pathStr);
            const basename = path.basename(pathStr);

            // Skip $themes.json and Tokens Studio files
            if (basename.startsWith('$') || pathStr.toLowerCase().includes('tokens-studio')) {
                continue;
            }

            // Skip .git and node_modules
            if (pathStr.includes('.git/') || pathStr.includes('node_modules/')) {
                continue;
            }

            // Skip AI chat memory and reports directories
            if (pathStr.includes('chat-memory') || pathStr.includes('team-reports')) {
                continue;
            }

            for (const pattern of pluralPatterns) {
                if (pattern.test(pathStr)) {
                    this.issues.push({
                        type: 'file_name',
                        file: fullPath,
                        issue: `Plural in file/folder name: ${basename}`
                    });
                }
            }
        }
    }

    /**
     * Print a comprehensive report of all plural references found
     */
    printReport() {
        if (this.issues.length === 0) {
            console.log('✅ NO PLURAL REFERENCES FOUND!');
            console.log('All token names, file names, and documentation references use singular naming.');
            return;
        }

        console.log(`\n🚨 FOUND ${this.issues.length} PLURAL REFERENCES`);
        console.log('='.repeat(50));

        // Group by type
        const byType = {};
        for (const issue of this.issues) {
            const issueType = issue.type;
            if (!(issueType in byType)) {
                byType[issueType] = [];
            }
            byType[issueType].push(issue);
        }

        // Print each type
        for (const [issueType, issues] of Object.entries(byType)) {
            console.log(`\n📋 ${issueType.toUpperCase().replace('_', ' ')} (${issues.length} issues)`);
            console.log('-'.repeat(30));

            for (const issue of issues) {
                if (issueType === 'token_reference') {
                    console.log(`  📄 ${issue.file}:${issue.line}`);
                    console.log(`     ${issue.issue}`);
                    console.log(`     Content: ${issue.content}`);
                } else if (issueType === 'json_structure') {
                    console.log(`  📄 ${issue.file}`);
                    console.log(`     Path: ${issue.path}`);
                    console.log(`     ${issue.issue}`);
                } else if (issueType === 'documentation') {
                    console.log(`  📝 ${issue.file}:${issue.line}`);
                    console.log(`     ${issue.issue}`);
                    console.log(`     Content: ${issue.content}`);
                } else if (issueType === 'file_name') {
                    console.log(`  📁 ${issue.file}`);
                    console.log(`     ${issue.issue}`);
                }

                console.log();
            }
        }
    }

    /**
     * Save the report to a file
     */
    saveReport(outputFile = 'plural-references-report.txt') {
        const lines = [];
        lines.push('PLURAL REFERENCE FINDER REPORT');
        lines.push('='.repeat(50));
        lines.push('');

        if (this.issues.length === 0) {
            lines.push('✅ NO PLURAL REFERENCES FOUND!');
            lines.push('All token names, file names, and documentation references use singular naming.');
            fs.writeFileSync(outputFile, lines.join('\n'));
            return;
        }

        lines.push(`Found ${this.issues.length} plural references:`);
        lines.push('');

        for (const issue of this.issues) {
            lines.push(`Type: ${issue.type}`);
            lines.push(`File: ${issue.file}`);
            if (issue.line) {
                lines.push(`Line: ${issue.line}`);
            }
            if (issue.path) {
                lines.push(`Path: ${issue.path}`);
            }
            lines.push(`Issue: ${issue.issue}`);
            if (issue.content) {
                lines.push(`Content: ${issue.content}`);
            }
            lines.push('-'.repeat(40));
            lines.push('');
        }

        fs.writeFileSync(outputFile, lines.join('\n'));
    }
}

/**
 * Main function to run the plural finder
 */
async function main() {
    const finder = new PluralFinder();
    const issues = await finder.findAllIssues();
    finder.printReport();

    // Save report
    if (issues.length > 0) {
        finder.saveReport();
        console.log('\n📊 Report saved to: plural-references-report.txt');
    }

    console.log(`\n🎯 SUMMARY: ${issues.length} plural references found`);

    return issues.length === 0;
}

if (require.main === module) {
    main().then(success => {
        if (!success) {
            process.exit(1);
        }
    }).catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}

module.exports = { PluralFinder, main };
