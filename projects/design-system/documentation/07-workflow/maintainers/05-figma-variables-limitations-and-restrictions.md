# Figma Variables & Variable Modes Restrictions
**Version:** 1.0  
**Date:** September 4, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Document known limitations and restrictions of Figma variables and variable modes

## **Target Audience**
**Primary:** DS/Oblique Designers, DS/Oblique Developers  
**Secondary:** Product/Project Designers (for limitation awareness)  
**Prerequisites:** Experience with Figma variables and design token systems  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md)

---

## Figma Variable System Limitations

### Variable Mode Restrictions

#### Mode Persistence Issues
- **Ghost Modes**: Variable modes persist even after variables are deleted
- **Cleanup Difficulty**: Manual layer-by-layer cleanup required for ghost modes
- **Detection Problems**: Cannot easily identify which layer contains ghost variables
- **Component Infection**: Ghost modes spread to all instances of a component

#### Mode Management Limitations
- **Limited Mode Count**: Practical limit on number of variable modes per collection
- **Mode Switching**: No bulk mode switching across multiple components
- **Mode Dependencies**: Complex dependency chains can break when modes are modified
- **Mode Inheritance**: Inconsistent inheritance behavior in nested components

### Variable Reference Restrictions

#### Token Architecture Limitations
- **Deep Nesting**: Limited support for complex token reference chains
- **Circular References**: No automatic detection of circular dependencies
- **Cross-Collection**: Limited cross-collection variable referencing
- **Alias Resolution**: Inconsistent alias resolution in complex hierarchies

#### Variable Types Limitations
- **Unsupported Types**: No native support for:
  - Responsive typography scales
  - Advanced state tokens (hover, focus, active combinations)
  - Complex animation tokens
  - Multi-value tokens (spacing scales with multiple breakpoints)
  - Conditional logic tokens

#### Collection Management
- **Collection Limits**: Practical limits on variables per collection
- **Collection Organization**: No nested collections or hierarchical organization
- **Collection Sharing**: Limited sharing options between files and teams
- **Version Control**: No built-in version control for variable changes

### Component Integration Issues

#### Variable Application Restrictions
- **Selective Application**: Cannot apply variables to specific properties only
- **Property Mapping**: Limited mapping between variable types and component properties
- **Instance Overrides**: Variable values cannot be overridden at instance level
- **Variant Conflicts**: Variables may conflict with component variant properties

#### Auto-Layout & Variables
- **Spacing Variables**: Inconsistent behavior with auto-layout spacing
- **Sizing Variables**: Limited support for responsive sizing variables
- **Gap Variables**: Cannot use variables for gap properties in all contexts
- **Padding Variables**: Restricted padding variable application in auto-layout

### Performance & Scale Limitations

#### Large File Performance
- **Variable Count Impact**: Performance degrades with high variable counts
- **Mode Switching Speed**: Slow mode switching in files with many variables
- **Rendering Performance**: Variable-heavy components render slowly
- **Memory Usage**: High memory consumption with extensive variable usage

#### Collaboration Restrictions
- **Concurrent Editing**: Limited support for multiple editors working on variables
- **Change Tracking**: No detailed change history for variable modifications
- **Conflict Resolution**: Poor conflict resolution for simultaneous variable changes
- **Permission Granularity**: Cannot set granular permissions for variable collections

### Design System Integration Issues

#### Token Studio Integration
- **Sync Limitations**: Not all Token Studio tokens sync to Figma variables
- **Bidirectional Sync**: No bidirectional synchronization support
- **Complex Tokens**: Advanced token structures not supported in Figma
- **Theme Management**: Limited theme switching capabilities

#### Export Limitations
- **Code Generation**: Limited code generation from Figma variables
- **Export Formats**: Restricted export format options
- **Custom Properties**: Cannot export as CSS custom properties directly
- **Platform Compatibility**: Limited cross-platform token export

### Workarounds & Mitigation Strategies

#### For Ghost Modes
1. Use MCP tools for variable detection: `mcp_figma_dev_mod_get_variable_defs`
2. Implement systematic detachment workflows (see 04-figma-variable-detachment-ghost-modes.md)
3. Component rebuilding from clean states

#### For Unsupported Token Types
1. Document tokens outside Figma (see 01-tokens-studio-context.md)
2. Implement tokens directly in code based on documentation
3. Use Token Studio for advanced token management

#### For Performance Issues
1. Limit variable collections size
2. Use semantic layering (S1/S2/S3) for organization
3. Regular cleanup of unused variables

---

## Impact on Design System Workflows

### Token Architecture Decisions
- **S1/S2/S3 Semantic Layers**: Designed to work within Figma limitations
- **Token Studio Primary**: Use Token Studio as primary token management tool
- **Figma as Reference**: Treat Figma variables as reference implementation

### Development Workflows
- **MCP Integration**: Leverage MCP tools for variable inspection and debugging
- **Validation Scripts**: Use automated scripts for token validation
- **Manual Implementation**: Prepare for manual implementation of unsupported tokens

---

## Related Documentation

- **01-tokens-studio-context.md**: Token architecture and management
- **02-figma-tokens-workflow.md**: MCP integration workflows
- **03-figma-token-debugging.md**: Debugging procedures
- **04-figma-variable-detachment-ghost-modes.md**: Cleanup procedures

---

**Note**: These limitations are based on current Figma capabilities and may change with future Figma updates.
