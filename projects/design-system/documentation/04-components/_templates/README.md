# Component Templates

This folder contains reusable templates for creating new components in the oblique design system.

## **Requirements:** Template Structure

Each component should follow this standardized structure:

```
{component-name}/
├── README.md                   # Entry point and navigation
├── 01-overview.md             # Component introduction and usage
├── 02-architecture.md         # Design decisions and structure
├── 03-implementation.md       # Developer implementation guide
├── 04-guidelines.md           # Usage guidelines and standard practices
├── _research/                 # Internal research and rationale
│   ├── competitive-analysis/
│   ├── user-research/
│   ├── technical-research/
│   └── decision-logs/
└── _reports/                  # Internal validation reports
    ├── 01-technical/
    ├── 02-tokenization/
    ├── 03-compliance/
    ├── 04-quality/
    └── _archive/
```

## **Quick Start:** How to Use Templates

1. **Copy template files** to new component folder
2. **Replace placeholders** with component-specific content:
   - `{COMPONENT_NAME}` → Actual component name (e.g., "Button", "Input")
   - `{component-name}` → Kebab-case name (e.g., "button", "input-field")
   - `{SUBCOMPONENT_LIST}` → List of subcomponents if applicable
   - `{USE_CASES}` → Primary use cases for the component
   - `{RESEARCH_EVIDENCE}` → Specific research findings

3. **Update file content** with component-specific details
4. **Create research folders** and add initial research documents
5. **Set up validation reports** as components are developed

## **Note:** Template Files

- **README-template.md** - Component entry point template
- **01-overview-template.md** - Overview document template  
- **02-architecture-template.md** - Architecture document template
- **03-implementation-template.md** - Implementation guide template
- **04-guidelines-template.md** - Guidelines template

## **Success:** Component Creation Checklist

- [ ] Component folder created with proper naming (01-{component-name})
- [ ] All template files copied and renamed
- [ ] Placeholders replaced with component-specific content
- [ ] Research folder structure created
- [ ] Reports folder structure created
- [ ] Component added to main components overview
- [ ] Links updated in related documentation

---

**Reference Implementation:** See [01-button/](../01-button/) for a complete example of this template structure in use.
