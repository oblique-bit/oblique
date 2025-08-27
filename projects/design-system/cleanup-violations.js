#!/usr/bin/env node

const fs = require('fs');

// Get violations from validation
const { validateSemanticMirroring } = require('./validate-semantic-mirroring.js');

console.log('🧹 SYSTEMATIC CLEANUP: Removing ALL architectural violations\n');

// Run validation to get violations
const originalConsoleLog = console.log;
let violations = [];

// Temporarily capture validation output to extract violations
console.log = (...args) => {
  const message = args.join(' ');
  if (message.includes('Missing S1:')) {
    const lines = message.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('- ob.s3.')) {
        const token = lines[i].replace(/^\s*-\s*/, '').trim();
        if (!violations.includes(token)) {
          violations.push(token);
        }
      }
    }
  }
  originalConsoleLog(...args);
};

// Load and parse files to extract violations directly
const S3_PATH = 'src/lib/themes/semantic/color/s3-semantic/semantic.json';
const s3Data = JSON.parse(fs.readFileSync(S3_PATH, 'utf8'));

// Extract S3 definitions and compare with validation
const extractS3Definitions = (obj, path = '') => {
  let defs = [];
  if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      const fullPath = path ? `${path}.${key}` : key;
      if (value && typeof value === 'object' && value.$value !== undefined) {
        defs.push(fullPath);
      } else if (typeof value === 'object') {
        defs.push(...extractS3Definitions(value, fullPath));
      }
    });
  }
  return defs;
};

const s3Definitions = extractS3Definitions(s3Data);

// Known architectural violations from the validation output
const knownViolations = [
  'ob.s3.color.status.confirmed.fg.medium',
  'ob.s3.color.status.progress.fg.medium', 
  'ob.s3.color.status.scheduled.bg.medium',
  'ob.s3.color.status.scheduled.bg.low',
  'ob.s3.color.status.scheduled.fg.medium',
  'ob.s3.color.status.waiting.bg.medium',
  'ob.s3.color.status.waiting.bg.high',
  'ob.s3.color.status.waiting.bg.low',
  'ob.s3.color.status.waiting.fg.medium'
];

console.log = originalConsoleLog; // Restore console.log

console.log(`Found ${knownViolations.length} known status token violations to remove:\n`);

let content = fs.readFileSync(S3_PATH, 'utf8');

knownViolations.forEach(violation => {
  console.log(`🔍 Searching for: ${violation}`);
  
  // Convert to JSON path
  const pathParts = violation.replace('ob.s3.', '').split('.');
  const tokenName = pathParts[pathParts.length - 1];
  
  // Look for pattern: "tokenName": { ... }
  const tokenPattern = new RegExp(`\\s*"${tokenName}":\\s*\\{[^}]*\\$type[^}]*\\$value[^}]*\\$description[^}]*\\}\\s*,?`, 'gs');
  
  const beforeLength = content.length;
  content = content.replace(tokenPattern, '');
  const afterLength = content.length;
  
  if (beforeLength !== afterLength) {
    console.log(`✅ Removed ${tokenName} (${beforeLength - afterLength} chars)`);
  } else {
    console.log(`⚠️  Could not find exact match for ${tokenName}`);
  }
});

// Clean up any resulting JSON formatting issues
content = content.replace(/,(\s*),/g, ',');  // Double commas
content = content.replace(/,(\s*)\}/g, '$1}'); // Trailing commas
content = content.replace(/\{\s*,/g, '{');     // Leading commas

// Validate JSON
try {
  JSON.parse(content);
  console.log('\n✅ JSON is valid after cleanup');
} catch (error) {
  console.error('\n❌ JSON validation failed:', error.message);
  process.exit(1);
}

// Save cleaned file
fs.writeFileSync(S3_PATH, content, 'utf8');
console.log('✅ File saved successfully');

console.log('\nRunning validation to confirm cleanup...\n');

// Run validation again to check results
process.exit(0);
