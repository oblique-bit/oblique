#!/usr/bin/env node

const fs = require('fs');

// Console colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

console.log(`${colors.cyan}🔍 Spinner Component Token Validation${colors.reset}\n`);

const spinnerFile = 'src/lib/themes/component/atoms/spinner.json';
const s3File = 'src/lib/themes/semantic/color/s3-semantic/semantic.json';

try {
    console.log(`${colors.green}✅ Loading spinner file...${colors.reset}`);
    const spinnerContent = fs.readFileSync(spinnerFile, 'utf8');
    
    console.log(`${colors.green}✅ Loading S3 semantic file...${colors.reset}`);
    const s3Content = fs.readFileSync(s3File, 'utf8');
    const s3Data = JSON.parse(s3Content);

    console.log(`${colors.green}✅ Extracting spinner token references...${colors.reset}`);
    
    // Extract spinner token references
    const spinnerReferences = new Set();
    const s3References = spinnerContent.match(/\{ob\.s3\.[^}]+\}/g) || [];
    
    s3References.forEach(ref => {
        const cleanRef = ref.slice(1, -1);
        spinnerReferences.add(cleanRef);
    });

    console.log(`${colors.green}✅ Extracting S3 definitions...${colors.reset}`);
    
    // Extract all S3 token definitions
    const s3Definitions = new Set();
    
    function extractTokens(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = prefix ? `${prefix}.${key}` : key;
            
            if (value && typeof value === 'object' && value.$value !== undefined) {
                s3Definitions.add(currentPath);
            } else if (value && typeof value === 'object') {
                extractTokens(value, currentPath);
            }
        }
    }
    
    extractTokens(s3Data);
    
    console.log(`${colors.green}✅ Found ${spinnerReferences.size} spinner references${colors.reset}`);
    console.log(`${colors.green}✅ Found ${s3Definitions.size} S3 definitions${colors.reset}`);

    console.log(`\n${colors.cyan}🔍 Validating Spinner Token References${colors.reset}`);
    console.log(`${colors.cyan}=====================================${colors.reset}`);
    
    const validReferences = [];
    const invalidReferences = [];
    
    // Check each reference
    spinnerReferences.forEach(ref => {
        if (s3Definitions.has(ref)) {
            validReferences.push(ref);
        } else {
            invalidReferences.push(ref);
        }
    });

    if (invalidReferences.length === 0) {
        console.log(`${colors.green}✅ Perfect spinner token validation!${colors.reset}`);
        console.log(`${colors.green}🎉 All ${spinnerReferences.size} references are valid${colors.reset}`);
        
        console.log(`\n${colors.cyan}📋 Valid Spinner Tokens:${colors.reset}`);
        validReferences.forEach(ref => {
            console.log(`   ${colors.green}✅ ${ref}${colors.reset}`);
        });
    } else {
        console.log(`${colors.red}❌ Found ${invalidReferences.length} invalid references:${colors.reset}`);
        invalidReferences.forEach(ref => {
            console.log(`   ${colors.red}• ${ref}${colors.reset}`);
        });
    }

    console.log(`\n${colors.cyan}📋 Spinner Validation Summary:${colors.reset}`);
    console.log(`   • Spinner references: ${spinnerReferences.size}`);
    console.log(`   • Valid references: ${validReferences.length}`);
    console.log(`   • Issues found: ${invalidReferences.length}`);

    if (invalidReferences.length === 0) {
        console.log(`\n${colors.green}🎉 Spinner tokens are perfectly configured!${colors.reset}`);
    } else {
        console.log(`\n${colors.red}⚠️  Spinner tokens need fixes!${colors.reset}`);
    }

} catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
}
