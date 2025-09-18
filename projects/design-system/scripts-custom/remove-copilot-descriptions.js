/**
 * Remove Copilot-Generated $description Tokens
 * Purpose: Remove AI-generated $description tokens that were created as actual token definitions
 * Date: September 18, 2025
 */

const fs = require('fs');
const path = require('path');

async function removeCopilotDescriptionTokens() {
    console.log('🔍 SCANNING FOR COPILOT-GENERATED $DESCRIPTION TOKENS');
    console.log('==================================================');
    
    const themesPath = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
    let totalFound = 0;
    let totalRemoved = 0;
    const modifiedFiles = [];
    
    // Function to recursively find and remove $description tokens
    function removeDescriptionTokens(obj, currentPath = '') {
        let removedFromThis = 0;
        
        for (const key in obj) {
            if (key === '$description' && typeof obj[key] === 'object' && obj[key].$type && obj[key].$value) {
                // This is a Copilot-generated $description token
                console.log(`  Found: ${currentPath}.$description = "${obj[key].$value}"`);
                delete obj[key];
                totalFound++;
                totalRemoved++;
                removedFromThis++;
            } else if (typeof obj[key] === 'object' && obj[key] !== null && key !== '$description') {
                // Recurse into nested objects (but skip regular $description properties)
                const childPath = currentPath ? `${currentPath}.${key}` : key;
                const childRemoved = removeDescriptionTokens(obj[key], childPath);
                removedFromThis += childRemoved;
            }
        }
        
        return removedFromThis;
    }
    
    // Function to process a single file
    function processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(content);
            const relativePath = path.relative(themesPath, filePath);
            
            console.log(`\n📄 Processing: ${relativePath}`);
            const removedCount = removeDescriptionTokens(jsonData, '');
            
            if (removedCount > 0) {
                // Write back with pretty formatting
                fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
                modifiedFiles.push(relativePath);
                console.log(`✅ Removed ${removedCount} $description tokens from ${relativePath}`);
            } else {
                console.log(`   No $description tokens found`);
            }
            
        } catch (error) {
            console.error(`❌ Error processing ${filePath}: ${error.message}`);
        }
    }
    
    // Function to recursively scan directories
    function scanDirectory(dirPath) {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            
            if (item.isDirectory()) {
                scanDirectory(fullPath);
            } else if (item.name.endsWith('.json')) {
                processFile(fullPath);
            }
        }
    }
    
    // Start scanning from themes directory
    scanDirectory(themesPath);
    
    // Generate summary report
    console.log('\n' + '='.repeat(60));
    console.log('📊 CLEANUP SUMMARY');
    console.log('='.repeat(60));
    console.log(`Copilot $description tokens found: ${totalFound}`);
    console.log(`Copilot $description tokens removed: ${totalRemoved}`);
    console.log(`Files modified: ${modifiedFiles.length}`);
    
    if (modifiedFiles.length > 0) {
        console.log('\n📁 Modified files:');
        modifiedFiles.forEach(file => {
            console.log(`   • ${file}`);
        });
    }
    
    console.log('\n💡 These were AI-generated description tokens that became actual token definitions.');
    console.log('   Regular $description properties (part of W3C spec) were preserved.');
    
    return {
        totalFound,
        totalRemoved,
        modifiedFiles
    };
}

// Command line interface
if (require.main === module) {
    removeCopilotDescriptionTokens().catch(console.error);
}

module.exports = { removeCopilotDescriptionTokens };
