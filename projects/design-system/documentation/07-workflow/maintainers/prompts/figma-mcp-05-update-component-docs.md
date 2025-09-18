**Note:** DIRECT COMPONENT DOCUMENTATION UPDATE

I need to create/update the component documentation file with the latest Figma layer structure. Follow this exact workflow:

1. **Get Metadata First**: Use mcp_figma_dev_mod_get_metadata to see component/frame names
2. **Extract Code Structure**: Use mcp_figma_dev_mod_get_code to get internal layer hierarchy  
3. **Get Visual Context**: Use mcp_figma_dev_mod_get_image for visual reference
4. **Identify Component**: Determine component name from metadata
5. **Create/Update File**: Update `documentation/04-components/[component].md` with detailed layer structure

CRITICAL: Always include Figma file information and last modified date for version tracking.

OUTPUT ACTION: Skip chat analysis - directly create/update the component MD file with:
- Detailed layer structure tree with properties and dimensions
- Complete analysis table with all layer details
- Design token mapping
- Component properties
- Figma file information and version tracking
