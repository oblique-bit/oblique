#!/usr/bin/env node

/**
 * Documentation Structure Enforcement Script
 * This script ensures that:
 * 1. The documentation folder contains only subdirectories (no files)
 * 2. All .md files have lowercase extensions (.MD → .md)
 * Per requirements: "in documentation folder there must be no file, but only folders" 
 *                   "i wanna have lowercase for all .md"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_DIR = path.dirname(__dirname);
const DOCUMENTATION_DIR = path.join(PROJECT_DIR, 'documentation');

console.log('🔍 Enforcing documentation folder structure rules...');
console.log('   Rule 1: documentation folder should only contain subfolders, not files');
console.log('   Rule 2: all .md files should have lowercase extensions (.MD → .md)');

/**
 * Get files (not directories) in the documentation directory.
 */
function getFilesInDocumentationRoot() {
    try {
        const entries = fs.readdirSync(DOCUMENTATION_DIR);
        const files = [];
        
        for (const entry of entries) {
            const fullPath = path.join(DOCUMENTATION_DIR, entry);
            const stats = fs.statSync(fullPath);
            
            if (stats.isFile()) {
                files.push(fullPath);
            }
        }
        
        return files;
    } catch (error) {
        console.log(`❌ Error reading documentation directory: ${error.message}`);
        return [];
    }
}

/**
 * Find and normalize .MD files to .md (case normalization)
 */
function normalizeMarkdownCases() {
    try {
        const result = execSync(
            'find . -name "*.MD" | grep -v node_modules | sort',
            { cwd: PROJECT_DIR, encoding: 'utf-8' }
        );
        const mdFiles = result.trim().split('\n').filter(line => line.length > 0);
        
        if (mdFiles.length === 0) {
            console.log('✅ All .md files already have correct lowercase extensions');
            return 0;
        }
        
        console.log(`🔤 Found ${mdFiles.length} .MD files to normalize to .md`);
        let normalizedCount = 0;
        
        for (const filePath of mdFiles) {
            const fullPath = path.join(PROJECT_DIR, filePath);
            const dir = path.dirname(fullPath);
            const fileName = path.basename(fullPath);
            const normalizedFileName = fileName.replace(/\.MD$/, '.md');
            const normalizedPath = path.join(dir, normalizedFileName);
            
            try {
                fs.renameSync(fullPath, normalizedPath);
                console.log(`✅ Normalized: ${filePath} → ${filePath.replace(/\.MD$/, '.md')}`);
                normalizedCount++;
            } catch (error) {
                console.log(`❌ Error normalizing ${filePath}: ${error.message}`);
            }
        }
        
        return normalizedCount;
    } catch (error) {
        console.log('ℹ️ No .MD files found to normalize');
        return 0;
    }
}

/**
 * Main execution function.
 */
function main() {
    // Step 1: Normalize .MD files to .md across the entire project
    console.log('\n🔤 Step 1: Normalizing markdown file extensions...');
    const normalizedCount = normalizeMarkdownCases();
    
    // Step 2: Check if the documentation directory exists
    if (!fs.existsSync(DOCUMENTATION_DIR)) {
        console.log(`❌ Error: Documentation directory not found at ${DOCUMENTATION_DIR}`);
        process.exit(1);
    }
    
    console.log('\n📁 Step 2: Checking documentation folder structure...');
    
    // Get a list of files in the documentation directory (not directories)
    const filesToRemove = getFilesInDocumentationRoot();
    
    // Check if there are any files to remove
    if (filesToRemove.length === 0) {
        console.log('✅ Documentation structure is already correct (no files at root level)');
        
        if (normalizedCount > 0) {
            console.log(`\n📊 Summary: Normalized ${normalizedCount} .MD files to .md`);
        } else {
            console.log('\n📊 Summary: No changes needed - everything is properly organized');
        }
        process.exit(0);
    }
    
    // Count the files
    const fileCount = filesToRemove.length;
    console.log(`⚠️ Found ${fileCount} files directly in documentation folder (should be in subfolders)`);
    
    // Process each file
    const removedFiles = [];
    const preservedFiles = [];
    
    for (const filePath of filesToRemove) {
        const fileName = path.basename(filePath);
        
        // Skip .DS_Store and other hidden files
        if (fileName.startsWith('.')) {
            console.log(`⏩ Skipping hidden file: ${fileName}`);
            continue;
        }
        
        console.log(`🗑️ Removing file: ${filePath}`);
        try {
            fs.unlinkSync(filePath);
            removedFiles.push(filePath);
        } catch (error) {
            console.log(`❌ Error removing ${filePath}: ${error.message}`);
            preservedFiles.push(filePath);
        }
    }
    
    // Log the cleanup if any files were removed
    if (removedFiles.length > 0) {
        console.log('');
        console.log('📝 Cleanup summary:');
        for (const filePath of removedFiles) {
            console.log(`  ✅ Removed: ${path.basename(filePath)}`);
        }
        
        console.log(`🧹 Cleaned up ${removedFiles.length} files from documentation root folder`);
        console.log('✅ Documentation structure now follows the rule: only subfolders, no files');
        
        if (normalizedCount > 0) {
            console.log(`🔤 Also normalized ${normalizedCount} .MD files to .md extensions`);
        }
    } else {
        console.log('ℹ️ No files were removed from documentation root');
        
        if (normalizedCount > 0) {
            console.log(`🔤 But normalized ${normalizedCount} .MD files to .md extensions`);
        }
    }
    
    // Exit with appropriate code
    process.exit(preservedFiles.length > 0 ? 1 : 0);
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { 
    getFilesInDocumentationRoot,
    normalizeMarkdownCases,
    main 
};
