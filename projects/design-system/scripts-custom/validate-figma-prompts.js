#!/usr/bin/env node

/**
 * Figma MCP Prompt Validation Report Generator
 * 
 * This script generates validation reports for all Figma MCP prompts.
 * It analyzes prompt effectiveness, output quality, and provides recommendations.
 * 
 * Usage: node validate-figma-prompts.js
 * 
 * Prerequisites:
 * - Figma Desktop App running
 * - Component selected in Figma
 * - MCP tools configured
 * - VS Code with GitHub Copilot
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROMPTS_DIR = path.join(__dirname, '../documentation/07-workflow/maintainers/prompts');
const REPORTS_DIR = path.join(PROMPTS_DIR, '_validation-reports');
const COMPONENTS_DIR = path.join(__dirname, '../documentation/04-components');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateFileHeader(promptName) {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    });
    
    return `# Figma MCP Prompt Validation Report: ${promptName}

**Version:** 1.0  
**Date:** ${currentDate}  
**Status:** Validation Report  
**Purpose:** Automated validation and analysis of Figma MCP prompt effectiveness

## **Target Audience**
**Primary:** DS/Oblique Developers, DS/Oblique Designers  
**Secondary:** Design System Maintainers  
**Prerequisites:** Understanding of Figma MCP workflows and prompt validation processes

---

## Validation Overview

This report analyzes the effectiveness, usability, and current relevance of the \`${promptName}\` prompt for Figma MCP operations.

**Validation Criteria:**
- **Functionality**: Does the prompt execute without errors?
- **Output Quality**: Is the generated output useful and accurate?
- **Usability**: Is the prompt clear and easy to understand?
- **Relevance**: Is the prompt still needed in current workflows?
- **Documentation Impact**: Does the prompt properly handle component documentation?

---`;
}

function analyzePromptContent(promptPath, promptName) {
    try {
        const content = fs.readFileSync(promptPath, 'utf8');
        const lines = content.split('\n');
        const wordCount = content.split(/\s+/).length;
        
        // Analyze prompt characteristics
        const hasSteps = content.includes('1.') || content.includes('2.');
        const hasMCPCommands = content.includes('mcp_figma_dev_mod_');
        const hasOutputFormat = content.includes('OUTPUT') || content.includes('FORMAT');
        const hasFollowUp = content.includes('FOLLOW-UP') || content.includes('follow');
        
        return {
            lineCount: lines.length,
            wordCount,
            hasSteps,
            hasMCPCommands,
            hasOutputFormat,
            hasFollowUp,
            content
        };
    } catch (error) {
        return {
            error: `Failed to read prompt file: ${error.message}`,
            content: ''
        };
    }
}

function generateAnalysisSection(analysis, promptName) {
    if (analysis.error) {
        return `## Analysis Results

❌ **Error**: ${analysis.error}

### Recommendation: INVESTIGATE
- **Action**: Fix file access issues
- **Priority**: High
- **Status**: Cannot validate due to technical issues`;
    }

    let usabilityScore = 0;
    let functionalityScore = 0;
    let relevanceScore = 0;
    let issues = [];
    let strengths = [];

    // Usability analysis
    if (analysis.hasSteps) {
        usabilityScore += 2;
        strengths.push('Clear step-by-step instructions');
    } else {
        issues.push('Missing numbered steps for clarity');
    }

    if (analysis.wordCount > 50 && analysis.wordCount < 300) {
        usabilityScore += 2;
        strengths.push('Appropriate prompt length');
    } else if (analysis.wordCount <= 50) {
        issues.push('Prompt may be too brief');
    } else {
        issues.push('Prompt may be too verbose');
    }

    // Functionality analysis
    if (analysis.hasMCPCommands) {
        functionalityScore += 3;
        strengths.push('Contains specific MCP commands');
    } else {
        issues.push('Missing explicit MCP command references');
    }

    if (analysis.hasOutputFormat) {
        functionalityScore += 2;
        strengths.push('Specifies expected output format');
    } else {
        issues.push('No clear output format specification');
    }

    // Relevance analysis (based on prompt category)
    if (promptName.includes('inspect-layer-structure')) {
        relevanceScore += 3;
        strengths.push('Core functionality - high relevance');
    } else if (promptName.includes('generate-')) {
        relevanceScore += 2;
        strengths.push('Code generation - moderate relevance');
    } else if (promptName.includes('analyze-')) {
        relevanceScore += 2;
        strengths.push('Analysis functionality - moderate relevance');
    }

    if (analysis.hasFollowUp) {
        relevanceScore += 1;
        strengths.push('Includes follow-up actions');
    }

    const totalScore = usabilityScore + functionalityScore + relevanceScore;
    const maxScore = 10;
    const percentage = Math.round((totalScore / maxScore) * 100);

    let recommendation = 'KEEP';
    let priority = 'Low';
    let status = 'Good';

    if (percentage >= 80) {
        recommendation = 'KEEP';
        status = 'Excellent';
    } else if (percentage >= 60) {
        recommendation = 'UPDATE';
        priority = 'Medium';
        status = 'Good with improvements needed';
    } else if (percentage >= 40) {
        recommendation = 'MAJOR UPDATE';
        priority = 'High';
        status = 'Needs significant improvement';
    } else {
        recommendation = 'REPLACE OR REMOVE';
        priority = 'Critical';
        status = 'Poor quality';
    }

    return `## Analysis Results

**Overall Score**: ${totalScore}/${maxScore} (${percentage}%)

### Strengths ✅
${strengths.map(s => `- ${s}`).join('\n')}

### Issues Identified ⚠️
${issues.length > 0 ? issues.map(i => `- ${i}`).join('\n') : '- No significant issues found'}

### Recommendation: ${recommendation}
- **Action**: ${getRecommendationAction(recommendation)}
- **Priority**: ${priority}
- **Status**: ${status}

### Detailed Metrics
- **Usability Score**: ${usabilityScore}/4
- **Functionality Score**: ${functionalityScore}/5  
- **Relevance Score**: ${relevanceScore}/4
- **Line Count**: ${analysis.lineCount}
- **Word Count**: ${analysis.wordCount}`;
}

function getRecommendationAction(recommendation) {
    switch (recommendation) {
        case 'KEEP':
            return 'Maintain current prompt as-is';
        case 'UPDATE':
            return 'Minor improvements to clarity or format';
        case 'MAJOR UPDATE':
            return 'Significant restructuring needed';
        case 'REPLACE OR REMOVE':
            return 'Consider replacing with better alternative or removing';
        default:
            return 'Review and assess';
    }
}

function generateExpectedBehaviorSection(promptName) {
    return `## Expected Behavior Analysis

### 2.1 Component Documentation Impact
**What this prompt would write/modify in \`documentation/04-components/\`:**

${getExpectedDocumentationImpact(promptName)}

### 2.2 VS Code Copilot Chat Output
**Expected chat response format:**

${getExpectedChatOutput(promptName)}

### 2.3 MCP Tool Interactions
**Expected MCP command sequence:**

${getExpectedMCPSequence(promptName)}`;
}

function getExpectedDocumentationImpact(promptName) {
    if (promptName.includes('update-component-docs')) {
        return `- **Creates/Updates**: Component markdown files
- **Sections Modified**: Layer structure, token mapping, component properties
- **File Naming**: \`[component-name].md\` in components directory
- **Impact Level**: HIGH - Directly modifies documentation files
- **Safety**: Should backup existing files before updates`;
    } else if (promptName.includes('inspect-layer-structure_simple')) {
        return `- **Creates/Updates**: NO direct file modifications
- **Sections Modified**: None (chat output only)
- **File Naming**: N/A
- **Impact Level**: NONE - Safe for exploration
- **Safety**: No documentation files affected`;
    } else if (promptName.includes('inspect-layer-structure_detailed')) {
        return `- **Creates/Updates**: May offer to create component documentation
- **Sections Modified**: Layer structure, detailed analysis tables
- **File Naming**: \`[component-name].md\` if user accepts
- **Impact Level**: MEDIUM - User-controlled file creation
- **Safety**: Requires user confirmation before creating files`;
    } else {
        return `- **Creates/Updates**: NO direct file modifications (analysis only)
- **Sections Modified**: None
- **File Naming**: N/A  
- **Impact Level**: NONE - Read-only operation
- **Safety**: No documentation files affected`;
    }
}

function getExpectedChatOutput(promptName) {
    if (promptName.includes('inspect-layer-structure')) {
        return `\`\`\`markdown
## 🔍 Figma Layer Analysis: [component_name]

### Simple Structure
\`\`\`
component_frame
└── component_symbol
    └── layer_name
        ├── sub_layer_1
        └── sub_layer_2
\`\`\`

[Follow-up offer for documentation]
\`\`\``;
    } else if (promptName.includes('generate-')) {
        return `\`\`\`markdown
## Generated Code: [component_name]

### HTML Structure
\`\`\`html
[Generated HTML code]
\`\`\`

### CSS Styles  
\`\`\`css
[Generated CSS with token references]
\`\`\`
\`\`\``;
    } else {
        return `\`\`\`markdown
## Analysis Results: [component_name]

[Structured analysis output based on prompt type]
[Data tables, comparisons, or extracted information]
[Recommendations or next steps]
\`\`\``;
    }
}

function getExpectedMCPSequence(promptName) {
    const baseSequence = `1. \`mcp_figma_dev_mod_get_metadata\` - Extract component metadata
2. \`mcp_figma_dev_mod_get_code\` - Generate component code structure
3. \`mcp_figma_dev_mod_get_image\` - Capture visual reference`;

    if (promptName.includes('variable') || promptName.includes('semantic') || promptName.includes('viewport')) {
        return baseSequence + `\n4. \`mcp_figma_dev_mod_get_variable_defs\` - Extract variable definitions`;
    } else if (promptName.includes('manual-mcp-commands')) {
        return `**Manual execution of:**\n${baseSequence}`;
    } else {
        return baseSequence;
    }
}

function generateValidationReport(promptFile) {
    const promptName = path.basename(promptFile, '.md');
    const reportName = `${promptName}_report.md`;
    const promptPath = path.join(PROMPTS_DIR, promptFile);
    const reportPath = path.join(REPORTS_DIR, reportName);

    log(`Generating validation report for: ${promptName}`, 'cyan');

    // Analyze prompt content
    const analysis = analyzePromptContent(promptPath, promptName);

    // Generate report content
    const reportContent = [
        generateFileHeader(promptName),
        generateExpectedBehaviorSection(promptName),
        generateAnalysisSection(analysis, promptName),
        `\n---\n\n**Generated:** ${new Date().toISOString()}  \n**Script Version:** 1.0  \n**Validation Method:** Automated analysis`
    ].join('\n\n');

    // Write report file
    try {
        fs.writeFileSync(reportPath, reportContent);
        log(`✅ Generated: ${reportName}`, 'green');
        return true;
    } catch (error) {
        log(`❌ Failed to generate ${reportName}: ${error.message}`, 'red');
        return false;
    }
}

function main() {
    log('🚀 Figma MCP Prompt Validation Report Generator', 'bright');
    log('='.repeat(60), 'blue');

    // Check prerequisites
    log('\n📋 Checking prerequisites...', 'yellow');
    
    if (!fs.existsSync(PROMPTS_DIR)) {
        log('❌ Prompts directory not found!', 'red');
        process.exit(1);
    }

    if (!fs.existsSync(REPORTS_DIR)) {
        log('❌ Reports directory not found!', 'red');
        process.exit(1);
    }

    // User instruction
    log('\n⚠️  IMPORTANT: Before running this script:', 'yellow');
    log('   1. Open Figma Desktop App', 'yellow');
    log('   2. Select a component to validate prompts against', 'yellow');
    log('   3. Ensure MCP tools are configured in VS Code', 'yellow');
    log('   4. This script will NOT modify any component documentation files', 'green');

    // Get list of prompt files
    const promptFiles = fs.readdirSync(PROMPTS_DIR)
        .filter(file => file.endsWith('.md') && !file.startsWith('README'))
        .sort();

    if (promptFiles.length === 0) {
        log('❌ No prompt files found!', 'red');
        process.exit(1);
    }

    log(`\n📝 Found ${promptFiles.length} prompt files to validate:`, 'blue');
    promptFiles.forEach(file => log(`   - ${file}`, 'cyan'));

    // Generate reports
    log('\n🔄 Generating validation reports...', 'yellow');
    let successCount = 0;
    let failCount = 0;

    promptFiles.forEach(file => {
        if (generateValidationReport(file)) {
            successCount++;
        } else {
            failCount++;
        }
    });

    // Summary
    log('\n📊 Validation Report Summary:', 'bright');
    log(`   ✅ Successfully generated: ${successCount} reports`, 'green');
    if (failCount > 0) {
        log(`   ❌ Failed to generate: ${failCount} reports`, 'red');
    }
    log(`   📁 Reports saved to: ${path.relative(process.cwd(), REPORTS_DIR)}`, 'blue');

    log('\n🎉 Validation report generation complete!', 'bright');
    log('   Review the reports to assess prompt quality and effectiveness.', 'cyan');
}

// Execute the script
if (require.main === module) {
    main();
}

module.exports = {
    generateValidationReport,
    analyzePromptContent,
    generateFileHeader
};
