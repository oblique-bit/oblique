# Component Research Organization Guide
## Systematic Approach to Design System Research Documentation

### Current State Analysis

**Existing Structure (Good patterns to maintain):**
```
documentation/04-components/button/
├── button-overview.md                    ✅ Component docs
├── reports/                              ✅ Research reports  
│   ├── 20250906_1416-button-mcp-figma-report.md
│   └── _archive/                         ✅ Archived research
└── implementation-summary.md             ✅ Technical docs

documentation/06-remove-button-research-report.md  ❌ Misplaced research
```

### Recommended Organization System

#### Option A: Research Within Component Folders (Recommended)

```
documentation/04-components/
├── 01-overview.md
├── button/
│   ├── 01-overview.md                    # Component overview
│   ├── 02-implementation.md              # Technical implementation
│   ├── 03-guidelines.md                  # Usage guidelines
│   └── research/                         # 🔬 Research hub
│       ├── README.md                     # Research index
│       ├── competitive-analysis/         # External system analysis
│       │   ├── 2025-09-06_remove-button-patterns.md
│       │   ├── 2025-09-08_major-design-systems-analysis.md
│       │   └── _archive/                 # Older competitive research
│       ├── user-research/                # User studies & testing
│       │   ├── 2025-08-15_button-usability-study.md
│       │   └── 2025-09-01_accessibility-audit.md
│       ├── technical-research/           # Implementation exploration
│       │   ├── 2025-09-05_figma-component-analysis.md
│       │   ├── 2025-09-06_token-architecture-study.md
│       │   └── performance/              # Performance studies
│       ├── design-exploration/           # Visual & interaction studies
│       │   ├── 2025-08-20_size-variant-exploration.md
│       │   └── 2025-09-03_animation-patterns.md
│       └── decisions/                    # Design decisions & rationale
│           ├── 2025-09-07_remove-subcomponent-decision.md
│           └── 2025-09-08_square-constraint-rationale.md
│
├── input/
│   ├── 01-overview.md
│   ├── 02-implementation.md
│   └── research/
│       ├── README.md
│       ├── competitive-analysis/
│       ├── user-research/
│       └── decisions/
│
└── tag/
    ├── 01-overview.md
    ├── 02-implementation.md
    └── research/
        ├── README.md
        ├── competitive-analysis/
        │   └── 2025-09-09_tag-remove-patterns.md  # Cross-references button research
        └── decisions/
```

#### Option B: Centralized Research Hub

```
documentation/
├── 04-components/                        # Component documentation
│   ├── button/01-overview.md
│   ├── input/01-overview.md
│   └── tag/01-overview.md
│
└── 08-research/                          # 🔬 Central research hub
    ├── README.md                         # Research methodology & index
    ├── competitive-analysis/             # Cross-component research
    │   ├── 2025-09-06_design-systems-sizing-patterns.md
    │   ├── 2025-09-08_remove-button-industry-analysis.md
    │   └── systems/                      # Per-system deep dives
    │       ├── material-ui/
    │       ├── ant-design/
    │       └── spectrum/
    ├── component-research/               # Component-specific research
    │   ├── button/
    │   │   ├── competitive-analysis/
    │   │   ├── user-research/
    │   │   ├── technical-research/
    │   │   └── decisions/
    │   ├── input/
    │   └── tag/
    ├── cross-component/                  # Multi-component research
    │   ├── sizing-inheritance-patterns.md
    │   ├── accessibility-standards.md
    │   └── token-architecture/
    └── methodology/                      # Research processes
        ├── competitive-analysis-template.md
        ├── user-research-guidelines.md
        └── research-report-template.md
```

### Recommended: Hybrid Approach

**Best of both worlds - Component-focused with cross-references:**

```
documentation/04-components/[component]/research/  # Component-specific research
documentation/08-research/                         # Cross-component & methodology
```

### Research File Naming Convention

#### Format: `YYYY-MM-DD_research-type_brief-description.md`

**Examples:**
```
2025-09-06_competitive-analysis_remove-button-patterns.md
2025-09-08_user-research_button-accessibility-study.md
2025-09-10_technical-research_figma-component-performance.md
2025-09-12_design-exploration_size-variant-concepts.md
2025-09-15_decision-log_square-constraint-rationale.md
```

**Research Type Prefixes:**
- `competitive-analysis_` - External design system studies
- `user-research_` - User testing, interviews, surveys
- `technical-research_` - Implementation, performance, tooling
- `design-exploration_` - Visual concepts, interaction patterns
- `decision-log_` - Design decisions and rationale
- `cross-component_` - Multi-component studies

