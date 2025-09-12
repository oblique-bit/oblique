# Figma MCP Prompt Validation Report: figma-mcp-01-inspect-layer-structure_detailed

**Version:** 1.0  
**Date:** September 6, 2025  
**Status:** Validation Report  
**Purpose:** Automated validation and analysis of Figma MCP prompt effectiveness

## **Target Audience**
**Primary:** DS/Oblique Developers, DS/Oblique Designers  
**Secondary:** Design System Maintainers  
**Prerequisites:** Understanding of Figma MCP workflows and prompt validation processes

---

## Validation Overview

This report analyzes the effectiveness, usability, and current relevance of the `figma-mcp-01-inspect-layer-structure_detailed` prompt for Figma MCP operations.

**Validation Criteria:**
- **Functionality**: Does the prompt execute without errors?
- **Output Quality**: Is the generated output useful and accurate?
- **Usability**: Is the prompt clear and easy to understand?
- **Relevance**: Is the prompt still needed in current workflows?
- **Documentation Impact**: Does the prompt properly handle component documentation?

---

## Expected Behavior Analysis

### 2.1 Component Documentation Impact
**What this prompt would write/modify in `documentation/04-components/`:**

- **Creates/Updates**: May offer to create component documentation
- **Sections Modified**: Layer structure, detailed analysis tables
- **File Naming**: `[component-name].md` if user accepts
- **Impact Level**: MEDIUM - User-controlled file creation
- **Safety**: Requires user confirmation before creating files

### 2.2 VS Code Copilot Chat Output
**Expected chat response format:**

```markdown
## **Analysis:** Figma Layer Analysis: [component_name]

### Simple Structure
```
component_frame
└── component_symbol
    └── layer_name
        ├── sub_layer_1
        └── sub_layer_2
```

[Follow-up offer for documentation]
```

### 2.3 MCP Tool Interactions
**Expected MCP command sequence:**

1. `mcp_figma_dev_mod_get_metadata` - Extract component metadata
2. `mcp_figma_dev_mod_get_code` - Generate component code structure
3. `mcp_figma_dev_mod_get_image` - Capture visual reference

## Analysis Results

**Overall Score**: 9/10 (90%)

### Strengths **Success:**
- Clear step-by-step instructions
- Contains specific MCP commands
- Core functionality - high relevance
- Includes follow-up actions

### Issues Identified **Warning:**
- Prompt may be too verbose
- No clear output format specification

### Recommendation: KEEP
- **Action**: Maintain current prompt as-is
- **Priority**: Low
- **Status**: Excellent

### Detailed Metrics
- **Usability Score**: 2/4
- **Functionality Score**: 3/5  
- **Relevance Score**: 4/4
- **Line Count**: 316
- **Word Count**: 1612


---

**Generated:** 2025-09-06T18:50:49.570Z  
**Script Version:** 1.0  
**Validation Method:** Automated analysis