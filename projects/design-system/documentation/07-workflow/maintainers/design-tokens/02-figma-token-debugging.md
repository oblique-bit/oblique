# Figma Variable Debugging Guide
**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Diagnostic methods for troubleshooting design variables in Figma with Token Studio

This document provides diagnostic methods for troubleshooting design variables in Figma, particularly when working with Token Studio and variable detachment.

---

## Diagnostic Method: Finding Hidden Variables

### Problem
When - Apply to Badge, Button, Link, Infobox, Pill, Popover, Spinner, Tooltip
3. Combine with S1/S2/S3 variable application after cleanup
4. Version control each cleaned component for rollback capabilitying to detach all variables from a Figma component, sometimes one variable remains attached but you can't identify which layer contains it or which variable it is.

### Solution: MCP Variable Detection

Use the Figma MCP (Model Context Protocol) tools to inspect the currently selected object and identify any remaining variables.

#### Step-by-Step Process

1. **Select the problematic component** in Figma
2. **Use MCP variable detection** to identify remaining variables:
   ```
   mcp_figma_dev_mod_get_variable_defs
   ```
3. **Analyze the results** to identify:
   - Variable name/path
   - Variable value
   - Layer where it's applied

#### Example Output
```json
{
  "ob/h/button/icon-only/surface/size/md": "36"
}
```

This tells you:
- **Variable**: `ob/h/button/icon-only/surface/size/md`
- **Value**: `36` (likely pixels)
- **Type**: Size variable for icon-only button surface
- **Layer**: Applied to the surface/background layer of the component

#### Finding the Specific Layer

Based on the variable name, you can deduce:
- **Variable path**: `ob/h/button/icon-only/surface/size/md`
- **Component**: Button
- **Variant**: Icon-only
- **Property**: Surface size
- **Size**: Medium (md)

### **Most likely applied to:**
- Background/Surface layer
- Container layer
- Clickable area layer

#### Search Strategy

1. **Layer names to check:**
   - "Background"
   - "Surface" 
   - "Container"
   - "Base"
   - "Frame"

2. **Properties to inspect:**
   - Width/Height (for size variables)
   - Padding (for spacing variables)
   - Border radius (for radius variables)
   - Colors (for color variables)

3. **Look for the exact value** (36 in this example) in layer properties

---

## Common Variable Types and Their Layers

### Size Variables
- **Pattern**: `ob/h/component/variant/surface/size/scale`
- **Applied to**: Background, container, or frame layers
- **Properties**: Width, height, or both

### Color Variables
- **Pattern**: `ob/s/color/category/property/contrast/theme`
- **Applied to**: Fill, stroke, or text layers
- **Properties**: Fill color, stroke color, text color

### Spacing Variables
- **Pattern**: `ob/s/spacing/category/scale`
- **Applied to**: Container layers, auto-layout frames
- **Properties**: Padding, gap, margins

### Typography Variables
- **Pattern**: `ob/s/typography/category/property`
- **Applied to**: Text layers
- **Properties**: Font family, size, weight, line height

---

## Troubleshooting Workflow

### 1. Identify Remaining Variables
```bash
# Select component in Figma
# Run MCP command to get variable definitions
mcp_figma_dev_mod_get_variable_defs
```

### 2. Decode Variable Information
- Parse the variable path to understand component/property
- Identify expected layer type from variable category
- Determine likely property (size, color, spacing, etc.)

### 3. Locate the Layer
- Check layer panel for matching names
- Look for the specific value in layer properties
- Inspect nested layers and component variants

### 4. Verify and Detach
- Confirm the variable is applied to the identified layer
- Detach the variable manually
- Verify no other variables remain

---

## Prevention Strategies

### Component Setup
1. **Use consistent layer naming** (Background, Surface, Text, Icon)
2. **Document variable applications** in component descriptions
3. **Test variable detachment** during component development

### Variable Management
1. **Use semantic variable names** that clearly indicate purpose
2. **Follow consistent naming conventions** across all variables
3. **Document variable-to-layer mappings** for complex components

### Quality Assurance
1. **Regular variable audits** using MCP diagnostic tools
2. **Test component detachment** before publishing
3. **Maintain variable usage documentation**

---

## MCP Commands Reference

### Get Variable Definitions
```
mcp_figma_dev_mod_get_variable_defs
```
Returns all variables applied to the currently selected object.

### Get Component Image
```
mcp_figma_dev_mod_get_image
```
Provides visual context for the selected component.

### Get Code Connect Mapping
```
mcp_figma_dev_mod_get_code_connect_map
```
Shows component-to-code relationships if configured.

