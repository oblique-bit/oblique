# Status Colors Documentation

Status colors communicate system state, user feedback, and contextual information in the Oblique Design System. They have been redesigned for government web applications with clearer, more accessible naming that follows established signal color 03_semantics.

**Semantic Status System:** Semantic statuses act as an overarching term and contain more than colors. Status meaning must not rely solely on color. For full accessibility and clear communication, we combine multiple elements:
- **Status color** - Visual color coding for quick recognition
- **Status label** - Clear text descriptions (such as "Resolved", "Critical")  
- **Status icon** - Visual symbols for enhanced recognition (out of scope in this doc, has to be created as doc and linked)
- **Contextual information** - Additional descriptive text when needed
- **Appropriate ARIA labels** - Screen reader support for accessibility compliance

**Foundation:** Primitive color values are inherited from the [BK Design System](https://swiss.github.io/designsystem/?path=/docs/04_components-badge--docs) for consistency across Swiss government applications and websites. We have enhanced these base primitive colors with 03_semantic meaning and grouped them into two distinct classifications to provide clearer guidance for designers and developers.

## **Reserved Color Governance**

### **System-Wide Reserved Color Policy**

**All interaction and status colors are reserved for their intended semantic purpose and must not be used for other purposes.** This governance applies across all color categories in the design system.

**Reserved Color Categories:**
- **Status colors** - `info`, `resolved`, `critical`, `attention` (documented below)
- **Interaction colors** - Hover, active, focus, selected, visited states
- **Accessibility colors** - Focus outlines, visited links, skip navigation  
- **System colors** - Disabled states, overlays, backdrops
- **Brand colors** - Primary brand identity colors

**Core Principle:**
**Semantic colors communicate meaning - using them decoratively breaks user expectations and accessibility.**

**Reservation Types:**
- **Technical reservation**: Colors directly consumed by semantic tokens
- **Semantic aura**: ±2 shade values around any semantic color are also reserved

**Semantic Aura Rule:**
If a color has semantic meaning (e.g., red.500 = error), the **next 2 shades in each direction** are also reserved:
- red.500 = error (semantic)
- red.300, red.400, red.600, red.700 = reserved (semantic aura)
- red.200, red.800+ = available for decorative use

**Governance Rules:**
- ✅ **Use reserved colors ONLY for their intended semantic purpose**  
- ❌ **Never use semantic colors + their ±2 shade aura for decoration**
- 🔄 **Use shades outside the semantic aura for decorative needs**
- 📋 **All semantic colors automatically reserve their ±2 shade aura**

**Implementation:** Reserved colors include `"reserved": true` metadata in token definitions with documented alternatives for decorative use.

## **Status Reference Tables**

### **Reserved Statuses**
Status tokens with **mandatory settings** that cannot be changed due to brand consistency, universal signal 03_semantics, or cross-system requirements.

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
- **Follow universal signal 03_semantics** - Based on traffic light patterns
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

The Reserved status tokens (`info`, `resolved`, `critical`, `attention`) were specifically redesigned for government web applications with enhanced 03_semantic clarity. The renaming decisions from legacy terms follow established patterns in modern web application design:

### **critical** (formerly "error")

**Why "critical" is superior for web applications:**

- **Broader 03_semantic scope**: "Critical" encompasses system failures, urgent alerts, and high-priority issues beyond simple form errors
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
- **Task management 03_semantics**: Government applications frequently involve case management, ticket resolution, and workflow completion
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

1. **Clearer 03_semantics**: More precise meaning in web application contexts
2. **Professional tone**: Appropriate for government and enterprise applications
3. **Better 04_component fit**: Works naturally with badges, pills, and status indicators
4. **Industry alignment**: Consistent with established enterprise design systems
5. **Workflow orientation**: Designed for task management and process-driven applications

---

## **Technical Implementation**

## Token Structure

```
ob.s.color.status.{status_name}.{property}.{contrast_level}.{inversity_variation}
```

**Primitive Token Reference:** Each color value in the tables below corresponds to a primitive token from the base color palette (`ob.p.color.{color_family}.{shade}`). These primitive tokens are organized by color family (red, blue, green, orange, purple, indigo, etc.) with numbered scales from 50 (lightest) to 900 (darkest).

> **Note**: Some status colors marked as *Custom/Computed* may not have direct primitive token mappings and could be using computed values, custom colors, or tokens from a different color system. These should be verified against the actual token implementation files.

### Properties
- `fg` - Foreground/text color for status content
- `bg` - Background color for status containers

### Contrast Levels
- `contrast_highest` - Absolute maximum contrast, hue-neutral (see below)
- `contrast_high` - High contrast within the status hue family
- `contrast_medium` - Standard contrast for normal usage
- `contrast_low` - Subtle contrast for secondary contexts

> **Recommended contrast level for `bg` and `border`:** Use `contrast_low` for all status `bg` and `border` tokens in components. Despite the lower luminance contrast, `contrast_low` shades retain full color saturation, making the status hue immediately recognisable. This applies to all status categories (info, critical, resolved, attention, pending, confirmed, progress, scheduled, waiting, closed, fatal). Use cases include small status surfaces such as Badge backgrounds and Infobox borders, where a saturated but visually unobtrusive fill or stroke is preferable to the heavier visual weight of `contrast_medium` or `contrast_high`.

### The `contrast_highest` Tier — Intentional Hue Alien

Every status color category — regardless of its hue — maps `fg.contrast_highest` to the same neutral primitive:

| Mode | Foreground | Background | Primitive |
|------|-----------|-----------|-----------|
| Light | `fg.contrast_highest` | — | `ob.p.color.cobalt.900` (#131B22) |
| Dark | `fg.contrast_highest` | — | `ob.p.color.basic.white` (#FFFFFF) |
| Light | — | `bg.contrast_highest` | `ob.p.color.basic.white` (#FFFFFF) |
| Dark | — | `bg.contrast_highest` | `ob.p.color.cobalt.900` (#131B22) |

This applies uniformly across all 12 statuses (info, critical, resolved, attention, fatal, closed, disabled, pending, confirmed, progress, scheduled, waiting) and across neutral and interaction categories.

**Why `contrast_highest` breaks the hue rule on purpose:**

`contrast_high`, `contrast_medium`, and `contrast_low` all stay within their status hue family. A `critical` foreground at `contrast_high` is a dark red, `info` at `contrast_high` is a dark blue, and so on. `contrast_highest` is different — it deliberately steps outside the status hue and uses the darkest neutral available (`cobalt.900` in light mode, `basic.white` in dark mode). This makes it a **hue alien**: it belongs to the status group semantically but does not share the hue visually.

**Rationale:**

- **Maximum contrast on demand.** At small font sizes (e.g., component size `xs` or `sm`), the in-hue `contrast_high` foreground may not provide sufficient contrast against certain status backgrounds. `contrast_highest` gives maintainers a single token to reach the absolute highest available contrast without leaving the semantic token namespace.
- **Consistent across all statuses.** Because every status maps `contrast_highest` to the same neutral primitive, a component can reference `status.{any}.fg.contrast_highest` and always get the darkest (or brightest) possible text — no per-status exceptions needed.
- **Symmetrical light/dark behavior.** In light mode, `fg.contrast_highest` is the darkest neutral and `bg.contrast_highest` is white. In dark mode, the values swap. The concept — "give me the maximum" — stays the same regardless of theme.
- **Opt-in, not default.** Components typically use `contrast_high` (in-hue) for their default foreground. `contrast_highest` is an explicit choice for situations where accessibility requires it, such as small text on a colored background where the in-hue foreground falls short.

**Practical example:**

A badge at size `xs` displaying status `info` on a medium-contrast info background might use:
```
color: var(--ob-s-color-status-info-fg-contrast_highest-inversity_normal);
```
This produces near-black text (`cobalt.900`) instead of dark blue (`contrast_high`), gaining the extra contrast needed at that small size — while still referencing a token that semantically belongs to the info status group.

### Prohibited Pairing: Neutral Foreground on Status Background

**Rule: Never pair neutral foreground tokens (`ob.s.color.neutral.fg.contrast_high`, `contrast_medium`, or `contrast_low`) with status background colors.**

`contrast_highest` already provides the only neutral shade that safely pairs with any status background — `cobalt.900` (#131B22) in light mode, `basic.white` (#FFFFFF) in dark mode. These are the absolute extremes of the lightness scale, which guarantees sufficient contrast against any colored background.

All other neutral foreground shades (gray tones from `contrast_high` through `contrast_low`) produce grayish text on colored backgrounds. This causes contrast failures because:

- **Insufficient luminance difference.** A medium gray on a saturated blue or red background can easily fall below WCAG AA thresholds, especially at small font sizes.
- **Semantic confusion.** Neutral gray text on a status-colored background sends a mixed signal — the background says "this has status meaning" while the gray text says "this is neutral content." The pairing undermines both messages.
- **No valid use case.** Every legitimate scenario where text appears on a status background is already covered: in-hue foregrounds (`contrast_high` through `contrast_low`) for status-coherent text, and `contrast_highest` for maximum-contrast text that intentionally breaks the hue. There is no gap that a mid-range neutral would fill.

**What to use instead:**

| Scenario | Correct token | Why |
|----------|---------------|-----|
| Default text on status bg | `status.{name}.fg.contrast_high` | In-hue, high contrast, semantically consistent |
| Small text needing extra contrast | `status.{name}.fg.contrast_highest` | Hue-neutral by design, maximum possible contrast |
| Subtle secondary text on status bg | `status.{name}.fg.contrast_medium` | Still in-hue, lower emphasis but semantically correct |

This rule ensures that every foreground color on a status background either stays within the status hue family or reaches the absolute maximum neutral contrast — nothing in between.

### Interaction Elements on Status Backgrounds — Emphasis Low Required

**Rule: Buttons, text links, and other interaction elements placed on saturated status backgrounds (`contrast_high`, `contrast_medium`, `contrast_low`) must use emphasis low mode.**

The only exception is `bg.contrast_highest`, which resolves to a neutral white/dark and therefore pairs safely with high-emphasis interaction colors.

**Why high emphasis fails on saturated backgrounds:**

High-emphasis interaction tokens (e.g. `ob.s.color.interaction.*.emphasis_high`) carry strong chromatic saturation — typically deep blues for links, vivid accent colors for buttons. When placed on a saturated status background (a red `critical`, blue `info`, or green `resolved` surface), two competing saturated hues clash:

- **Visual strain.** Saturated foreground on saturated background creates high chromatic tension that is hard on the eye, especially at small sizes or extended reading.
- **Semantic collision.** The status background communicates a specific meaning (error, success, info). A vividly colored link or button introduces a second semantic signal that competes with and dilutes the status message.
- **Reduced legibility.** Two saturated hues of different families can produce poor perceived contrast even when the luminance ratio technically passes WCAG thresholds.

**Why emphasis low works:**

Emphasis low desaturates interaction tokens to monochromatic (near-neutral) tones. On a saturated status background, a monochromatic link or button:

- Has only one chromatic signal on-screen — the status color — keeping the message clear.
- Achieves better perceived contrast because neutral-on-saturated has no hue competition.
- Remains recognizable as interactive through underline (links) or shape (buttons) affordances rather than color alone.

**Summary:**

| Background | Interaction emphasis | Why |
|------------|---------------------|-----|
| `bg.contrast_highest` (neutral) | High or Low | Neutral bg — no hue clash |
| `bg.contrast_high` (saturated) | **Low only** | Saturated bg — avoid chromatic collision |
| `bg.contrast_medium` (saturated) | **Low only** | Saturated bg — avoid chromatic collision |
| `bg.contrast_low` (saturated) | **Low only** | Saturated bg — avoid chromatic collision |

### Inversity Variations
- `inversity_normal` - Standard light theme
- `inversity_flipped` - Dark theme / inverted contexts

## Reserved Status Colors

### Info (Blue)
Communicates informational content without urgency.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_highest` | `#131B22` | `#FFFFFF` | `ob.p.color.cobalt.900` | `ob.p.color.basic.white` | Maximum contrast (hue-neutral), small text on colored bg |
| `contrast_high` | `#1E3A8A` | `#EFF6FF` | `ob.p.color.blue.900` | `ob.p.color.blue.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#1E40AF` | `#93c5fd` | `ob.p.color.blue.800` | `ob.p.color.blue.300` | *Not used in current 04_components* |
| `contrast_low` | `#2563EB` | `#DBEAFE` | `ob.p.color.blue.600` | `ob.p.color.blue.100` | *Not used in current 04_components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_highest` | `#FFFFFF` | `#131B22` | `ob.p.color.basic.white` | `ob.p.color.cobalt.900` | Maximum contrast (hue-neutral), high-contrast container |
| `contrast_high` | `#1e3a8a` | `#1e40af` | `ob.p.color.blue.900` | `ob.p.color.blue.800` | Badge enabled/disabled states |
| `contrast_medium` | `#3b82f6` | `#2563eb` | `ob.p.color.blue.500` | `ob.p.color.blue.600` | Pill enabled/focus states |
| `contrast_low` | `#bfdbfe` | `#2563EB` | `ob.p.color.blue.200` | `ob.p.color.blue.600` | Pill enabled/focus/pressed states |

### Resolved (Green)
Indicates successful completion, approval, or positive outcomes.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_highest` | `#131B22` | `#FFFFFF` | `ob.p.color.cobalt.900` | `ob.p.color.basic.white` | Maximum contrast (hue-neutral), small text on colored bg |
| `contrast_high` | `#065f46` | `#ecfdf5` | `ob.p.color.green.800` | `ob.p.color.green.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#047857` | `#a7f3d0` | `ob.p.color.green.700` | `ob.p.color.green.200` | *Not used in current 04_components* |
| `contrast_low` | `#059669` | `#d1fae5` | `ob.p.color.green.600` | `ob.p.color.green.100` | *Not used in current 04_components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_highest` | `#FFFFFF` | `#131B22` | `ob.p.color.basic.white` | `ob.p.color.cobalt.900` | Maximum contrast (hue-neutral), high-contrast container |
| `contrast_high` | `#064e3b` | `#065f46` | `ob.p.color.green.900` | `ob.p.color.green.800` | Badge enabled/disabled states |
| `contrast_medium` | `#047857` | `#059669` | `ob.p.color.green.700` | `ob.p.color.green.600` | Pill enabled/focus states |
| `contrast_low` | `#a7f3d0` | `#059669` | `ob.p.color.green.200` | `ob.p.color.green.600` | Pill enabled/focus/pressed states |

### Critical (Red)
Communicates urgent alerts, system failures, or critical errors requiring immediate attention.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_highest` | `#131B22` | `#FFFFFF` | `ob.p.color.cobalt.900` | `ob.p.color.basic.white` | Maximum contrast (hue-neutral), small text on colored bg |
| `contrast_high` | `#99191e` | `#ffedee` | `ob.p.color.red.800` | `ob.p.color.red.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#bf1f25` | `#fa9da1` | `ob.p.color.red.700` | `ob.p.color.red.300` | *Not used in current 04_components* |
| `contrast_low` | `#d8232a` | `#ffccce` | `ob.p.color.red.600` | `ob.p.color.red.200` | *Not used in current 04_components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_highest` | `#FFFFFF` | `#131B22` | `ob.p.color.basic.white` | `ob.p.color.cobalt.900` | Maximum contrast (hue-neutral), high-contrast container |
| `contrast_high` | `#801519` | `#99191e` | `ob.p.color.red.900` | `ob.p.color.red.800` | Badge enabled/disabled states, Pill focus state |
| `contrast_medium` | `#bf1f25` | `#d8232a` | `ob.p.color.red.700` | `ob.p.color.red.600` | Pill enabled/focus states |
| `contrast_low` | `#ffccce` | `#d8232a` | `ob.p.color.red.200` | `ob.p.color.red.600` | Pill enabled/pressed states |

### Attention (Amber/Orange)
Indicates caution, warnings, or items that need review but aren't critical.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#9a3412` | `#fff7ed` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#c2410c` | `#fdba74` | *Not used in current 04_components* |
| `contrast_low` | `#ea580c` | `#ffedd5` | *Not used in current 04_components* |

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_highest` | `#131B22` | `#FFFFFF` | `ob.p.color.cobalt.900` | `ob.p.color.basic.white` | Maximum contrast (hue-neutral), small text on colored bg |
| `contrast_high` | `#9a3412` | `#fff7ed` | `ob.p.color.orange.800` | `ob.p.color.orange.50` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#c2410c` | `#fdba74` | `ob.p.color.orange.700` | `ob.p.color.orange.300` | *Not used in current 04_components* |
| `contrast_low` | `#ea580c` | `#ffedd5` | `ob.p.color.orange.600` | `ob.p.color.orange.100` | *Not used in current 04_components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_highest` | `#FFFFFF` | `#131B22` | `ob.p.color.basic.white` | `ob.p.color.cobalt.900` | Maximum contrast (hue-neutral), high-contrast container |
| `contrast_high` | `#7c2d12` | `#9a3412` | `ob.p.color.orange.900` | `ob.p.color.orange.800` | Badge enabled/disabled states |
| `contrast_medium` | `#c2410c` | `#ea580c` | `ob.p.color.orange.700` | `ob.p.color.orange.600` | Pill enabled/focus states |
| `contrast_low` | `#fed7aa` | `#ea580c` | `ob.p.color.orange.200` | `ob.p.color.orange.600` | Pill enabled/focus/pressed states |

## Flexible Status Colors

### Pending (Purple)
Indicates items awaiting action or processing.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#7c3aed` | `#a855f7` | `ob.p.color.purple.600` | `#a855f7 (no match)` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#8b5cf6` | `#c084fc` | `ob.p.color.purple.500` | `#c084fc (no match)` | *Not used in current 04_components* |
| `contrast_low` | `#a855f7` | `#f3e8ff` | `#a855f7 (no match)` | `#f3e8ff (no match)` | *Not used in current 04_components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#581c87` | `#7c3aed` | `#581c87 (no match)` | `ob.p.color.purple.600` | *Not used in current 04_components* |
| `contrast_medium` | `#7c3aed` | `#6d28d9` | `ob.p.color.purple.600` | `ob.p.color.purple.700` | Pill enabled/focus states |
| `contrast_low` | `#f3e8ff` | `#581c87` | `#f3e8ff (no match)` | `#581c87 (no match)` | Pill pressed state |

### Confirmed (Teal)
Indicates verified, approved, or confirmed items.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#0f766e` | `#2dd4bf` | *Custom/Computed* | *Custom/Computed* | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#14b8a6` | `#5eead4` | *Custom/Computed* | *Custom/Computed* | *Not used in current 04_components* |
| `contrast_low` | `#2dd4bf` | `#ccfbf1` | *Custom/Computed* | *Custom/Computed* | *Not used in current 04_components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#134e4a` | `#0f766e` | *Custom/Computed* | *Custom/Computed* | *Not used in current 04_components* |
| `contrast_medium` | `#0f766e` | `#0d9488` | *Custom/Computed* | *Custom/Computed* | Pill enabled/focus states |
| `contrast_low` | `#ccfbf1` | `#134e4a` | *Custom/Computed* | *Custom/Computed* | Pill pressed state |

### Progress (Indigo)
Indicates work in progress, loading states, or active processes.

#### Foreground Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#4338ca` | `#6366f1` | `ob.p.color.indigo.700` | `ob.p.color.indigo.500` | All pill states (enabled/hover/focus/pressed) |
| `contrast_medium` | `#6366f1` | `#818cf8` | `ob.p.color.indigo.500` | `ob.p.color.indigo.400` | *Not used in current 04_components* |
| `contrast_low` | `#818cf8` | `#e0e7ff` | `ob.p.color.indigo.400` | `ob.p.color.indigo.100` | *Not used in current 04_components* |

#### Background Colors
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#eef2ff` | `#4338ca` | `ob.p.color.indigo.50` | `ob.p.color.indigo.700` | *Not used in current 04_components* |
| `contrast_medium` | `#4338ca` | `#3730a3` | `ob.p.color.indigo.700` | `ob.p.color.indigo.800` | Pill enabled/focus states |
| `contrast_low` | `#e0e7ff` | `#312e81` | `ob.p.color.indigo.100` | `ob.p.color.indigo.900` | Pill pressed state |

### Additional Flexible Status Notes
All flexible statuses listed in the table above are available in the design system. Additional considerations:

#### Scheduled (Pink)
Future or planned items - typically uses pink/rose color family.

**Foreground Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#be185d` | `#f9a8d4` | `ob.p.color.pink.700` | `ob.p.color.pink.300` | All pill states (enabled/hover/focus/pressed) |

**Background Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_medium` | `#be185d` | `#9d174d` | `ob.p.color.pink.700` | `ob.p.color.pink.800` | Pill enabled/focus states |
| `contrast_low` | `#fce7f3` | `#831843` | `ob.p.color.pink.100` | `ob.p.color.pink.900` | Pill pressed state |

#### Waiting (Cobalt/Gray)
Queued or blocked items - typically uses neutral gray colors.

**Foreground Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#263645` | `#acb4bd` | `ob.p.color.cobalt.700` | `ob.p.color.cobalt.200` | All pill states (enabled/hover/focus/pressed) |

**Background Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_medium` | `#263645` | `#1c2834` | `ob.p.color.cobalt.700` | `ob.p.color.cobalt.800` | Pill enabled/focus states |
| `contrast_low` | `#dfe4e9` | `#131b22` | `ob.p.color.cobalt.100` | `ob.p.color.cobalt.900` | Pill pressed state |

#### Closed (Cobalt/Gray)
Archived or completed items - typically uses muted gray colors.

**Foreground Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_high` | `#1c2834` | `#828e9a` | `ob.p.color.cobalt.800` | `ob.p.color.cobalt.300` | All pill states (enabled/hover/focus/pressed) |

**Background Colors**
| Contrast Level | Light Theme | Dark Theme | Primitive Token (Light) | Primitive Token (Dark) | Usage |
|----------------|-------------|------------|-------------------------|------------------------|-------|
| `contrast_medium` | `#596978` | `#2f4356` | `ob.p.color.cobalt.400` | `ob.p.color.cobalt.600` | Pill enabled/focus states |
| `contrast_low` | `#f0f4f7` | `#131b22` | `ob.p.color.cobalt.50` | `ob.p.color.cobalt.900` | Pill pressed state |

#### Fatal (Red - Emergency)
Emergency disasters - used only in infobox 04_components, not in pills or badges.

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
1. **Reference 03_semantic tokens** - Never use primitive colors directly
2. **Follow 04_component guidelines** - Use appropriate status types per 04_component
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

*For related documentation, see [Free Colors](./08-colors-semantic-free.md), Neutral Colors and Interaction Colors*
