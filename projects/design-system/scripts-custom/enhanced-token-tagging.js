/**
 * Enhanced Token Tagging and Organization Strategy
 * Purpose: Distinguish between different content categories in the design system
 * Date: September 18, 2025
 */

const path = require('path');
const fs = require('fs');

// Configuration for different content types
const CONTENT_CATEGORIES = {
    // Content exclusively for Figma design workflow
    FIGMA_ONLY: {
        tag: '[FIGMA-ONLY]',
        description: 'Design workflow only - not included in code implementation',
        folders: ['_FIGMA-ONLY/figma-doc/', '_FIGMA-ONLY/typography-styles-R13.json']
    },
    
    // Content for current ongoing releases (R13, etc.)
    CURRENT_RELEASE: {
        tag: '[R13-LEGACY]',
        description: 'Current release tokens - maintained for ongoing production applications',
        patterns: ['*R13*', '*r13*', '*legacy*']
    },
    
    // Content for the future design system project (99% of content)
    DESIGN_SYSTEM: {
        tag: '[DESIGN-SYSTEM]',
        description: 'Future design system architecture - main development focus',
        isDefault: true
    },
    
    // Content that serves both current releases AND design system
    BRIDGE_CONTENT: {
        tag: '[BRIDGE]',
        description: 'Shared between current releases and design system'
    }
};

// Function to analyze and categorize existing content
async function analyzeAndCategorizeTokens() {
    const themesPath = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
    
    console.log('🏷️ ENHANCED TOKEN CATEGORIZATION ANALYSIS');
    console.log('=====================================');
    
    const results = {
        figmaOnly: [],
        currentRelease: [],
        designSystem: [],
        bridgeContent: [],
        needsReview: []
    };
    
    // Function to recursively scan files
    function scanDirectory(dirPath, category = null) {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            const relativePath = path.relative(themesPath, fullPath);
            
            if (item.isDirectory()) {
                // Determine category for subdirectories
                let subCategory = category;
                
                if (relativePath.includes('_FIGMA-ONLY')) {
                    subCategory = 'figmaOnly';
                } else if (relativePath.includes('R13') || relativePath.includes('r13') || relativePath.includes('legacy')) {
                    subCategory = 'currentRelease';
                } else if (!category) {
                    subCategory = 'designSystem'; // Default for main content
                }
                
                scanDirectory(fullPath, subCategory);
                
            } else if (item.name.endsWith('.json')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    
                    // Skip empty files
                    if (content.trim().length === 0) {
                        results.needsReview.push({
                            path: relativePath,
                            reason: 'Empty file',
                            suggestedAction: 'Delete or populate'
                        });
                        continue;
                    }
                    
                    const jsonData = JSON.parse(content);
                    
                    // Analyze content for categorization clues
                    const contentStr = content.toLowerCase();
                    let detectedCategory = category;
                    
                    if (!detectedCategory) {
                        if (relativePath.includes('_FIGMA-ONLY') || contentStr.includes('[figma-only]')) {
                            detectedCategory = 'figmaOnly';
                        } else if (relativePath.includes('R13') || relativePath.includes('r13') || 
                                 contentStr.includes('r13') || contentStr.includes('R13')) {
                            detectedCategory = 'currentRelease';
                        } else {
                            detectedCategory = 'designSystem';
                        }
                    }
                    
                    const fileInfo = {
                        path: relativePath,
                        category: detectedCategory,
                        tokenCount: countTokens(jsonData),
                        hasExistingTags: contentStr.includes('[figma-only]') || 
                                       contentStr.includes('[r13-legacy]') ||
                                       contentStr.includes('[design-system]')
                    };
                    
                    results[detectedCategory].push(fileInfo);
                    
                } catch (error) {
                    results.needsReview.push({
                        path: relativePath,
                        reason: `JSON parse error: ${error.message}`,
                        suggestedAction: 'Fix JSON syntax'
                    });
                }
            }
        }
    }
    
    // Helper function to count tokens in JSON structure
    function countTokens(obj, count = 0) {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                if (obj[key].$value !== undefined) {
                    count++;
                } else {
                    count = countTokens(obj[key], count);
                }
            }
        }
        return count;
    }
    
    // Start scanning
    scanDirectory(themesPath);
    
    // Generate report
    console.log('\n📊 CATEGORIZATION RESULTS:');
    console.log('========================');
    
    console.log(`\n🎨 FIGMA-ONLY Content: ${results.figmaOnly.length} files`);
    results.figmaOnly.forEach(file => {
        console.log(`   • ${file.path} (${file.tokenCount} tokens) ${file.hasExistingTags ? '✅' : '❌'}`);
    });
    
    console.log(`\n⚙️  CURRENT RELEASE (R13-LEGACY) Content: ${results.currentRelease.length} files`);
    results.currentRelease.forEach(file => {
        console.log(`   • ${file.path} (${file.tokenCount} tokens) ${file.hasExistingTags ? '✅' : '❌'}`);
    });
    
    console.log(`\n🚀 DESIGN SYSTEM Content: ${results.designSystem.length} files`);
    const dsTotal = results.designSystem.reduce((sum, file) => sum + file.tokenCount, 0);
    console.log(`   Total tokens: ${dsTotal}`);
    console.log(`   Percentage: ${Math.round((dsTotal / (dsTotal + results.figmaOnly.reduce((s,f) => s + f.tokenCount, 0) + results.currentRelease.reduce((s,f) => s + f.tokenCount, 0))) * 100)}%`);
    
    if (results.needsReview.length > 0) {
        console.log(`\n⚠️  NEEDS REVIEW: ${results.needsReview.length} files`);
        results.needsReview.forEach(file => {
            console.log(`   • ${file.path}: ${file.reason} (${file.suggestedAction})`);
        });
    }
    
    return results;
}

