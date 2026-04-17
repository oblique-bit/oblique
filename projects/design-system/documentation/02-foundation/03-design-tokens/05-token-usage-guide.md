# Token Usage Guide

**Purpose**: Practical guide for choosing the right token when building or styling a component  
**Audience**: System consumers (designers, developers) and system contributors  
**Related**: [Architecture](./02-architecture.md) | [Token Naming](./03-naming.md) | [Token Types](./04-token-types.md) | [Color Tokens](./01-types/07-color-tokens/00-colors-overview.md)

---

## Who This Guide Is For

If you're staring at hundreds of tokens and wondering "which one do I use?", this page is for you. It covers the three most complex token categories — **color**, **dimension**, and **typography** — and gives you a decision path for each.

---

## Color Tokens

### Before You Pick a Color: Use Components First

In most cases, **you don't need to pick a color token at all**. The proper colors are already embedded into the design system's components — buttons, inputs, alerts, cards, navigation, and even the text component all carry the correct color tokens built in. This is the recommended way to work with colors: use the components, and the colors come for free.

Only when all component possibilities are exhausted — when no existing component covers your layout need — should you reach for an individual color token.

> **For system consumers**: Treat manual color selection as the exception, not the rule. Build your UI with components first.
>
> **For system contributors and maintainers**: You will regularly need to assign the right color token to a component you're building or maintaining. The decision steps below are essential knowledge for your work.

> **Note on the current tokens preview**: Because we don't yet have a large component library available, manual color picking is more common right now than it will be in the future. As more components are released, the need to select individual color tokens will decrease significantly.

---

Color is by far the most complex token category. The system has multiple semantic layers (S1, S2, ob.s), multiple color families, and two inversity variants. This section starts with the absolute basics and then walks you through the full decision path.

### Getting Started: Your First Two Tokens

Before diving into the full system, here are the two most fundamental color tokens. If you're building anything — a page, a card, a component — you'll almost certainly need a background and a foreground (text) color. These are your starting point:

| What | Token | Description |
|---|---|---|
| **Background** | `ob.s.color.neutral.bg.contrast_highest.inversity_normal` | The standard page/canvas background. Highest contrast — the primary surface everything else sits on. |
| **Foreground (text)** | `ob.s.color.neutral.fg.contrast_highest.inversity_normal` | The standard body text / heading color. Highest contrast — maximum legibility against the background. |

These two tokens give you the most basic readable layout: dark text on a light surface (or light text on a dark surface — the tokens adapt automatically via lightness mode).

From here, you can layer in more tokens as needed:
- A **high-contrast background** (`ob.s.color.neutral.bg.contrast_high.inversity_normal`) for cards or elevated surfaces that need to stand out from the page
- A **high-contrast foreground** (`ob.s.color.neutral.fg.contrast_high.inversity_normal`) for body text and primary labels (one step below the absolute maximum)
- **Border** and **shadow** tokens for structural separation

Once you have the basics, use the decision steps below to find the right token for more specific needs.

### Step 1: Do You Need a Token at All?

- **Yes** — if the element participates in the design system in any way (background, text, border, status, interaction feedback, decorative element). This is almost always the case.
- **No** — only for content that lives entirely outside the design system (e.g., an embedded third-party widget or a static raster image). If in doubt, use a token.

### Step 2: Does a Component Token Already Exist?

Before reaching for a semantic token, check if an `ob.c.*` (component-level) token already covers your use case. Component tokens are the highest abstraction and already encode the correct semantic + emphasis + inversity decisions.

- If a component token exists → **use it**.
- If you're building a new component or the component token doesn't cover your case → continue to Step 3.

### Step 3: Which Color Family?

| Intent | Color family | Typical elements |
|---|---|---|
| Layout structure, text, backgrounds, borders | **Neutral** | Page background, body text, card surfaces, dividers |
| User-interactive elements | **Interaction** | Buttons, links, form controls, hover/focus/active states |
| System feedback | **Status** | Alerts, validation messages, badges (success, warning, error, info) |
| Federal identity | **Brand** | Logo area, brand bar — very limited use |
| Decorative / project-specific | **Free** | Tags, categories, data visualization — no built-in semantic meaning |

**Detailed documentation per family:**
- [Neutral](./01-types/07-color-tokens/04-colors-semantic-neutral.md)
- [Interaction](./01-types/07-color-tokens/06-colors-semantic-interaction.md)
- [Status](./01-types/07-color-tokens/07-colors-semantic-status.md)
- [Brand](./01-types/07-color-tokens/05-colors-semantic-brand.md)
- [Free](./01-types/07-color-tokens/08-colors-semantic-free.md)

