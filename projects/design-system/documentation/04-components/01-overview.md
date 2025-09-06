# Components Documentation Structure

**Purpose:** Organized component documentation for maintainable design system development

---

## Directory Structure

Each component follows this standardized structure:

```
04-components/
├── 01-overview.md                    # This file - documentation structure guide
├── {component}/                      # Individual component directories
│   ├── {component}-overview.md       # Stable requirements & behavior patterns
│   └── reports/                      # MCP analysis reports (implementation details)
│       ├── YYYYMMDD_HHMM-{component}-mcp-figma-report.md  # CURRENT report only
│       └── _archive/               # Previous reports (auto-archived)
│           └── [older-reports].md
└── [legacy-files.md]                # Being migrated to new structure
```

## Content Organization Strategy

### **Document:** Component Overview Files
**Location:** `{component}/{component}-overview.md`  
**Purpose:** Stable, long-term component documentation

**Contains:**
- Behavioral requirements that don't change with design iterations
- Responsive patterns and container behavior principles  
- UX guidelines and accessibility requirements
- High-level token usage patterns and implementation guidance
- Architecture decisions and maintainability strategies

**Examples:** Button responsive behavior, slot architecture principles, container query patterns

### **Summary:** MCP Analysis Reports  
**Location:** `{component}/reports/YYYYMMDD_HHMM-{component}-mcp-figma-report.md`  
**Purpose:** Time-specific implementation details from Figma analysis

**Contains:**
- Current layer structure with exact node IDs
- Token mapping with actual values from Figma
- Generated code output (JSX/HTML)
- Tokenization validation results
- Layer naming compliance checks
- Component properties and variant specifications

**Examples:** Specific token values, current Figma layer names, generated component code

## Benefits for Maintainers

### **Analysis:** **Easy Information Location**
- **Need behavioral requirements?** → Check `{component}-overview.md`  
- **Need current implementation specs?** → Check single report in `reports/`
- **Need design iteration history?** → Browse archived reports in `reports/_archive/`

### **Progress:** **Design Iteration Support**  
- **Stable docs don't get buried** in changing implementation details
- **Single current report** eliminates confusion about latest specs
- **Historical tracking** preserved in `_archive/` for comparison and rollback

### **Note:** **Faster Development**
- **Requirements separate from specs** prevents confusion during iterations
- **Historical tracking** enables rollback and comparison
- **Consistent structure** across all components

## Current Components

### **Success:** Migrated Components
- **Button** - Complete with overview and MCP reports

### **Requirements:** Future Components (To Be Organized)
- Card, Input, Modal, Navigation, etc.

---

## Usage Examples

### For Component Requirements:
```markdown
See: button/button-overview.md
→ Responsive behavior patterns
→ Container query simulation strategy  
→ Slot architecture principles
```

### For Current Implementation:
```markdown  
See: button/reports/20250906_1357-button-mcp-figma-report.md
→ Current layer structure (single file in reports/)
→ Latest token mappings
→ Generated component code
```

### For Design Evolution:
```markdown
Compare: button/reports/_archive/
→ 20250906_1344-button-mcp-figma-report.md (previous)
→ [older archived reports]
→ Track design system evolution over time
```

---

**Document Maintainers:** Design System Team  
**Last Updated:** September 6, 2025  
**Review Schedule:** With each new component migration
