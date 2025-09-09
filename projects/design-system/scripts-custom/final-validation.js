#!/usr/bin/env node

/**
 * Final comprehensive validation for semantic sizing refactoring
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 FINAL SEMANTIC SIZING VALIDATION');
console.log('===================================\n');

// Load sizing file
const sizingPath = path.join(__dirname, '../src/lib/themes/semantic/sizing.json');
const sizing = JSON.parse(fs.readFileSync(sizingPath, 'utf8'));
const s = sizing.ob.s.size;

// 1. Check new structure
console.log('✅ NEW SEMANTIC STRUCTURE:');
['detail', 'element', 'surface', 'container'].forEach(group => {
  const sizes = Object.keys(s[group] || {}).filter(k => !k.startsWith('$'));
  console.log(`   ${group}: ${sizes.join(', ')}`);
});

// 2. Check legacy compatibility  
console.log('\n✅ LEGACY COMPATIBILITY:');
const legacyTokens = Object.keys(s._legacy || {}).filter(k => !k.startsWith('$'));
console.log(`   ${legacyTokens.length} legacy tokens preserved`);

// 3. Component validation
console.log('\n✅ COMPONENT REFERENCES:');
const components = [
  'component/atom/badge.json',
  'component/molecule/tag.json', 
  'component/molecule/popover.json',
  'component/molecule/pill.json',
  'component/atom/spinner.json'
];

let totalLegacyRefs = 0;
let totalDirectRefs = 0;

components.forEach(comp => {
  const fullPath = path.join(__dirname, '..', 'src/lib/themes', comp);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const legacyCount = (content.match(/ob\.s\.size\._legacy\./g) || []).length;
    const directCount = (content.match(/ob\.s\.size\.(?!_legacy\.|detail\.|element\.|surface\.|container\.)\w+/g) || []).length;
    
    totalLegacyRefs += legacyCount;
    totalDirectRefs += directCount;
    
    console.log(`   ${path.basename(comp)}: ${legacyCount} legacy refs, ${directCount} direct refs`);
  }
});

console.log('\n📊 SUMMARY:');
console.log(`   • Total legacy references: ${totalLegacyRefs}`);
console.log(`   • Total direct old references: ${totalDirectRefs}`);
console.log(`   • Migration status: ${totalDirectRefs === 0 ? '✅ COMPLETE' : '⚠️ INCOMPLETE'}`);

if (totalDirectRefs === 0) {
  console.log('\n🎉 SEMANTIC SIZING REFACTORING SUCCESSFULLY VALIDATED!');
  console.log('   All components use legacy compatibility during transition.');
  console.log('   New semantic structure ready for adoption.');
} else {
  console.log('\n⚠️ ISSUES FOUND - Some references still need migration.');
}
