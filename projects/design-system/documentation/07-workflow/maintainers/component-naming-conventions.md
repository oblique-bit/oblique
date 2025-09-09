# Component Naming Conventions

**Purpose:** Standardized naming conventions for component documentation and files  
**Applies to:** All components in the design system  
**Last Updated:** September 9, 2025

---

## 📝 **FILE NAMING STANDARDS**

### **📖 Public Documentation Files:**
- `README.md` - Component entry point and navigation
- `01-overview.md` - Component introduction and basic usage
- `02-architecture.md` - Design decisions and structural details
- `03-implementation.md` - Developer implementation guide
- `04-guidelines.md` - Usage guidelines and best practices

### **🔍 Research Files:**
- `YYYY-MM-DD_topic-description.md` - Research studies and analysis
- `YYYY-MM-DD_decision-rationale.md` - Decision documentation
- `YYYY-MM-DD_competitive-analysis.md` - Industry comparisons

**Examples:**
- `2025-09-09_remove-button-industry-analysis.md`
- `2025-09-08_square-constraint-decision.md`
- `2025-09-07_accessibility-audit-results.md`

### **📊 Report Files:**
- `YYYYMMDD_HHMM-component-category-type-report.md`

**Format Breakdown:**
- `YYYYMMDD` - Date (20250906)
- `HHMM` - Time (1416)
- `component` - Component name (button)
- `category` - Report category (technical, tokenization, compliance, quality)
- `type` - Specific validation type (mcp, w3c, accessibility)

**Examples:**
- `20250906_1416-button-technical-mcp-report.md`
- `20250909_1030-button-tokenization-validation-report.md`
- `20250910_1445-button-compliance-w3c-report.md`

---

## 📁 **FOLDER NAMING STANDARDS**

### **Public vs Internal Distinction:**
- **Public content:** No prefix (direct access)
- **Internal content:** Underscore prefix (`_research/`, `_reports/`)
- **Archive content:** `_archive/` subfolder

### **Folder Structure:**
```
component-name/
├── README.md                   # Entry point
├── 01-overview.md             # Public docs
├── 02-architecture.md         # Public docs  
├── 03-implementation.md       # Public docs
├── 04-guidelines.md           # Public docs
├── _research/                 # Internal research
│   ├── competitive-analysis/
│   ├── user-research/
│   ├── technical-research/
│   └── decision-logs/
└── _reports/                  # Internal reports
    ├── 01-technical/
    ├── 02-tokenization/
    ├── 03-compliance/
    ├── 04-quality/
    └── _archive/
```

---

## 📅 **DATE FORMAT STANDARDS**

### **Research Files:**
- **Format:** `YYYY-MM-DD` (ISO 8601 standard)
- **Purpose:** Human-readable, sortable, internationally standard
- **Example:** `2025-09-09`

### **Report Files:**
- **Format:** `YYYYMMDD_HHMM` (timestamp format)
- **Purpose:** Precise timestamp for automated tools and version tracking
- **Example:** `20250909_1430`

### **When to Use Each:**
- **Research:** When humans need to read and reference dates easily
- **Reports:** When automated tools generate files or precise timing matters

---

## 🔤 **COMPONENT NAMING**

### **Component Names:**
- Use lowercase with hyphens: `button`, `input-field`, `data-table`
- Match Figma component names when possible
- Be descriptive but concise

### **File Content Naming:**
- Use descriptive, searchable titles
- Include component name in research/report files
- Be consistent across similar file types

---

## ✅ **VALIDATION CHECKLIST**

Before creating new component documentation:

- [ ] Component has `README.md` entry point
- [ ] Public docs follow `01-04` numbering
- [ ] Research files use `YYYY-MM-DD_` prefix
- [ ] Report files use `YYYYMMDD_HHMM-` prefix
- [ ] Internal folders use underscore prefix
- [ ] All files follow naming conventions
- [ ] Folder structure matches standard pattern

---

## 📚 **EXAMPLES**

### **Complete Button Component:**
```
button/
├── README.md
├── 01-overview.md
├── 02-architecture.md
├── 03-implementation.md
├── 04-guidelines.md
├── _research/
│   ├── 2025-09-09_folder-organization-research.md
│   ├── 2025-09-08_remove-button-industry-analysis.md
│   └── decision-logs/
│       └── 2025-09-07_remove-subcomponent-decision.md
└── _reports/
    ├── 01-technical/
    │   └── 20250906_1416-button-technical-mcp-report.md
    └── 03-compliance/
        └── 20250906_1500-button-compliance-w3c-report.md
```

---

**This convention ensures:**
- 🎯 **Consistency** across all components
- 🔍 **Discoverability** of relevant files
- 📊 **Automation** compatibility for reports
- 👥 **Team clarity** on file purposes
- 📈 **Scalability** as the system grows
