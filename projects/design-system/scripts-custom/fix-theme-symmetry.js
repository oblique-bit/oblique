#!/usr/bin/env node

/**
 * Fix Theme Symmetry - Shadow Tokens
 * 
 * Adds missing inversity_flipped shadow tokens to dark.json to match light.json structure
 */

const fs = require('fs');
const path = require('path');

const DARK_PATH = 'src/lib/themes/03_semantic/color/s1-lightness/dark.json';

console.log('🔧 Fixing Shadow Token Symmetry\n');

try {
  // Read the dark theme file
  const darkData = JSON.parse(fs.readFileSync(DARK_PATH, 'utf8'));
  
  console.log('📝 Adding missing shadow tokens to dark.json...');
  
  // Add the missing inversity_flipped shadow tokens
  if (!darkData.ob.s1.color.neutral.shadow.first.inversity_flipped) {
    darkData.ob.s1.color.neutral.shadow.first.inversity_flipped = {
      "$type": "color",
      "$value": "{ob.p.color.cobalt_alpha.50}",
      "$description": "1st of 2 effects"
    };
    console.log('   ✅ Added: ob.s1.color.neutral.shadow.first.inversity_flipped');
  }
  
  if (!darkData.ob.s1.color.neutral.shadow.second.inversity_flipped) {
    darkData.ob.s1.color.neutral.shadow.second.inversity_flipped = {
      "$type": "color",
      "$value": "{ob.p.color.cobalt_alpha.100}",
      "$description": "2nd of 2 effects"
    };
    console.log('   ✅ Added: ob.s1.color.neutral.shadow.second.inversity_flipped');
  }
  
  // Write the updated file back
  fs.writeFileSync(DARK_PATH, JSON.stringify(darkData, null, 2));
  
  console.log('\n✅ Dark theme symmetry fixed!');
  console.log('📊 Both files should now have 275 tokens each.');
  
} catch (error) {
  console.error('❌ Error fixing symmetry:', error.message);
  process.exit(1);
}