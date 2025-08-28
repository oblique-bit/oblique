#!/usr/bin/env node

/**
 * Intelligent File Renamer with Reference Update
 * 
 * Automatically renames files and updates ALL references throughout the workspace.
 * This ensures no broken references are left behind after file renames.
 * 
 * COMMANDS:
 *     node rename-file.js <old-path> <new-path>  - Rename file and update all references
 *     node rename-file.js --scan                 - Scan for potential broken references
 *     node rename-file.js --help                 - Show this help message
 * 
 * USAGE CONTEXT:
 * Manual file renaming consistently left broken references throughout the codebase,
 * requiring tedious manual updates across documentation, imports, command examples,
 * and configuration files. This created maintenance overhead and unreliable systems
 * where scripts and documentation referenced non-existent files. The team needed
 * an automated solution that would rename files AND update all references in a
 * single atomic operation. This script provides intelligent reference detection
 * and updates across multiple file types, ensuring system integrity after renames.
 * Essential for maintaining consistent file references and preventing broken links.
 * 
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 * CREATED: 2025-08-28
 * LAST_EDITED: 2025-08-28
 * LAST_RUN: 2025-08-28
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class IntelligentFileRenamer {
    constructor(workspaceRoot = '.') {
        this.workspaceRoot = path.resolve(workspaceRoot);
        this.searchPatterns = [
            '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx',
            '**/*.md', '**/*.json', '**/*.yml', '**/*.yaml',
            '**/*.html', '**/*.css', '**/*.scss',
            '**/package.json', '**/README*', '**/.*rc*'
        ];
        this.excludePatterns = [
            'node_modules/**',
            '.git/**',
            'dist/**',
            'build/**',
            '**/*.log'
        ];
    }

    /**
     * Main rename operation with reference updates
     */
    async renameWithReferences(oldPath, newPath) {
        console.log('🔄 INTELLIGENT FILE RENAMER');
        console.log('='.repeat(50));
        
        const oldFullPath = path.resolve(this.workspaceRoot, oldPath);
        const newFullPath = path.resolve(this.workspaceRoot, newPath);
        
        // Validate inputs
        if (!fs.existsSync(oldFullPath)) {
            console.error(`❌ Source file does not exist: ${oldPath}`);
            return false;
        }
        
        if (fs.existsSync(newFullPath)) {
            console.error(`❌ Target file already exists: ${newPath}`);
            return false;
        }
        
        // Ensure target directory exists
        const targetDir = path.dirname(newFullPath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            console.log(`📁 Created directory: ${path.dirname(newPath)}`);
        }
        
        console.log(`📝 Renaming: ${oldPath} → ${newPath}`);
        
        // Step 1: Find all references
        const references = await this.findAllReferences(oldPath);
        
        if (references.length === 0) {
            console.log('📄 No references found in workspace');
        } else {
            console.log(`🔍 Found ${references.length} references to update:`);
            references.forEach(ref => {
                console.log(`   📄 ${ref.file}:${ref.line} - "${ref.context}"`);
            });
        }
        
        // Step 2: Update all references BEFORE renaming
        let updateCount = 0;
        for (const ref of references) {
            if (await this.updateReference(ref, oldPath, newPath)) {
                updateCount++;
            }
        }
        
        // Step 3: Rename the actual file
        try {
            fs.renameSync(oldFullPath, newFullPath);
            console.log(`✅ File renamed successfully`);
        } catch (error) {
            console.error(`❌ Failed to rename file: ${error.message}`);
            return false;
        }
        
        // Summary
        console.log('\n📊 RENAME SUMMARY');
        console.log('='.repeat(30));
        console.log(`✅ File renamed: ${oldPath} → ${newPath}`);
        console.log(`✅ References updated: ${updateCount}/${references.length}`);
        
        if (updateCount === references.length) {
            console.log('🎉 All references successfully updated!');
            return true;
        } else {
            console.log('⚠️  Some references may need manual review');
            return false;
        }
    }
    
    /**
     * Find all references to a file throughout the workspace
     */
    async findAllReferences(filePath) {
        const references = [];
        const fileName = path.basename(filePath);
        const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
        
        // Get all files to search
        const searchFiles = await this.getSearchFiles();
        
        for (const file of searchFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const lines = content.split('\n');
                
                lines.forEach((line, index) => {
                    const lineNum = index + 1;
                    
                    // Search for various reference patterns
                    const patterns = [
                        // Exact file path
                        new RegExp(`\\b${this.escapeRegex(filePath)}\\b`, 'gi'),
                        // Just filename
                        new RegExp(`\\b${this.escapeRegex(fileName)}\\b`, 'gi'),
                        // Filename without extension
                        new RegExp(`\\b${this.escapeRegex(fileNameWithoutExt)}\\b`, 'gi'),
                        // Node require/import patterns
                        new RegExp(`['"\`]([^'"\`]*${this.escapeRegex(fileNameWithoutExt)}[^'"\`]*)['"\`]`, 'gi'),
                        // Script execution patterns
                        new RegExp(`node\\s+[^\\s]*${this.escapeRegex(fileName)}`, 'gi'),
                        // Markdown link patterns
                        new RegExp(`\\[([^\\]]*)]\\([^\\)]*${this.escapeRegex(fileName)}[^\\)]*\\)`, 'gi'),
                    ];
                    
                    patterns.forEach(pattern => {
                        let match;
                        while ((match = pattern.exec(line)) !== null) {
                            references.push({
                                file: file,
                                line: lineNum,
                                column: match.index,
                                match: match[0],
                                context: line.trim(),
                                pattern: pattern.toString()
                            });
                        }
                    });
                });
            } catch (error) {
                // Skip files that can't be read
                continue;
            }
        }
        
        // Remove duplicates and self-references
        return this.deduplicateReferences(references, filePath);
    }
    
    /**
     * Update a specific reference in a file
     */
    async updateReference(reference, oldPath, newPath) {
        try {
            const content = fs.readFileSync(reference.file, 'utf8');
            const fileName = path.basename(oldPath);
            const newFileName = path.basename(newPath);
            const fileNameWithoutExt = path.basename(oldPath, path.extname(oldPath));
            const newFileNameWithoutExt = path.basename(newPath, path.extname(newPath));
            
            let updatedContent = content;
            
            // Apply various replacement strategies
            const replacements = [
                // Full path replacement
                { from: oldPath, to: newPath },
                // Filename replacement
                { from: fileName, to: newFileName },
                // Filename without extension replacement
                { from: fileNameWithoutExt, to: newFileNameWithoutExt },
            ];
            
            let wasUpdated = false;
            replacements.forEach(repl => {
                if (updatedContent.includes(repl.from)) {
                    updatedContent = updatedContent.replace(new RegExp(this.escapeRegex(repl.from), 'g'), repl.to);
                    wasUpdated = true;
                }
            });
            
            if (wasUpdated) {
                fs.writeFileSync(reference.file, updatedContent);
                console.log(`   ✅ Updated ${reference.file}`);
                return true;
            }
            
        } catch (error) {
            console.log(`   ❌ Failed to update ${reference.file}: ${error.message}`);
        }
        
        return false;
    }
    
    /**
     * Get all files to search for references
     */
    async getSearchFiles() {
        let allFiles = [];
        
        for (const pattern of this.searchPatterns) {
            try {
                const files = await glob(pattern, {
                    cwd: this.workspaceRoot,
                    absolute: true,
                    ignore: this.excludePatterns
                });
                allFiles = allFiles.concat(files);
            } catch (error) {
                // Continue if glob pattern fails
                continue;
            }
        }
        
        // Remove duplicates
        return [...new Set(allFiles)];
    }
    
    /**
     * Remove duplicate references and self-references
     */
    deduplicateReferences(references, targetFile) {
        const seen = new Set();
        const targetPath = path.resolve(this.workspaceRoot, targetFile);
        
        return references.filter(ref => {
            // Skip self-references
            if (path.resolve(ref.file) === targetPath) {
                return false;
            }
            
            const key = `${ref.file}:${ref.line}:${ref.column}:${ref.match}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
    
    /**
     * Escape string for regex
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * Scan workspace for potentially broken references
     */
    async scanForBrokenReferences() {
        console.log('🔍 SCANNING FOR BROKEN REFERENCES');
        console.log('='.repeat(50));
        
        const searchFiles = await this.getSearchFiles();
        const brokenRefs = [];
        
        for (const file of searchFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const lines = content.split('\n');
                
                lines.forEach((line, index) => {
                    // Look for script execution patterns
                    const scriptMatches = line.match(/node\s+([^\s]+\.js)/g);
                    if (scriptMatches) {
                        scriptMatches.forEach(match => {
                            const scriptPath = match.replace(/^node\s+/, '');
                            const fullPath = path.resolve(this.workspaceRoot, scriptPath);
                            if (!fs.existsSync(fullPath)) {
                                brokenRefs.push({
                                    file: file,
                                    line: index + 1,
                                    issue: `Script not found: ${scriptPath}`,
                                    context: line.trim()
                                });
                            }
                        });
                    }
                    
                    // Look for require/import patterns
                    const importMatches = line.match(/(?:require|import).*['"`]([^'"`]+\.js)['"`]/g);
                    if (importMatches) {
                        importMatches.forEach(match => {
                            const moduleMatch = match.match(/['"`]([^'"`]+\.js)['"`]/);
                            if (moduleMatch && moduleMatch[1].startsWith('.')) {
                                const modulePath = path.resolve(path.dirname(file), moduleMatch[1]);
                                if (!fs.existsSync(modulePath)) {
                                    brokenRefs.push({
                                        file: file,
                                        line: index + 1,
                                        issue: `Module not found: ${moduleMatch[1]}`,
                                        context: line.trim()
                                    });
                                }
                            }
                        });
                    }
                });
            } catch (error) {
                continue;
            }
        }
        
        if (brokenRefs.length === 0) {
            console.log('✅ No broken references found!');
        } else {
            console.log(`❌ Found ${brokenRefs.length} potentially broken references:`);
            brokenRefs.forEach(ref => {
                console.log(`   📄 ${ref.file}:${ref.line} - ${ref.issue}`);
                console.log(`      "${ref.context}"`);
            });
        }
        
        return brokenRefs;
    }
}

/**
 * CLI Interface
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args.includes('--help')) {
        console.log('🔄 Intelligent File Renamer');
        console.log('');
        console.log('Usage:');
        console.log('  node rename-file.js <old-path> <new-path>  - Rename file and update references');
        console.log('  node rename-file.js --scan                 - Scan for broken references');
        console.log('  node rename-file.js --help                 - Show this help');
        console.log('');
        console.log('Examples:');
        console.log('  node rename-file.js scripts/old-name.js scripts/new-name.js');
        console.log('  node rename-file.js validate-orchestrator.js validate-all.js');
        console.log('  node rename-file.js --scan');
        return;
    }
    
    const renamer = new IntelligentFileRenamer();
    
    if (args[0] === '--scan') {
        await renamer.scanForBrokenReferences();
    } else if (args.length === 2) {
        const success = await renamer.renameWithReferences(args[0], args[1]);
        process.exit(success ? 0 : 1);
    } else {
        console.error('❌ Invalid arguments. Use --help for usage information.');
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Error:', error.message);
        process.exit(1);
    });
}

module.exports = { IntelligentFileRenamer };
