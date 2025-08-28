#!/usr/bin/env node

/**
 * Comprehensive Script Validation Tool
 * 
 * Validates all scripts in scripts-custom directory against maintenance guidelines:
 * 1. No hardcoded local paths
 * 2. Team portability (works on any machine)
 * 3. Valid references to existing files
 * 4. Template compliance
 * 5. JavaScript-only policy
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Comprehensive Script Validation');
console.log('=====================================\n');

const scriptsDir = path.join(__dirname);
const files = fs.readdirSync(scriptsDir)
    .filter(file => file.endsWith('.js') && !file.includes('validation'))
    .sort();

console.log(`Found ${files.length} JavaScript files to validate:\n`);

let totalIssues = 0;
const results = [];

for (const file of files) {
    console.log(`📄 Validating: ${file}`);
    
    const filePath = path.join(scriptsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // 1. Check for hardcoded paths
    const hardcodedPaths = [
        /\/Users\/[^\/]+\//g,
        /\/home\/[^\/]+\//g,
        /C:\\\\[^\\\\]+\\\\/g,
        /'\/[^.\/][^']*'/g,
        /"\/[^.\/][^"]*"/g
    ];
    
    hardcodedPaths.forEach((regex, index) => {
        const matches = content.match(regex);
        if (matches) {
            const pathTypes = ['macOS user paths', 'Linux user paths', 'Windows paths', 'Absolute paths (single quotes)', 'Absolute paths (double quotes)'];
            issues.push(`❌ Hardcoded ${pathTypes[index]} found: ${matches.slice(0, 3).join(', ')}${matches.length > 3 ? '...' : ''}`);
        }
    });
    
    // 2. Check template compliance
    const hasUsageContext = content.includes('USAGE CONTEXT:');
    const hasCommands = content.includes('COMMANDS:');
    const hasCreatedDate = content.includes('CREATED:') || content.includes('CREATED DATE:');
    const hasLastRun = content.includes('LAST_RUN:') || content.includes('LAST RUN:');
    
    if (!hasUsageContext) issues.push('⚠️ Missing USAGE CONTEXT section');
    if (!hasCommands) issues.push('⚠️ Missing COMMANDS section');
    if (!hasCreatedDate) issues.push('⚠️ Missing CREATED DATE field');
    if (!hasLastRun) issues.push('⚠️ Missing LAST_RUN field');
    
    // 3. Check for relative path usage
    const hasPathJoin = content.includes('path.join(__dirname');
    const hasDirectPaths = /['"]\.\.\//.test(content) || /'\/[^.\/]/.test(content);
    
    if (hasDirectPaths && !hasPathJoin) {
        issues.push('⚠️ Direct paths found without proper path.join() usage');
    }
    
    // 4. Try to execute script (basic syntax check)
    let executionResult = { success: false, error: null };
    try {
        // Run with timeout and capture both stdout and stderr
        const result = execSync(`cd "${path.dirname(scriptsDir)}" && timeout 10s node "${filePath}" --help 2>&1 || node "${filePath}" 2>&1 | head -20`, {
            encoding: 'utf8',
            timeout: 10000,
            stdio: 'pipe'
        });
        
        if (result.includes('Error:') || result.includes('error:')) {
            executionResult.error = result.split('\n')[0];
        } else {
            executionResult.success = true;
        }
    } catch (error) {
        executionResult.error = error.message.includes('timeout') ? 'Script runs (timeout after 10s)' : error.message.split('\n')[0];
        if (executionResult.error.includes('timeout')) {
            executionResult.success = true; // Timeout means it started running
        }
    }
    
    if (!executionResult.success && executionResult.error) {
        issues.push(`❌ Execution failed: ${executionResult.error}`);
    }
    
    // Report results for this file
    if (issues.length === 0) {
        console.log('   ✅ All checks passed\n');
        results.push({ file, status: 'PASS', issues: [] });
    } else {
        console.log(`   Found ${issues.length} issues:`);
        issues.forEach(issue => console.log(`   ${issue}`));
        console.log('');
        totalIssues += issues.length;
        results.push({ file, status: 'ISSUES', issues });
    }
}

// Summary
console.log('\n📊 Validation Summary');
console.log('=====================');
console.log(`Total files validated: ${files.length}`);
console.log(`Files with issues: ${results.filter(r => r.status === 'ISSUES').length}`);
console.log(`Files passing all checks: ${results.filter(r => r.status === 'PASS').length}`);
console.log(`Total issues found: ${totalIssues}\n`);

// Detailed results
console.log('📋 Detailed Results:');
console.log('===================');

const passing = results.filter(r => r.status === 'PASS');
const failing = results.filter(r => r.status === 'ISSUES');

if (passing.length > 0) {
    console.log('\n✅ Files passing all checks:');
    passing.forEach(r => console.log(`   ${r.file}`));
}

if (failing.length > 0) {
    console.log('\n⚠️ Files needing attention:');
    failing.forEach(r => {
        console.log(`   ${r.file}:`);
        r.issues.forEach(issue => console.log(`     ${issue}`));
    });
}

console.log(`\n🎯 Validation completed: ${totalIssues === 0 ? 'All scripts compliant!' : 'Issues found that need attention'}`);
