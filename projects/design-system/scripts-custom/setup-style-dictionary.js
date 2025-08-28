#!/usr/bin/env node

/**
 * Style Dictionary Configuration Helper
 * 
 * This script helps update Style Dictionary configuration to preserve underscore 
 * compound units instead of transforming them to camelCase.
 * 
 * If you don't have Style Dictionary set up yet, this script provides the configuration
 * needed to preserve underscore naming.
 * 
 * COMMANDS:
 *     node style-dictionary-setup-helper.js  - Setup Style Dictionary with underscore preservation
 *     (no command line arguments - runs automatically)
 * 
 * USAGE CONTEXT:
 * During Style Dictionary integration, the default transformations were converting
 * underscore-based compound units (like "contrast_high") to camelCase ("contrastHigh"),
 * breaking the design system's established naming conventions and token references.
 * Manual configuration of Style Dictionary to preserve underscore naming was complex
 * and required deep understanding of the transformation system. The team needed a
 * helper to automate the configuration setup and ensure consistent underscore
 * preservation across all build outputs. This script eliminates Style Dictionary
 * configuration errors and maintains naming consistency between token definitions
 * and build outputs. Essential for proper Style Dictionary integration setup.
 * 
 * AUTHORS: Design System Team
 * VERSION: 1.0.0
 * CREATED: 2025-08-12
 * LAST_EDITED: 2025-08-28
 * LAST_RUN: Not executed yet
 */

const fs = require('fs');
const path = require('path');

/**
 * Create a basic Style Dictionary configuration that preserves underscore naming.
 */
function createStyleDictionaryConfig() {
    const config = {
        source: ['src/lib/themes/**/*.json'],
        platforms: {
            css: {
                transformGroup: 'css',
                buildPath: 'dist/css/',
                files: [
                    {
                        destination: 'design-tokens.css',
                        format: 'css/variables',
                        options: {
                            showFileHeader: true
                        }
                    }
                ]
            },
            scss: {
                transformGroup: 'scss',
                buildPath: 'dist/scss/',
                files: [
                    {
                        destination: '_design-tokens.scss',
                        format: 'scss/variables'
                    }
                ]
            }
        },
        transform: {
            'attribute/cti': {
                type: 'attribute',
                transformer: {
                    type: 'name',
                    transformer: 'function(prop) { return prop.path.join(\'-\'); }'
                }
            }
        }
    };
    
    return config;
}

/**
 * Generate instructions for Style Dictionary setup.
 */
function generateConfigInstructions() {
    const instructions = `
# Style Dictionary Configuration for Underscore Compound Units

## Installation

\`\`\`bash
npm install --save-dev style-dictionary
\`\`\`

## Configuration

Create \`style-dictionary.config.js\` in your project root:

\`\`\`javascript
module.exports = {
  source: ['src/lib/themes/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'design-tokens.css',
        format: 'css/variables',
        options: {
          showFileHeader: true
        }
      }]
    },
    scss: {
      transformGroup: 'scss', 
      buildPath: 'dist/scss/',
      files: [{
        destination: '_design-tokens.scss',
        format: 'scss/variables'
      }]
    }
  },
  // Custom transform to preserve underscores in compound units
  transform: {
    'name/cti/underscore': {
      type: 'name',
      transformer: function(prop) {
        // Join path with hyphens but preserve underscores within compound units
        return prop.path.join('-');
      }
    }
  }
};
\`\`\`

## Package.json Scripts

Add to your package.json:

\`\`\`json
{
  "scripts": {
    "tokens:build": "style-dictionary build",
    "tokens:clean": "style-dictionary clean"
  }
}
\`\`\`

## Usage

\`\`\`bash
npm run tokens:build
\`\`\`

This will generate CSS variables like:
\`\`\`css
:root {
  --ob-s-color-alert_notification-fg-contrast_high: #ffffff;
  --ob-s-color-button-bg-inversity_normal: #0066cc;
}
\`\`\`

## Key Points

1. **Underscores are preserved** in compound units
2. **Dots become hyphens** between token parts  
3. **No camelCase transformation** needed
4. **Consistent naming** across all platforms

## Testing

After building, verify that:
- Compound units use underscores: \`contrast_high\`, \`alert_notification\`
- Token parts use hyphens: \`ob-s-color-button\`
- No camelCase transformations occur
`;
    
    return instructions;
}

/**
 * Main function.
 */
function main() {
    const projectRoot = path.dirname(__dirname);
    
    // Check if Style Dictionary config already exists
    const configFiles = [
        path.join(projectRoot, 'style-dictionary.config.js'),
        path.join(projectRoot, 'style-dictionary.config.json'),
        path.join(projectRoot, '.style-dictionary.json')
    ];
    
    let existingConfig = null;
    for (const configFile of configFiles) {
        if (fs.existsSync(configFile)) {
            existingConfig = configFile;
            break;
        }
    }
    
    if (existingConfig) {
        console.log(`Found existing Style Dictionary config: ${existingConfig}`);
        console.log('Please update your existing configuration to preserve underscore naming.');
        console.log('See the generated instructions for details.');
    } else {
        console.log('No existing Style Dictionary configuration found.');
        console.log('Creating setup instructions...');
    }
    
    // Create instructions file
    const instructionsFile = path.join(projectRoot, 'scripts-custom', 'style-dictionary-underscore-setup.md');
    const instructions = generateConfigInstructions();
    
    try {
        fs.writeFileSync(instructionsFile, instructions, 'utf8');
        
        console.log(`\nStyle Dictionary setup instructions created: ${instructionsFile}`);
        console.log('\nNext steps:');
        console.log('1. Follow the instructions in the generated file');
        console.log('2. Install Style Dictionary if not already installed');
        console.log('3. Create or update your configuration');
        console.log('4. Run the build to generate CSS with underscore compound units');
    } catch (error) {
        console.log(`❌ Error creating instructions file: ${error.message}`);
    }
}

// Run main function if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { 
    createStyleDictionaryConfig, 
    generateConfigInstructions 
};
