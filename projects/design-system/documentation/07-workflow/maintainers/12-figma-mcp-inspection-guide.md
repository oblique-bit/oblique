# 12. Figma MCP Layer Structure Inspection Guide

**Version:** 1.0  
**Date:** September 6, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Centralized collection of Figma MCP prompts and workflows for design system inspection

## **Target Audience**
**Primary:** DS/Oblique Developers, DS/Oblique Designers  
**Secondary:** Design System Implementers, MCP Tool Users  
**Prerequisites:** Figma desktop app, MCP tools knowledge, VS Code with GitHub Copilot  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md)

---

## Table of Contents

- [12.1 Layer Structure Inspection](#121-layer-structure-inspection)
- [12.2 Component Analysis](#122-component-analysis)
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

**Copy this exact prompt to request Figma layer structure analysis:**

```
🎯 FIGMA LAYER STRUCTURE INSPECTION

I need to inspect the Figma component layer structure using MCP tools. Follow this exact workflow:

1. **Get Metadata First**: Use mcp_figma_dev_mod_get_metadata to see component/frame names
2. **Extract Code Structure**: Use mcp_figma_dev_mod_get_code to get internal layer hierarchy  
3. **Get Visual Context**: Use mcp_figma_dev_mod_get_image for visual reference
4. **Use Exact Names**: Never invent or modify component names - use exactly as shown in Figma
5. **Document Structure**: Create hierarchical tree using exact Figma layer names

CRITICAL: Use get_code tool to extract internal layer structure. Metadata alone shows only top-level containers.

DOCUMENTATION FORMAT: Provide BOTH layer structure formats:
- **Simple Structure**: Layer names only (clean hierarchy without technical details)
- **Detailed Structure**: Include dimensions, properties, colors, and technical specifications
```

**When to use:**
- Documenting component anatomy for design system documentation
- Extracting exact layer names for token mapping
- Understanding component hierarchy for development handoff
- Creating component architecture diagrams

---

## 12.2 Component Analysis

### 12.2.1 Component Structure Analysis

```
🔍 COMPONENT STRUCTURE ANALYSIS

Show the full layer structure of this component using MCP tools:
1. Get metadata for component frame and symbol names
2. Extract internal layer hierarchy with get_code
3. Document both simple and detailed layer structures
```

### 12.2.2 Component Variant Comparison

```
🔀 COMPONENT VARIANT COMPARISON

Show all component variants and highlight their main differences:
1. Use get_metadata to identify all variants
2. Use get_code for each variant to extract structure
3. Compare layer structures and properties
4. Highlight differences between variants
```

### 12.2.3 Legacy Detection

```
🚨 LEGACY COMPONENT DETECTION

List legacy (deprecated) variables used in this component:
1. Extract variable definitions with get_variable_defs
2. Identify deprecated patterns or naming conventions
3. List components using legacy tokens
4. Provide migration recommendations
```

---

## 12.3 Token & Variable Analysis

### 12.3.1 Variable Definitions Extraction

```
🎨 VARIABLE DEFINITIONS EXTRACTION

Get variable definitions for this selection:
1. Use mcp_figma_dev_mod_get_variable_defs to extract all variables
2. List variable names, values, and scopes
3. Identify variable modes (light/dark, mobile/desktop)
4. Document variable relationships and references
```

### 12.3.2 Semantic Focus Analysis

```
🎯 SEMANTIC TOKEN FOCUS

Focus only on semantic components; exclude component-level variables:
1. Filter out component-level variables (e.g., `ob.c`, `ob.h`)
2. Show only semantic tokens (`ob.s`) and primitive tokens (`ob.p`)
3. Document semantic token usage patterns
4. Identify token hierarchy relationships
```

### 12.3.3 Viewport Analysis

```
📱 VIEWPORT MODE ANALYSIS

Identify which variables change based on viewport mode:
1. Extract variable definitions for mobile and desktop modes
2. Compare values across viewport modes
3. List variables that change vs. those that remain stable
4. Document responsive behavior patterns
```

---

## 12.4 Code Generation

### 12.4.1 HTML & CSS Generation

```
💻 HTML & CSS CODE GENERATION

Generate HTML and CSS for all component variants:
1. Use get_code to generate component code
2. Include all variant states and properties
3. Generate clean, semantic HTML structure
4. Provide corresponding CSS with exact token values
```

### 12.4.2 React + Tailwind Generation

```
⚛️ REACT + TAILWIND GENERATION

Generate React + Tailwind code using existing component mappings:
1. Use get_code_connect_map to identify existing mappings
2. Generate React component with TypeScript props
3. Use Tailwind classes that match token values
4. Include variant handling and prop validation
```

### 12.4.3 Context-Aware Generation

```
🖼️ CONTEXT-AWARE CODE GENERATION

Provide screenshot plus design metadata for context-aware code generation:
1. Use get_image for visual reference
2. Use get_metadata for component specifications
3. Use get_code for implementation structure
4. Generate code that matches exact visual appearance
```

---

## 12.5 Design System Rules

### 12.5.1 Create Design System Rules

```
📋 DESIGN SYSTEM RULES CREATION

Create a Design System rule file for this component to guide AI-based code generation:
1. Use mcp_figma_dev_mod_create_design_system_rules
2. Define component patterns and constraints
3. Specify token usage rules
4. Document naming conventions and structure patterns
```

---

## 12.6 Detailed Workflow

### 12.6.1 Initial Metadata Inspection
```
Use: mcp_figma_dev_mod_get_metadata
Purpose: Get exact component and frame names
Expected Output: Frame and symbol names with IDs
```

**What to look for:**
- Exact frame names (e.g., `button_aug` not "Button_Aug Component")
- Component symbol names (e.g., `type=primary, size=md, show icon=right, state=enabled,inversity=normal`)
- Container hierarchy (frame → symbol relationship)

### 12.6.2 Extract Internal Layer Structure
```
Use: mcp_figma_dev_mod_get_code  
Purpose: Get detailed internal component layer hierarchy
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
Purpose: Capture visual reference for component structure
Expected Output: PNG/SVG image of the component
```

### 12.6.4 Structure Documentation Template

Use these exact formats for documenting layer structure:

**Format 1: Simple Layer Structure (Clean Hierarchy)**
```markdown
### Simple Layer Structure
```
[exact_frame_name]
└── [exact_component_name]
    └── [layer_name]
        ├── [sub_layer_name]
        ├── [sub_layer_name]
        └── [sub_layer_name]
```

**Format 2: Detailed Layer Structure (Technical Specifications)**
```markdown
### Detailed Layer Structure
```
[exact_frame_name] (Frame: [width]×[height]px)
└── [exact_component_name] (Component Symbol: [width]×[height]px)
    └── [layer_name] ([layer_type]: [properties, colors, dimensions])
        ├── [sub_layer_name] ([sub_layer_type]: [properties])
        ├── [sub_layer_name] ([sub_layer_type]: [properties])
        └── [sub_layer_name] ([sub_layer_type]: [properties])
```

---

## 12.7 Common Mistakes

### 12.7.1 Wrong Approaches
1. **Only using metadata**: Metadata shows containers, not internal structure
2. **Inventing names**: Never modify Figma names (e.g., "Button_Aug" → `button_aug`)
3. **Skipping get_code**: This is the only tool that reveals internal layer hierarchy
4. **Assuming structure**: Always extract actual layer names from code output

### 12.7.2 Correct Approaches  
1. **Use get_code for structure**: Only this tool shows internal component layers
2. **Extract exact names**: Copy names exactly from `data-name` attributes
3. **Follow hierarchy**: Use HTML structure to understand layer relationships
4. **Include dimensions**: Add width/height from metadata for context

---

## 12.8 Troubleshooting

### 12.8.1 Inconsistent Results
**Cause**: Different selection contexts (frame vs component vs instance)
**Solution**: Try selecting different elements in Figma:
- Main component 
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
- **Variant Mismatch**: Verify component variants match between Figma and code implementation
- **Browser vs Desktop**: Confirm using Figma desktop app, not browser version

---

## 12.9 Example Outputs

### 12.9.1 Copy-Paste Commands

**Use these exact MCP commands in sequence:**

```
🔧 COMMAND 1: Get metadata
mcp_figma_dev_mod_get_metadata

🔧 COMMAND 2: Extract code structure  
mcp_figma_dev_mod_get_code

🔧 COMMAND 3: Get visual reference
mcp_figma_dev_mod_get_image
```

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

### 12.9.4 Final Documentation Examples:

**Simple Layer Structure:**
```markdown
### Simple Layer Structure
```
button_aug
└── type=primary, size=md, show icon=right, state=enabled,inversity=normal
    └── button-surface
        ├── icon-holder
        │   └── Icon/coffee
        ├── text-label
        └── icon-holder
            └── Icon/coffee
```

**Detailed Layer Structure:**
```markdown
### Detailed Layer Structure
```
button_aug (Frame: 452×319px)
└── type=primary, size=md, show icon=right, state=enabled,inversity=normal (Component Symbol: 139×36px)
    └── button-surface (Frame with Auto Layout: background #2379a4, rounded 2px)
        ├── icon-holder (Instance: 24×24px, left position)
        │   └── Icon/coffee (Icon instance with Vector)
        ├── text-label (Text layer: "Button", 14px Noto Sans Medium, white color)
        └── icon-holder (Instance: 24×24px, right position)
            └── Icon/coffee (Icon instance with Vector)
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

When updating component documentation:

1. **Replace existing layer structure** with exact Figma names
2. **Update component properties** section with actual layer details
3. **Sync token mapping** with extracted layer names
4. **Verify naming consistency** across all documentation sections

### 12.11.2 Development Handoff

When preparing design handoff:

1. **Extract all component variants** using variant comparison prompts
2. **Document token usage** with variable analysis prompts
3. **Generate implementation code** using appropriate code generation prompts
4. **Provide visual context** with screenshots and metadata

### 12.11.3 Best Practices

**For Developers:**
1. **Always verify MCP connection** before starting development sessions
2. **Use semantic tokens** whenever possible, avoid component-level tokens
3. **Test across viewport modes** to ensure responsive behavior
4. **Document any workarounds** for unsupported token types
5. **Use automation** for token validation and updates

**For Maintainers:**
1. **Keep Figma desktop app updated** to latest version
2. **Monitor MCP server connectivity** across team
3. **Document new token types** and their Figma support status
4. **Maintain Code Connect mappings** for accurate code generation
5. **Review and update workflows** based on team feedback
6. **Manage Dev Mode access** for team members as needed

---

**Maintainers:** Design System Team  
**Review Schedule:** As needed when Figma component structure changes  
**Related Documentation:** 
- [Figma and Tokens for Developers](./02-figma-and-tokens-for-developers.md)
- [Figma Component Decomposition Strategy](./09-figma-component-decomposition-strategy.md)
