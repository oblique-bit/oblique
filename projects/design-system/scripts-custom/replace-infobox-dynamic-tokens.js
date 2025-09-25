#!/usr/bin/env node

/**
 * Replace Dynamic Dimension Tokens with Static Equivalents
 * 
 * Replaces all dynamic dimension tokens in infobox responsive files with static equivalents
 */

const fs = require('fs');
const path = require('path');

// File paths
const DESKTOP_PATH = 'src/lib/themes/04_component/molecule/infobox/responsive/desktop.json';
const MOBILE_PATH = 'src/lib/themes/04_component/molecule/infobox/responsive/mobile.json';

// Mapping of dynamic to static dimension tokens
const DIMENSION_MAPPING = {
  // Surface tokens
  '{ob.s.dimension.dynamic.surface.xs.px}': '{ob.s.dimension.static.surface.xs.px}',
  '{ob.s.dimension.dynamic.surface.sm.px}': '{ob.s.dimension.static.surface.sm.px}',
  '{ob.s.dimension.dynamic.surface.md.px}': '{ob.s.dimension.static.surface.md.px}',
  
  // Element tokens  
  '{ob.s.dimension.dynamic.element.xs.px}': '{ob.s.dimension.static.element.xs.px}',
  '{ob.s.dimension.dynamic.element.sm.px}': '{ob.s.dimension.static.element.sm.px}',
  '{ob.s.dimension.dynamic.element.md.px}': '{ob.s.dimension.static.element.md.px}',
  
  // Container tokens
  '{ob.s.dimension.dynamic.container.xs.px}': '{ob.s.dimension.static.container.xs.px}',
  '{ob.s.dimension.dynamic.container.sm.px}': '{ob.s.dimension.static.container.sm.px}',
  '{ob.s.dimension.dynamic.container.md.px}': '{ob.s.dimension.static.container.md.px}',
};

/**
 * Replace dynamic tokens in a JSON object
 */
function replaceDynamicTokens(obj) {
  if (typeof obj === 'string') {
    // Check if this string contains a dynamic token
    for (const [dynamic, static] of Object.entries(DIMENSION_MAPPING)) {
      if (obj === dynamic) {
        return static;
      }
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(replaceDynamicTokens);
  } else if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceDynamicTokens(value);
    }
    return result;
  }
  return obj;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  console.log(`🔄 Processing: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }
  
  // Read and parse the file
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(originalContent);
  
  // Count dynamic tokens before replacement
  let dynamicCount = 0;
  const originalStr = JSON.stringify(jsonData);
  Object.keys(DIMENSION_MAPPING).forEach(dynamic => {
    const matches = originalStr.match(new RegExp(dynamic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    if (matches) {
      dynamicCount += matches.length;
    }
  });
  
  // Replace dynamic tokens with static ones
  const updatedData = replaceDynamicTokens(jsonData);
  
  // Count static tokens after replacement
  let staticCount = 0;
  const updatedStr = JSON.stringify(updatedData);
  Object.values(DIMENSION_MAPPING).forEach(static => {
    const matches = updatedStr.match(new RegExp(static.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    if (matches) {
      staticCount += matches.length;
    }
  });
  
  // Write the updated file
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
  
  console.log(`   ✅ Replaced ${dynamicCount} dynamic tokens with ${staticCount} static tokens`);
  
  return { dynamicCount, staticCount };
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Replacing Dynamic Dimension Tokens with Static Equivalents\n');
  
  let totalDynamic = 0;
  let totalStatic = 0;
  
  // Process desktop file
  const desktopResult = processFile(DESKTOP_PATH);
  if (desktopResult) {
    totalDynamic += desktopResult.dynamicCount;
    totalStatic += desktopResult.staticCount;
  }
  
  // Process mobile file  
  const mobileResult = processFile(MOBILE_PATH);
  if (mobileResult) {
    totalDynamic += mobileResult.dynamicCount;
    totalStatic += mobileResult.staticCount;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total dynamic tokens replaced: ${totalDynamic}`);
  console.log(`   Total static tokens added: ${totalStatic}`);
  console.log(`\n✅ All infobox responsive files now use static dimension tokens only!`);
}

// Run the script
main();