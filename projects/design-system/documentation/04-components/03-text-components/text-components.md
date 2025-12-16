# Text Components

**Purpose**: Token structure and spacing strategies for typography-related components  
**Audience**: Design system maintainers, UX designers, developers  
**Related**: [Design Tokens Architecture](../../03-design-tokens/02-architecture.md)

---

## Overview

Text components bridge the gap between Figma's text style limitations and the full styling capabilities needed for production. Figma text styles only define typography properties — they cannot include spacing and color. Text components wrap text styles in frames that carry these additional properties via design tokens. 

**Scope of this document:**
- Vertical spacing (top/bottom)
- Color assignment
- Icon handling (links)

**Out of scope** (covered by typography styles):
- Font family, font size, font weight
- Line height, letter spacing
- Typography context modes (interface/prose)

---

## Why Figma Text Components?

*Figma limitations as of December 2025:*

1. **Text styles cannot include margin or padding**  
   Figma text styles only define typography properties. A wrapper frame is needed to hold spacing tokens.

2. **Text styles cannot include color**  
   Headings have slight color variations for Grauwert (tonal weight) optimization. Components allow binding color variables per heading level.

3. **Manual top spacing selection for headings**  
   In CSS, top spacing removal is automated via selectors like `:first-child`, `* + h1`, or lobotomized owl (`* + *`). In Figma, designers need to manually select between "no" and "default" top spacing variants based on context.

**Solution:** Figma text components = Frame containing text formatted with a text style (H1, paragraph, lead, etc.). The frame holds the spacing tokens.

---

## Text Components

### 1. text/heading

| Token | Purpose | CSS Output |
|-------|---------|------------|
| `ob.h.heading.{level}.spacing.top` | Space above heading | `margin-top` |
| `ob.h.heading.{level}.spacing.bottom` | Space between heading and following content | `margin-bottom` |
| `ob.h.heading.paragraphSpacing` | Figma-only: spacing after manual line breaks | *None* |

**Per-level tokens:**

| Level | Top | Bottom |
|-------|-----|--------|
| H1 | `ob.h.heading.h1.spacing.top` | `ob.h.heading.h1.spacing.bottom` |
| H2 | `ob.h.heading.h2.spacing.top` | `ob.h.heading.h2.spacing.bottom` |
| H3 | `ob.h.heading.h3.spacing.top` | `ob.h.heading.h3.spacing.bottom` |
| H4 | `ob.h.heading.h4.spacing.top` | `ob.h.heading.h4.spacing.bottom` |
| H5 | `ob.h.heading.h5.spacing.top` | `ob.h.heading.h5.spacing.bottom` |
| H6 | `ob.h.heading.h6.spacing.top` | `ob.h.heading.h6.spacing.bottom` |

**Figma component properties:**

| Property | Options | Default | Notes |
|----------|---------|---------|-------|
| `spacing.top` | `default` / `none` | `default` | Set to `none` for first heading in container |
| `spacing.bottom` | — | Always ON | Not configurable |

> **Why no bottom spacing toggle?** A heading always introduces content — it cannot be the last element. Therefore, bottom spacing is always required.

---

### 2. text/paragraph

| Token | Purpose | CSS Output |
|-------|---------|------------|
| `ob.h.paragraph.spacing.top` | Always 0 (fixed) | `margin-top: 0` |
| `ob.h.paragraph.spacing.bottom` | Space after paragraph (**source**) | `margin-bottom` |
| `ob.h.paragraph.paragraphSpacing` | Alias → `{ob.h.paragraph.spacing.bottom}` | *None* (Figma-only) |

**Figma component properties:**

| Property | Options | Default | Notes |
|----------|---------|---------|-------|
| `spacing.top` | — | Always `0` | Not configurable (fixed) |
| `spacing.bottom` | `default` / `none` | `default` | Set to `none` for last paragraph or before non-text elements |

> **Why no top spacing toggle?** Top spacing is fixed to `0`. The preceding element's bottom spacing controls the gap. This avoids manual effort for every paragraph instance.

---

### 3. text/lead

The Lead component is intentionally separate from Paragraph (not a variant) to enforce strict usage guidelines.

| Aspect | Rule |
|--------|------|
| **Styling** | Slightly different from paragraph |
| **Placement** | Must be placed directly after H1 only |
| **Why separate?** | Dedicated component allows clear documentation of usage restrictions |

| Token | Purpose | CSS Output |
|-------|---------|------------|
| `ob.h.lead.spacing.top` | `0` (fixed) — H1's bottom spacing governs the gap | `margin-top: 0` |
| `ob.h.lead.spacing.bottom` | Space after lead | `margin-bottom` |

**Figma component properties:**

