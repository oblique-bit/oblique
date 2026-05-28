# FigJam Audit Card — DR v2 Format

Format spec for the naming-audit cards on the **States — Concept** board (file key `7k7SeWlhTycijN1TFo8SbI`, page `02 Audit – DR_V2`).

---

## FigJam node structure

```
SECTION  (card shell — grey fill, rounded, 1-column in outer section)
├── SHAPE_WITH_TEXT  (badge — top-right corner, green or amber)
└── TEXT             (all card content — single node, mixed styling)
```

Section shell:
- `fills`: `rgb(245, 245, 245)` — `{r:0.96, g:0.96, b:0.96}`
- `strokes`: `rgb(200, 188, 188)` — `{r:0.784, g:0.736, b:0.736}`
- `cornerRadius`: 12

Text node placement:
- `x`: 40, `y`: 70
- `width`: 596 (fixed), height auto-resizes
- `lineHeight`: 150%

Section height = `text.y + text.height + 40` (40 px bottom padding).

---

## Required sections — in order

```
<name>              Inter Bold 40   dark

STATUS              Inter Bold 16   dark
🟢 / 🟡 / ⏸  ...  Inter Regular 16 dark

WHY                 Inter Bold 16   dark
✓ …                Inter Bold 16   green  (bullet)
  prose             Inter Regular 16 dark

SOURCE              Inter Bold 16   dark
  prose / DS names  Inter Regular 16 / Inter Bold 16 blue

REJECTED ALTERNATIVES   Inter Bold 16   dark
⊗ …                Inter Bold 16   red    (bullet)
  mono name         Roboto Mono Regular 16 dark
  —  prose          Inter Regular 16 dark

COMBINES WITH  |  ORTHOGONAL WITH    Inter Bold 16  dark
  (see below)

 ____…____          Inter Regular 16 dark   (divider)

DECISION INDEPENDENT    Inter Bold 16  dark
CSS  :pseudo            Inter Bold 16 blue + Roboto Mono Regular 16 blue
What: prose             Inter Bold 16 dark  +  Inter Regular 16 dark
 ____…____
```

**COMBINES WITH** — for individual state value cards (rest, hover, active…).  
**ORTHOGONAL WITH** — for axis overview cards (availability, interaction…).

---

## Font scheme

| Segment type      | Family        | Style   | Size | Color  |
|-------------------|---------------|---------|------|--------|
| Card title        | Inter         | Bold    | 40   | dark   |
| Section header    | Inter         | Bold    | 16   | dark   |
| Body prose        | Inter         | Regular | 16   | dark   |
| Technical name    | Roboto Mono   | Regular | 16   | dark   |
| DS name (linked)  | Inter         | Bold    | 16   | blue   |
| CSS pseudo (linked) | Roboto Mono | Regular | 16   | blue   |
| ✓ bullet          | Inter         | Bold    | 16   | green  |
| ⊗ bullet          | Inter         | Bold    | 16   | red    |
| Divider           | Inter         | Regular | 16   | dark   |

---

## Color values (Figma plugin API)

```js
DARK  = { r:0.12, g:0.12, b:0.12 }   // #1f1f1f — text
BLUE  = { r:0.00, g:0.30, b:0.85 }   // #004dd9 — DS names, CSS pseudos
GREEN = { r:0.20, g:0.65, b:0.30 }   // #33a64d — ✓ bullets
RED   = { r:0.85, g:0.20, b:0.20 }   // #d93333 — ⊗ bullets
```

---

## Status / badge system

| Status       | Emoji | Badge text         | Badge fill                      |
|--------------|-------|--------------------|---------------------------------|
| Approved     | 🟢    | `APPROVED BY D.R.` | `{r:0.549, g:0.859, b:0.588}`   |
| Open         | 🟡    | `OPEN (Sn)`        | `{r:1.0, g:0.92, b:0.50}`      |
| On hold      | ⏸     | `ON HOLD (Dn)`     | `{r:1.0, g:0.92, b:0.50}`      |

Badge (SHAPE_WITH_TEXT) position: `x = section.width − badge.width − 20`, `y = 16`.

---

## Divider string

```
 ________________________________________________________________________ 
```
1 leading space + 72 underscores + 1 trailing space = 74 characters.

> Calibrated for a 596px-wide text node at Inter Regular 16px (underscore = 8px, space = 5px → 72×8 + 2×5 = 586px, 10px safety margin). Do not increase — 84 underscores wraps to a second line.

---

## DS name → URL mapping

All Inter Bold Blue DS names in cards link to the DS's states/color documentation.

| Name            | URL                                                               |
|-----------------|-------------------------------------------------------------------|
| M3              | https://m3.material.io/foundations/interaction/states/overview    |
| Carbon          | https://carbondesignsystem.com/elements/color/tokens/             |
| Spectrum        | https://spectrum.adobe.com/page/using-color/                      |
| Atlassian / ADS | https://atlassian.design/foundations/color-new                    |
| Primer          | https://primer.style/foundations/color/overview                   |
| Fluent          | https://fluent2.microsoft.design/                                 |
| USWDS           | https://designsystem.digital.gov/                                 |
| Polaris         | https://polaris.shopify.com/                                      |
| Canada          | https://design.canada.ca/en/                                      |
| Ant             | https://ant.design/components/result                              |
| Bootstrap       | https://getbootstrap.com/                                         |
| Chakra          | https://chakra-ui.com/                                            |
| Innovaccer      | (no public DS docs — blue label, no link)                         |