// Function to apply enhanced tagging strategy
async function applyEnhancedTagging(dryRun = true) {
    console.log('\n🏷️ APPLYING ENHANCED TAGGING STRATEGY');
    console.log('===================================');
    
    if (dryRun) {
        console.log('🔍 DRY RUN MODE - No files will be modified');
    }
    
    const results = await analyzeAndCategorizeTokens();
    const changes = [];
    
    // Process each category
    for (const [categoryKey, files] of Object.entries(results)) {
        if (categoryKey === 'needsReview') continue;
        
        const config = getCategoryConfig(categoryKey);
        
        for (const file of files) {
            if (!file.hasExistingTags) {
                const change = {
                    file: file.path,
                    action: 'add_tag',
                    tag: config.tag,
                    description: config.description
                };
                
                changes.push(change);
                
                if (!dryRun) {
                    await addTagToFile(file.path, config);
                }
            }
        }
    }
    
    // Report planned/completed changes
    console.log(`\n📝 ${dryRun ? 'PLANNED' : 'COMPLETED'} CHANGES:`);
    changes.forEach(change => {
        console.log(`   • ${change.file}: ${change.action} → ${change.tag}`);
    });
    
    return changes;
}

// Helper function to get category configuration
function getCategoryConfig(categoryKey) {
    const configMap = {
        figmaOnly: CONTENT_CATEGORIES.FIGMA_ONLY,
        currentRelease: CONTENT_CATEGORIES.CURRENT_RELEASE,
        designSystem: CONTENT_CATEGORIES.DESIGN_SYSTEM,
        bridgeContent: CONTENT_CATEGORIES.BRIDGE_CONTENT
    };
    
    return configMap[categoryKey] || CONTENT_CATEGORIES.DESIGN_SYSTEM;
}

// Function to add tags to specific files
async function addTagToFile(relativePath, config) {
    const fullPath = path.join('/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes', relativePath);
    
    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const jsonData = JSON.parse(content);
        
        // Add tags to token descriptions
        const updatedJson = addTagsToTokens(jsonData, config);
        
        // Write back with pretty formatting
        fs.writeFileSync(fullPath, JSON.stringify(updatedJson, null, 2));
        
        console.log(`✅ Tagged: ${relativePath}`);
        
    } catch (error) {
        console.error(`❌ Error tagging ${relativePath}: ${error.message}`);
    }
}

// Recursive function to add tags to token descriptions
function addTagsToTokens(obj, config) {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (obj[key].$value !== undefined) {
                // This is a token, add/update description
                const existingDesc = obj[key].$description || '';
                
                if (!existingDesc.includes(config.tag)) {
                    obj[key].$description = `${config.tag}\n${config.description}${existingDesc ? '\n' + existingDesc : ''}`;
                }
            } else {
                // Recurse into nested objects
                obj[key] = addTagsToTokens(obj[key], config);
            }
        }
    }
    return obj;
}

// Export functions for command line usage
module.exports = {
    analyzeAndCategorizeTokens,
    applyEnhancedTagging,
    CONTENT_CATEGORIES
};

// Command line interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--analyze')) {
        analyzeAndCategorizeTokens();
    } else if (args.includes('--apply')) {
        const dryRun = !args.includes('--commit');
        applyEnhancedTagging(dryRun);
    } else {
        console.log(`
🏷️ Enhanced Token Tagging System

Usage:
  node enhanced-token-tagging.js --analyze                    # Analyze current content
  node enhanced-token-tagging.js --apply                     # Dry run (preview changes)
  node enhanced-token-tagging.js --apply --commit            # Apply changes

Categories:
  [FIGMA-ONLY]     - Design workflow only
  [R13-LEGACY]     - Current release tokens  
  [DESIGN-SYSTEM]  - Future design system (99% of content)
  [BRIDGE]         - Shared between current and future
        `);
    }
}