### Step 4: Which Property?

Once you know the family, pick the property that matches what you're styling:

| Property | Meaning | Example |
|---|---|---|
| `bg` / `bg_base` | Background fill | Card surface, button background |
| `fg` / `fg_base` | Foreground (text, icons) | Body text, icon color |
| `border` | Border / stroke | Input border, divider line |
| `shadow` | Drop shadow | Elevated card, dropdown |

### Step 5: Inversity — Normal vs. Flipped

Every semantic color token exists in two inversity variants. This is one of the most important decisions when building components.

#### `inversity_normal` — The Default

Use `inversity_normal` unless you have a specific reason to flip. This is the recommended, standard appearance. The vast majority of components use `inversity_normal`.

#### `inversity_flipped` — The Exception

Use `inversity_flipped` only in these cases:

| Reason | Examples | Rationale |
|---|---|---|
| **Small elements that must visually stand out** | Primary button, badge, tag | Compact elements need the inverted color scheme to create sufficient visual contrast and draw attention |
| **Design decision based on expected component appearance** | Footer | Users expect the footer to appear flipped — this is a deliberate design convention and brand alignment choice |

**Rule of thumb**: If the element is small and needs to pop, or if convention dictates a flipped appearance — use `inversity_flipped`. Otherwise, default to `inversity_normal`.

### Step 6: Which Semantic Level?

| Level | Role | Who consumes it |
|---|---|---|
| **S1** (Lightness) | Light/dark theme switching. Referenced by S2 and ob.s. | **Internal only** — never consumed directly by components. |
| **S2** (Emphasis) | High/low emphasis variations for interaction elements. References S1. | Consumed by ob.s compilation. Can be used as fallback when ob.s does not yet cover a specific token. |
| **ob.s** (Compiled semantic) | Complete, clean collection of all semantic colors. Compiles from S1, S2, and static sources. | **Mandatory consumption point** — all component tokens and developers must reference this layer. |

**Components must consume from ob.s** (`ob.s.color.*`). S1 and S2 are internal layers — they feed into ob.s and must never be referenced directly by a component. The only acceptable exception is referencing S2 as a temporary fallback when the compiled ob.s layer doesn't yet have the token you need; this must be tracked and resolved.

### Step 7: Contrast Level

