# FigJam Audit Card — DR v2 Format

Format spec for all naming-audit cards on the **States — Concept** board.

**Board**: `7k7SeWlhTycijN1TFo8SbI`, page `02 Audit – DR_V2`

**Template nodes** (live in `_templates` section):
- `280:182` — Audit Card Template 0 – Overview
- `214:402` — Audit Card Template 1.2 – Approved _(1.1 Proposed = same structure, amber badge)_

---

## Two card types

| | Template 0 – Overview | Template 1 – Detail |
|---|---|---|
| **Purpose** | One per mode collection; axis-level summary | One per mode value or naming decision |
| **Last section** | `PURPOSE` | `DECISION INDEPENDENT` |
| **COLLISION NOTE** | — | Optional — only when a naming clash must be called out |
| **DS names** | Inter Bold blue, hyperlinked | Inter Bold blue, hyperlinked |
| **Example** | `access` axis card | `active` interaction-value card |

Both types share the same shell, badge system, font scheme, and divider.

---

## Shell

```
SECTION  (card shell)
├── SHAPE_WITH_TEXT  (status badge — top-right)
└── TEXT             (all content — single node, mixed styling)
```

| Property | Value | Figma API |
|---|---|---|
| Fill | white | `{ r:1, g:1, b:1 }` |
| Stroke | light gray | `{ r:0.902, g:0.902, b:0.902 }` |
| Corner radius | 12 | `cornerRadius: 12` |
| Width | 668 | — |
| Height | auto-fit | `maxBottom(children) + 58` |

---

## Text node

| Property | Value |
|---|---|
| `x` | 40 |
| `y` | 70 |
| `width` | 596 (fixed) |
| `height` | auto (`textAutoResize: 'HEIGHT'`) |
| `lineHeight` | 150% (`{ unit: 'PERCENT', value: 150 }`) |

Section height formula: `Math.ceil(max(c.y + c.height for c in children) + 58)`

---

## Font scheme

_Canonical as of 2026-05-28. "Simple" = Inter Medium; "Technical" = Roboto Mono Medium._

| Segment | Family | Style | Size | Color |
|---|---|---|---|---|
| Card title | Inter | **Bold** | 40 | dark, **underlined** |
| Section header | Inter | **Bold** | 16 | dark |
| Body prose | Inter | **Medium** | 16 | dark |
| Technical term | Roboto Mono | **Medium** | 16 | dark |
| DS name (SOURCE) | Inter | **Bold** | 16 | blue, hyperlinked |
| ✓ bullet | Inter | **Medium** | 16 | green |
| ⊗ bullet | Inter | **Medium** | 16 | red |
| Divider | Inter | **Medium** | 16 | gray |

Card title always carries a hyperlink to the matching detail card, and **must be underlined** (`textDecoration: 'UNDERLINE'`). The underline is the visual signal that the title is a link. Apply it as a separate `setRangeTextDecoration` call _after_ the `setRangeTextDecoration(0, newLen, 'NONE')` braces step — not before, or the braces step will wipe it.

---

## Color values

```js
DARK  = { r:0.12, g:0.12, b:0.12 }   // #1f1f1f  — text
GRAY  = { r:0.70, g:0.70, b:0.70 }   // #b3b3b3  — divider line
BLUE  = { r:0.00, g:0.30, b:0.85 }   // #004dd9  — DS names
GREEN = { r:0.20, g:0.65, b:0.30 }   // #33a64d  — ✓ bullets
RED   = { r:0.85, g:0.20, b:0.20 }   // #d93333  — ⊗ bullets
```

---

## Status badge (SHAPE_WITH_TEXT)

Position: `x = section.width − badge.width − 20`, `y = 16`  
Dimensions: 220 × 54

| Status | Emoji in text | Badge text | Badge fill |
|---|---|---|---|
| Approved | 🟢 | `APPROVED BY D.R.` | `{ r:0.549, g:0.859, b:0.588 }` — green |
| Proposed | 🟡 | `PROPOSED BY D.R.` | `{ r:1.000, g:0.920, b:0.500 }` — amber |
| On hold | ⏸ | `ON HOLD (Dn)` | `{ r:1.000, g:0.920, b:0.500 }` — amber |

Template 1.1 shows the **Proposed** badge variant.  
Template 1.2 shows the **Approved** badge variant.

---

## Divider

```
{prev text} \n DIVIDER \n\n
```

The divider segment is a run of `_` characters at `GRAY` fill, Inter Medium 16.  
Calibrated to fill 596px width without wrapping — use ~70 underscores.

```js
const DIV = ' ' + '_'.repeat(70) + ' ';
// Inter Medium 16, GRAY fill
```

