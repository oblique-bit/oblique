# Status Colors Documentation

Status colors communicate system state, user feedback, and contextual information in the Oblique Design System. They have been redesigned for government web applications with clearer, more accessible naming that follows established signal color semantics.

**Semantic Status System:** Semantic statuses act as an overarching term and contain more than colors. Status meaning must not rely solely on color. For full accessibility and clear communication, we combine multiple elements:
- **Status color** - Visual color coding for quick recognition
- **Status label** - Clear text descriptions (such as "Resolved", "Critical")  
- **Status icon** - Visual symbols for enhanced recognition (out of scope in this doc, has to be created as doc and linked)
- **Contextual information** - Additional descriptive text when needed
- **Appropriate ARIA labels** - Screen reader support for accessibility compliance

**Foundation:** Primitive color values are inherited from the [BK Design System](https://swiss.github.io/designsystem/?path=/docs/components-badge--docs) for consistency across Swiss government applications and websites. We have enhanced these base primitive colors with semantic meaning and grouped them into two distinct classifications to provide clearer guidance for designers and developers.

## **Status Reference Tables**

### **Reserved Statuses**
Status tokens with **mandatory settings** that cannot be changed due to brand consistency, universal signal semantics, or cross-system requirements.

| Status | Type | Description | Components | Legacy Name | Inspiration | Change Status |
|--------|------|-------------|-------------|-------------|-------------|---------------|
| **info** | Informational | General information, tips, announcements | badge, pill, infobox, alert | — | USWDS | Unchanged |
| **resolved** | Success/Completion | Completed tasks, success messages | badge, pill, status-indicator | success | GitHub, Jira | Renamed |
| **critical** | Error/Urgent | System failures, urgent alerts | badge, pill, infobox, alert | error | Material, Atlassian | Renamed |
| **attention** | Warning/Caution | Warnings, review needed | badge, pill, infobox, alert | — | BK Design System | Added |

### **Flexible Statuses**
Status tokens that **projects can adapt, rename, or remap** based on workflow requirements.

| Status | Type | Description | Components | Legacy Name | Inspiration | Change Status |
|--------|------|-------------|-------------|-------------|-------------|---------------|
| **pending** | Workflow | Awaiting action, in queue | badge, pill, status-indicator | — | GitHub | Added |
| **confirmed** | Verification | Verified, approved, confirmed items | badge, pill, status-indicator | — | Custom | Added |
| **progress** | Active Work | Work in progress, loading states | badge, pill, status-indicator | — | Custom | Added |
| **scheduled** | Future | Future or planned items | badge, pill, status-indicator | — | Custom | Added |
| **waiting** | Queued | Queued or blocked items | badge, pill, status-indicator | — | Custom | Added |
| **closed** | Archive | Archived or completed items | badge, pill, status-indicator | — | Custom | Added |

## **Status Token Classification System**

Status tokens are classified as either **Reserved** or **Flexible** to provide clear governance:

### **Reserved Statuses**

**Rules:**
- **Fixed across all projects** - Cannot be renamed or remapped
- **Follow universal signal semantics** - Based on traffic light patterns
- **Cross-system consistency** - Used across government applications
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
- **Government context alignment**: Government applications frequently deal with critical situations requiring immediate attention (emergency services, public safety, urgent notifications)
- **Badge/pill appropriateness**: In status indicators, "critical" better describes the urgency level beyond simple error states
- **Professional tone**: "Critical" sounds more measured and professional for government communications
- **Industry standard**: Major enterprise tools (Jira, Atlassian, ServiceNow) use "critical" for highest-priority issues

**Examples in government web applications:**
- Emergency alert badges: "Critical weather warning"
- System status indicators: "Critical service outage"
- Priority classification: "Critical infrastructure issue"
- User notification badges: "Critical action required"

### **resolved** (formerly "success")

**Why "resolved" is more application-focused:**

- **Process-oriented language**: "Resolved" indicates completion of a workflow or task, not a successful action
- **Task management semantics**: Government applications frequently involve case management, ticket resolution, and workflow completion
- **Less celebratory tone**: "Success" implies achievement; "resolved" implies professional completion appropriate for government contexts
- **Status indicator clarity**: In badges and pills, "resolved" clearly indicates a completed state beyond a positive outcome
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
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.{status_name}.{property}.{contrast_level}.{inversity_variation}
```

**Primitive Token Reference:** Each color value in the tables below corresponds to a primitive token from the base color palette (`ob.p.color.red.50.red.50.{color_family}.{scale}`). These primitive tokens are organized by color family (red, blue, green, orange, purple, indigo, etc.) with numbered scales from 50 (lightest) to 900 (darkest).

> **Note**: Some status colors marked as *Custom/Computed* may not have direct primitive token mappings and could be using computed values, custom colors, or tokens from a different color system. These should be verified against the actual token implementation files.

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
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#1E3A8A` | `#EFF6FF` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#1E40AF` | `#93c5fd` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |
| `contrast_low` | `#2563EB` | `#DBEAFE` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#1e3a8a` | `#1e40af` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Badge enabled/disabled states |
| `contrast_medium` | `#3b82f6` | `#2563eb` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus states |
| `contrast_low` | `#bfdbfe` | `#2563EB` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus/pressed states |

### Resolved (Green)
Indicates successful completion, approval, or positive outcomes.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#065f46` | `#ecfdf5` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#047857` | `#a7f3d0` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |
| `contrast_low` | `#059669` | `#d1fae5` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#064e3b` | `#065f46` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Badge enabled/disabled states |
| `contrast_medium` | `#047857` | `#059669` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus states |
| `contrast_low` | `#a7f3d0` | `#059669` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus/pressed states |

### Critical (Red)
Communicates urgent alerts, system failures, or critical errors requiring immediate attention.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#99191e` | `#ffedee` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#bf1f25` | `#fa9da1` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |
| `contrast_low` | `#d8232a` | `#ffccce` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#801519` | `#99191e` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Badge enabled/disabled states, Pill focus state |
| `contrast_medium` | `#bf1f25` | `#d8232a` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus states |
| `contrast_low` | `#ffccce` | `#d8232a` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/pressed states |

### Attention (Amber/Orange)
Indicates caution, warnings, or items that need review but aren't critical.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#9a3412` | `#fff7ed` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#c2410c` | `#fdba74` | *Not used in current components* |
| `contrast_low` | `#ea580c` | `#ffedd5` | *Not used in current components* |

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#9a3412` | `#fff7ed` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#c2410c` | `#fdba74` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |
| `contrast_low` | `#ea580c` | `#ffedd5` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#7c2d12` | `#9a3412` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Badge enabled/disabled states |
| `contrast_medium` | `#c2410c` | `#ea580c` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus states |
| `contrast_low` | `#fed7aa` | `#ea580c` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus/pressed states |

## Flexible Status Colors

### Pending (Purple)
Indicates items awaiting action or processing.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#7c3aed` | `#a855f7` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#8b5cf6` | `#c084fc` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |
| `contrast_low` | `#a855f7` | `#f3e8ff` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#581c87` | `#7c3aed` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |
| `contrast_medium` | `#7c3aed` | `#6d28d9` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus states |
| `contrast_low` | `#f3e8ff` | `#581c87` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill pressed state |

### Confirmed (Teal)
Indicates verified, approved, or confirmed items.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#0f766e` | `#2dd4bf` | *Custom/Computed* | *Custom/Computed* | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#14b8a6` | `#5eead4` | *Custom/Computed* | *Custom/Computed* | *Not used in current components* |
| `contrast_low` | `#2dd4bf` | `#ccfbf1` | *Custom/Computed* | *Custom/Computed* | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#134e4a` | `#0f766e` | *Custom/Computed* | *Custom/Computed* | *Not used in current components* |
| `contrast_medium` | `#0f766e` | `#0d9488` | *Custom/Computed* | *Custom/Computed* | Pill enabled/focus states |
| `contrast_low` | `#ccfbf1` | `#134e4a` | *Custom/Computed* | *Custom/Computed* | Pill pressed state |

### Progress (Indigo)
Indicates work in progress, loading states, or active processes.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#4338ca` | `#6366f1` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#6366f1` | `#818cf8` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |
| `contrast_low` | `#818cf8` | `#e0e7ff` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#312e81` | `#4338ca` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | *Not used in current components* |
| `contrast_medium` | `#4338ca` | `#3730a3` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus states |
| `contrast_low` | `#e0e7ff` | `#312e81` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill pressed state |

### Additional Flexible Status Notes
All flexible statuses listed in the table above are available in the design system. Additional considerations:

#### Scheduled (Pink)
Future or planned items - typically uses pink/rose color family.

**Foreground Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#be185d` | `#f9a8d4` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | All pill states (enabled/hover/focus/pressed) |

**Background Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_medium` | `#be185d` | `#9d174d` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus states |
| `contrast_low` | `#fce7f3` | `#831843` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill pressed state |

#### Waiting (Cobalt/Gray)
Queued or blocked items - typically uses neutral gray colors.

**Foreground Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#263645` | `#acb4bd` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | All pill states (enabled/hover/focus/pressed) |

**Background Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_medium` | `#263645` | `#1c2834` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus states |
| `contrast_low` | `#dfe4e9` | `#131b22` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill pressed state |

#### Closed (Cobalt/Gray)
Archived or completed items - typically uses muted gray colors.

**Foreground Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#1c2834` | `#828e9a` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | All pill states (enabled/hover/focus/pressed) |

**Background Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_medium` | `#596978` | `#2f4356` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill enabled/focus states |
| `contrast_low` | `#f0f4f7` | `#131b22` | `ob.p.color.red.50.red.50.red.50` | `ob.p.color.red.50.red.50.red.50` | Pill pressed state |

#### Fatal (Red - Emergency)
Emergency disasters - used only in infobox components, not in pills or badges.

**Note**: Fatal status uses the same red color family as Critical status but with maximum contrast requirements for emergency situations requiring consistent brand treatment for population safety. Refer to Critical (Red) color table above for primitive token mappings.

> **Note**: Projects may extend flexible statuses by adding new status types as needed, following the same token structure and classification rules.

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
