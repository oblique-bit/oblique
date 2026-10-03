# Figma Variables & Variable Modes Restrictions
**Purpose:** Document known limitations and restrictions of Figma variables and variable modes

## **Target Audience**
**Primary:** DS/Oblique Designers, DS/Oblique Developers
**Secondary:** Product/Project Designers (for limitation awareness)
**Prerequisites:** Experience with Figma variables and design token systems

---

## Figma Variable System Limitations

### Variable Mode Restrictions

#### Mode Persistence Issues
- **Ghost Modes**: Variable modes persist even after variables are deleted
- **Cleanup Difficulty**: Manual layer-by-layer cleanup required for ghost modes
- **Detection Problems**: Hard to identify which layer holds ghost variables
- **Component Infection**: Ghost modes spread to all instances of a component

#### Mode Management Limitations
- **Limited Mode Count**: Practical limit on modes per collection
- **Mode Switching**: No bulk mode switching across components
- **Mode Dependencies**: Complex dependency chains break when modes change
- **Mode Inheritance**: Inconsistent inheritance in nested components

### Variable Reference Restrictions

#### Token Architecture Limitations
- **Deep Nesting**: Limited support for long token reference chains
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
- **Collection Organization**: No nested or hierarchical collections
- **Collection Sharing**: Limited sharing between files and teams
- **Version Control**: No built-in version history for variable changes

### Component Integration Issues

#### Variable Application Restrictions
- **Selective Application**: Cannot apply variables to specific properties only
- **Property Mapping**: Limited mapping between variable types and component properties
- **Instance Overrides**: Variable values cannot be overridden at instance level
- **Variant Conflicts**: Variables may conflict with component variant properties

#### Auto-Layout & Variables
- **Spacing Variables**: Inconsistent behavior with auto-layout spacing
- **Sizing Variables**: Limited support for responsive sizing
- **Gap Variables**: Cannot use variables for gap properties in all contexts
- **Padding Variables**: Restricted padding variable use in auto-layout

### Performance & Scale Limitations

#### Large File Performance
- **Variable Count Impact**: Performance degrades with high variable counts
- **Mode Switching Speed**: Slow mode switching in files with many variables
- **Rendering Performance**: Variable-heavy components render slowly
- **Memory Usage**: High memory consumption with wide variable usage

#### Collaboration Restrictions
- **Concurrent Editing**: Limited support for multiple editors on variables
- **Change Tracking**: No detailed change history for variable edits
- **Conflict Resolution**: Poor conflict resolution for simultaneous changes
- **Permission Granularity**: Cannot set granular permissions per collection

### Design System Integration Issues

#### Token Studio Integration
- **Sync Limitations**: Not all Token Studio tokens sync to Figma variables
- **Bidirectional Sync**: No bidirectional synchronization support
- **Complex Tokens**: Advanced token structures not supported in Figma
- **Mode Management**: Limited mode switching capabilities

#### Export Limitations
- **Code Generation**: Limited code generation from Figma variables
- **Export Formats**: Restricted export format options
- **Custom Properties**: Cannot export as CSS custom properties directly
- **Platform Compatibility**: Limited cross-platform token export

### Workarounds & Mitigation Strategies

#### For Ghost Modes
1. Use MCP tools for variable detection: `mcp_figma_dev_mod_get_variable_defs`
2. Detach affected variables and rebuild the component from a clean state

#### For Unsupported Token Types
1. Document tokens outside Figma
2. Implement tokens directly in code based on documentation
3. Use Token Studio for advanced token management

#### For Performance Issues
1. Limit variable collections size
2. Use semantic layering (S1/S2/ob.s) for organization
3. Regular cleanup of unused variables

---

## Impact on Design System Workflows

### Token Architecture Decisions
- **S1/S2/ob.s Semantic Layers**: Designed to work within Figma limitations
- **Token Studio Primary**: Use Token Studio as primary token management tool
- **Figma as Reference**: Treat Figma variables as reference implementation

### Development Workflows
- **MCP Integration**: Use MCP tools for variable inspection and debugging
- **Validation Scripts**: Use automated scripts for token validation
- **Manual Implementation**: Prepare for manual implementation of unsupported tokens

---

## Related Documentation

- [Token Description Guidelines](04-token-description-guidelines.md) - How to write a token's `$description`
- [Architecture](../01-introduction/01-architecture.md) - Token structure, layer system, and architectural patterns

---

**Note**: These limitations are based on current Figma capabilities and may change with future Figma updates.