> Exact count is width-sensitive. Verify after any font or width change — the line must not wrap.

---

## Section structure — Template 0 (Overview)

```
{name}                      ← Inter Bold 40, DARK, hyperlinked

STATUS

{emoji} {status text}       ← Inter Medium 16

WHY

✓ {reason}                  ← ✓ Inter Medium GREEN; prose Inter Medium DARK
...

SOURCE

{source prose}              ← Inter Medium 16; DS names Inter Bold BLUE linked

REJECTED ALTERNATIVES

⊗ {term} — {reason}        ← ⊗ Inter Medium RED; prose Inter Medium DARK
...

{divider — gray}

PURPOSE

{one-sentence description}
```

---

## Section structure — Template 1 (Detail)

```
{name}                      ← Inter Bold 40, DARK, hyperlinked

STATUS

{emoji} {status text}

WHY

✓ {reason}
...

SOURCE

{DS name}, {DS name}, …     ← each DS name: Inter Bold BLUE, hyperlinked
{prose around names}        ← Inter Medium DARK

[COLLISION NOTE]            ← optional — only if a term collision must be surfaced
{prose}

REJECTED ALTERNATIVES

⊗ {term}: {reason}
...

{divider — gray}

DECISION INDEPENDENT

CSS {pseudo}                ← Roboto Mono Medium for the pseudo
What: {definition sentence}
```

**COLLISION NOTE** is optional. Use it when the chosen term could be confused with a term from another DS or Oblique namespace — e.g. M3 uses `activated` (persistent) where Oblique uses `active` (transient). One paragraph max.

---

## Spacing between sections

All sections are separated by two blank lines (`\n\n\n` = end of section line + blank + blank before next header). Bullets within a section are single-spaced (`\n`).

```
WHY\n
\n
✓ first reason\n
✓ second reason\n
\n
\n
SOURCE\n
```

---

## JavaScript segment builder

