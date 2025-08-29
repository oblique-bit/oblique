#!/usr/bin/env node

/**
 * Terminology Consistency Validator
 * 
 * Validates terminology usage across all documentation files against the glossary.
 * Checks for:
 * - Outdated terms (layers vs levels)
 * - Inconsistent usage
 * - Missing glossary entries
 * - Proper capitalization and naming conventions
 */

const fs = require('fs');
const path = require('path');

const DOCS_PATH = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/documentation';
const GLOSSARY_PATH = path.join(DOCS_PATH, 'design-tokens/glossary.md');

// Load glossary content
let glossaryContent = '';
try {
    glossaryContent = fs.readFileSync(GLOSSARY_PATH, 'utf8');
} catch (error) {
    console.error('❌ Could not read glossary:', error.message);
    process.exit(1);
}

// Define terminology rules based on our conversation
const TERMINOLOGY_RULES = {
    // DEPRECATED/OUTDATED TERMS
    deprecated: {
        'layer': {
            replacement: 'level',
            context: 'token architecture',
            exceptions: ['Figma layer', 'visual layer'],
            severity: 'error'
        },
        'layers': {
            replacement: 'levels',
            context: 'token architecture',
            exceptions: ['Figma layers', 'visual layers'],
            severity: 'error'
        },
        'semantic layer': {
            replacement: 'Semantic Level',
            context: 'all contexts',
            severity: 'error'
        },
        'semantic layers': {
            replacement: 'Semantic Levels',
            context: 'all contexts', 
            severity: 'error'
        },
        'l1': {
            replacement: 's1',
            context: 'token references',
            severity: 'warning'
        },
        'l2': {
            replacement: 's2', 
            context: 'token references',
            severity: 'warning'
        },
        'l3': {
            replacement: 's3',
            context: 'token references',
            severity: 'warning'
        }
    },

    // REQUIRED CONSISTENT TERMS
    required: {
        'Design System': {
            patterns: ['ob namespace', 'Oblique namespace', 'namespace'],
            context: 'when referring to ob prefix',
            severity: 'suggestion'
        },
        'Inversity variant': {
            patterns: ['theme variant', 'inversity theme'],
            context: 'inversity_normal/inversity_flipped',
            severity: 'suggestion'
        },
        'Semantic Level': {
            patterns: ['s1 level', 's2 level', 's3 level'],
            context: 'specific semantic levels',
            severity: 'warning'
        },
        'Component Level': {
            patterns: ['c level', 'component level'],
            context: 'component tokens',
            severity: 'suggestion'
        },
        'Global Level': {
            patterns: ['g level', 'global level'],
            context: 'global tokens',
            severity: 'suggestion'
        },
        'Primitive Level': {
            patterns: ['p level', 'primitive level'],
            context: 'primitive tokens',
            severity: 'suggestion'
        }
    },

    // SPECIFIC NAMING CONVENTIONS
    conventions: {
        'S1/S2/S3': {
            description: 'Semantic levels should be uppercase when abbreviated',
            pattern: /\bs[123]\b/gi,
            replacement: match => match.toUpperCase(),
            severity: 'suggestion'
        },
        'token names': {
            description: 'Token names should be lowercase with underscores',
            pattern: /ob\.[a-zA-Z0-9._-]+/g,
            validator: (match) => {
                const parts = match.split('.');
                return parts.every(part => part === part.toLowerCase());
            },
            severity: 'suggestion'
        }
    }
};

// Get all markdown files
function getAllMarkdownFiles(dir) {
    const files = [];
    
    function walkDir(currentPath) {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                walkDir(fullPath);
            } else if (item.endsWith('.md')) {
                files.push(fullPath);
            }
        }
    }
    
    walkDir(dir);
    return files;
}

// Analyze terminology in a file
function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(DOCS_PATH, filePath);
    const issues = [];
    
    console.log(`\n📄 Analyzing: ${relativePath}`);
    
    // Check for deprecated terms
    for (const [term, rule] of Object.entries(TERMINOLOGY_RULES.deprecated)) {
        const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = content.match(regex);
        
        if (matches) {
            const contexts = [];
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                if (regex.test(line)) {
                    contexts.push({
                        line: index + 1,
                        content: line.trim(),
                        suggestion: line.replace(regex, rule.replacement)
                    });
                }
            });
            
            issues.push({
                type: 'deprecated',
                term,
                rule,
                count: matches.length,
                contexts,
                severity: rule.severity
            });
        }
    }
    
    // Check for required consistent terms
    for (const [correctTerm, rule] of Object.entries(TERMINOLOGY_RULES.required)) {
        for (const pattern of rule.patterns) {
            const regex = new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            const matches = content.match(regex);
            
            if (matches) {
                issues.push({
                    type: 'inconsistent',
                    term: pattern,
                    correctTerm,
                    count: matches.length,
                    severity: rule.severity
                });
            }
        }
    }
    
    // Check naming conventions
    for (const [conventionName, rule] of Object.entries(TERMINOLOGY_RULES.conventions)) {
        const matches = content.match(rule.pattern);
        if (matches) {
            const violations = [];
            
            matches.forEach(match => {
                if (rule.validator && !rule.validator(match)) {
                    violations.push(match);
                } else if (rule.replacement) {
                    const corrected = rule.replacement(match);
                    if (corrected !== match) {
                        violations.push({ original: match, suggested: corrected });
                    }
                }
            });
            
            if (violations.length > 0) {
                issues.push({
                    type: 'convention',
                    convention: conventionName,
                    rule,
                    violations,
                    severity: rule.severity
                });
            }
        }
    }
    
    return issues;
}

