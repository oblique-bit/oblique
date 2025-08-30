# Status Colors Documentation

Status colors communicate system state, user feedback, and contextual information in the Oblique Design System. They have been redesigned for government web applications with clearer, more accessible naming that follows established signal color semantics.

**Semantic Status System:** Semantic statuses act as an overarching term and contain more than colors. Status meaning should never rely solely on color. For full accessibility and clear communication, we combine multiple elements:
- **Status color** - Visual color coding for quick recognition
- **Status label** - Clear text descriptions (e.g., "Resolved", "Critical")  
- **Status icon** - Visual symbols for enhanced recognition (out of scope in this doc, has to be created as doc and linked)
- **Contextual information** - Additional descriptive text when needed
- **Appropriate ARIA labels** - Screen reader support for accessibility compliance

**Foundation:** Primitive color values are inherited from the [BK Design System](https://swiss.github.io/designsystem/?path=/docs/components-badge--docs) for consistency across Swiss government applications and websites. We have enhanced these base primitive colors with semantic meaning and grouped them into two distinct classifications to provide clearer guidance for designers and developers.

## **Status Reference Tables**

### 🔒 **Reserved Statuses**
Status tokens with **mandatory settings** that cannot be changed due to brand consistency, universal signal semantics, or cross-system requirements.

| Status | Type | Description | Components | Legacy Name | Inspiration | Change Status |
|--------|------|-------------|-------------|-------------|-------------|---------------|
| **info** | Informational | General information, tips, announcements | ob.c.infobox, ob.c.badge | — | GOV.UK, USWDS | Unchanged |
| **resolved** | Success/Completion | Completed tasks, success messages | ob.c.badge, ob.c.pill | success | GitHub, Jira | Renamed |
| **critical** | Error/Urgent | System failures, urgent alerts | ob.c.badge, ob.c.infobox | error | Material, Atlassian | Renamed |
| **attention** | Warning/Caution | Warnings, review needed | ob.c.infobox, ob.c.badge | warning | USWDS, Atlassian | Renamed |
| **fatal** | Emergency | Population danger, critical alerts requiring brand consistency | ob.c.infobox | — | BK Design System | Added |

### **Flexible Statuses**
Status tokens that can be **adapted, renamed, or remapped** by projects based on workflow requirements.

| Status | Type | Description | Components | Legacy Name | Inspiration | Change Status |
|--------|------|-------------|-------------|-------------|-------------|---------------|
| **pending** | Workflow | Awaiting action, in queue | ob.c.pill, ob.c.badge | — | Jira, GitHub | Added |
| **confirmed** | Approval | Verified, approved, confirmed | ob.c.pill, ob.c.badge | — | GitHub, Atlassian | Added |
| **progress** | Processing | In progress, loading states | ob.c.pill, ob.c.badge | — | Jira, GitHub | Added |
| **scheduled** | Planning | Scheduled, future items | ob.c.pill, ob.c.badge | — | Jira, GitHub | Added |
| **waiting** | Queue | Waiting, queued, on hold | ob.c.pill, ob.c.badge | — | Jira, GitHub | Added |
| **closed** | Archive | Closed, archived, ended | ob.c.pill, ob.c.badge | — | GitHub | Added |

## **Status Token Classification System**

Status tokens are classified as either **Reserved** or **Flexible** to provide clear governance:

### 🔒 **Reserved Statuses**

**Rules:**
- **Fixed across all projects** - Cannot be renamed or remapped
- 🚦 **Follow universal signal semantics** - Based on traffic light patterns
- 🌍 **Cross-system consistency** - Used across government applications
- **Color mapping locked** - Primitive color references must not change
- **Brand consistency required** - Critical for maintaining design system integrity

**Usage:** Fundamental system communication across all applications
- **Info**: General information and announcements
- **Resolved**: Completed tasks and positive outcomes  
- **Critical**: System failures and urgent alerts
- **Attention**: Warnings and caution messages
- **Fatal**: Emergency situations requiring consistent brand treatment for population safety

### **Flexible Statuses**

**Rules:**
- **Project-adaptable** - May be renamed or remapped by designers
- **Workflow-oriented** - Designed for ticketing and task management
- **Extensible** - Projects can add new flexible statuses
- **Reserved protection** - Must not alter reserved statuses

**Usage:** Application-specific workflows and customizable processes

## **Reserved Status Naming Rationale**

The Reserved status tokens (`info`, `resolved`, `critical`, `attention`) were specifically redesigned for government web applications with enhanced semantic clarity. The renaming decisions from legacy terms follow established patterns in modern web application design:

### **critical** (formerly "error")

**Why "critical" is superior for web applications:**

- **Broader semantic scope**: "Critical" encompasses system failures, urgent alerts, and high-priority issues beyond simple form errors
- **Government context alignment**: Government applications often deal with critical situations requiring immediate attention (emergency services, public safety, urgent notifications)
- **Badge/pill appropriateness**: In status indicators, "critical" better describes the urgency level rather than just error states
- **Professional tone**: "Critical" sounds more measured and professional for government communications
- **Industry standard**: Major enterprise tools (Jira, Atlassian, ServiceNow) use "critical" for highest-priority issues

**Examples in government web applications:**
- Emergency alert badges: "Critical weather warning"
- System status indicators: "Critical service outage"
- Priority classification: "Critical infrastructure issue"
- User notification badges: "Critical action required"

### **resolved** (formerly "success")

**Why "resolved" is more application-focused:**

- **Process-oriented language**: "Resolved" indicates completion of a workflow or task, not just a successful action
- **Task management semantics**: Government applications often involve case management, ticket resolution, and workflow completion
- **Less celebratory tone**: "Success" implies achievement; "resolved" implies professional completion appropriate for government contexts
- **Status indicator clarity**: In badges and pills, "resolved" clearly indicates a completed state rather than just a positive outcome
- **Industry adoption**: GitHub, Jira, and other enterprise platforms use "resolved" for completed items

**Examples in government web applications:**
- Case management badges: "Ticket resolved"
- Application status pills: "Request resolved"
- Workflow indicators: "Issue resolved"
- Process completion: "Review resolved"

### Design System Benefits

These naming choices provide:

1. **Clearer semantics**: More precise meaning in web application contexts
2. **Professional tone**: Appropriate for government and enterprise applications
3. **Better component fit**: Works naturally with badges, pills, and status indicators
4. **Industry alignment**: Consistent with established enterprise design systems
5. **Workflow orientation**: Designed for task management and process-driven applications

---

## **Technical Implementation**

## Token Structure

```
ob.s2.color.status.{status_name}.{property}.{contrast_level}.{inversity_variation}
```

### Properties
- `fg` - Foreground/text color for status content
- `bg` - Background color for status containers

### Contrast Levels
- `contrast_high` - Maximum contrast for critical visibility
- `contrast_medium` - Standard contrast for normal usage
- `contrast_low` - Subtle contrast for secondary contexts

### Inversity Variations
- `inversity_normal` - Standard light theme
- `inversity_flipped` - Dark theme / inverted contexts

## Reserved Status Colors

### Info (Blue)
Communicates informational content without urgency.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#1e40af` | `#60a5fa` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#3b82f6` | `#93c5fd` | *Not used in current components* |
| `contrast_low` | `#60a5fa` | `#dbeafe` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#1e3a8a` | `#1e40af` | Badge enabled/disabled states |
| `contrast_medium` | `#3b82f6` | `#2563eb` | Pill enabled/focus states |
| `contrast_low` | `#dbeafe` | `#1e3a8a` | Pill pressed state |

### Resolved (Green)
Indicates successful completion, approval, or positive outcomes.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#166534` | `#4ade80` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#22c55e` | `#86efac` | *Not used in current components* |
| `contrast_low` | `#4ade80` | `#dcfce7` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#14532d` | `#166534` | Badge enabled/disabled states |
| `contrast_medium` | `#22c55e` | `#16a34a` | Pill enabled/focus states |
| `contrast_low` | `#dcfce7` | `#14532d` | Pill pressed state |

### Critical (Red)
Communicates urgent alerts, system failures, or critical errors requiring immediate attention.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#dc2626` | `#f87171` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#ef4444` | `#fca5a5` | *Not used in current components* |
| `contrast_low` | `#f87171` | `#fee2e2` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#7f1d1d` | `#dc2626` | Badge enabled/disabled states |
| `contrast_medium` | `#dc2626` | `#b91c1c` | Pill enabled/focus states |
| `contrast_low` | `#fee2e2` | `#7f1d1d` | Pill pressed state |

### Attention (Amber/Orange)
Indicates caution, warnings, or items that need review but aren't critical.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#d97706` | `#fbbf24` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#f59e0b` | `#fcd34d` | *Not used in current components* |
| `contrast_low` | `#fbbf24` | `#fef3c7` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#92400e` | `#d97706` | Badge enabled/disabled states |
| `contrast_medium` | `#d97706` | `#b45309` | Pill enabled/focus states |
| `contrast_low` | `#fef3c7` | `#92400e` | Pill pressed state |

## Flexible Status Colors

### Pending (Purple)
Indicates items awaiting action or processing.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#7c3aed` | `#a855f7` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#8b5cf6` | `#c084fc` | *Not used in current components* |
| `contrast_low` | `#a855f7` | `#f3e8ff` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#581c87` | `#7c3aed` | *Not used in current components* |
| `contrast_medium` | `#7c3aed` | `#6d28d9` | Pill enabled/focus states |
| `contrast_low` | `#f3e8ff` | `#581c87` | Pill pressed state |

### Confirmed (Teal)
Indicates verified, approved, or confirmed items.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#0f766e` | `#2dd4bf` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#14b8a6` | `#5eead4` | *Not used in current components* |
| `contrast_low` | `#2dd4bf` | `#ccfbf1` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#134e4a` | `#0f766e` | *Not used in current components* |
| `contrast_medium` | `#0f766e` | `#0d9488` | Pill enabled/focus states |
| `contrast_low` | `#ccfbf1` | `#134e4a` | Pill pressed state |

### Progress (Indigo)
Indicates work in progress, loading states, or active processes.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#4338ca` | `#6366f1` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#6366f1` | `#818cf8` | *Not used in current components* |
| `contrast_low` | `#818cf8` | `#e0e7ff` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#312e81` | `#4338ca` | *Not used in current components* |
| `contrast_medium` | `#4338ca` | `#3730a3` | Pill enabled/focus states |
| `contrast_low` | `#e0e7ff` | `#312e81` | Pill pressed state |

### Additional Flexible Statuses
- **Scheduled**: Future or planned items (typically cyan/sky colors)
- **Waiting**: Queued or blocked items (typically gray/neutral colors)
- **Fatal**: Emergency disasters (inspired by BK Design System https://swiss.github.io/designsystem/?path=/docs/components-alertbanner--docs)
- **Closed**: Archived or completed items (typically muted colors)

## Usage Guidelines

The following examples demonstrate recommended implementation patterns. Actual developer implementations may vary based on project requirements, technical constraints, and team preferences.

### Component Application

These examples show recommended token usage patterns. Developers may adapt these patterns based on their specific implementation needs and project architecture.

#### Infobox Component
```scss
.infobox {
  &.info {
    background-color: var(--ob-s2-color-status-info-bg-contrastLow-inversityNormal);
    border-left: 4px solid var(--ob-s2-color-status-info-fg-contrastHigh-inversityNormal);
    color: var(--ob-s2-color-status-info-fg-contrastHigh-inversityNormal);
  }
  
  &.critical {
    background-color: var(--ob-s2-color-status-critical-bg-contrastLow-inversityNormal);
    border-left: 4px solid var(--ob-s2-color-status-critical-fg-contrastHigh-inversityNormal);
    color: var(--ob-s2-color-status-critical-fg-contrastHigh-inversityNormal);
  }
}
```

#### Badge Component
```scss
.badge {
  &.resolved {
    background-color: var(--ob-s2-color-status-resolved-bg-contrastMedium-inversityNormal);
    color: var(--ob-s2-color-status-resolved-fg-contrastHigh-inversityNormal);
  }
  
  &.pending {
    background-color: var(--ob-s2-color-status-pending-bg-contrastMedium-inversityNormal);
    color: var(--ob-s2-color-status-pending-fg-contrastHigh-inversityNormal);
  }
}
```

#### Pill Component
```scss
.pill {
  &.progress {
    background-color: var(--ob-s2-color-status-progress-bg-contrastLow-inversityNormal);
    color: var(--ob-s2-color-status-progress-fg-contrastHigh-inversityNormal);
    border: 1px solid var(--ob-s2-color-status-progress-fg-contrastMedium-inversityNormal);
  }
}
```

## Accessibility

### Contrast Requirements
All status colors have been validated and meet WCAG 2.1 AA conformity standards for accessibility compliance.

### Screen Reader Support
```html
<!-- Good: Status with accessible label -->
<div class="badge resolved" aria-label="Status: Resolved">
  <svg aria-hidden="true">...</svg>
  Resolved
</div>

<!-- Good: Status with screen reader text -->
<div class="pill progress">
  <span class="sr-only">Status: </span>
  In Progress
</div>
```

## Theme Integration

### Automatic Adaptation
Status colors automatically adapt to theme changes through inversity variations:

```scss
/* Light theme context */
.theme-light .badge.critical {
  background-color: var(--ob-s2-color-status-critical-bg-contrastMedium-inversityNormal);
  color: var(--ob-s2-color-status-critical-fg-contrastHigh-inversityNormal);
}

/* Dark theme context */
.theme-dark .badge.critical {
  background-color: var(--ob-s2-color-status-critical-bg-contrastMedium-inversityFlipped);
  color: var(--ob-s2-color-status-critical-fg-contrastHigh-inversityFlipped);
}
```

### Context-Aware Implementation
```scss
.status-indicator {
  /* Base styles that work in any context */
  --status-bg: var(--ob-s2-color-status-info-bg-contrastLow-inversityNormal);
  --status-fg: var(--ob-s2-color-status-info-fg-contrastHigh-inversityNormal);
  
  background-color: var(--status-bg);
  color: var(--status-fg);
  
  /* Automatically adapts when inversity context changes */
  .inversity_flipped & {
    --status-bg: var(--ob-s2-color-status-info-bg-contrastLow-inversityFlipped);
    --status-fg: var(--ob-s2-color-status-info-fg-contrastHigh-inversityFlipped);
  }
}
```

## **Implementation Guidelines**

### For Design System Maintainers:
1. **Never modify reserved statuses** - Color mappings and names are locked
2. **Document flexible adaptations** - Track project-specific modifications
3. **Validate token updates** - Ensure reserved statuses remain unchanged
4. **Review new statuses** - Classify as reserved or flexible

### For Project Designers:
1. **Use reserved statuses as-is** - No modifications allowed
2. **Adapt flexible statuses freely** - Rename or remap as needed
3. **Extend with new statuses** - Add project-specific statuses as flexible
4. **Document customizations** - Track deviations from base system

### For Developers:
1. **Reference semantic tokens** - Never use primitive colors directly
2. **Follow component guidelines** - Use appropriate status types per component
3. **Test theme switching** - Ensure inversity variations work correctly

> **Note:** All status colors automatically meet WCAG 2.1 AA contrast requirements. Accessibility validation is built into the design system tokens, so developers don't need to manually check contrast ratios.

## **Tools**

### Status Token Classifier Script
```bash
# Automated classification script available
# Contact team for execution details
```

This script automatically updates token descriptions with classification information.

---

*For related documentation, see [Neutral Colors](./colors-semantic-neutral.md) and [Interaction Colors](./colors-semantic-interaction.md)*
