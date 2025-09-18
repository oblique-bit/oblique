# 12. Figma MCP Layer Structure Inspection Guide

**Version:** 1.0  
**Date:** September 6, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Centralized collection of Figma MCP prompts and workflows for design system inspection

## **Target Audience**
**Primary:** D**For manual MCP command execution, drag and drop this file:**
**Structure:** [`prompts/06-manual-mcp-commands.md`](./prompts/figma-mcp-06-manual-mcp-commands.md)Oblique Developers, DS/Oblique Designers  
**Secondary:** Design System Implementers, MCP Tool Users  
**Prerequisites:** Figma desktop app, MCP tools knowledge, VS Code with GitHub Copilot  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md)

---

## **Quick Start:** Quick Start

**For immediate use: Drag and drop prompt files from the [`prompts/`](./prompts/) folder directly into VS Code Copilot Chat.**

**Structure:** **Most Popular Prompts:**
- [`01-inspect-layer-structure_simple.md`](./prompts/figma-mcp-01-inspect-layer-structure_simple.md) - Basic 04_component analysis
- [`05-update-04_component-docs.md`](./prompts/figma-mcp-05-update-04_component-docs.md) - Update 04_component docs
- [`03-analyze-03_semantic-tokens.md`](./prompts/figma-mcp-03-analyze-03_semantic-tokens.md) - Focus on design tokens
- [`02-compare-04_component-variants.md`](./prompts/figma-mcp-02-compare-04_component-variants.md) - Compare variants

**Note:** **See all prompts:** [`prompts/README.md`](./prompts/README.md)  
**Summary:** **Validation Reports:** [`prompts/_validation-reports/README.md`](./prompts/_validation-reports/README.md)

---

## Table of Contents