---

## Use Cases

### Scenario 1: Orphaned Size Variable
- **Problem**: Can't detach size variable from button
- **Diagnosis**: MCP shows `ob/h/button/surface/size/md: 40`
- **Solution**: Check background layer width/height properties

### Scenario 2: Hidden Color Variable
- **Problem**: Component still has color variable after detachment
- **Diagnosis**: MCP shows `ob/s/color/status/info/bg: #0066cc`
- **Solution**: Check nested layers, icon fills, or stroke colors

### Scenario 3: Typography Variable Remnant
- **Problem**: Text appears to have variable but can't find it
- **Diagnosis**: MCP shows `ob/s/typography/body/size: 16`
- **Solution**: Check text layer font size or line height

---

## Complete Ghost Variable Removal Workflow

### **The Nuclear Option: Component Copy-Paste Method**

When MCP diagnostics and manual cleanup aren't sufficient, use this comprehensive workflow to completely eliminate ghost variables and modes:

#### **Required Tools**
1. **Native Figma**: "Detach deleted variables" action
2. **Variable Utilities Plugin**: 
   - Unset Variable Modes
   - Detach Variables  
   - Detach Text Variables
3. **MCP Diagnostics**: `mcp_figma_dev_mod_get_variable_defs`

#### **Step-by-Step Process**

**Phase 1: Pre-Cleanup Assessment**
1. Select the infected component
2. Run MCP diagnostics to document current variable state:
   ```
   mcp_figma_dev_mod_get_variable_defs
   ```
3. Document findings for reference

**Phase 2: Native Figma Cleanup**
1. Use Figma's native "Detach deleted variables" action
   - **Reference**: [Figma Variables Tutorial](https://youtu.be/etMeJcO8wPU?si=uTYlOzhQDhDa7INH&t=85)
   - Right-click → Variable Utilities → Edit Variables in Selection
   - Select "Detach deleted variables"

**Phase 3: Plugin-Based Deep Clean**
1. **Unset Variable Modes**
   - Remove any remaining variable mode references
2. **Detach Variables** 
   - Remove all standard variable attachments
3. **Detach Text Variables**
   - Clean text-specific variable references

**Phase 4: Component Transfer Method**
1. **Copy** the cleaned component (Ctrl/Cmd + C)
2. **Create new empty Figma file** or use existing clean file
3. **Paste** component into empty file (Ctrl/Cmd + V)
4. **Verification Check**: 
   - Run MCP diagnostics on pasted component
   - Look for any remaining variables or ghost modes
   - If found: Undo (Ctrl/Cmd + Z) and return to Phase 3
5. **Clean Transfer**: Copy from clean file and paste into destination library

**Phase 5: Final Verification**
1. **Immediate Check**: After pasting into destination, check for ghost modes
2. **If ghost modes appear**:
   - Undo immediately (Ctrl/Cmd + Z)
   - Return to Phase 4 for additional debugging
   - Run MCP diagnostics to identify remaining variables
3. **If clean**: Component is successfully migrated

#### **Troubleshooting Decision Tree**

```
Ghost modes after paste? 
├─ YES → Undo → Debug with MCP → Repeat Phase 3-4
└─ NO → - Success: Component is clean
```

#### **Success Indicators**
- - No ghost modes visible in component
- - MCP diagnostics return empty/minimal variable references
- - Component functions normally in destination library
- - No "Change Variable Mode" options appear unexpectedly

#### **Documentation Requirements**
For each cleaned component, document:
- Original variable count (from Phase 1 MCP output)
- Cleanup methods used (native + which plugin actions)
- Final verification status
- Any remaining known variables (if intentional)

#### **Workflow Integration**
This method integrates with the overall OUI-3966 component migration:
1. Use this workflow for each component before V6→V7 migration
2. Apply to Badge, Button, Link, Infobox, Pill, Popover, Spinner, Tooltip
3. Combine with S1/S2/S3 token application after cleanup
4. Version control each cleaned component for rollback capability

---

## Best Practices

1. **Always run diagnostics** before declaring a component "clean"
2. **Document findings** for future reference
3. **Use consistent layer naming** to make diagnostics easier
4. **Test with multiple component states** (hover, disabled, etc.)
5. **Create component variant matrices** to catch edge cases
6. **Use the nuclear workflow** for stubborn ghost variable cases
7. **Verify immediately after each paste** to catch ghost mode reappearance early

---

*Last updated: August 28, 2025 - Added complete ghost variable removal workflow with native Figma actions and plugin integration*
