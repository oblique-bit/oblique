# Developer Workflow Documentation  

This section contains comprehensive documentation for developers implementing design tokens in code.

## **Main Documentation**

- [**Token Assignment Guidelines**](./token-assignment-guidelines.md) - How to implement tokens in code
  - S1/S2/S3 consumption rules
  - Interactive vs. non-interactive components  
  - Code generation patterns
  - Prohibited consumption patterns
  - Component token hierarchy

## **Key Implementation Rules**

- **Primary Rule**: Components should primarily consume S3 semantic tokens
- **Prohibition**: Components must never consume primitives directly
- **Interactive Components**: Must use S3 interaction tokens for full theming capabilities
- **Reference Chain**: S1→S2→S3 hierarchy with direct primitive references

## **Quick Reference**

```bash
# Correct token consumption
ob.c.button.primary.bg      → Component token (preferred)
ob.s3.color.primary.bg      → S3 semantic token (interactive)
ob.s2.color.primary.bg      → S2 semantic token (non-interactive)

# Prohibited consumption  
ob.s1.color.primary.bg      → ❌ Never consume S1 directly
ob.p.color.blue.500         → ❌ Never consume primitives directly
```

## **Related Documentation**

- [**Tokenization Process**](../tokenization-process.md) - Understanding token creation and assignment
- [**Designer Workflow**](../designers/designer-workflow.md) - How tokens are applied in Figma
- [**Architecture**](../../architecture.md) - Token structure and hierarchy rules
- [**Style Dictionary Setup**](../../04-references/03-technical/style-dictionary-underscore-setup.md) - Build configuration

---

*This workflow ensures proper token implementation that maintains design system consistency and theming capabilities.*