// Generate suggestions for glossary improvements
function analyzeGlossaryGaps(allIssues) {
    const suggestions = [];
    const termFrequency = {};
    
    // Count recurring problematic terms
    allIssues.forEach(fileIssues => {
        fileIssues.forEach(issue => {
            if (issue.type === 'inconsistent') {
                termFrequency[issue.term] = (termFrequency[issue.term] || 0) + issue.count;
            }
        });
    });
    
    // Suggest missing glossary entries
    Object.entries(termFrequency)
        .filter(([term, count]) => count >= 3) // Appears in multiple files
        .forEach(([term, count]) => {
            if (!glossaryContent.toLowerCase().includes(term.toLowerCase())) {
                suggestions.push({
                    type: 'missing_entry',
                    term,
                    frequency: count,
                    suggestion: `Add "${term}" to glossary with proper definition`
                });
            }
        });
    
    return suggestions;
}

// Main execution
function main() {
    console.log('🔍 Oblique Design System - Terminology Consistency Validator');
    console.log('=' .repeat(60));
    
    const markdownFiles = getAllMarkdownFiles(DOCS_PATH);
    console.log(`Found ${markdownFiles.length} markdown files to analyze`);
    
    const allIssues = [];
    let totalIssues = 0;
    let errorCount = 0;
    let warningCount = 0;
    let suggestionCount = 0;
    
    // Analyze each file
    markdownFiles.forEach(filePath => {
        const issues = analyzeFile(filePath);
        
        if (issues.length > 0) {
            allIssues.push({ file: filePath, issues });
            totalIssues += issues.length;
            
            // Count by severity
            issues.forEach(issue => {
                switch (issue.severity) {
                    case 'error': errorCount++; break;
                    case 'warning': warningCount++; break;
                    case 'suggestion': suggestionCount++; break;
                }
            });
            
            // Display issues for this file
            issues.forEach(issue => {
                const icon = issue.severity === 'error' ? '❌' : 
                           issue.severity === 'warning' ? '⚠️' : '💡';
                
                console.log(`  ${icon} ${issue.type.toUpperCase()}: ${issue.term || issue.convention}`);
                
                if (issue.type === 'deprecated') {
                    console.log(`     → Replace with: "${issue.rule.replacement}"`);
                    if (issue.contexts) {
                        issue.contexts.slice(0, 3).forEach(ctx => {
                            console.log(`     Line ${ctx.line}: ${ctx.content}`);
                            console.log(`     Suggest: ${ctx.suggestion}`);
                        });
                        if (issue.contexts.length > 3) {
                            console.log(`     ... and ${issue.contexts.length - 3} more occurrences`);
                        }
                    }
                } else if (issue.type === 'inconsistent') {
                    console.log(`     → Should be: "${issue.correctTerm}" (found ${issue.count} times)`);
                } else if (issue.type === 'convention') {
                    console.log(`     → ${issue.rule.description}`);
                    if (issue.violations.length <= 3) {
                        issue.violations.forEach(v => {
                            if (typeof v === 'object') {
                                console.log(`     "${v.original}" → "${v.suggested}"`);
                            } else {
                                console.log(`     "${v}"`);
                            }
                        });
                    } else {
                        console.log(`     ${issue.violations.length} violations found`);
                    }
                }
                console.log('');
            });
        } else {
            console.log(`  ✅ No issues found`);
        }
    });
    
    // Analyze glossary gaps
    console.log('\n📚 Glossary Analysis');
    console.log('=' .repeat(30));
    
    const glossaryGaps = analyzeGlossaryGaps(allIssues.map(result => result.issues));
    if (glossaryGaps.length > 0) {
        console.log('Suggested glossary improvements:');
        glossaryGaps.forEach(gap => {
            console.log(`  💡 ${gap.suggestion} (appears ${gap.frequency} times)`);
        });
    } else {
        console.log('✅ No glossary gaps detected');
    }
    
    // Summary
    console.log('\n📊 Summary');
    console.log('=' .repeat(20));
    console.log(`Total files analyzed: ${markdownFiles.length}`);
    console.log(`Total issues found: ${totalIssues}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  ⚠️  Warnings: ${warningCount}`);
    console.log(`  💡 Suggestions: ${suggestionCount}`);
    
    // Exit code based on errors
    if (errorCount > 0) {
        console.log('\n❌ Validation failed due to terminology errors');
        process.exit(1);
    } else if (warningCount > 0) {
        console.log('\n⚠️  Validation completed with warnings');
        process.exit(0);
    } else {
        console.log('\n✅ All terminology checks passed!');
        process.exit(0);
    }
}

// Run the validator
main();
