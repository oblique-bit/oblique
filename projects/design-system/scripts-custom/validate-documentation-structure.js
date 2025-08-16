#!/usr/bin/env node

/**
 * Documentation Structure Enforcement Script
 * This script ensures that the documentation folder contains only subdirectories (no files)
 * Per requirement: "in documentation folder there must be no file, but only folders"
 */

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.dirname(__dirname);
const DOCUMENTATION_DIR = path.join(PROJECT_DIR, 'documentation');

console.log('🔍 Enforcing documentation folder structure rules...');
console.log('   Rule: documentation folder should only contain subfolders, not files');

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
 * Main execution function.
 */
function main() {
    // Check if the documentation directory exists
    if (!fs.existsSync(DOCUMENTATION_DIR)) {
        console.log(`❌ Error: Documentation directory not found at ${DOCUMENTATION_DIR}`);
        process.exit(1);
    }
    
    // Get a list of files in the documentation directory (not directories)
    const filesToRemove = getFilesInDocumentationRoot();
    
    // Check if there are any files to remove
    if (filesToRemove.length === 0) {
        console.log('✅ Documentation structure is already correct (no files at root level)');
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
    } else {
        console.log('ℹ️ No files were removed');
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
    main 
};