### Research Document Templates

#### Competitive Analysis Template
```markdown
# [Component] Competitive Analysis: [Topic]
## Research Overview

**Date**: YYYY-MM-DD
**Systems Analyzed**: System1, System2, System3
**Research Question**: What problem are we solving?
**Scope**: What aspects are we analyzing?

## Executive Summary
Key findings in 2-3 sentences

## Systems Analysis
### [Design System Name]
- **Implementation**: How they solve it
- **Patterns**: What patterns they use
- **Evidence**: Links, screenshots, code
- **Assessment**: Pros/cons

## Key Findings
1. Pattern identification
2. Industry trends
3. Best practices

## Recommendations for oblique
- Specific actionable insights
- Implementation suggestions
- Validation of current approach

## References
- Links to source documentation
- Related research files
```

#### Decision Log Template
```markdown
# Decision: [Brief Description]

**Date**: YYYY-MM-DD  
**Component**: [Component Name]  
**Decision**: What was decided  
**Status**: ✅ Approved | 🔄 Under Review | ❌ Rejected

## Context
What led to this decision need?

## Options Considered
1. **Option A**: Description, pros/cons
2. **Option B**: Description, pros/cons
3. **Option C**: Description, pros/cons

## Decision Rationale
Why this option was chosen

## Research Supporting Decision
- Link to competitive analysis
- Link to user research
- Link to technical research

## Implementation Impact
- Components affected
- Token changes needed
- Breaking changes

## Validation Plan
How will we measure success?
```

### Cross-Component Research Tracking

#### Research Index (documentation/08-research/README.md)
```markdown
# Design System Research Index

## Active Research Areas
- [ ] Component sizing inheritance patterns
- [ ] Accessibility audit across all components  
- [ ] Performance optimization study
- [x] Remove button patterns analysis ✅

## Cross-Component Studies
| Study | Components | Status | Lead |
|-------|-----------|---------|------|
| Sizing Patterns | Button, Input, Tag | In Progress | Team |
| Accessibility Audit | All | Planned | Designer |

## Research by Component
### Button
- [Remove Button Analysis](../04-components/button/research/competitive-analysis/2025-09-08_remove-button-patterns.md)
- [Size Variants Study](../04-components/button/research/design-exploration/2025-09-05_size-exploration.md)

### Input  
- [Accessibility Standards](../04-components/input/research/user-research/2025-08-20_accessibility-audit.md)
```

### Implementation Steps

#### Step 1: Reorganize Existing Research
```bash
# Move misplaced research to proper component folders
mv documentation/06-remove-button-research-report.md \
   documentation/04-components/button/research/competitive-analysis/2025-09-09_remove-button-industry-analysis.md
```

#### Step 2: Create Research Structure
```bash
# Create research folders for existing components
mkdir -p documentation/04-components/button/research/{competitive-analysis,user-research,technical-research,design-exploration,decisions}
mkdir -p documentation/04-components/input/research/{competitive-analysis,user-research,decisions}
mkdir -p documentation/04-components/tag/research/{competitive-analysis,decisions}
```

#### Step 3: Create Research Hub
```bash
# Create central research coordination
mkdir -p documentation/08-research/{cross-component,methodology,competitive-analysis/systems}
```

#### Step 4: Implement Templates
- Create research templates in `documentation/08-research/methodology/`
- Establish naming conventions
- Set up research index tracking

### Benefits of This Organization

#### For Researchers
- **Clear structure** for finding component-specific research
- **Templates** for consistent research quality
- **Cross-references** prevent duplicate work

#### For Developers  
- **Component-focused** research easily discoverable
- **Decision logs** provide implementation context
- **Technical research** supports development needs

#### For Designers
- **Competitive analysis** informs design decisions
- **User research** validates design choices
- **Design exploration** documents iteration process

#### For Maintainers
- **Research index** provides oversight
- **Methodology docs** ensure quality standards
- **Archive system** preserves research history

### Tools Integration

#### File Naming Automation
```bash
# Helper script for research file creation
./scripts/create-research.sh button competitive-analysis "remove-button-patterns"
# Creates: documentation/04-components/button/research/competitive-analysis/2025-09-09_competitive-analysis_remove-button-patterns.md
```

#### Cross-Reference Validation
- Automated link checking between research files
- Component research completeness tracking
- Research age/relevance monitoring

---

**Next Steps**: Choose organization approach and begin restructuring existing research files using the proposed naming conventions and templates.