*Status-card context: M3 should link to `https://m3.material.io/foundations/feedback` instead.*

---

## JavaScript segment builder (figma-ds-cli eval script)

```js
(async () => {
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Roboto Mono', style: 'Regular' });

  const DARK  = [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:{r:0.12,g:0.12,b:0.12} }];
  const GREEN = [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:{r:0.20,g:0.65,b:0.30} }];
  const RED   = [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:{r:0.85,g:0.20,b:0.20} }];
  const BLUE  = [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:{r:0.00,g:0.30,b:0.85} }];
  const CARD_FILL   = [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:{r:0.96,g:0.96,b:0.96} }];
  const CARD_STROKE = [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:{r:0.784,g:0.736,b:0.736} }];
  const BADGE_GREEN = [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:{r:0.549,g:0.859,b:0.588} }];
  const BADGE_AMBER = [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:{r:1.0,g:0.92,b:0.50} }];

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
    'Ant':        'https://ant.design/components/result',
    'Bootstrap':  'https://getbootstrap.com/',
    'Chakra':     'https://chakra-ui.com/',
    'Innovaccer': null,
  };

  const mk    = (txt, font, size, fill, url) => ({ txt, font, size, fill, url: url || null });
  const TITLE = (t)      => mk(t, {family:'Inter',style:'Bold'}, 40, DARK);
  const NL    = (n)      => mk('\n'.repeat(n), {family:'Inter',style:'Regular'}, 16, DARK);
  const HDR   = (t)      => mk(t, {family:'Inter',style:'Bold'}, 16, DARK);
  const REG   = (t)      => mk(t, {family:'Inter',style:'Regular'}, 16, DARK);
  const MONO  = (t)      => mk(t, {family:'Roboto Mono',style:'Regular'}, 16, DARK);
  const MONO_B= (t, url) => mk(t, {family:'Roboto Mono',style:'Regular'}, 16, BLUE, url);
  const BLUE_B= (t)      => mk(t, {family:'Inter',style:'Bold'}, 16, BLUE, DS_URLS[t] || null);
  const GBUL  = ()       => mk('✓', {family:'Inter',style:'Bold'}, 16, GREEN);
  const RBUL  = ()       => mk('⊗', {family:'Inter',style:'Bold'}, 16, RED);
  const DIV   = ()       => mk(' ________________________________________________________________________ ', {family:'Inter',style:'Regular'}, 16, DARK);

  // Process loop
  for (const card of cards) {
    const t     = await figma.getNodeByIdAsync(card.textId);
    const sec   = await figma.getNodeByIdAsync(card.secId);
    const badge = await figma.getNodeByIdAsync(card.badgeId);
    if (!t || !sec) continue;

    sec.fills = CARD_FILL; sec.strokes = CARD_STROKE;
    try { sec.cornerRadius = 12; } catch(e) {}

    if (badge) {
      try {
        const fn = badge.text.fontName;
        if (fn !== figma.mixed) await figma.loadFontAsync(fn);
        badge.text.characters = card.badgeText;
        badge.fills = card.badgeFill
          ? [{ type:'SOLID', visible:true, opacity:1, blendMode:'NORMAL', color:card.badgeFill }]
          : BADGE_GREEN;
      } catch(e) {}
    }

    let combined = ''; const rangeList = [];
    for (const sg of card.segs) {
      const start = combined.length;
      combined += sg.txt;
      const end = combined.length;
      if (end > start) rangeList.push({ start, end, font:sg.font, size:sg.size, fill:sg.fill, url:sg.url });
    }

    t.x = 40; t.y = 70;
    t.textAutoResize = 'HEIGHT';
    t.resize(596, 100);
    t.lineHeight = { unit:'PERCENT', value:150 };
    t.fontName = { family:'Inter', style:'Regular' };
    t.fontSize = 16;
    t.characters = combined;

    for (const r of rangeList) {
      t.setRangeFontName(r.start, r.end, r.font);
      t.setRangeFontSize(r.start, r.end, r.size);
      t.setRangeFills(r.start, r.end, r.fill);
      if (r.url) t.setRangeHyperlink(r.start, r.end, { type:'URL', value:r.url });
    }

    const maxBottom = Math.max(...Array.from(sec.children).map(c => c.y + c.height));
    sec.resizeWithoutConstraints(sec.width, Math.ceil(maxBottom + 40));
  }
})()
```

Key: `BLUE_B(name)` auto-looks up `DS_URLS[name]` and stores it on the segment. `MONO_B(text, url)` takes an explicit URL. Both apply `setRangeHyperlink` in the processing loop.