```js
(async () => {
  await figma.loadFontAsync({ family: 'Inter',       style: 'Bold'    });
  await figma.loadFontAsync({ family: 'Inter',       style: 'Medium'  });
  await figma.loadFontAsync({ family: 'Roboto Mono', style: 'Medium'  });

  // Color fills (Figma solid fill objects)
  const solid = c => [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:c }];
  const DARK  = solid({ r:0.12, g:0.12, b:0.12 });
  const GRAY  = solid({ r:0.70, g:0.70, b:0.70 });
  const BLUE  = solid({ r:0.00, g:0.30, b:0.85 });
  const GREEN = solid({ r:0.20, g:0.65, b:0.30 });
  const RED   = solid({ r:0.85, g:0.20, b:0.20 });

  // Segment constructors
  const mk = (txt, font, size, fill, url) => ({ txt, font, size, fill, url: url || null });
  const TITLE = (t, url)  => mk(t, { family:'Inter',       style:'Bold'   }, 40, DARK, url);
  const HDR   = (t)       => mk(t, { family:'Inter',       style:'Bold'   }, 16, DARK);
  const BODY  = (t)       => mk(t, { family:'Inter',       style:'Medium' }, 16, DARK);
  const TECH  = (t)       => mk(t, { family:'Roboto Mono', style:'Medium' }, 16, DARK);
  const DS    = (t)       => mk(t, { family:'Inter',       style:'Bold'   }, 16, BLUE, DS_URLS[t] ?? null);
  const DIV   = ()        => mk(' ' + '_'.repeat(70) + ' ', { family:'Inter', style:'Medium' }, 16, GRAY);
  const CHK   = ()        => mk('✓', { family:'Inter',      style:'Medium' }, 16, GREEN);
  const CRS   = ()        => mk('⊗', { family:'Inter',      style:'Medium' }, 16, RED);
  const NL    = (n = 1)   => BODY('\n'.repeat(n));

  // DS name → documentation URL
  const DS_URLS = {
    'M3':         'https://m3.material.io/foundations/interaction/states/overview',
    'Carbon':     'https://carbondesignsystem.com/elements/color/tokens/',
    'Spectrum':   'https://spectrum.adobe.com/page/using-color/',
    'Atlassian':  'https://atlassian.design/foundations/color-new',
    'ADS':        'https://atlassian.design/foundations/color-new',
    'Primer':     'https://primer.style/foundations/color/overview',
    'Fluent':     'https://fluent2.microsoft.design/',
    'USWDS':      'https://designsystem.digital.gov/',
    'Polaris':    'https://polaris.shopify.com/',
    'Canada':     'https://design.canada.ca/en/',
    'Ant':        'https://ant.design/',
    'Bootstrap':  'https://getbootstrap.com/',
    'Chakra':     'https://chakra-ui.com/',
    'Innovaccer': null,
  };

  // Segment array → apply to text node
  async function applyCard(textNodeId, sectionNodeId, badgeNodeId, segs, badgeText, badgeFill) {
    const tn  = await figma.getNodeByIdAsync(textNodeId);
    const sec = await figma.getNodeByIdAsync(sectionNodeId);
    if (!tn || !sec) return;

    // Badge
    if (badgeNodeId) {
      const badge = await figma.getNodeByIdAsync(badgeNodeId);
      if (badge?.text) {
        try { await figma.loadFontAsync(badge.text.fontName); } catch(e) {}
        badge.text.characters = badgeText;
        if (badgeFill) badge.fills = [{ type:'SOLID', color:badgeFill }];
      }
    }

    // Build combined string + style ranges
    let combined = ''; const ranges = [];
    for (const sg of segs) {
      const start = combined.length;
      combined += sg.txt;
      const end = combined.length;
      if (end > start) ranges.push({ start, end, font:sg.font, size:sg.size, fill:sg.fill, url:sg.url });
    }

    // ── HYPERLINK + UNDERLINE BUG PREVENTION (3-layer) ───────────────
    // FigJam stores hyperlinks and textDecoration as separate character-level
    // properties. Setting tn.characters re-inherits BOTH from the node's
    // internal buffer — clearing hyperlinks alone leaves underlines intact.
    //
    // Belt       — clear hyperlinks BEFORE setting characters
    // Suspenders — clear hyperlinks AFTER setting characters
    // Braces     — clear textDecoration AFTER setting characters
    const oldLen = tn.characters.length;
    try { tn.setRangeHyperlink(0, oldLen, null); } catch(e) {}

    tn.x = 40; tn.y = 70;
    tn.textAutoResize = 'HEIGHT';
    tn.resize(596, 100);
    tn.lineHeight = { unit:'PERCENT', value:150 };
    tn.fontName = { family:'Inter', style:'Medium' };
    tn.fontSize = 16;
    tn.characters = combined;
    const newLen = combined.length;

    try { tn.setRangeHyperlink(0, newLen, null); } catch(e) {}      // suspenders
    try { tn.setRangeTextDecoration(0, newLen, 'NONE'); } catch(e) {} // braces
    // ─────────────────────────────────────────────────────────────────

    for (const r of ranges) {
      tn.setRangeFontName(r.start, r.end, r.font);
      tn.setRangeFontSize(r.start, r.end, r.size);
      tn.setRangeFills(r.start, r.end, r.fill);
    }

    // Set hyperlinks LAST (after all font/colour work)
    for (const r of ranges) {
      if (r.url) tn.setRangeHyperlink(r.start, r.end, { type:'URL', value:r.url });
    }

    // Title underline — MUST come after the braces step that cleared all decorations.
    // titleEnd+1 because Figma groups the trailing \n into the title segment.
    tn.setRangeTextDecoration(0, titleEnd + 1, 'UNDERLINE');

    // Verify: remove any leaking hyperlinks beyond the intended range
    let pos = 0;
    for (const vs of tn.getStyledTextSegments(['hyperlink'])) {
      const end = pos + vs.characters.length;
      if (vs.hyperlink && pos >= titleEnd) {
        try { tn.setRangeHyperlink(pos, end, null); } catch(e) {}
      }
      pos = end;
    }

    // Re-fit section
    const maxBottom = Math.max(...Array.from(sec.children).map(c => c.y + c.height));
    sec.resizeWithoutConstraints(sec.width, Math.ceil(maxBottom + 58));
  }
})()
```

---

## DS name → URL mapping

| Name | URL |
|---|---|
| M3 | https://m3.material.io/foundations/interaction/states/overview |
| Carbon | https://carbondesignsystem.com/elements/color/tokens/ |
| Spectrum | https://spectrum.adobe.com/page/using-color/ |
| Atlassian / ADS | https://atlassian.design/foundations/color-new |
| Primer | https://primer.style/foundations/color/overview |
| Fluent | https://fluent2.microsoft.design/ |
| USWDS | https://designsystem.digital.gov/ |
| Polaris | https://polaris.shopify.com/ |
| Canada | https://design.canada.ca/en/ |
| Ant | https://ant.design/ |
| Bootstrap | https://getbootstrap.com/ |
| Chakra | https://chakra-ui.com/ |
| Innovaccer | _(no public DS docs — blue label, no link)_ |

_Status-card context: M3 links to `https://m3.material.io/foundations/feedback` instead of the states overview._