Semantic color tokens use a contrast scale to express visual weight. Picking the right level is both a design choice and an accessibility requirement — WCAG 2.2 SC 1.4.3 requires at least 4.5:1 for normal text and 3:1 for large text. Every fg/bg pairing in a component must meet at least the AA ratio — see the [Contrast Pairing Tables](#contrast-pairing-tables--the-aa-minimum-rule) for validated combinations. The number of levels available differs by category:

| Category | Available contrast levels |
|---|---|
| **Neutral** | `lowest`, `low`, `medium`, `high`, `highest` (all 5) |
| **Status** | `low`, `medium`, `high`, `highest` (4 levels) |
| **Interaction** | `low`, `medium`, `high` (3 levels at S1) |

Not every primitive shade is available as a semantic token — shades that would produce unreadable pairings are deliberately excluded. The intent is to keep the number of options limited to ensure visual consistency across projects.

Choose the contrast level that matches the visual importance of the element in its context.

### Color Decision Flowchart (Summary)

```
Need to style something with color?
│
├─ Component token exists? → Use ob.c.* token ✓
│
├─ No component token → Pick color family:
│   ├─ Layout/structure → Neutral
│   ├─ Interactive → Interaction
│   ├─ Feedback → Status
│   ├─ Brand identity → Brand
│   └─ Decorative → Free
│
├─ Pick property: bg, fg, border, shadow
│
├─ Pick inversity:
│   ├─ Default → inversity_normal
│   └─ Small & must stand out, or design convention → inversity_flipped
│
├─ Pick semantic level:
│   └─ Default → ob.s (ob.s.*), the primary consumption layer
│
└─ Pick contrast: highest / high / medium / low
```

### Common Color Mistakes

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| Using a primitive token (`ob.p.*`) directly in a component | Violates the architecture rule: primitives exist only as the foundation for the reference chain. They don't adapt to theme modes (lightness, emphasis). | Use semantic tokens (`ob.s.*`) or component tokens (`ob.c.*`) |
| Hardcoding a hex value | Breaks theming entirely | Always use a token |
| Using `inversity_flipped` "just because it looks better" | Flipped has specific use cases; inconsistent inversity breaks the system | Default to `inversity_normal`; only flip for prominence or convention |
| Skipping S2 for interactive components in emphasis contexts | Your component won't respond to emphasis mode changes | ob.s compiles from S2 for interaction tokens. If ob.s covers your case, use that. If not, S2 is the fallback for emphasis-aware interaction tokens. |
| Reaching for S1 directly | S1 is an internal layer — never consumed directly by components | Use ob.s tokens (`ob.s.color.*`). S1 feeds into ob.s via the reference chain. |
| Pairing `contrast_low` fg with `contrast_low` bg | Low-contrast text on low-contrast background likely fails WCAG 1.4.3 (4.5:1 minimum) | Pair high-contrast foreground with high-contrast background, or verify the combination meets the required ratio |

---

## Dimension Tokens

Dimension tokens control spacing, sizing, border radius, and border width. They are less layered than color tokens but still require deliberate choices.

### Spacing

Spacing tokens control the gaps and distances between and within elements.

| Context | Token pattern | Controlled by |
|---|---|---|
| **Inside a component** (padding, inset) | Component-specific or `ui_scale` dimension tokens | UI Scale mode (sm/md/lg) |
| **Outside a component** (margin, gap between siblings) | Layout dimension tokens | Density mode (compact/comfortable/spacious) |

**Key distinction**: Inset spacing (inside) is driven by **UI Scale**. Outer spacing (between components) is driven by **Density**. Don't mix them up.

### Sizing

| What you're sizing | Where to look |
|---|---|
| Component overall dimensions (button height, input height) | `ob.c.{component}.dimension.*` or `ob.h.{element}.dimension.*` tokens (these reference UI Scale semantic tokens internally) |
| Icon size | `ob.c.icon.dimension.*` component tokens |
| Layout containers (page width, column widths) | Global tokens (`ob.g.*`) |

### Border Radius

Use the design system's border radius tokens (`ob.s.border_radius.*`) rather than hardcoding pixel values.

### Border Width

Use the design system's border width tokens rather than hardcoding pixel values.

### px vs rem — Which Unit When Building a Component?

The system provides **both px and rem** at the primitive and semantic layers. Every semantic dimension token has a `.px` and a `.rem` variant side by side. The unit choice is made when you wire a component token to a semantic token — you pick one.

#### Where the choice happens

| Layer | What's available |
|---|---|
| **Primitive** (`ob.p.dimension.*`) | Both scales exist in parallel: `ob.p.dimension.px.*` and `ob.p.dimension.rem.*` |
| **Semantic** (`ob.s.dimension.*`) | Every token exposes both: `…element.md.px` and `…element.md.rem` |
| **Component** (`ob.c.*`, `ob.h.*`) | **You pick one.** The component token references either the `.px` or the `.rem` semantic variant. |

#### The rule

**Default to `.rem`** for all dimension properties that should scale with the user's browser font-size setting. This covers padding, margins, gaps, component heights, icon sizes — essentially everything that contributes to the spatial layout of a component.

**Use `.px` only for micro-level adjustments** where sub-rem precision matters and scaling would cause visual artifacts: border widths, focus indicator thickness, and optical baseline offsets.

#### Decision table for component contributors

| Property | Unit | Why |
|---|---|---|
| Padding / inset | `.rem` | Scales with user font-size preference (accessibility) |
| Gap / spacing between child elements | `.rem` | Scales with user font-size preference |
| Component height / width | `.rem` | Component grows proportionally with content |
| Icon size | `.rem` | Icons stay proportional to surrounding text |
| Border width | `.px` | 1px and 2px borders must stay crisp; scaling a 1px border to 1.5px causes rendering artifacts |
| Focus indicator thickness | `.px` | Fixed visual weight required for consistent accessibility indicator (e.g., 3px) |
| Optical baseline offset (inline icon next to text) | `.px` | Sub-pixel adjustment; the description notes devs should convert to `em` in CSS for runtime |

#### Real example from the icon component

The icon component demonstrates both patterns:

```
Icon size (rem):
  ob.c.icon.component.size.md
    → {ob.s.dimension.dynamic.ui_scale.spacing.md.rem}
        → {ob.p.dimension.rem.1100} * {ob.g.multiplier.dimension.ui_scale.md}

Inline icon vertical offset (px):
  ob.c.icon.inline_text.spacing.vertical.offset
    → {ob.s.dimension.static.ui_scale.micro.sm.px}
        → {ob.p.dimension.px.2}
```

The size uses `.rem` because icons should scale with the user's font-size setting. The vertical offset uses `.px` because it's a 2px optical correction that would blur at non-integer rem values.

#### Why this matters for accessibility

When a user increases their browser's default font size (e.g., from 16px to 20px), all `rem`-based dimensions scale proportionally. A button with `rem` padding grows to accommodate larger text. A button with hardcoded `px` padding stays the same size, potentially clipping the larger text.

WCAG 2.2 SC 1.4.4 (Resize Text) requires that text can be resized up to 200% without loss of content or functionality. Using `rem` for spatial properties ensures your components pass this criterion automatically.

### Dimension Decision Flowchart (Summary)

```
Need a spacing/sizing value?
│
├─ Inside a component (padding, inset)?
│   └─ UI Scale dimension tokens
│
├─ Between components (gap, margin)?
│   └─ Density dimension tokens
│
├─ Component size (height, width)?
│   └─ Component tokens (ob.c.*) or UI Scale
│
├─ Layout-level (page width, breakpoint)?
│   └─ Global tokens (ob.g.*)
│
└─ Border radius / border width?
    └─ Design system border tokens
```

### Common Dimension Mistakes

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| Hardcoding `8px` or `16px` | Doesn't adapt to density or scale modes | Use spacing tokens |
| Using a density token for component padding | Density controls outer spacing, not inset | Use UI Scale tokens for inset |
| Using UI Scale tokens for layout gaps | UI Scale controls component internals | Use Density tokens for layout gaps |
| Using `.px` for component padding or sizing | Doesn't scale with user's browser font-size setting — fails WCAG 1.4.4 | Use the `.rem` variant of the same semantic token |
| Using `.rem` for border width or focus ring | Sub-rem values (1px, 2px, 3px) render inconsistently when scaled | Use the `.px` variant — these are the documented micro-level exceptions |

---

## Typography Tokens

Typography is the least complex of the three categories. The system provides predefined typography tokens that combine font family, size, weight, and line height.

### Which Typography Token?

The system provides two approaches for typography tokens:

| Approach | When to use | Example patterns |
|---|---|---|
| **Semantic typography styles** (composition tokens) | Headings and display text — combines font family, size, weight, line height into one token | `ob.s.typography.style.display.xl` |
| **Component typography tokens** (individual properties) | Component elements (buttons, labels, form controls) — separate tokens for each property | `ob.h.button.typography.font_size`, `ob.h.button.typography.line_height` |

Semantic typography tokens come in two variants:
- **Grouped** (`/grouped/`): Pre-composed tokens combining all typography properties — used in Figma styles and for direct application.
- **Single** (`/single/`): Individual property tokens (fontSize, lineHeight, fontWeight, etc.) — used when granular control is needed within component construction.

Both variants exist in **dynamic** (scale with global multipliers) and **static** (fixed values) forms.

### Typography Context Mode

The system provides two typography contexts:

| Mode | Use for |
|---|---|
| **Interface** | UI elements — buttons, labels, navigation, form controls, compact layouts |
| **Prose** | Long-form reading — documentation, articles, content-heavy pages with generous line heights |

This mode is selected at **build time** by loading the appropriate token set (`interface.json` or `prose.json`). In most UI applications, **interface** is the default.

### Common Typography Mistakes

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| Manually setting font-size and line-height | Breaks typography context mode switching and multiplier scaling | Use typography tokens that bundle all properties (grouped tokens) or the individual component typography tokens |
| Overriding line-height below 1.5x font-size | Fails WCAG 2.2 SC 1.4.12 (Text Spacing) — users who inject custom spacing will lose content or functionality | Use line-height tokens built on `ob.p.line_height.base` (1.5) or higher |

---

## WCAG 2.2 and the Token System

The token architecture is designed to help components meet [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) requirements. Not all WCAG criteria are token-related — many concern behavior, semantics, or content structure. This section maps the criteria that tokens **directly** support, so contributors understand why certain token choices matter.

### Token-Supported Success Criteria

| SC | Level | Criterion | How tokens help | Key tokens |
|---|---|---|---|---|
| **1.4.3** | AA | Contrast (Minimum) | The contrast level scale (`contrast_lowest` → `contrast_highest`) on semantic color tokens is designed to meet the 4.5:1 ratio for normal text and 3:1 for large text. Choosing `contrast_high` or `contrast_highest` for text-on-background pairings helps satisfy this criterion. | `ob.s.color.{family}.fg.contrast_high.*`, `ob.s.color.{family}.bg.contrast_highest.*` |
| **1.4.4** | AA | Resize Text | Using `.rem` variants for all spatial properties (padding, gaps, component sizes) ensures components scale proportionally when users increase browser font size up to 200%. See the [px vs rem section](#px-vs-rem--which-unit-when-building-a-component) above. | `ob.s.dimension.*.rem` variants |
| **1.4.6** | AAA | Contrast (Enhanced) | The `contrast_highest` level targets the stricter 7:1 ratio for text. Using this level for body text and primary headings supports Enhanced contrast compliance. | `ob.s.color.neutral.fg.contrast_highest.*` |
| **1.4.10** | AA | Reflow | `rem`-based dimension tokens help components reflow naturally at 320 CSS pixel width (equivalent to 400% zoom at 1280px). When spatial values scale with the user's font-size, layout adapts without requiring horizontal scrolling. | All `.rem` dimension tokens |
| **1.4.11** | AA | Non-text Contrast | Border tokens and foreground tokens provide the 3:1 contrast needed for UI component boundaries (input borders, button outlines) and graphical objects (icons). The border contrast scale (`subtle`, `medium`, `strong`) lets contributors pick the right visual weight. | `ob.s.color.neutral.border.{contrast}.*`, `ob.s.color.{family}.fg.*` |
| **1.4.12** | AA | Text Spacing | The base line-height primitive is `1.5` (unitless), meeting the minimum 1.5× font-size requirement. Typography tokens built on this value allow user-overridden spacing without content clipping or overlap. | `ob.p.line_height.base` (1.5), `ob.s.dynamic.line_height.*` |
| **2.4.7** | AA | Focus Visible | Dedicated focus ring tokens bundle color, width (3px), and style into a ready-to-use CSS outline value. Using these tokens ensures every interactive component has a visible keyboard focus indicator. | `ob.s.border.focus_ring.inversity_normal`, `ob.s.border.focus_ring.inversity_flipped` |
| **2.4.13** | AAA | Focus Appearance | The focus ring tokens use a 3px solid border (≥ 2 CSS pixel perimeter required) with a distinct purple color that provides ≥ 3:1 contrast between focused and unfocused states. The outline offset tokens (`ob.s.outline_offset.*`) control the gap between the focus indicator and the component edge. | `ob.s.border.focus_ring.*`, `ob.s.outline_offset.{xs…lg}`, `ob.s.border_width.md` (3px) |
| **2.5.8** | AA | Target Size (Minimum) | The mobile button touch target token enforces a 48px minimum, exceeding the 24px WCAG minimum. Desktop components deliberately have no minimum constraint (mouse precision). | `ob.h.button.touch_target.min_size` (48px on mobile) |

### Contrast Pairing Tables — The AA Minimum Rule

The design system is required to be **WCAG 2.1 AA compliant**. This means **no foreground/background color pairing that falls below the AA contrast ratio (4.5:1 for normal text, 3:1 for large text and UI components) is allowed in any component**.

To enforce this, documented **contrast pairing tables** are maintained in Figma:

> [Tokens Preview — Contrast Pairing Tables](https://www.figma.com/design/51tJjbxBSBmjAmKjQmhsz3/Tokens-Preview?node-id=9559-21413)

These tables show which fg/bg token combinations meet the AA threshold and which do not. They are the source of truth for valid pairings.

**For contributors**: Before wiring a foreground token to a background token in a component, check the pairing tables. If the combination is not listed as AA-passing, it must not be used.

These tables currently serve as a manual reference. They will be converted into **automated validators** that flag below-AA pairings at build time. Until then, the pairing tables are the enforcement mechanism — treat them as binding.

### Criteria That Tokens Do NOT Cover

Many WCAG 2.2 requirements depend on component behavior and semantic HTML rather than token values:

- **Keyboard accessibility** (2.1.1, 2.1.2) — implementation concern, not token-driven
- **Focus order** (2.4.3) — DOM order, not visual tokens
- **Name, Role, Value** (4.1.2) — ARIA attributes and semantic markup
- **Use of Color** (1.4.1) — tokens provide the palette, but the requirement to not rely on color alone is a design/implementation decision (e.g., adding icons or text labels alongside color indicators)
- **Content on Hover or Focus** (1.4.13) — behavioral: dismiss, hover, persist mechanics
- **Accessible Authentication** (3.3.8) — form/flow design, not token-driven

---

## Quick Reference: Token Resolution Chain

```
Global (ob.g.*)          ← system-wide constants, referenced by any level
       │
Primitive (ob.p.*)       ← raw values (colors, base dimensions)
       │
Semantic (ob.s1/s2/s.*)  ← themed, mode-aware tokens
       │
Component (ob.c.*)       ← highest abstraction, component-specific
```

**Always consume from the highest available level.** If a component token exists, use that. If not, use semantic. Never use primitive tokens directly — they exist only as the foundation for the reference chain.