| Property | Options | Default | Notes |
|----------|---------|---------|-------|
| `spacing.top` | — | Always `0` | Not configurable (H1 bottom spacing governs gap) |
| `spacing.bottom` | `default` / `none` | `default` | Set to `none` for last element in container |

---

### 4. text/link

Not a Figma component — just a combination of:
- **Text style** (typography)
- **Color variable** (link color)

No spacing tokens needed; link inherits from surrounding text context.

**Display behavior:**
- **Inline** (default, especially in Figma)
- Block element possible in CSS but not exposed in Figma

> **Guideline note:** You can use the Link component as a block element. If placing multiple block links, follow spacing rules for the context. **Not intended for vertical lists of links** — use text/link-list instead.

**Icons:**

| Mode | Platform | Description |
|------|----------|-------------|
| **Automatic** | Code only | Icons displayed based on link type detection |
| **Manual** | Figma: N/A | Icons cannot be embedded in text styles |

> **Figma vs Code:** In Figma, text/link is a text-style + color-variable combination — no icon slot exists. In code, icons are injected automatically based on `href` analysis (see below). Note: text/link-list displays icons alongside links in Figma.

*Automatic icon display (code):*
- **External link** — definition TBD:
  - [ ] Other domain?
  - [ ] Same domain, other subdomain?
  - [ ] Other application?
  - → *Reference existing definition and add here*
- **Download** — links to files (not pages)

---

### 5. text/link-list

A Figma component for displaying multiple links vertically.

**Icons:**

| Mode | Platform | Description |
|------|----------|-------------|
| **Automatic** | Code only | Icons displayed based on link type detection |
| **Manual** | Figma | UX designer selects from default icon options |

*Default icon options (Figma):*
- External link
- Download
- Phone number
- Email
- PDF
- Other (as needed)

---

## Link Target Behavior

Applies to both **text/link** and **text/link-list** (`<a href>`).

| Aspect | Rule |
|--------|------|
| **Fixed values** | None — no design system default |
| **Decision authority** | UX designer defines per use case in project handoff |
| **Guidelines** | Recommendations for when to use same tab, new tab, new browser window (TBD) |

> **TODO (Guidelines):** Document recommendations for link target behavior:
> - Same tab
> - New tab
> - New browser window

---

## Figma Spacer Component (Helper)

Vertical spacing in Figma text components is realized via a **spacer component**.

| Aspect | Description |
|--------|-------------|
| **Naming** | Figma-only concept (not directly mapped to code) |
| **Size source** | Dimension tokens (typography context) |
| **Default** | Dynamic dimension typography tokens (responsive to typography mode) |
| **Optional variant** | Static tokens — no size change when switching between interface/prose modes |
| **Visibility mode** | `_dev_notes` (Figma-only): `visible` or `hidden` |

The spacer's dimension token values **are exported to code** as the actual spacing values.

> **TODO:** Create typography-context mode-aware dimension tokens. Currently, the spacer uses hardcoded values because these tokens are missing.

---

## Key Distinctions

1. **`spacing.top` / `spacing.bottom`** = Structural layout tokens (element-to-element gaps)
2. **`paragraphSpacing`** = Figma-internal behavior only (manual line break within the text block)

---

## Figma `paragraphSpacing` Behavior

- In Figma, `paragraphSpacing` controls the space **only when a user manually breaks a line** (Enter/Return key).
- This is **not** the same as margin-bottom in CSS.
- For headings: rarely used (only if heading has manual line breaks).
- For paragraphs: used for internal text flow, but **not** for spacing between separate `<p>` elements.

---

## Fixed Values

| Token | Value |
|-------|-------|
| `ob.h.paragraph.spacing.top` | `0` (always) |
| `ob.h.lead.spacing.top` | `0` (always) |

> **Note on CSS margin collapse:** If vertical spacing is implemented with margins, the fixed `spacing.top: 0` for paragraphs reduces collapse scenarios. When a heading or paragraph precedes a `<p>`, only the preceding element's bottom margin applies — nothing to collapse against.

---

## CSS Mapping Summary

\`\`\`css
/* Headings */
h1, h2, h3, h4, h5, h6 {
  margin-top: var(--ob-h-heading-spacing-top);
  margin-bottom: var(--ob-h-heading-spacing-bottom);
}

/* Paragraphs */
p {
  margin-top: 0; /* enforced via token or reset */
  margin-bottom: var(--ob-h-paragraph-spacing-bottom);
}
\`\`\`

---

## Decisions

- [x] Heading levels (H1–H6) have individual spacing tokens (not shared)
- [x] `spacing.bottom` is source, `paragraphSpacing` is alias (for paragraph)
- [ ] Define actual token values per level
- [ ] Define text/link token structure
- [ ] Define text/link-list token structure
