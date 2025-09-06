#!/usr/bin/env node
/**
 * Fix Figma MCP prompt links
 */

const fs = require('fs');
const path = require('path');

const fixes = {
    './prompts/06-manual-mcp-commands.md': './prompts/figma-mcp-06-manual-mcp-commands.md',
    './prompts/01-inspect-layer-structure_simple.md': './prompts/figma-mcp-01-inspect-layer-structure_simple.md',
    './prompts/05-update-component-docs.md': './prompts/figma-mcp-05-update-component-docs.md',
    './prompts/03-analyze-semantic-tokens.md': './prompts/figma-mcp-03-analyze-semantic-tokens.md',
    './prompts/02-compare-component-variants.md': './prompts/figma-mcp-02-compare-component-variants.md',
    './prompts/01-inspect-layer-structure_detailed.md': './prompts/figma-mcp-01-inspect-layer-structure_detailed.md',
    './prompts/02-detect-legacy-components.md': './prompts/figma-mcp-02-detect-legacy-components.md',
    './prompts/03-extract-variable-definitions.md': './prompts/figma-mcp-03-extract-variable-definitions.md',
    './prompts/03-analyze-viewport-modes.md': './prompts/figma-mcp-03-analyze-viewport-modes.md',
    './prompts/04-generate-html-css.md': './prompts/figma-mcp-04-generate-html-css.md',
    './prompts/04-generate-react-tailwind.md': './prompts/figma-mcp-04-generate-react-tailwind.md',
    './prompts/04-generate-with-context.md': './prompts/figma-mcp-04-generate-with-context.md',
    './prompts/05-create-design-rules.md': './prompts/figma-mcp-05-create-design-rules.md',
    './prompts/manual-mcp-commands.md': './prompts/figma-mcp-06-manual-mcp-commands.md'
};

const filePath = '/Users/davorradisic/vc git repo bit/oblique/projects/design-system/documentation/07-workflow/maintainers/12-figma-mcp-inspection-guide.md';

let content = fs.readFileSync(filePath, 'utf8');
let fixedCount = 0;

for (const [oldLink, newLink] of Object.entries(fixes)) {
    const oldPattern = `](${oldLink})`;
    const newPattern = `](${newLink})`;
    
    if (content.includes(oldPattern)) {
        content = content.replace(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern);
        fixedCount++;
        console.log(`✓ Fixed: ${oldLink} → ${newLink}`);
    }
}

fs.writeFileSync(filePath, content);
console.log(`\n✅ Fixed ${fixedCount} links in 12-figma-mcp-inspection-guide.md`);
