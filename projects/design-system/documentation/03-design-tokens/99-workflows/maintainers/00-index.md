# Maintainer Workflows Index
**Version:** 1.0  
**Date:** September 4, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Index and navigation for design system maintainer workflows

## **Target Audience**
**Primary:** DS/Oblique Developers, DS/Oblique Designers  
**Secondary:** Product/Project Developers (for reference)  
**Prerequisites:** Understanding of design system architecture and token workflows  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md)

---

## Workflow Organization

This folder contains complete workflows for **Oblique Design System maintainers** and core team members. All workflows are organized in logical sequence for efficient navigation and learning.

### **Audience Targeting Legend**

Each document includes audience targeting to help you quickly identify relevance:

- **Primary:** Main intended audience - document specifically created for these personas
- **Secondary:** Supporting audience - valuable reference material
- **Prerequisites:** Required knowledge or tools needed
- **Related Personas:** Links to detailed persona descriptions

**Key Personas:**
- **DS/Oblique Designers:** Design system maintainers working in Figma ([full description](../../02-foundation/02-personas.md#11-dsobl))
- **DS/Oblique Developers:** Design system maintainers writing code ([full description](../../02-foundation/02-personas.md#12-dsobl))
- **Product/Project Designers:** External teams using the design system ([full description](../../02-foundation/02-personas.md#21-product))
- **Product/Project Developers:** External developers implementing with the design system ([full description](../../02-foundation/02-personas.md#23-product))

### Foundation Workflows
- **01-tokens-studio-context.md** - Token Studio fundamentals and architecture
- **02-figma-and-tokens-for-developers.md** - Figma Dev Mode MCP integration and token workflows

### Figma Integration Workflows
- **03-figma-token-debugging.md** - Debugging Figma variables with MCP tools
- **04-figma-variable-detachment-ghost-modes.md** - Advanced Figma cleanup and ghost mode elimination

### Token Development Workflows
- **05-figma-variables-limitations-and-restrictions.md** - Figma variables and variable modes restrictions
- **06-design-system-script-recommendations.md** - Development tools and script recommendations

### Figma Component Workflows
- **09-figma-component-decomposition-strategy.md** - Component decomposition and slot architecture
- **10-figma-slot-component-architecture.md** - Advanced slot component patterns
- **11-button-aug-slot-implementation.md** - Practical slot implementation example
- **12-figma-mcp-inspection-guide.md** - Complete MCP inspection workflows and prompts

### Tokenization & Quality Workflows
- **13-tokenization-workflow-complete.md** - Complete tokenization workflow for designers and maintainers
- **14-designer-developer-handoff.md** - Quality gates and handoff protocols for component validation

### **Quick Start:** Ready-to-Use Prompts
- **[`prompts/`](./prompts/)** - Drag-and-drop prompt files for VS Code Copilot Chat
  - Figma layer structure inspection
  - Component analysis and documentation
  - **complete tokenization validation**
  - Token and variable analysis
  - Code generation workflows
  - Design system rules creation

---

## Workflow Categories

### Token Architecture
Files 01-04 cover the complete token architecture from Token Studio fundamentals through Figma integration and debugging.

### Token Development Support
Files 05-06 provide token-specific development workflows including Figma limitations and tooling recommendations.

### Component Development & Quality
Files 09-14 cover component development, tokenization workflows, and quality assurance processes.

### System Administration (Internal Only)
General system workflows have been moved to appropriate private locations:
- **Component workflows**: Automated component validation and testing workflows
- **File protection**: Automated file protection and validation systems
- **Version tracking**: Design system version tracking and stable points---

## Quick Navigation

### For New Maintainers
Start with: **01 → 02 → 05 → 13**

### For Token Architecture Work  
Focus on: **01 → 02 → 03 → 04**

### For Component Development
Focus on: **09 → 10 → 13 → 14**

### For Quality Assurance
Focus on: **12 → 13 → 14**

### For System Administration
See: **Automation Systems** and **Stable Version Tracking**

---

## Related Documentation

- **Consumer Workflows:** `../consumers/` - For design system users
- **Foundation:** `../../02-foundation/` - System principles and standards
- **Guidelines:** `../../06-guidelines/` - Contribution and usage standards

---

**Last Updated:** September 4, 2025  
**Related:** All maintainer workflow files in this directory
