#!/usr/bin/env node

/**
 * Oblique Design System - Theme Reference Cleanup Script
 * 
 * This script cleans up orphaned references in $themes.json that remain
 * when tokens are deleted outside of Token Studio (e.g., via VS Code).
 * 
 * Based on Token Studio's cleanup patterns:
 * - removeStyleNamesFromThemes()
 * - removeVariableNamesFromThemes()
 * - figmaStyleReferences cleanup
 */

const fs = require('fs');
const path = require('path');

// Configuration
const THEMES_FILE = 'src/lib/themes/$themes.json';
const TOKEN_THEMES_DIR = 'src/lib/themes';
const BACKUP_DIR = '_private/backups/themes';

/**
 * Create timestamped backup of $themes.json
 */
function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `themes-${timestamp}.json`);
  
  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  // Copy themes file to backup
  fs.copyFileSync(THEMES_FILE, backupPath);
  console.log(`✅ Backup created: ${backupPath}`);
  return backupPath;
}

/**
 * Load and parse JSON file safely
 */
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Get all token paths from all token files
 */
function getAllValidTokenPaths() {
  const validTokens = new Set();
  
  function scanTokenFile(filePath) {
    const content = loadJSON(filePath);
    if (!content) return;
    
    function traverseTokens(obj, currentPath = '') {
      for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('$')) continue; // Skip metadata
        
        const tokenPath = currentPath ? `${currentPath}.${key}` : key;
        
        if (value && typeof value === 'object') {
          // Check if this is a token definition (has $value or $type)
          if (value.$value !== undefined || value.$type !== undefined) {
            validTokens.add(tokenPath);
          } else {
            // Continue traversing
            traverseTokens(value, tokenPath);
          }
        }
      }
    }
    
    traverseTokens(content);
  }
  
  // Scan all token files recursively
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isFile() && entry.name.endsWith('.json') && !entry.name.startsWith('$')) {
        scanTokenFile(fullPath);
      } else if (entry.isDirectory() && !entry.name.startsWith('$')) {
        scanDirectory(fullPath);
      }
    }
  }
  
  // Scan all theme directories
  scanDirectory(TOKEN_THEMES_DIR);
  
  return validTokens;
}

/**
 * Find orphaned references in themes
 */
function findOrphanedReferences(themes, validTokens) {
  const orphaned = {
    figmaStyleReferences: [],
    figmaVariableReferences: [],
    selectedTokenSets: []
  };
  
  themes.forEach((theme, themeIndex) => {
    // Check figmaStyleReferences
    if (theme.$figmaStyleReferences) {
      Object.keys(theme.$figmaStyleReferences).forEach(tokenPath => {
        if (!validTokens.has(tokenPath)) {
          orphaned.figmaStyleReferences.push({
            themeIndex,
            themeName: theme.name,
            tokenPath,
            styleId: theme.$figmaStyleReferences[tokenPath]
          });
        }
      });
    }
    
    // Check figmaVariableReferences
    if (theme.$figmaVariableReferences) {
      Object.keys(theme.$figmaVariableReferences).forEach(tokenPath => {
        if (!validTokens.has(tokenPath)) {
          orphaned.figmaVariableReferences.push({
            themeIndex,
            themeName: theme.name,
            tokenPath,
            variableId: theme.$figmaVariableReferences[tokenPath]
          });
        }
      });
    }
    
    // Check selectedTokenSets for non-existent token sets
    if (theme.selectedTokenSets) {
      Object.keys(theme.selectedTokenSets).forEach(tokenSet => {
        const tokenSetPath = path.join(TOKEN_THEMES_DIR, `${tokenSet}.json`);
        
        // Validate that the token set file exists
        if (!fs.existsSync(tokenSetPath)) {
          orphaned.selectedTokenSets.push({
            themeIndex,
            themeName: theme.name,
            tokenSet,
            status: theme.selectedTokenSets[tokenSet],
            expectedPath: tokenSetPath
          });
        }
      });
    }
  });
  
  return orphaned;
}

/**
 * Clean orphaned references from themes
 */
