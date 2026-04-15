#!/usr/bin/env node
/**
 * write-doc-titles-intros.js
 *
 * Phase 2b: Populate token_path and page_intro for all doc/ token files
 * that still have empty values.
 *
 * Only writes fields that are currently empty — does not overwrite existing content.
 *
 * Run: node scripts-custom/write-doc-titles-intros.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DOC = path.resolve(__dirname, '..', 'src', 'lib', 'themes', 'doc');

const UPDATES = [
  // ── Primitive ─────────────────────────────────────────────────────────────────
  {
    file: '02_primitive/dimension.json',
    title: 'Dimension',
    intro: 'Base spacing values in px and rem. Named by pixel step (e.g. 0, 4, 8, 16). Referenced by all semantic dimension tokens.',
  },
  {
    file: '02_primitive/motion.json',
    title: 'Motion',
    intro: 'Primitive duration steps (instant, fast, medium, slow, slower) and easing curves (linear, ease_out, ease_in, ease_in_out). Referenced by semantic motion tokens.',
  },
  {
    file: '02_primitive/number.json',
    title: 'Number',
    intro: 'Unitless numeric primitives — percentage, line-height ratios, letter-spacing values, and infinity. Referenced by semantic typography tokens.',
  },
  {
    file: '02_primitive/position.json',
    title: 'Position',
    intro: 'Primitive positional offset values — top and right. Referenced by layout token files.',
  },
  {
    file: '02_primitive/typography.json',
    title: 'Typography',
    intro: 'Primitive typography values — font families (sans, mono), unitless font size steps, font weights, and paragraph spacing scale. Referenced by semantic typography tokens.',
  },
  {
    file: '02_primitive/z_index.json',
    title: 'Z-index',
    intro: 'Primitive z-index scale with named levels from 0 to 1500. Referenced by semantic z-index tokens.',
  },

  // ── Semantic — asset ──────────────────────────────────────────────────────────
  {
    file: '03_semantic/asset/theme/lightness/dark.json',
    title: 'Dark',
    intro: 'Asset overrides applied in the Dark lightness theme — logo and image assets resolved for dark backgrounds.',
  },
  {
    file: '03_semantic/asset/theme/lightness/light.json',
    title: 'Light',
    intro: 'Asset overrides applied in the Light lightness theme — logo and image assets resolved for light backgrounds.',
  },

  // ── Semantic — root level ────────────────────────────────────────────────────
  {
    file: '03_semantic/border.json',
    title: 'Border',
    intro: 'Semantic border tokens — border-radius, border-width, outline-offset, and border shorthand. Referenced by component and HTML token files.',
  },
  {
    file: '03_semantic/effect.json',
    title: 'Effect',
    intro: 'Semantic visual effect tokens for surface treatments. Referenced by component and HTML token files.',
  },
  {
    file: '03_semantic/elevation.json',
    title: 'Elevation',
    intro: 'Semantic shadow tokens by elevation level — sm, md, default, none. Use to convey layer depth and component hierarchy.',
  },
  {
    file: '03_semantic/z_index.json',
    title: 'Z-index',
    intro: 'Semantic z-index tokens for UI layering — header, drawer, modal, notification, tooltip, and other stacking contexts.',
  },

  // ── Semantic — color ─────────────────────────────────────────────────────────
  {
    file: '03_semantic/color/compiled.json',
    title: 'Compiled',
    intro: 'Fully resolved semantic color tokens — neutral, interaction, status, free, and brand. No mode resolution required. Use these tokens in component and HTML token files.',
  },
  {
    file: '03_semantic/color/contrast_pairings.json',
    title: 'Contrast pairings',
    intro: 'Reference documentation for accessible foreground and background color combinations. Not a live token set — for documentation use only.',
  },
  {
    file: '03_semantic/color/s1_lightness/light.json',
    title: 'Light',
    intro: 'S1 color tokens resolved for the Light theme. Covers neutral, status, and interaction families. Referenced by S2 and compiled tokens.',
  },
  {
    file: '03_semantic/color/s1_lightness/dark.json',
    title: 'Dark',
    intro: 'S1 color tokens resolved for the Dark theme. Covers neutral, status, and interaction families. Referenced by S2 and compiled tokens.',
  },
  {
    file: '03_semantic/color/s2_emphasis/high.json',
    title: 'High emphasis',
    intro: 'S2 interaction color tokens for the High Emphasis mode. References S1 interaction tokens. Referenced by compiled interaction tokens.',
  },
  {
    file: '03_semantic/color/s2_emphasis/low.json',
    title: 'Low emphasis',
    intro: 'S2 interaction color tokens for the Low Emphasis mode. References S1 interaction tokens. Referenced by compiled interaction tokens.',
  },

  // ── Semantic — dimension / component size ────────────────────────────────────
  {
    file: '03_semantic/dimension/ui_scale/lg.json',
    title: 'Large',
    intro: 'Component dimension tokens for the Large size mode.',
  },
  {
    file: '03_semantic/dimension/ui_scale/md.json',
    title: 'Medium',
    intro: 'Component dimension tokens for the Medium size mode.',
  },
  {
    file: '03_semantic/dimension/ui_scale/sm.json',
    title: 'Small',
    intro: 'Component dimension tokens for the Small size mode.',
  },
  {
    file: '03_semantic/dimension/ui_scale/static.json',
    title: 'Static',
    intro: 'Component dimension tokens independent of size mode — fixed values used across all size variants.',
  },

  // ── Semantic — dimension / density ───────────────────────────────────────────
  {
    file: '03_semantic/dimension/density/compact.json',
    title: 'Compact',
    intro: 'Semantic spacing tokens for the Compact density mode — reduced whitespace for information-dense layouts.',
  },
  {
    file: '03_semantic/dimension/density/spacious.json',
    title: 'Spacious',
    intro: 'Semantic spacing tokens for the Spacious density mode — increased whitespace for comfortable reading and interaction.',
  },
  {
    file: '03_semantic/dimension/density/standard.json',
    title: 'Standard',
    intro: 'Semantic spacing tokens for the Standard density mode — balanced spacing for general-purpose layouts.',
  },
  {
    file: '03_semantic/dimension/density/static.json',
    title: 'Static',
    intro: 'Density-independent spacing tokens — fixed values not affected by density mode.',
  },

  // ── Semantic — dimension / typography context ─────────────────────────────────
  {
    file: '03_semantic/dimension/typography_context/interface.json',
    title: 'Interface',
    intro: 'Typography dimension tokens for the Interface context — compact spacing tuned for UI controls and labels.',
  },
  {
    file: '03_semantic/dimension/typography_context/prose.json',
    title: 'Prose',
    intro: 'Typography dimension tokens for the Prose context — generous spacing optimized for readable body text.',
  },
  {
    file: '03_semantic/dimension/typography_context/static.json',
    title: 'Static',
    intro: 'Context-independent typography dimension tokens — fixed values not affected by typography context mode.',
  },

  // ── Semantic — motion ────────────────────────────────────────────────────────
  {
    file: '03_semantic/motion/mode/disabled.json',
    title: 'Disabled',
    intro: 'Motion tokens for the Disabled motion mode — all durations set to zero for reduced-motion accessibility.',
  },
  {
    file: '03_semantic/motion/mode/enabled.json',
    title: 'Enabled',
    intro: 'Motion tokens for the Enabled motion mode — durations from instant to relaxed for animated UI interactions.',
  },
  {
    file: '03_semantic/motion/static.json',
    title: 'Static',
    intro: 'Mode-independent easing curve tokens — standard, entrance, exit, and emphasis. Not affected by motion mode.',
  },

  // ── Semantic — typography / grouped ─────────────────────────────────────────
  {
    file: '03_semantic/typography/grouped/lg.json',
    title: 'Large',
    intro: 'Grouped typography token sets for the Large component size mode — bundled font-size, line-height, and spacing.',
  },
  {
    file: '03_semantic/typography/grouped/md.json',
    title: 'Medium',
    intro: 'Grouped typography token sets for the Medium component size mode.',
  },
  {
    file: '03_semantic/typography/grouped/sm.json',
    title: 'Small',
    intro: 'Grouped typography token sets for the Small component size mode.',
  },
  {
    file: '03_semantic/typography/grouped/static.json',
    title: 'Static',
    intro: 'Grouped typography tokens independent of component size mode.',
  },

  // ── Semantic — typography / single ───────────────────────────────────────────
  {
    file: '03_semantic/typography/single/lg.json',
    title: 'Large',
    intro: 'Individual typography tokens for the Large component size mode — font-size, line-height, paragraph-spacing, and heading spacing.',
  },
  {
    file: '03_semantic/typography/single/md.json',
    title: 'Medium',
    intro: 'Individual typography tokens for the Medium component size mode.',
  },
  {
    file: '03_semantic/typography/single/sm.json',
    title: 'Small',
    intro: 'Individual typography tokens for the Small component size mode.',
  },
  {
    file: '03_semantic/typography/single/static.json',
    title: 'Static',
    intro: 'Size-mode-independent individual typography tokens.',
  },

  // ── Component — atom ─────────────────────────────────────────────────────────
  {
    file: '04_component/atom/badge.json',
    title: 'Badge',
    intro: 'Component tokens for the Badge atom — color (bg, fg), spacing, and size.',
  },
  {
    file: '04_component/atom/icon/02_layout.json',
    title: 'Layout',
    intro: 'Layout and size tokens for the Icon atom — static, component, and inline-text size variants.',
  },
  {
    file: '04_component/atom/spinner.json',
    title: 'Spinner',
    intro: 'Component tokens for the Spinner atom — size, color (active, inactive), and border-radius.',
  },
  {
    file: '04_component/atom/tooltip.json',
    title: 'Tooltip',
    intro: 'Component tokens for the Tooltip atom — spacing, color (bg, fg), and typography.',
  },

  // ── Component — molecule / infobox ───────────────────────────────────────────
  {
    file: '04_component/molecule/infobox/01_color.json',
    title: 'Color',
    intro: 'Color tokens for the Infobox molecule — icon, border, surface, and foreground colors.',
  },
  {
    file: '04_component/molecule/infobox/02_layout.json',
    title: 'Layout',
    intro: 'Layout tokens for the Infobox molecule — container padding, icon asset size, and border-radius.',
  },
  {
    file: '04_component/molecule/infobox/03_viewport/desktop.json',
    title: 'Desktop',
    intro: 'Viewport-specific layout tokens for the Infobox molecule at the desktop breakpoint.',
  },
  {
    file: '04_component/molecule/infobox/03_viewport/mobile.json',
    title: 'Mobile',
    intro: 'Viewport-specific layout tokens for the Infobox molecule at the mobile breakpoint.',
  },

  // ── Component — molecule / pill ───────────────────────────────────────────────
  {
    file: '04_component/molecule/pill/07_reference_only.json',
    title: 'Reference only',
    intro: 'Pill tokens for internal reference — composite, foreground label, and focus ring. Not for direct component assignment.',
  },
  {
    file: '04_component/molecule/pill/pill.json',
    title: 'Pill',
    intro: 'Layout tokens for the Pill molecule — spacing, border-radius, surface, color, icon size, and minimum height.',
  },
  {
    file: '04_component/molecule/pill/typography.json',
    title: 'Typography',
    intro: 'Typography tokens for the Pill molecule label.',
  },

  // ── Component — molecule / popover ────────────────────────────────────────────
  {
    file: '04_component/molecule/popover.json',
    title: 'Popover',
    intro: 'Component tokens for the Popover molecule — spacing, size, and color (bg, border, fg).',
  },

  // ── Component — molecule / tag ────────────────────────────────────────────────
  {
    file: '04_component/molecule/tag/reference_only.json',
    title: 'Reference only',
    intro: 'Tag tokens for internal reference — filter styles. Not for direct component assignment.',
  },
  {
    file: '04_component/molecule/tag/tag.json',
    title: 'Tag',
    intro: 'Layout tokens for the Tag molecule — container, spacing, border-radius, and color.',
  },
  {
    file: '04_component/molecule/tag/typography.json',
    title: 'Typography',
    intro: 'Typography tokens for the Tag molecule label.',
  },

  // ── HTML — button ────────────────────────────────────────────────────────────
  {
    file: '05_html/button/01_color.json',
    title: 'Color',
    intro: 'Color tokens for the HTML button element — foreground, background, and border across all interaction states.',
  },
  {
    file: '05_html/button/02_typography.json',
    title: 'Typography',
    intro: 'Typography tokens for the HTML button element — font-size, font-weight, and line-height.',
  },
  {
    file: '05_html/button/03_shadows.json',
    title: 'Shadows',
    intro: 'Shadow tokens for the HTML button element.',
  },
  {
    file: '05_html/button/04_layout.json',
    title: 'Layout',
    intro: 'Layout tokens for the HTML button element — spacing, size, and border-radius.',
  },
  {
    file: '05_html/button/05_viewport/desktop.json',
    title: 'Desktop',
    intro: 'Viewport-specific layout tokens for the HTML button element at the desktop breakpoint.',
  },
  {
    file: '05_html/button/05_viewport/mobile.json',
    title: 'Mobile',
    intro: 'Viewport-specific layout tokens for the HTML button element at the mobile breakpoint.',
  },
  {
    file: '05_html/button/06_motion.json',
    title: 'Motion',
    intro: 'Motion tokens for the HTML button element — transition duration and easing.',
  },
  {
    file: '05_html/button/07_reference_only.json',
    title: 'Reference only',
    intro: 'HTML button tokens for internal reference — not for direct component assignment.',
  },

  // ── HTML — hr ────────────────────────────────────────────────────────────────
  {
    file: '05_html/hr.json',
    title: 'HR',
    intro: 'Tokens for the HTML hr element — height and color (subtle, default, strong).',
  },

  // ── HTML — link ──────────────────────────────────────────────────────────────
  {
    file: '05_html/link/interface.json',
    title: 'Interface',
    intro: 'Link icon tokens for the Interface typography context.',
  },
  {
    file: '05_html/link/link.json',
    title: 'Link',
    intro: 'Base tokens for the HTML anchor element — spacing, motion, asset, color, and interaction states (enabled, hover, focus, active).',
  },
  {
    file: '05_html/link/prose.json',
    title: 'Prose',
    intro: 'Link icon tokens for the Prose typography context.',
  },

  // ── HTML — list ──────────────────────────────────────────────────────────────
  {
    file: '05_html/list.json',
    title: 'List',
    intro: 'Tokens for the HTML list elements — single-item and group spacing.',
  },

  // ── HTML — typography ────────────────────────────────────────────────────────
  {
    file: '05_html/typography/context/interface.json',
    title: 'Interface',
    intro: 'Typography context tokens for the Interface context — font stack, size, and spacing for UI labels and controls.',
  },
  {
    file: '05_html/typography/context/prose.json',
    title: 'Prose',
    intro: 'Typography context tokens for the Prose context — font stack, size, and spacing for body text and content.',
  },
  {
    file: '05_html/typography/style.json',
    title: 'Style',
    intro: 'Typography style tokens for HTML elements — heading and body style definitions.',
  },
];

let updated = 0;
let skipped = 0;
let errors = 0;

for (const entry of UPDATES) {
  const filePath = path.join(DOC, entry.file);

  if (!fs.existsSync(filePath)) {
    console.error(`MISSING  ${entry.file}`);
    errors++;
    continue;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`PARSE ERROR  ${entry.file}: ${e.message}`);
    errors++;
    continue;
  }

  const doc = data.doc;
  if (!doc) {
    console.error(`NO DOC KEY  ${entry.file}`);
    errors++;
    continue;
  }

  let changed = false;

  // Only write if currently empty — never overwrite existing content
  if (!doc.token_path['$value']) {
    doc.token_path['$value'] = entry.title;
    changed = true;
  }
  if (!doc.page_intro['$value']) {
    doc.page_intro['$value'] = entry.intro;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`UPDATED  ${entry.file}`);
    updated++;
  } else {
    console.log(`SKIP     ${entry.file}  (already has content)`);
    skipped++;
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${errors} errors.`);
