# Component Research Organization: Separated Documentation Strategy
## Public Component Docs vs Internal Research**01-overview.md           # Component introduction
02-architecture.md       # Design decisions & structure  
03-implementation.md     # Developer guide  
04-guidelines.md         # Usage guidelines**orts

### Organizational Philosophy

**Two-Tier Documentation System:**
1. **Public Component Documentation** - User-facing, implementation-focused
2. **Internal Research Reports** - Stakeholder-facing, decision-rationale focused

### Folder Structure

```
documentation/04-components/
├── 01-overview.md                        # Public docs
├── button/
│   ├── README.md                         # 📖 ENTRY POINT: Component overview & navigation
│   ├── 01-overview.md                    # ✅ PUBLIC: How to use
│   ├── 02-architecture.md                # ✅ PUBLIC: Component decisions & architecture
│   ├── 03-implementation.md              # ✅ PUBLIC: How to implement  
│   ├── 04-guidelines.md                  # ✅ PUBLIC: Usage guidelines
│   ├── _research/                        # 🔒 INTERNAL: Research reports
│   │   ├── README.md                     # Research index
│   │   ├── competitive-analysis/
│   │   │   ├── 2025-09-08_remove-button-industry-analysis.md
│   │   │   ├── 2025-09-06_major-design-systems-comparison.md
│   │   │   └── _archive/
│   │   ├── user-research/
│   │   │   ├── 2025-08-15_button-usability-study.md
│       │   └── 2025-09-01_accessibility-audit.md
│       ├── technical-research/
│       │   ├── 2025-09-05_figma-component-analysis.md
│       │   ├── 2025-09-06_token-architecture-study.md
│       │   └── performance/
│   │   └── decision-logs/
│   │       ├── 2025-09-07_remove-subcomponent-decision.md
│   │       └── 2025-09-08_square-constraint-rationale.md
│   └── _reports/                         # 🔒 INTERNAL: Validation reports
│       ├── 01-technical/
│       ├── 02-tokenization/
│       ├── 03-compliance/
│       ├── 04-quality/
│       └── _archive/
│
├── input/
│   ├── 01-overview.md                    # ✅ PUBLIC
│   ├── 02-architecture.md                # ✅ PUBLIC
│   ├── 03-implementation.md              # ✅ PUBLIC
│   └── _research/                        # 🔒 INTERNAL
│       ├── competitive-analysis/
│       ├── user-research/
│       └── decision-logs/
│
└── tag/
    ├── 01-overview.md                    # ✅ PUBLIC
    ├── 02-architecture.md                # ✅ PUBLIC
    ├── 03-implementation.md              # ✅ PUBLIC
    └── _research/                        # 🔒 INTERNAL
        ├── competitive-analysis/
        └── decision-logs/
```

### Content Distribution Strategy

#### PUBLIC Component Documentation (documentation/04-components/[component]/)

**01-overview.md** - User-facing introduction
- What the component does
- When to use it
- Basic examples
- API reference

**02-architecture.md** - Component decisions (distilled from research)
- Design principles
- Component structure
- Subcomponent relationships
- Constraints & rules
- Why we made specific choices (summary from research)

**03-implementation.md** - Developer-focused
- Installation & setup
- Code examples
- Integration patterns
- Token usage

**04-guidelines.md** - Usage guidance
- Do's and don'ts
- Accessibility considerations
- Content guidelines
- Responsive behavior

#### INTERNAL Research Reports (documentation/04-components/[component]/_research/)

