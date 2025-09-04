# Figma Variable Detachment & Ghost Mode Elimination
**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Methods for detaching variables and eliminating persistent ghost variable modes in Figma

## **Target Audience**
**Primary:** DS/Oblique Designers  
**Secondary:** DS/Oblique Developers (for MCP tools)  
**Prerequisites:** Advanced Figma knowledge, MCP tools, understanding of variable modes  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md#11-dsobl)

This document provides comprehensive methods for detaching variables from Figma components and eliminating persistent ghost variable modes that remain after variable deletion.

---

## Problem Overview

### Ghost Variable Modes Issue
**Root Cause**: Figma retains variable modes even after variables are deleted, creating "infected" components that require manual layer-by-layer cleanup.

**Symptoms**:
- Variable modes persist in components after variables are deleted
- Cannot identify which layer contains the ghost variable
- Components show variable references that don't exist in the variables panel
- Manual detachment attempts fail or are incomplete

**Impact**: Creates cumbersome workflow where every layer needs manual inspection for variable cleanup.

**Figma Forum Reference**: [Change Variable Mode Still Visible After Deleted Variables](https://forum.figma.com/ask-the-community-7/change-variable-mode-is-still-visible-after-deleted-all-variables-32723)

---

## 6-Phase Ghost Variable & Style Elimination Workflow

### Phase 1: Pre-Cleanup Assessment with MCP Diagnostics

**Objective**: Identify all remaining variables in the selected component

**Method A: MCP Diagnostics (Figma Desktop + VS Code)**
1. **Select the problematic component** in Figma
2. **Use MCP variable detection** to identify remaining variables:
   ```
   mcp_figma_dev_mod_get_variable_defs
   ```
3. **Analyze the results** to identify:
   - Variable name/path
   - Variable value  
   - Layer where it's applied

**Example Output**:
```json
{
  "ob/h/button/icon-only/surface/size/md": "36",
  "ob/s/color/neutral/no_color": "#00000000"
}
```

**Method B: Variable Visualizer Plugin (Alternative for Web/No MCP)**
1. **Install Variable Visualizer Plugin**: [Variable Visualizer - Design System Token Variables Management](https://www.figma.com/community/plugin/1457362132545070106/variable-visualizer-design-system-token-variables-management)
2. **Select the component** with suspected ghost variables
3. **Run Variable Visualizer plugin** from Figma plugins menu
4. **Analyze plugin output** to identify:
   - All variables currently applied to the component
   - Variable hierarchy and relationships
   - Specific layers where variables are attached

**When to Use Each Method**:
- **MCP Method**: Best for desktop users with VS Code integration, provides programmatic access
- **Plugin Method**: Ideal for web users, team members without MCP setup, or when MCP is unavailable

**Analysis**: Both methods help you identify which variables are still attached and their values, helping you locate the specific layers for cleanup.

### Phase 2: Native Figma Cleanup Actions

**Objective**: Use Figma's built-in variable detachment methods

**Steps**:
1. **Select Component**: Click on the main component frame
2. **Right Panel**: Navigate to Design Tab → Variables Section
3. **Detach Variables**: For each variable found in Phase 1:
   - Click the variable icon next to the property
   - Select "Detach variable" or "Remove variable"
   - Confirm the detachment action
4. **Layer-by-Layer Review**: 
   - Expand all layers in the component
   - Check each layer for variable indicators (purple variable icons)
   - Manually detach any remaining variables

**Native Actions**:
- **Detach deleted variables** (appears when variables are deleted but references remain)
- **Remove variable** (standard detachment for active variables)
- **Reset to default** (removes variable and resets to original value)

### Phase 3: Style Detachment (Text Styles & Effect Styles)

**Objective**: Detach text styles and effect styles that may contain hidden variable references

**Critical Note**: Text styles and effect styles can contain hidden variable references that persist even after direct variable detachment. These must be addressed separately.

**Style Types to Address**:
- **Text Styles**: Typography styles with font, size, color, and spacing variables
- **Effect Styles**: Drop shadows, inner shadows, blur effects with variable references

**Text Style Detachment Process**:
1. **Select Text Layers**: Identify all text layers in the component
2. **Check Style Panel**: Look for applied text styles in the Design Panel
3. **Detach Text Styles**:
   - Click on the text style name/icon
   - Select "Detach style" from the dropdown
   - Repeat for each text layer with applied styles
4. **Manual Property Check**: After detaching styles, check each typography property:
   - Font family, weight, size
   - Line height, letter spacing
   - Color (especially important - often contains variable references)

**Effect Style Detachment Process**:
1. **Select Layers with Effects**: Identify layers with drop shadows, inner shadows, blur effects
2. **Check Effects Panel**: Look for applied effect styles
3. **Detach Effect Styles**:
   - Click on the effect style name/icon
   - Select "Detach style" from the dropdown
4. **Manual Property Check**: Verify effect properties no longer reference variables:
   - Shadow color, blur, spread values
   - Opacity settings

**Style Variable Detection**:
- Look for purple variable icons within style properties
- Pay special attention to color properties in both text and effect styles
- Use MCP diagnostics before and after style detachment to verify cleanup

### Phase 4: Plugin-Based Deep Clean

**Objective**: Use specialized plugins for comprehensive variable removal

**Recommended Plugins**:
- **Variable Visualizer Plugin**: [Variable Visualizer - Design System Token Variables Management](https://www.figma.com/community/plugin/1457362132545070106/variable-visualizer-design-system-token-variables-management) - **Alternative to MCP for variable inspection**
- **Variables Cleaner Plugin**
- **Variables Organizer Plugin** 
- **Variable Utilities Plugin**

**Variable Utilities Plugin Actions**:
1. **Unset Variable Modes**: Removes mode-specific variable assignments
2. **Detach Variables**: Bulk detachment of all variables in selection
3. **Detach Text Variables**: Specific text variable removal
4. **Reset Variable Values**: Resets variables to default values

**Plugin Workflow**:
1. Install the Variable Utilities plugin
2. Select the component with ghost variables
3. Run "Unset Variable Modes" first
4. Follow with "Detach Variables" 
5. Use "Detach Text Variables" for typography-specific issues
6. Verify results with MCP diagnostics

### Phase 5: Component Transfer Method

**Objective**: Transfer clean component structure to eliminate persistent ghost references

**When to Use**: When Phases 2, 3, and 4 fail to remove all ghost variables and style references

**Steps**:
1. **Create Clean Duplicate**:
   - Copy the component (Cmd+C / Ctrl+C)
   - Paste in a clean area (Cmd+V / Ctrl+V)
   - Rename to distinguish from original

2. **Layer-by-Layer Reconstruction**:
   - Copy individual layers from original component
   - Paste into clean component structure
   - Verify no variables are transferred during copy process

3. **Style Reapplication**:
   - Manually reapply styles without variable references
   - Use direct color/dimension values temporarily
   - Prepare component for fresh variable application

4. **Component Replacement**:
   - Replace original component with clean version
   - Update component instances throughout file
   - Delete infected original component

### Phase 6: Final Verification and Quality Assurance

**Objective**: Confirm complete variable and style removal and system cleanliness

**Verification Steps**:
1. **MCP Re-Scan**: Run `mcp_figma_dev_mod_get_variable_defs` on cleaned component
2. **Expected Result**: Empty object `{}` indicating no variables
3. **Visual Inspection**: Check component layers for any purple variable indicators
4. **Style Inspection**: Verify no text styles or effect styles contain variable references
5. **Mode Testing**: Switch between variable modes to ensure no ghost references appear

**Quality Assurance Checklist**:
- [ ] MCP diagnostics return empty results
- [ ] No purple variable icons visible on any layer
- [ ] No purple variable icons within text style properties
- [ ] No purple variable icons within effect style properties
- [ ] Component maintains visual appearance
- [ ] No error messages when switching variable modes
- [ ] Component ready for fresh S1/S2/S3 variable application

---

## Troubleshooting Common Issues

### Issue: MCP Not Available (Web Users, No Desktop Access)
**Solution**: Use Variable Visualizer Plugin as alternative for variable inspection
- Install [Variable Visualizer Plugin](https://www.figma.com/community/plugin/1457362132545070106/variable-visualizer-design-system-token-variables-management)
- Provides similar variable detection capabilities as MCP method
- Works in both Figma web and desktop versions

### Issue: Text Styles or Effect Styles Contain Hidden Variables
**Solution**: Use Phase 3 (Style Detachment) to systematically detach all text and effect styles before proceeding with variable cleanup. Pay special attention to color properties within styles.

### Issue: Variables Persist After Native Detachment
**Solution**: Progress to Phase 3 (Style Detachment) then Phase 4 (Plugin-based cleanup) or Phase 5 (Component transfer method)

### Issue: Plugin Actions Have No Effect  
**Solution**: Use Phase 5 component reconstruction method as last resort

### Issue: Component Visual Breaks During Cleanup
**Solution**: Document original values before cleanup, reapply manually after variable removal

### Issue: Ghost Variables Return After Cleanup
**Solution**: Check for nested components that may be reintroducing variables; clean entire component hierarchy

---

## Best Practices

### Pre-Cleanup Preparation
1. **Document Current State**: Screenshot component before cleanup
2. **Note Variable Values**: Record current applied values for reference
3. **Create Backup**: Duplicate component before starting cleanup process

### During Cleanup
1. **Systematic Approach**: Follow phases in order for best results
2. **Verify Each Step**: Use MCP diagnostics between phases
3. **Layer-by-Layer Review**: Don't skip manual layer inspection

### Post-Cleanup
1. **Final Verification**: Always confirm with MCP diagnostics
2. **Fresh Variable Application**: Apply new S1/S2/S3 variables immediately
3. **Documentation**: Record which method worked for future reference

---

## Integration with S1/S2/S3 Architecture

After successful ghost variable elimination, components are ready for fresh variable application:

### S1/S2/S3 Variable Structure
- **S1 Semantic Level**: Lightness variables (light/dark theme handling)
- **S2 Semantic Level**: Emphasis variables (high/low emphasis variations)  
- **S3 Semantic Level**: Semantic compilation (complete semantic color collection)

### Post-Cleanup Variable Application
1. **Select cleaned component layers**
2. **Use Token Studio to apply S1/S2/S3 variables**
3. **Test all variable modes** to ensure proper functionality
4. **Verify with MCP diagnostics** that only intended variables are present

---

## Related Documentation
- [Figma Token Debugging Guide](./02-figma-token-debugging.md)
- [S1/S2/S3 Architecture Documentation](../../../03-design-tokens/theming.md)
- [Token Consumption Guidelines](../../../03-design-tokens/guidelines-token-consumption.md)

---

*Created: 29.08.2025*  
*Purpose: Standardized workflow for variable detachment and ghost mode elimination*  
*Context: Supports component migration projects and variable cleanup initiatives*
