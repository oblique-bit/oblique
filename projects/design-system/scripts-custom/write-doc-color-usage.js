#!/usr/bin/env node
/**
 * write-doc-color-usage.js
 *
 * Phase 2a: Populate recommended, not_recommended, and semantic_assigned
 * for all color-family doc/ token files.
 *
 * Also corrects page_intro on s1_families/free.json to accurately
 * reflect that free colors resolve via specific S1 status sub-groups.
 *
 * Run: node scripts-custom/write-doc-color-usage.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'src', 'lib', 'themes');
const DOC = path.join(ROOT, 'doc');

/** Each entry: rel path from DOC, fields to set. */
const UPDATES = [
  // ── S-tier compiled ──────────────────────────────────────────────────────────
  {
    file: '03_semantic/color/brand.json',
    recommended: 'Use for the primary brand accent in navigation active states and official federal identity elements.',
    not_recommended: 'Do not use for interactive states or status feedback — use the interaction or status scale instead.',
    semantic_assigned: 'true',
  },
  {
    file: '03_semantic/color/neutral.json',
    recommended: 'Use for text, background, border, and shadow roles in standard UI components.',
    not_recommended: 'Do not use for interactive state feedback — use the interaction scale. Do not use for status communication — use the status scale.',
    semantic_assigned: 'false',
  },
  {
    file: '03_semantic/color/interaction.json',
    recommended: 'Use for interactive component states — buttons, links, form controls, and focusable elements.',
    not_recommended: 'Do not use for static decorative elements. Do not use for status communication — use the status scale instead.',
    semantic_assigned: 'false',
  },
  {
    file: '03_semantic/color/status.json',
    recommended: 'Use for alerts, badges, and any element that communicates system or process state.',
    not_recommended: 'Avoid for decoration or branding — status colors carry fixed semantic meaning. Do not use for interactive states — use the interaction scale.',
    semantic_assigned: 'true',
  },
  {
    file: '03_semantic/color/free.json',
    recommended: 'Use for tags, badges, and contextual color accents where no fixed semantic role applies. Suitable for categorical distinction.',
    not_recommended: 'Do not substitute for status or interaction colors. Free tokens carry no predefined semantic meaning — assign meaning in context.',
    semantic_assigned: 'false',
  },

  // ── S1 families ──────────────────────────────────────────────────────────────
  {
    file: '03_semantic/color/s1_families/neutral.json',
    recommended: 'Reference when authoring compiled semantic tokens that resolve to neutral foreground, background, border, or shadow values.',
    not_recommended: 'Do not assign directly to component tokens — use compiled S-tier tokens instead.',
    semantic_assigned: '',
    // page_intro override (s1 neutral is correctly described already)
  },
  {
    file: '03_semantic/color/s1_families/interaction.json',
    recommended: 'Reference when authoring S2 or compiled tokens that resolve to interaction state colors.',
    not_recommended: 'Do not assign directly to component tokens — use compiled S-tier tokens instead.',
    semantic_assigned: '',
  },
  {
    file: '03_semantic/color/s1_families/status.json',
    recommended: 'Reference when authoring compiled tokens that resolve to status colors.',
    not_recommended: 'Do not assign directly to component tokens — use compiled S-tier tokens instead.',
    semantic_assigned: '',
  },
  {
    // Free colors in the compiled tier resolve via specific S1 status sub-groups
    // (e.g. ob.s1.color.status.closed for cobalt) — no standalone S1 free family.
    file: '03_semantic/color/s1_families/free.json',
    page_intro: 'S1 status sub-groups that feed into the compiled free color scale. Free color families (cobalt, yellow, teal, indigo, pink) resolve via specific S1 status tokens (e.g. closed, pending, confirmed).',
    recommended: 'Reference the matching S1 status sub-group when tracing how a free color scale is resolved.',
    not_recommended: 'Do not assign directly to component tokens — use compiled S-tier tokens instead.',
    semantic_assigned: '',
  },

  // ── S2 emphasis ──────────────────────────────────────────────────────────────
  {
    file: '03_semantic/color/s2_emphasis/interaction_state.json',
    recommended: 'Reference when authoring compiled interaction tokens that require emphasis resolution.',
    not_recommended: 'Do not assign directly to component tokens — use compiled S-tier tokens instead.',
    semantic_assigned: '',
  },

  // ── Component: icon ───────────────────────────────────────────────────────────
  {
    file: '04_component/atom/icon/01_color.json',
    recommended: 'Assign to icon foreground in any context where the icon inherits the surrounding text color.',
    not_recommended: 'Do not override with a literal color value — always reference via the token chain.',
    semantic_assigned: 'true',
  },
];

let updated = 0;
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

  // Optional page_intro override
  if (entry.page_intro !== undefined) {
    doc.page_intro['$value'] = entry.page_intro;
  }

  // Always update these three fields
  doc.recommended['$value'] = entry.recommended;
  doc.not_recommended['$value'] = entry.not_recommended;
  doc.semantic_assigned['$value'] = entry.semantic_assigned;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`UPDATED  ${entry.file}`);
  updated++;
}

console.log(`\nDone: ${updated} updated, ${errors} errors.`);