**competitive-analysis/** - External system studies
- How other design systems solve similar problems
- Industry pattern analysis
- Benchmarking reports
- Feature comparison matrices

**user-research/** - User testing & feedback
- Usability studies
- Accessibility audits
- User interview findings
- A/B testing results

**technical-research/** - Implementation exploration
- Performance studies
- Figma component analysis
- Token architecture research
- Browser compatibility testing

**decision-logs/** - Design rationale
- Why we chose specific approaches
- Alternatives considered
- Trade-off analysis
- Stakeholder input documentation

### Naming Conventions

#### Public Documentation
```
01-overview.md           # Component introduction
02-implementation.md     # Developer guide  
03-architecture.md       # Design decisions
04-guidelines.md         # Usage guidelines
```

#### Research Reports  
```
YYYY-MM-DD_research-type_brief-description.md

Examples:
2025-09-08_competitive-analysis_remove-button-patterns.md
2025-09-06_user-research_accessibility-audit.md
2025-09-10_technical-research_figma-performance.md
2025-09-12_decision-log_square-constraint-rationale.md
```

### Content Flow: Research → Public Docs

```
🔬 RESEARCH PHASE
├── Competitive analysis
├── User research  
├── Technical exploration
└── Decision documentation

     ↓ Distillation Process

📖 PUBLIC DOCUMENTATION
├── Architecture decisions (why we built it this way)
├── Implementation guide (how to use it)
├── Guidelines (best practices)
└── Overview (what it does)
```

### Example: Button Component Organization

#### Public Documentation Structure

**button/03-architecture.md** (distilled from research):
```markdown
# Button Architecture

## Component Structure
Button consists of three subcomponents:
- `button.text_icons` - Standard button with text and optional icons
- `button.icon_only` - Icon-only button (circular constraint)  
- `button.remove` - Removal action button (square constraint)

## Design Decisions

### Why Square Constraint for Remove Buttons?
Based on industry analysis of 8 major design systems, remove buttons consistently use square proportions for:
- Visual balance within parent components
- Consistent touch targets
- Clear differentiation from circular icon buttons

*Research source: [Remove Button Industry Analysis](_research/competitive-analysis/2025-09-08_remove-button-industry-analysis.md)*

### Why Separate Remove Subcomponent?
Remove buttons require specialized behavior that generic icon buttons cannot provide:
- Semantic clarity for destructive actions
- Specialized keyboard support (Delete/Backspace)
- Context-aware sizing within parent components

*Research source: [Remove vs Icon-Only Decision](_research/decision-logs/2025-09-07_remove-subcomponent-decision.md)*
```

#### Research Documentation Structure

**button/_research/competitive-analysis/2025-09-08_remove-button-industry-analysis.md**:
```markdown
# Remove Button Research Report
## Major Design Systems Analysis for oblique's Button Subcomponent Architecture

### Executive Summary
[Full detailed research with methodology, findings, analysis...]

### Systems Analyzed
- Material-UI Chip component
- Ant Design Tag component  
- Adobe Spectrum Tags
- Microsoft Fluent UI Buttons
- Apple Human Interface Guidelines

[Complete research documentation...]
```

### Stakeholder Access Strategy

#### For Internal Teams & Stakeholders
- **Full access** to both public docs and research reports
- Research reports provide **decision rationale**
- **Traceability** from decisions back to research

#### For External/Public Users
- **Only public documentation** is exposed
- Clean, focused implementation guidance
- **No research methodology clutter**
- Architecture section provides **decision summaries**

### Implementation Benefits

#### For Stakeholders
✅ **Decision transparency** - Full research visibility  
✅ **Rationale documentation** - Why choices were made  
✅ **Research investment value** - Clear ROI on research efforts  
✅ **Quality assurance** - Decisions backed by evidence  

#### for Public Users  
✅ **Clean documentation** - No research noise  
✅ **Implementation focus** - What they need to know  
✅ **Decision context** - Why without overwhelming detail  
✅ **Professional presentation** - Polished documentation  

#### For Design System Team
✅ **Research preservation** - Knowledge doesn't get lost  
✅ **Decision audit trail** - Can revisit reasoning  
✅ **Onboarding efficiency** - New team members understand context  
✅ **Stakeholder communication** - Clear research value demonstration  

### Migration Plan

#### Step 1: Move Existing Research
```bash
# Move current research report to proper location
mv documentation/06-remove-button-research-report.md \
   documentation/04-components/button/_research/competitive-analysis/2025-09-08_remove-button-industry-analysis.md
```

#### Step 2: Create Structure
```bash
# Create research folders
mkdir -p documentation/04-components/button/_research/{competitive-analysis,user-research,technical-research,decision-logs}
mkdir -p documentation/04-components/input/_research/{competitive-analysis,user-research,decision-logs}  
mkdir -p documentation/04-components/tag/_research/{competitive-analysis,decision-logs}
```

#### Step 3: Extract Architecture Decisions
- Create `03-architecture.md` for each component
- Distill research findings into decision summaries
- Link to detailed research reports

#### Step 4: Establish Templates
- Research report templates in each `_research/` folder
- Public documentation templates
- Content flow guidelines

### Next Steps

1. **Reorganize existing content** using this structure
2. **Create architecture documents** that distill research findings  
3. **Establish content templates** for both public and research docs
4. **Set up stakeholder access** to research folders
5. **Document content flow process** from research to public docs

This separation ensures stakeholders get full research transparency while keeping public documentation clean and focused on implementation needs.
