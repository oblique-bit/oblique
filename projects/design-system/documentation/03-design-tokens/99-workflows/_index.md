# Design Token Workflows

**Role-based workflows for implementing design tokens in the Oblique Design System**

---

## **🎯 Core Process**

### **Tokenization Workflow**
- [**Tokenization Process**](./tokenization-process.md) - **START HERE** - Complete token creation and assignment workflow
  - Step-by-step token creation process
  - Design system rules and validation
  - Cross-platform implementation patterns
  - Quality assurance checklist

---

## **👥 Role-Based Workflows**

### **🎨 For Designers**
- [**Designer Workflow**](./designers/) - Figma + Tokens Studio implementation
  - Token application in Figma
  - Layer naming standards
  - Validation requirements  
  - Common violation patterns

### **👩‍💻 For Developers**
- [**Developer Workflow**](./developers/) - Code implementation and assignment
  - S1/S2/S3 consumption rules
  - Interactive vs. non-interactive components
  - Code generation patterns
  - Token reference validation
- [**Developer Token Usage Guide**](./developers/developer-token-usage-guide.md) - Comprehensive developer implementation guide

### **🛠️ For Maintainers**
- [**Maintainer Workflows**](./maintainers/) - System maintenance and architecture
  - Component creation workflows
  - Design-to-development handoff processes
  - Figma troubleshooting and maintenance
  - Architecture analysis and migration guides

### **🌍 For Consumers**
- [**Consumer Workflows**](./consumers/) - External team integration
  - Token consumption patterns
  - Integration best practices

---

## **🔄 Workflow Integration**

### **Complete Token Lifecycle**
```
1. Token Creation (Tokenization Process)
   ↓
2. Design Implementation (Designer Workflow) 
   ↓
3. Code Implementation (Developer Workflow)
   ↓  
4. Validation & Testing (Both Workflows)
```

### **Cross-Role Collaboration**
- **Design → Development Handoff**: Tokenization process provides shared vocabulary
- **Validation Points**: Both workflows include validation checkpoints
- **Quality Assurance**: Consistent validation across design and code

---

## **� Architecture & Migration**

### **System Architecture**
- [**Modes Architecture Implementation Roadmap**](./modes-architecture-implementation-roadmap.md) - Complete modes system roadmap
- [**Modes Migration Quick Start**](./modes-migration-quick-start.md) - Fast migration guide for modes

### **Migration Workflows**
- [**Multiplier Elimination Compensation**](./multiplier-elimination-compensation.md) - Multiplier system migration
- [**Multiplier Migration Audit Report**](./multiplier-migration-audit-report.md) - Migration analysis and audit
- [**Size Mode Migration Risks Analysis**](./size-mode-migration-risks-analysis.md) - Risk assessment for size mode changes

---

## **�📚 Supporting Documentation**

### **Foundation Concepts**
- [System Requirements](../01-system-requirements.md) - Platform compatibility and tooling
- [Foundation Architecture](../02-foundation-architecture.md) - Token architecture principles
- [Modes System](../04-references/02-modes/) - Mode switching and S1/S2/S3 layers

### **Technical References**  
- [Architecture Patterns](../04-references/03-technical/architecture-patterns.md) - Token structure and hierarchy
- [Token Types](../04-references/01-token-types/) - Category-specific documentation

---

*All workflows follow the core tokenization process while providing role-specific implementation guidance.*