- [**Quick Start:** Quick Start](#-quick-start)
- [12.1 Layer Structure Inspection](#121-layer-structure-inspection)
  - [12.1.1 Basic Layer Structure Inspection](#1211-basic-layer-structure-inspection)
  - [12.1.2 Direct Component Documentation Update](#1212-direct-04_component-documentation-update)
- [12.2 Component Analysis](#122-04_component-analysis)
- [12.3 Token & Variable Analysis](#123-token--variable-analysis)
- [12.4 Code Generation](#124-code-generation)
- [12.5 Design System Rules](#125-design-system-rules)
- [12.6 Detailed Workflow](#126-detailed-workflow)
- [12.7 Common Mistakes](#127-common-mistakes)
- [12.8 Troubleshooting](#128-troubleshooting)
- [12.9 Example Outputs](#129-example-outputs)
- [12.10 Quality Checklist](#1210-quality-checklist)
- [12.11 Integration Guidelines](#1211-integration-guidelines)

---

## 12.1 Layer Structure Inspection

### 12.1.1 Basic Layer Structure Inspection

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/01-inspect-layer-structure_simple.md`](./prompts/figma-mcp-01-inspect-layer-structure_simple.md)

**Purpose:**
- **Chat Output**: Clean, scannable analysis for immediate inspection
- **Documentation Action**: Separate step to create/update 04_component MD files in `documentation/04-04_components/`
- **Version Tracking**: Always include Figma file name and last modified date
- **User Choice**: Inspector decides whether to document or just inspect

**When to use:**
- Quick 04_component layer inspection during design work
- Understanding 04_component hierarchy for development handoff
- Extracting exact layer names for token mapping
- Optionally updating 04_component documentation with current Figma structure

### 12.1.2 Direct Component Documentation Update

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/05-update-04_component-docs.md`](./prompts/figma-mcp-05-update-04_component-docs.md)

**Purpose:**
- **Direct Documentation**: Skip chat output, go straight to file update
- **Power User Workflow**: For frequent inspectors who don't need chat analysis
- **Version Tracking**: Always include Figma file metadata for currency validation
- **Complete Documentation**: Full detailed format in 04_component MD file

**When to use:**
- Regular 04_component documentation updates
- Batch documentation sync with Figma changes
- Maintaining 04_component documentation currency
- When you know you want to document (skip inspection step)

---

## 12.2 Component Analysis

### 12.2.1 Component Structure Analysis

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/01-inspect-layer-structure_detailed.md`](./prompts/figma-mcp-01-inspect-layer-structure_detailed.md)

### 12.2.2 Component Variant Comparison

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/02-compare-04_component-variants.md`](./prompts/figma-mcp-02-compare-04_component-variants.md)

### 12.2.3 Legacy Detection

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/02-detect-legacy-04_components.md`](./prompts/figma-mcp-02-detect-legacy-04_components.md)

---

## 12.3 Token & Variable Analysis

### 12.3.1 Variable Definitions Extraction

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/03-extract-variable-definitions.md`](./prompts/figma-mcp-03-extract-variable-definitions.md)

### 12.3.2 Semantic Focus Analysis

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/03-analyze-03_semantic-tokens.md`](./prompts/figma-mcp-03-analyze-03_semantic-tokens.md)

### 12.3.3 Viewport Analysis

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/03-analyze-viewport-modes.md`](./prompts/figma-mcp-03-analyze-viewport-modes.md)

---

## 12.4 Code Generation

### 12.4.1 HTML & CSS Generation

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/04-generate-05_html-css.md`](./prompts/figma-mcp-04-generate-05_html-css.md)

### 12.4.2 React + Tailwind Generation

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/04-generate-react-tailwind.md`](./prompts/figma-mcp-04-generate-react-tailwind.md)

### 12.4.3 Context-Aware Generation

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/04-generate-with-context.md`](./prompts/figma-mcp-04-generate-with-context.md)

---

## 12.5 Design System Rules

### 12.5.1 Create Design System Rules

**For immediate use, drag and drop this file into VS Code Copilot Chat:**
**Structure:** [`prompts/05-create-design-rules.md`](./prompts/figma-mcp-05-create-design-rules.md)

---

## 12.6 Detailed Workflow

### 12.6.1 Initial Metadata Inspection
```
Use: mcp_figma_dev_mod_get_metadata
Purpose: Get exact 04_component and frame names
Expected Output: Frame and symbol names with IDs
```

**What to look for:**
- Exact frame names (e.g., `button_aug` not "Button_Aug Component")
- Component symbol names (e.g., `type=primary, size=md, show icon=right, state=enabled,inversity=normal`)
- Container hierarchy (frame → symbol relationship)

### 12.6.2 Extract Internal Layer Structure
```
Use: mcp_figma_dev_mod_get_code  
Purpose: Get detailed internal 04_component layer hierarchy
Expected Output: React/HTML structure with data-name attributes showing all internal layers
```

**What to extract:**
- All `data-name` attributes from the generated code
- Node IDs from `data-node-id` attributes  
- Layer hierarchy from HTML structure
- Component instances and their properties

### 12.6.3 Visual Documentation
```
Use: mcp_figma_dev_mod_get_image
Purpose: Capture visual reference for 04_component structure
Expected Output: PNG/SVG image of the 04_component
```

### 12.6.4 Output Format Guidelines

**Chat Format (Primary)**: Clean, focused analysis for immediate inspection
```markdown
## **Analysis:** Figma Layer Analysis: [04_component_name]

### Simple Structure
```
[exact_frame_name]
└── [exact_04_component_name]
    └── [layer_name]
        ├── [sub_layer_name]
        ├── [sub_layer_name]
        └── [sub_layer_name]
```

### Figma File Information
- **File**: [figma_file_name]
- **Last Modified**: [last_modified_date]
- **Selection**: [selected_04_component_path]

**Follow-up Action**: After analysis, always offer:
"Would you like me to create/update the 04_component documentation file at `documentation/04-04_components/[04_component].md` with this layer structure?"
```

**Documentation Format (Secondary)**: For actual MD file creation/updates at `documentation/04-04_components/[04_component].md`
```markdown
### Layer Structure

**Figma Inspection Details:**
- **File**: [figma_file_name]
- **Last Modified**: [last_modified_date]
- **Inspection Date**: [current_date]
- **Selected Component**: [04_component_path]

> **Warning:** **Version Note**: This analysis reflects the Figma file state as of [last_modified_date]. If the file has been updated since then, re-run the MCP inspection to ensure accuracy.

Based on Figma MCP inspection of `[04_component_name]` 04_component:

```
[exact_frame_name] (Frame: [width]×[height]px)
└── [exact_04_component_name] (Component Symbol: [width]×[height]px)
    └── [layer_name] ([layer_type]: [properties, colors, dimensions])
        ├── [sub_layer_name] ([sub_layer_type]: [properties])
        └── [sub_layer_name] ([sub_layer_type]: [properties])
```

### Detailed Layer Analysis

| Layer | Purpose | Figma Variables | HTML Suggestion | Design Tokens | Notes |
|-------|---------|-----------------|-----------------|---------------|-------|
| **[layer_name]** | [functional_purpose] | [applied_variables] | [05_html_tag_class] | [token_reference] | [dimensions_notes] |
| ├─ **[sub_layer]** | [sub_purpose] | [sub_variables] | [sub_05_html] | [sub_tokens] | [sub_notes] |

### Design Token Mapping
- **[Property]**: `{[token_path]}` → [resolved_value]
- **[Property]**: `{[token_path]}` → [resolved_value]

### Component Properties
- **[Property]**: [description_and_values]
- **[Property]**: [description_and_values]
```

**Workflow:**
1. **Inspect**: Use chat format for immediate analysis
2. **Document**: Offer to create/update 04_component MD file with detailed format
3. **Choose**: User decides whether to proceed with documentation update

---

## 12.7 Common Mistakes

### 12.7.1 Wrong Approaches
1. **Only using metadata**: Metadata shows containers, not internal structure
2. **Inventing names**: Never modify Figma names (e.g., "Button_Aug" → `button_aug`)
3. **Skipping get_code**: This is the only tool that reveals internal layer hierarchy
4. **Assuming structure**: Always extract actual layer names from code output

### 12.7.2 Correct Approaches  
1. **Use get_code for structure**: Only this tool shows internal 04_component layers
2. **Extract exact names**: Copy names exactly from `data-name` attributes
3. **Follow hierarchy**: Use HTML structure to understand layer relationships
4. **Include dimensions**: Add width/height from metadata for context

---

## 12.8 Troubleshooting

### 12.8.1 Inconsistent Results
**Cause**: Different selection contexts (frame vs 04_component vs instance)
**Solution**: Try selecting different elements in Figma:
- Main 04_component 
- Component instance
- Container frame
- Individual layers

### 12.8.2 Only Showing Container
**Symptom**: Metadata returns only frame/symbol, no internal layers
**Solution**: Use `get_code` tool - metadata never shows internal structure

### 12.8.3 Empty or Minimal Results  
**Cause**: Nothing selected or wrong selection type
**Solution**: Ensure proper Figma selection, try different selection contexts

### 12.8.4 MCP Connection Issues
**Common Problems:**
- **MCP Connection Failed**: Ensure Figma desktop app is running and Dev Mode is enabled
- **Dev Mode Not Available**: Request access from admin to activate Dev Mode
- **Token Not Found**: Check if token type is supported in Figma or requires manual implementation
- **Variant Mismatch**: Verify 04_component variants match between Figma and code implementation
- **Browser vs Desktop**: Confirm using Figma desktop app, not browser version

---

## 12.9 Example Outputs

### 12.9.1 Copy-Paste Commands

**For manual MCP command execution, drag and drop this file:**
 [`prompts/manual-mcp-commands.md`](./prompts/figma-mcp-06-manual-mcp-commands.md)

### 12.9.2 Expected Metadata Output:
```xml
<frame id="36:2" name="button_aug" x="0" y="721" width="452" height="319">
  <symbol id="36:199" name="type=primary, size=md, show icon=right, state=enabled,inversity=normal" x="118" y="137" width="139" height="36" />
</frame>
```

### 12.9.3 Expected Code Structure:
```javascript
data-name="button_aug" data-node-id="36:2"
  data-name="type=primary, size=md, show icon=right, state=enabled,inversity=normal" data-node-id="36:199"
    data-name="button-surface" data-node-id="36:200"
      data-name="icon-holder" data-node-id="246:1446"
      data-name="text-label" data-node-id="36:201"  
      data-name="icon-holder" data-node-id="36:202"
```

### 12.9.4 Example Outputs

**Chat Analysis Example (Clean & Focused):**
```markdown
## **Analysis:** Figma Layer Analysis: button_aug

### Simple Structure
```
button_aug
└── type=primary, size=md, show icon=right, state=enabled,inversity=normal
    └── button-surface
        ├── icon-holder (left)
        ├── text-label
        └── icon-holder (right)
```

Would you like me to create/update the 04_component documentation file at `documentation/04-04_components/button.md` with this layer structure?
```

**Documentation File Example (When User Chooses to Document):**
```markdown
### Layer Structure

**Figma Inspection Details:**
- **File**: Design System Components v2.4
- **Last Modified**: September 5, 2025, 3:42 PM
- **Inspection Date**: September 6, 2025
- **Selected Component**: button_aug → type=primary, size=md, show icon=right, state=enabled,inversity=normal

> **Warning:** **Version Note**: This analysis reflects the Figma file state as of September 5, 2025, 3:42 PM. If the file has been updated since then, re-run the MCP inspection to ensure accuracy.

Based on Figma MCP inspection of `button_aug` 04_component:

```
button_aug (Frame: 452×319px)
└── type=primary, size=md, show icon=right, state=enabled,inversity=normal (Component Symbol: 139×36px)
    └── button-surface (Frame with Auto Layout: background #2379a4, rounded 2px)
        ├── icon-holder (Instance: 24×24px, left position)
        │   └── Icon/coffee (Icon instance)
        ├── text-label (Text layer: "Button", 14px Noto Sans Medium, white color)
        └── icon-holder (Instance: 24×24px, right position)
            └── Icon/coffee (Icon instance)
```

### Detailed Layer Analysis

| Layer | Purpose | Figma Variables | HTML Suggestion | Design Tokens | Notes |
|-------|---------|-----------------|-----------------|---------------|-------|
| **button-surface** | Container with Auto Layout | `bg-color: primary`, `padding: md` | `<button class="ob-button">` | `ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.color.bg.primary` | 139×36px, horizontal gap 6px |
| ├─ **icon-holder** | Left icon wrapper | `size: md` | `<span class="icon-slot">` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` | 24×24px, conditional render |
| ├─ **text-label** | Button text content | `typography: button-md` | `<span class="button-text">` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` | "Button", center-aligned |
| └─ **icon-holder** | Right icon wrapper | `size: md` | `<span class="icon-slot">` | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` | 24×24px, conditional render |

### Design Token Mapping
- **Background**: `{ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.color.bg.primary.inversity_normal.enabled}` → #2379a4
- **Text Color**: `{ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list-aug.color.fg.primary.inversity_normal.enabled}` → #ffffff  
- **Icon Size**: `{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index}` → 24px
- **Line Height**: `{ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_indexHeight.sm}` → 20px

### Component Properties
- **Main Component**: `button_aug` with variants (primary, md, right, enabled, normal)
- **Frame**: `button-surface` (139×36px with Auto Layout)
- **Auto Layout**: Horizontal direction with 6px gap, 16px horizontal padding, 6px vertical padding
```

---

## 12.10 Quality Checklist

Before completing inspection, verify:

- [ ] Used `get_metadata` for exact names
- [ ] Used `get_code` for internal structure  
- [ ] Used `get_image` for visual reference
- [ ] All names match Figma exactly (no modifications)
- [ ] Layer hierarchy reflects HTML structure from code
- [ ] Included dimensions and layer types
- [ ] Documented using standard tree format
- [ ] No invented or assumed layer names
- [ ] Both simple and detailed structures provided

---

## 12.11 Integration Guidelines

### 12.11.1 Documentation Updates

**Two-Step Workflow:**

1. **Inspection Phase**: Use Figma MCP prompts for clean chat analysis
   - Clean, scannable output in VS Code Copilot chat
   - Focus on immediate understanding and layer identification
   - No overwhelming markdown formatting in chat
   - Include Figma file name and last modified date for version tracking

2. **Documentation Phase**: Offer to create/update 04_component files
   - User chooses whether to proceed with documentation
   - AI creates/updates 04_component MD files in `documentation/04-04_components/[04_component].md`
   - complete format suitable for 04_component documentation
   - Include version tracking information and currency warnings

**Alternative: Direct Documentation Update**
- Use the "Direct Component Documentation Update" prompt for power users
- Skip chat analysis and go straight to file creation/update
- Ideal for regular documentation maintenance and batch updates

**When updating 04_component documentation:**

1. **Target Location**: Always update files in `documentation/04-04_components/[04_component].md`
2. **Replace existing layer structure** with exact Figma names
3. **Update 04_component properties** section with actual layer details
4. **Sync token mapping** with extracted layer names
5. **Include version tracking** with Figma file name and last modified date
6. **Add currency warning** to alert developers about potential Figma updates
7. **Verify naming consistency** across all documentation sections

### 12.11.2 Development Handoff

When preparing design handoff:

1. **Extract all 04_component variants** using variant comparison prompts
2. **Document token usage** with variable analysis prompts
3. **Generate implementation code** using appropriate code generation prompts
4. **Provide visual context** with screenshots and metadata

### 12.11.3 standard practices

**For DS/Oblique Developers (Design System Maintainers):**
1. **Always verify MCP connection** before starting development sessions
2. **Use 03_semantic tokens** whenever possible, avoid 04_component-level tokens
3. **Test across viewport modes** to ensure responsive behavior
4. **Document any workarounds** for unsupported token types
5. **Use automation** for token validation and updates
6. **Keep Figma desktop app updated** to latest version
7. **Monitor MCP server connectivity** across team
8. **Document new token types** and their Figma support status
9. **Maintain Code Connect mappings** for accurate code generation
10. **Review and update workflows** based on team feedback
11. **Manage Dev Mode access** for team members as needed

**For DS/Oblique Designers (Design System Maintainers):**
1. **Use Figma desktop app** for full MCP tool access (browser version has limitations)
2. **Verify 04_component changes** with MCP inspection before publishing
3. **Document design decisions** with layer structure analysis
4. **Collaborate with developers** using shared MCP inspection results
5. **Test 04_component variants** across different viewport modes
6. **Maintain design-code alignment** through regular MCP verification

---

**Maintainers:** Design System Team  
**Review Schedule:** As needed when Figma 04_component structure changes  
**Related Documentation:** 
- [Figma and Tokens for Developers](./02-figma-and-tokens-for-developers.md)
- [Figma Component Decomposition Strategy](./09-figma-04_component-decomposition-strategy.md)