function cleanOrphanedReferences(themes, orphaned) {
  let cleaned = 0;
  const updatedThemes = JSON.parse(JSON.stringify(themes)); // Deep clone
  
  // Remove orphaned figmaStyleReferences
  orphaned.figmaStyleReferences.forEach(({ themeIndex, tokenPath }) => {
    if (updatedThemes[themeIndex].$figmaStyleReferences) {
      delete updatedThemes[themeIndex].$figmaStyleReferences[tokenPath];
      cleaned++;
      console.log(`🧹 Removed style reference: ${tokenPath} from theme "${updatedThemes[themeIndex].name}"`);
    }
  });
  
  // Remove orphaned figmaVariableReferences
  orphaned.figmaVariableReferences.forEach(({ themeIndex, tokenPath }) => {
    if (updatedThemes[themeIndex].$figmaVariableReferences) {
      delete updatedThemes[themeIndex].$figmaVariableReferences[tokenPath];
      cleaned++;
      console.log(`🧹 Removed variable reference: ${tokenPath} from theme "${updatedThemes[themeIndex].name}"`);
    }
  });
  
  // Remove orphaned selectedTokenSets
  orphaned.selectedTokenSets.forEach(({ themeIndex, tokenSet }) => {
    if (updatedThemes[themeIndex].selectedTokenSets) {
      delete updatedThemes[themeIndex].selectedTokenSets[tokenSet];
      cleaned++;
      console.log(`🧹 Removed token set: ${tokenSet} from theme "${updatedThemes[themeIndex].name}"`);
    }
  });
  
  return { updatedThemes, cleaned };
}

/**
 * Main cleanup function
 */
function main() {
  console.log('🔍 Oblique Design System - Theme Reference Cleanup');
  console.log('=====================================================');
  
  // Create backup
  const backupPath = createBackup();
  
  // Load themes file
  console.log('📖 Loading $themes.json...');
  const themesData = loadJSON(THEMES_FILE);
  if (!themesData) {
    console.error('❌ Failed to load themes file');
    process.exit(1);
  }
  
  const themes = Array.isArray(themesData) ? themesData : (themesData.themes || []);
  console.log(`✅ Loaded ${themes.length} themes`);
  
  // Get all valid token paths
  console.log('🔍 Scanning token files...');
  const validTokens = getAllValidTokenPaths();
  console.log(`✅ Found ${validTokens.size} valid tokens`);
  
  // Also count valid token set files
  const allTokenSetRefs = new Set();
  themes.forEach(theme => {
    if (theme.selectedTokenSets) {
      Object.keys(theme.selectedTokenSets).forEach(tokenSet => {
        allTokenSetRefs.add(tokenSet);
      });
    }
  });
  console.log(`📁 Found ${allTokenSetRefs.size} unique token set references`);;
  
  // Find orphaned references
  console.log('🕵️ Finding orphaned references...');
  const orphaned = findOrphanedReferences(themes, validTokens);
  
  const totalOrphaned = orphaned.figmaStyleReferences.length + 
                       orphaned.figmaVariableReferences.length + 
                       orphaned.selectedTokenSets.length;
  
  if (totalOrphaned === 0) {
    console.log('✅ No orphaned references found! $themes.json is clean.');
    return;
  }
  
  console.log(`\n⚠️ Found ${totalOrphaned} orphaned references:`);
  console.log(`   - ${orphaned.figmaStyleReferences.length} style references`);
  console.log(`   - ${orphaned.figmaVariableReferences.length} variable references`);
  console.log(`   - ${orphaned.selectedTokenSets.length} token set references`);
  
  // List orphaned references
  if (orphaned.figmaStyleReferences.length > 0) {
    console.log('\n📋 Orphaned Style References:');
    orphaned.figmaStyleReferences.forEach(({ themeName, tokenPath, styleId }) => {
      console.log(`   - ${tokenPath} (${styleId}) in theme "${themeName}"`);
    });
  }
  
  if (orphaned.figmaVariableReferences.length > 0) {
    console.log('\n📋 Orphaned Variable References:');
    orphaned.figmaVariableReferences.forEach(({ themeName, tokenPath, variableId }) => {
      console.log(`   - ${tokenPath} (${variableId}) in theme "${themeName}"`);
    });
  }
  
  if (orphaned.selectedTokenSets.length > 0) {
    console.log('\n📋 Orphaned Token Set References:');
    orphaned.selectedTokenSets.forEach(({ themeName, tokenSet, status, expectedPath }) => {
      console.log(`   - ${tokenSet} (${status}) in theme "${themeName}"`);
      console.log(`     Expected: ${expectedPath}`);
    });
  }
  
  // Clean orphaned references
  console.log('\n🧹 Cleaning orphaned references...');
  const { updatedThemes, cleaned } = cleanOrphanedReferences(themes, orphaned);
  
  // Update themes file
  const updatedThemesData = Array.isArray(themesData) ? updatedThemes : {
    ...themesData,
    themes: updatedThemes
  };
  
  try {
    fs.writeFileSync(THEMES_FILE, JSON.stringify(updatedThemesData, null, 2));
    console.log(`\n✅ Cleanup complete! Removed ${cleaned} orphaned references.`);
    console.log(`📁 Backup available at: ${backupPath}`);
    console.log(`📝 Updated: ${THEMES_FILE}`);
  } catch (error) {
    console.error('❌ Error writing updated themes file:', error.message);
    console.log(`🔄 You can restore from backup: ${backupPath}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createBackup,
  getAllValidTokenPaths,
  findOrphanedReferences,
  cleanOrphanedReferences
};