**Goal:** FIGMA LAYER STRUCTURE INSPECTION

I need to inspect the Figma component layer structure using MCP tools. Follow this exact workflow:

1. **Get Metadata First**: Use mcp_figma_dev_mod_get_metadata to see component/frame names
2. **Extract Code Structure**: Use mcp_figma_dev_mod_get_code to get internal layer hierarchy  
3. **Get Visual Context**: Use mcp_figma_dev_mod_get_image for visual reference
4. **Use Exact Names**: Never invent or modify component names - use exactly as shown in Figma
5. **Document Structure**: Create hierarchical tree using exact Figma layer names
6. **Validate Layer Naming**: Check layer names for compound unit compliance

CRITICAL: Use get_code tool to extract internal layer structure. Metadata alone shows only top-level containers.

## **Warning:** LAYER NAMING VALIDATION

**IMPORTANT**: Check all layer names for compound unit compliance:
- **Success:** **CORRECT**: `text_label`, `icon_holder`, `button_surface` (underscore format)
- **Error:** **INCORRECT**: `text-label`, `iconHolder`, `buttonSurface` (hyphen/camelCase)

If non-compliant layer names found, flag them for designer attention.

CHAT OUTPUT FORMAT: Provide clean, focused analysis:

## **Analysis:** Figma Layer Analysis: [component_name]

### Simple Structure
[Clean tree hierarchy without technical details]

### Layer Naming Validation
[Report any naming violations if found]

FOLLOW-UP ACTION: After analysis, offer:
"Would you like me to create/update the component documentation file at `documentation/04-components/[component].md` with this layer structure?"
