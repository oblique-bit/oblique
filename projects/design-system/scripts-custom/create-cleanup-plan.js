#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Main cleanup function
function createCleanupPlan() {
  console.log('🧹 TOKEN CLEANUP PLAN');
  console.log('====================\n');
  
  const themesDir = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
  
  // Phase 1: Safe deletions (empty files)
  const emptyFiles = [
    'component/atom/icon_holder/lg.json',
    'component/atom/icon_holder/md.json',
    'global/multipliers/dimension/lg.json',
    'global/multipliers/dimension/md.json',
    'global/multipliers/dimension/sm.json',
    'global/multipliers/typography/2xl.json',
    'global/multipliers/typography/xl.json',
    'global/multipliers/typography/xs.json',
    'semantic/spacing/desktop.json',
    'semantic/spacing/mobile.json'
  ];
  
  // Phase 2: Tiny placeholder files (only contain {})
  const placeholderFiles = [
    'component/molecules/breadcrumb.json',
    'component/molecules/card.json',
    'component/molecules/column-layout.json',
    'component/molecules/datepicker.json',
    'component/molecules/dialog.json',
    'component/molecules/expansion-panel.json',
    'component/molecules/file-upload.json',
    'component/molecules/list-group.json',
    'component/molecules/nav-tree.json',
    'component/molecules/paginator.json',
    'component/molecules/progress-bar.json',
    'component/molecules/slider.json',
    'component/molecules/stepper.json',
    'component/molecules/tab.json'
  ];
  
  console.log('📋 PHASE 1: SAFE DELETIONS');
  console.log('==========================');
  console.log(`🗑️  Empty files (${emptyFiles.length} files):`);
  emptyFiles.forEach(file => console.log(`   • ${file}`));
  
  console.log(`\n🗑️  Placeholder files (${placeholderFiles.length} files):`);
  placeholderFiles.forEach(file => console.log(`   • ${file}`));
  
  console.log('\n📋 PHASE 2: CANDIDATE DELETIONS (REVIEW NEEDED)');
  console.log('===============================================');
  
  console.log('\n🏷️  R13 Legacy Typography Tokens:');
  console.log('These are from the old typography system and likely safe to delete:');
  console.log('   • All tokens in _FIGMA-ONLY/typography-styles-R13.json');
  console.log('   • 49 r13.typography.components_only.* tokens');
  console.log('   • These reference the old type_scale system we just migrated');
  
  console.log('\n🎨 Figma Documentation Tokens:');
  console.log('These are design documentation tokens with broken references:');
  console.log('   • figma-doc.typography.* tokens (6 tokens)');
  console.log('   • figma-doc.color.* tokens (7 tokens)');
  console.log('   • They reference missing primitive tokens like ob.p.fontSizeUnitless.400');
  
  console.log('\n📊 PHASE 3: MAJOR CLEANUP CANDIDATES');
  console.log('====================================');
  
  console.log('\n🧩 Unused Component Tokens (246 tokens):');
  console.log('Many ob.c.* tokens that are defined but never used:');
  console.log('   • ob.c.badge.color.* (many variants)');
  console.log('   • ob.c.* component tokens across many components');
  console.log('   • These might be prepared for future use - NEEDS DESIGN REVIEW');
  
  console.log('\n🎭 Unused Primitive Tokens (103 tokens):');
  console.log('Color and typography primitives not used in the system:');
  console.log('   • ob.p.color.red.500, ob.p.color.orange.500, etc.');
  console.log('   • Various color primitives that might be legacy');
  console.log('   • NEEDS DESIGN REVIEW - some might be part of color palette');
  
  console.log('\n💡 IMMEDIATE ACTION PLAN:');
  console.log('========================');
  
  console.log('\n1️⃣  START WITH SAFE DELETIONS:');
  console.log('   Run the following commands to delete empty/placeholder files:');
  
  console.log('\n   # Delete empty files');
  emptyFiles.forEach(file => {
    console.log(`   rm "${path.join(themesDir, file)}"`);
  });
  
  console.log('\n   # Delete placeholder files');  
  placeholderFiles.forEach(file => {
    console.log(`   rm "${path.join(themesDir, file)}"`);
  });
  
  console.log('\n2️⃣  FIX BROKEN REFERENCES:');
  console.log('   The 12 orphaned references are causing broken token chains');
  console.log('   Most are from the type_scale → grouped migration');
  
  console.log('\n3️⃣  REVIEW & DELETE CANDIDATES:');
  console.log('   • R13 tokens: Likely safe to delete entirely');
  console.log('   • figma-doc tokens: Delete if not needed for documentation');
  console.log('   • Unused component/primitive tokens: Design team review needed');
  
  console.log('\n⚠️  WARNING: ALWAYS BACKUP BEFORE MAJOR DELETIONS!');
  console.log('   git checkout -b token-cleanup-backup');
  
  return {
    emptyFiles,
    placeholderFiles,
    totalSafeDeletions: emptyFiles.length + placeholderFiles.length
  };
}

// Run the cleanup plan
const plan = createCleanupPlan();
console.log(`\n🎯 Ready to safely delete ${plan.totalSafeDeletions} files immediately!`);
process.exit(0);
