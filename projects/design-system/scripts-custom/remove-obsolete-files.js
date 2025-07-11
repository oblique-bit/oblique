#!/usr/bin/env node

/**
 * Remove Obsolete Files Script
 * Eliminates untracked obsolete files that shouldn't exist in the design system
 * These are typically deprecated files from previous refactoring iterations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗑️  OBSOLETE FILE REMOVER ACTIVATED 🗑️ ');
console.log('Searching for untracked obsolete files...\n');

// Get all untracked files
try {
  const untrackedFiles = execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(file => file.length > 0);

  if (untrackedFiles.length === 0) {
    console.log('✅ No obsolete files found! Your repo is clean.');
    process.exit(0);
  }

  console.log(`Found ${untrackedFiles.length} untracked files:\n`);

  // Define obsolete file patterns - files that are known to be deprecated
  const obsoletePatterns = [
    // Obsolete emphasis files
    /src\/lib\/themes\/semantics\/colors\/emphasis\/neutral\.json$/,
    /src\/lib\/themes\/semantics\/colors\/emphasis\/status\.json$/,
    
    // Obsolete inversity files (renamed from default/inverse to normal/flipped)
    /src\/lib\/themes\/semantics\/colors\/inversity\/default\.json$/,
    /src\/lib\/themes\/semantics\/colors\/inversity\/inverse\.json$/,
    
    // Obsolete component inversity folders
    /src\/lib\/themes\/html\/.*\/inversity\/.*\.json$/,
    
    // Temporary or backup files
    /\.tmp$/,
    /\.bak$/,
    /\.backup$/,
    /_backup\./,
    
    // AI script temp files
    /ai\/scripts\/.*\.tmp$/,
    /ai\/temp-scripts\/.*\.tmp$/
  ];

  const obsoleteFiles = [];
  const otherFiles = [];

  untrackedFiles.forEach(file => {
    const isObsolete = obsoletePatterns.some(pattern => pattern.test(file));
    if (isObsolete) {
      obsoleteFiles.push(file);
    } else {
      otherFiles.push(file);
    }
  });

  // Show obsolete files
  if (obsoleteFiles.length > 0) {
    console.log('🗑️  OBSOLETE FILES (will be deleted):');
    obsoleteFiles.forEach(file => console.log(`  ❌ ${file}`));
    console.log();
  }

  // Show other untracked files
  if (otherFiles.length > 0) {
    console.log('📄 OTHER UNTRACKED FILES (will be kept):');
    otherFiles.forEach(file => console.log(`  ℹ️  ${file}`));
    console.log();
  }

  // Remove obsolete files
  if (obsoleteFiles.length > 0) {
    console.log('�️  REMOVING OBSOLETE FILES...\n');
    
    let removedCount = 0;
    obsoleteFiles.forEach(file => {
      try {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`  ✅ Removed: ${file}`);
          removedCount++;
        } else {
          console.log(`  ⚠️  Already gone: ${file}`);
        }
      } catch (error) {
        console.log(`  ❌ Failed to remove: ${file} - ${error.message}`);
      }
    });

    console.log(`\n🎉 Successfully removed ${removedCount} obsolete files!`);
    
    if (removedCount > 0) {
      console.log('\n📋 CLEANUP SUMMARY:');
      console.log(`  • Total untracked files: ${untrackedFiles.length}`);
      console.log(`  • Obsolete files removed: ${removedCount}`);
      console.log(`  • Clean files kept: ${otherFiles.length}`);
    }
  } else {
    console.log('✅ No obsolete files found among untracked files.');
  }

  // Final status check
  console.log('\n🔍 Final git status:');
  try {
    const finalStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (finalStatus.trim()) {
      console.log(finalStatus);
    } else {
      console.log('✅ Repository is completely clean!');
    }
  } catch (error) {
    console.log('Error checking final status:', error.message);
  }

} catch (error) {
  console.error('Error running obsolete file remover:', error.message);
  process.exit(1);
}

console.log('\n�️  OBSOLETE FILE CLEANUP COMPLETE! �️ ');
