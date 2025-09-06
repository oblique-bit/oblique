#!/usr/bin/env node
/**
 * Language Validation and Cleanup Script
 * Removes emojis and replaces complex words with simpler alternatives
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/documentation';

// Word replacements for simpler language
const wordReplacements = {
    'comprehensive': 'complete',
    'sophisticated': 'advanced',
    'extensive': 'wide',
    'elaborate': 'detailed',
    'exhaustive': 'complete',
    'intricate': 'complex',
    'best practices': 'standard practices',
    'best practice': 'standard practice',
    'the best': 'high-quality',
    'optimize': 'improve',
    'optimized': 'improved',
    'optimization': 'improvement',
    'very': ''
};

// Emoji replacements
const emojiReplacements = {
    '🎯': '**Goal:**',
    '🚀': '**Quick Start:**',
    '✅': '**Success:**',
    '❌': '**Error:**',
    '🔧': '**Setup:**',
    '📋': '**Requirements:**',
    '🛡️': '**Validation:**',
    '🤖': '**Automation:**',
    '📁': '**Structure:**',
    '⚠️': '**Warning:**',
    '🤝': '**Contributing:**',
    '🎨': '**Design:**',
    '🏗️': '**Architecture:**',
    '💫': '**Features:**',
    '🔍': '**Analysis:**',
    '🔒': '**Security:**',
    '📊': '**Summary:**',
    '🎼': '**System:**',
    '🔄': '**Process:**',
    '🎉': '**Complete:**',
    '⭐': '**Important:**',
    '💯': '**Perfect:**',
    // Additional emoji patterns
    '📝': '**Note:**',
    '💡': '**Tip:**',
    '🔨': '**Tools:**',
    '📄': '**Document:**',
    '🌟': '**Highlight:**',
    '🎪': '**Demo:**',
    '🧪': '**Test:**',
    '👀': '**Review:**',
    '🚦': '**Status:**',
    '🔗': '**Link:**',
    '📈': '**Progress:**',
    '🎁': '**Package:**',
    '🌈': '**Theme:**',
    '🔰': '**Beginner:**',
    '🏃': '**Quick:**',
    '💥': '**Breaking:**'
};

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    // Replace emojis - use Unicode regex to catch all emoji patterns
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E6}-\u{1F1FF}]/gu;
    
    // First, replace known emojis with specific replacements
    for (const [emoji, replacement] of Object.entries(emojiReplacements)) {
        const regex = new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        if (matches) {
            content = content.replace(regex, replacement);
            changes += matches.length;
        }
    }
    
    // Handle malformed emoji sequences and unicode issues
    content = content.replace(/\*\*Note:\*\*️/g, '**Note:**');
    content = content.replace(/\*\*Quick:\*\*‍\*\*Note:\*\*️/g, '**Quick Note:**');
    content = content.replace(/\*\*\*\*Note:\*\*️/g, '**Note:**');
    content = content.replace(/⏱️/g, '**Time:**');
    content = content.replace(/�️/g, '');
    content = content.replace(/�/g, '');
    
    // Then, remove any remaining emojis with generic replacement
    const remainingEmojis = content.match(emojiRegex);
    if (remainingEmojis) {
        content = content.replace(emojiRegex, '**Note:**');
        changes += remainingEmojis.length;
    }
    
    // Replace complex words (case insensitive) - handle edge cases
    for (const [complex, simple] of Object.entries(wordReplacements)) {
        if (complex === 'very') {
            // Special handling for 'very' - only remove when it's clearly a qualifier
            content = content.replace(/\bvery\s+/gi, '');
            content = content.replace(/\s+very\b/gi, '');
            const matches = content.match(/\bvery\b/gi);
            if (matches) changes += matches.length;
        } else {
            const regex = new RegExp(`\\b${complex}\\b`, 'gi');
            const matches = content.match(regex);
            if (matches) {
                content = content.replace(regex, simple);
                changes += matches.length;
            }
        }
    }
    
    if (changes > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✓ Cleaned ${changes} issues in ${path.relative(DOCS_DIR, filePath)}`);
    }
    
    return changes;
}

function main() {
    const markdownFiles = glob.sync('**/*.md', { cwd: DOCS_DIR });
    let totalChanges = 0;
    
    console.log('🧹 LANGUAGE CLEANUP STARTING...');
    console.log('================================');
    
    for (const file of markdownFiles) {
        const filePath = path.join(DOCS_DIR, file);
        totalChanges += cleanFile(filePath);
    }
    
    console.log('================================');
    console.log(`✅ Cleaned ${totalChanges} language issues across ${markdownFiles.length} files`);
    console.log('✅ Documentation now uses professional, clear language');
}

main();
