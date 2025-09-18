# Figma MCP Prompt Validation Report: figma-mcp-03-analyze-viewport-modes

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

This report analyzes the effectiveness, usability, and current relevance of the `figma-mcp-03-analyze-viewport-modes` prompt for Figma MCP operations.

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

- **Creates/Updates**: NO direct file modifications (analysis only)
- **Sections Modified**: None
- **File Naming**: N/A  
- **Impact Level**: NONE - Read-only operation
- **Safety**: No documentation files affected

### 2.2 VS Code Copilot Chat Output
**Expected chat response format:**

```markdown
## Analysis Results: [component_name]

[Structured analysis output based on prompt type]
[Data tables, comparisons, or extracted information]
[Recommendations or next steps]
```

### 2.3 MCP Tool Interactions
**Expected MCP command sequence:**

1. `mcp_figma_dev_mod_get_metadata` - Extract component metadata
2. `mcp_figma_dev_mod_get_code` - Generate component code structure
3. `mcp_figma_dev_mod_get_image` - Capture visual reference
4. `mcp_figma_dev_mod_get_variable_defs` - Extract variable definitions

## Analysis Results

**Overall Score**: 4/10 (40%)

### Strengths **Success:**
- Clear step-by-step instructions
- Analysis functionality - moderate relevance

### Issues Identified **Warning:**
- Prompt may be too brief
- Missing explicit MCP command references
- No clear output format specification

### Recommendation: MAJOR UPDATE
- **Action**: Significant restructuring needed
- **Priority**: High
- **Status**: Needs significant improvement

### Detailed Metrics
- **Usability Score**: 2/4
- **Functionality Score**: 0/5  
- **Relevance Score**: 2/4
- **Line Count**: 8
- **Word Count**: 43


---

**Generated:** 2025-09-06T18:50:49.592Z  
**Script Version:** 1.0  
**Validation Method:** Automated analysis