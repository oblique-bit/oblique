/**
 * Folder Reorganization Strategy
 * Purpose: Correctly separate Figma-only content from R13-Legacy developer content
 * Date: September 18, 2025
 */

const path = require('path');
const fs = require('fs');

const REORGANIZATION_PLAN = {
    // Current problematic structure
    current: {
        '_FIGMA-ONLY/': {
            description: 'Misleading name - contains mixed content types',
            contents: [
                'figma-doc/ - Actually Figma-only (design workflow)',
                'typography-styles-R13.json - Actually R13-Legacy for developers'
            ]
        }
    },
    
    // Proposed new structure
    proposed: {
        '_FIGMA-ONLY/': {
            description: 'Pure Figma design workflow only',
            contents: ['figma-doc/ folder only'],
            audience: 'Designers using Figma',
            purpose: 'Design workflow, canvas colors, documentation tokens'
        },
        'R13-LEGACY/': {
            description: 'R13 legacy tokens for ongoing release developers',
            contents: ['typography-styles-R13.json'],
            audience: 'Developers maintaining current R13 applications',
            purpose: 'Typography styles for R13 compatibility'
        }
    },
    
    // Alternative naming options
    alternatives: {
        option1: {
            figmaOnly: '_FIGMA-ONLY/',
            r13Legacy: 'R13-LEGACY/'
        },
        option2: {
            figmaOnly: '_DESIGN-WORKFLOW-ONLY/',
            r13Legacy: '_CURRENT-RELEASES/'
        },
        option3: {
            figmaOnly: '_FIGMA-ONLY/',
            r13Legacy: '_DEV-IGNORE/'  // If you want to hide from main development
        }
    }
};

async function analyzeCurrentStructure() {
    console.log('📁 FOLDER REORGANIZATION ANALYSIS');
    console.log('================================');
    
    const basePath = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes';
    const figmaOnlyPath = path.join(basePath, '_FIGMA-ONLY');
    
    console.log('\\n🔍 CURRENT STRUCTURE ANALYSIS:');
    console.log('------------------------------');
    
    // Analyze figma-doc content (truly Figma-only)
    const figmaDocPath = path.join(figmaOnlyPath, 'figma-doc');
    if (fs.existsSync(figmaDocPath)) {
        console.log('\\n🎨 ACTUAL FIGMA-ONLY CONTENT:');
        const figmaDocFiles = fs.readdirSync(figmaDocPath, { recursive: true });
        figmaDocFiles.forEach(file => {
            if (file.endsWith('.json')) {
                const fullPath = path.join(figmaDocPath, file);
                const stats = fs.statSync(fullPath);
                console.log(`   • figma-doc/${file} (${Math.round(stats.size/1024)}KB)`);
            }
        });
    }
    
    // Analyze R13 content (developer legacy)
    const r13File = path.join(figmaOnlyPath, 'typography-styles-R13.json');
    if (fs.existsSync(r13File)) {
        console.log('\\n⚙️  R13-LEGACY CONTENT (MISPLACED):');
        const stats = fs.statSync(r13File);
        console.log(`   • typography-styles-R13.json (${Math.round(stats.size/1024)}KB)`);
        
        // Analyze content to confirm it's for developers
        const content = fs.readFileSync(r13File, 'utf8');
        const tokenCount = (content.match(/\\$value/g) || []).length;
        console.log(`   • Contains ${tokenCount} R13 typography tokens`);
        console.log(`   • Purpose: Typography styles for R13 compatibility`);
        console.log(`   • Audience: Developers maintaining R13 applications`);
        console.log(`   • Status: MISPLACED in _FIGMA-ONLY folder`);
    }
    
    console.log('\\n❌ PROBLEM IDENTIFIED:');
    console.log('---------------------');
    console.log('• _FIGMA-ONLY contains mixed content types');  
    console.log('• R13-Legacy content is for DEVELOPERS, not Figma workflow');
    console.log('• Current structure is misleading for both audiences');
    
    console.log('\\n✅ PROPOSED SOLUTION:');
    console.log('--------------------');
    console.log('1. Keep _FIGMA-ONLY/ for actual Figma workflow content');
    console.log('2. Create R13-LEGACY/ or _CURRENT-RELEASES/ for R13 content');
    console.log('3. Update references and documentation accordingly');
    
    return {
        figmaOnlyFiles: figmaDocFiles || [],
        r13FileExists: fs.existsSync(r13File),
        r13FileSize: fs.existsSync(r13File) ? fs.statSync(r13File).size : 0
    };
}

async function proposeReorganization() {
    console.log('\\n📋 REORGANIZATION PROPOSAL:');
    console.log('===========================');
    
    console.log('\\n🎯 OPTION 1: Clear Separation (Recommended)');
    console.log('├── _FIGMA-ONLY/');
    console.log('│   └── figma-doc/           # Pure Figma workflow content');
    console.log('│       ├── colors-static.json');
    console.log('│       ├── typography.json');
    console.log('│       └── theme/');
    console.log('├── R13-LEGACY/');
    console.log('│   └── typography-styles-R13.json  # R13 compatibility for developers');
    console.log('└── [rest of design system structure]');
    
    console.log('\\n🎯 OPTION 2: Hidden Current Releases');
    console.log('├── _FIGMA-ONLY/');
    console.log('│   └── figma-doc/           # Pure Figma workflow content');  
    console.log('├── _DEV-IGNORE/');
    console.log('│   └── typography-styles-R13.json  # Hidden from main development');
    console.log('└── [rest of design system structure]');
    
    console.log('\\n🎯 OPTION 3: Descriptive Naming');
    console.log('├── _DESIGN-WORKFLOW-ONLY/');
    console.log('│   └── figma-doc/           # Figma design workflow');
    console.log('├── _CURRENT-RELEASES/');  
    console.log('│   └── typography-styles-R13.json  # Current release support');
    console.log('└── [rest of design system structure]');
    
    console.log('\\n💡 RECOMMENDED APPROACH:');
    console.log('========================');
    console.log('• OPTION 1 with clear, explicit naming');
    console.log('• _FIGMA-ONLY/ = Pure Figma workflow (designers only)');
    console.log('• R13-LEGACY/ = Current release support (developers only)');
    console.log('• Main themes/ = Future design system (99% of content)');
    
    return REORGANIZATION_PLAN;
}

// Command line interface
if (require.main === module) {
    analyzeCurrentStructure()
        .then(() => proposeReorganization())
        .catch(console.error);
}

module.exports = { analyzeCurrentStructure, proposeReorganization, REORGANIZATION_PLAN };
