#!/usr/bin/env node

const fs = require('fs');

console.log('🧹 Removing ALL obsolete simple tokens from S3 status sections...\n');

// Load S3 file
const filePath = 'src/lib/themes/semantic/color/s3-semantic/semantic.json';
let content = fs.readFileSync(filePath, 'utf8');
const originalContent = content;

console.log('Original file size:', content.length);

// Remove obsolete simple tokens in status sections
// Pattern: Remove "medium", "low", "high" tokens that are direct children of bg/fg in status contexts
// BUT preserve contrast_medium, contrast_low, contrast_high

let removedCount = 0;

// Find and remove obsolete tokens in status contexts
const obsoleteTokenPattern = /(\s+)"(medium|low|high)": \{[^}]*\$type[^}]*\}(?:,\s*|\s*)/g;

content = content.replace(obsoleteTokenPattern, (match, indent, tokenName) => {
  // Check if this is in a status context by looking at surrounding context
  const beforeMatch = content.substring(0, content.indexOf(match));
  
  // If it's in a status section and not a contrast_ token, remove it
  if (beforeMatch.includes('status.') && !beforeMatch.includes('contrast_')) {
    console.log(`❌ Removing obsolete token: ${tokenName}`);
    removedCount++;
    
    // Remove the token and trailing comma if present
    return '';
  }
  return match;
});

// Clean up any double commas or trailing commas that might result
content = content.replace(/,(\s*),/g, ',');
content = content.replace(/,(\s*)\}/g, '$1}');

console.log(`\n🧹 Removed ${removedCount} obsolete tokens`);
console.log('New file size:', content.length);
console.log('Size reduction:', originalContent.length - content.length, 'characters');

// Validate JSON
try {
  JSON.parse(content);
  console.log('✅ JSON is valid');
} catch (error) {
  console.error('❌ JSON validation failed:', error.message);
  process.exit(1);
}

// Save file
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ File saved successfully');
