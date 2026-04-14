#!/usr/bin/env node
/**
 * write-figma-descriptions.js
 *
 * Creates per-family doc/ JSON files from Figma _Set Heading descriptions
 * extracted from the "Color Tokens" section (node 9544:34302) in Figma file 51tJjbxBSBmjAmKjQmhsz3.
 *
 * What this script does:
 * 1. Creates new doc/ JSON files per color family (S3, S1, S2, component)
 * 2. Sets token_path and page_intro from Figma source-of-truth descriptions
 * 3. Updates doc/02_primitive/color.json with a combined primitive description
 * 4. Updates $metadata.json tokenSetOrder to include the new files
 *
 * Idempotent: skips files where page_intro is already non-empty.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const THEMES_DIR = path.join(ROOT, 'src/lib/themes');
const DOC_DIR = path.join(THEMES_DIR, 'doc');
const METADATA_PATH = path.join(THEMES_DIR, '$metadata.json');

// ---------------------------------------------------------------------------
// Figma descriptions — source of truth
// Extracted from _Set Heading component instances (Figma Color Tokens section)
// Trailing spaces have been trimmed from original Figma text
// ---------------------------------------------------------------------------
const ENTRIES = [
  // S — Compiled semantic color families
  {
    setName: 'ob.s.color.brand',
    readableName: 'Brand',
    description: 'Official federal identity color (Bundesrot)',
    docRelPath: '03_semantic/color/brand.json',
    metaKey: 'doc/03_semantic/color/brand',
  },
  {
    setName: 'ob.s.color.free',
    readableName: 'Free',
    description: 'Free colors. No emphasis modes \u2014 only Light/Dark modes apply. Contrast levels (e.g. contrast_highest) are available.',
    docRelPath: '03_semantic/color/free.json',
    metaKey: 'doc/03_semantic/color/free',
  },
  {
    setName: 'ob.s.color.interaction',
    readableName: 'Interaction',
    description: 'Interactive state colors for components. Both Lightness (Light/Dark) and Emphasis (High/Low) modes affect resolved values across all 4 columns.',
    docRelPath: '03_semantic/color/interaction.json',
    metaKey: 'doc/03_semantic/color/interaction',
  },
  {
    setName: 'ob.s.color.neutral',
    readableName: 'Neutral',
    description: 'Foundational colors for backgrounds, text, borders, and surfaces.',
    docRelPath: '03_semantic/color/neutral.json',
    metaKey: 'doc/03_semantic/color/neutral',
  },
  {
    setName: 'ob.s.color.status',
    readableName: 'Status',
    description: 'Status communication colors. No emphasis modes \u2014 only Light/Dark modes apply. Contrast levels (e.g. contrast_highest) are available.',
    docRelPath: '03_semantic/color/status.json',
    metaKey: 'doc/03_semantic/color/status',
  },

  // S1 — Lightness-resolved color families
  {
    setName: 'ob.s1.color.free',
    readableName: 'Free',
    description: 'Lightness-resolved free colors. Only Light/Dark modes apply. References Primitives, referenced by S2.',
    docRelPath: '03_semantic/color/s1_families/free.json',
    metaKey: 'doc/03_semantic/color/s1_families/free',
  },
  {
    setName: 'ob.s1.color.interaction',
    readableName: 'Interaction',
    description: 'Lightness-resolved interaction colors. Only Light/Dark modes apply. References Primitives, referenced by S2.',
    docRelPath: '03_semantic/color/s1_families/interaction.json',
    metaKey: 'doc/03_semantic/color/s1_families/interaction',
  },
  {
    setName: 'ob.s1.color.neutral',
    readableName: 'Neutral',
    description: 'Lightness-resolved neutral colors. Only Light/Dark modes apply. References Primitives, referenced by S3.',
    docRelPath: '03_semantic/color/s1_families/neutral.json',
    metaKey: 'doc/03_semantic/color/s1_families/neutral',
  },
  {
    setName: 'ob.s1.color.status',
    readableName: 'Status',
    description: 'Lightness-resolved status colors. Only Light/Dark modes apply. References Primitives, referenced by S3.',
    docRelPath: '03_semantic/color/s1_families/status.json',
    metaKey: 'doc/03_semantic/color/s1_families/status',
  },

  // S2 — Emphasis-resolved color families
  {
    setName: 'ob.s2.color.interaction.state',
    readableName: 'Interaction State',
    description: 'State-based color mapping for interaction elements. Interactive state colors for components. Both Lightness (Light/Dark) and Emphasis (High/Low) modes affect resolved values across all 4 columns.',
    docRelPath: '03_semantic/color/s2_emphasis/interaction_state.json',
    metaKey: 'doc/03_semantic/color/s2_emphasis/interaction_state',
  },

  // Component — icon_slot color
  {
    setName: 'ob.c.icon_slot.color',
    readableName: 'icon_slot',
    description: 'Component foreground color token for the icon_slot element. Resolves via the semantic chain to the contextual neutral foreground.',
    docRelPath: '04_component/atom/icon/01_color.json',
    metaKey: 'doc/04_component/atom/icon/01_color',
  },
];

// Primitive color: two Figma headings share the same file (ob.p.color).
// Combined into the existing doc/02_primitive/color.json.
const PRIMITIVE_COLOR_REL = '02_primitive/color.json';
const PRIMITIVE_COLOR_TITLE = 'Color';
const PRIMITIVE_COLOR_INTRO =
  'Scales provided by Bundeskanzlei Design System and additional Oblique custom primitive colors.';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function emptyDoc() {
  return {
    doc: {
      token_path:         { $type: 'other', $value: '' },
      page_intro:        { $type: 'other', $value: '' },
      recommended:       { $type: 'other', $value: '' },
      not_recommended:   { $type: 'other', $value: '' },
      semantic_assigned: { $type: 'other', $value: '' },
    },
  };
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// ---------------------------------------------------------------------------
// Step 1: Create / update family doc files
// ---------------------------------------------------------------------------
let created = 0;
let updated = 0;
let skipped = 0;
let errors  = 0;

for (const entry of ENTRIES) {
  const docPath = path.join(DOC_DIR, entry.docRelPath);

  try {
    if (fs.existsSync(docPath)) {
      const data = readJson(docPath);
      const titleEmpty = (data?.doc?.token_path?.$value ?? null) === '';
      const introEmpty = (data?.doc?.page_intro?.$value ?? null) === '';

      if (!titleEmpty && !introEmpty) {
        console.log(`SKIPPED  ${entry.docRelPath} — already has content`);
        skipped++;
        continue;
      }

      if (titleEmpty) data.doc.token_path.$value = entry.readableName;
      if (introEmpty) data.doc.page_intro.$value = entry.description;
      writeJson(docPath, data);
      console.log(`UPDATED  ${entry.docRelPath}`);
      updated++;
    } else {
      fs.mkdirSync(path.dirname(docPath), { recursive: true });
      const data = emptyDoc();
      data.doc.token_path.$value = entry.readableName;
      data.doc.page_intro.$value = entry.description;
      writeJson(docPath, data);
      console.log(`CREATED  ${entry.docRelPath}`);
      created++;
    }
  } catch (e) {
    console.error(`ERROR    ${entry.docRelPath}: ${e.message}`);
    errors++;
  }
}

// ---------------------------------------------------------------------------
// Step 2: Update primitive color.json
// ---------------------------------------------------------------------------
const primPath = path.join(DOC_DIR, PRIMITIVE_COLOR_REL);
try {
  const data = readJson(primPath);
  const titleEmpty = (data?.doc?.token_path?.$value ?? null) === '';
  const introEmpty = (data?.doc?.page_intro?.$value ?? null) === '';

  if (!titleEmpty && !introEmpty) {
    console.log(`SKIPPED  ${PRIMITIVE_COLOR_REL} — already has content`);
    skipped++;
  } else {
    if (titleEmpty) data.doc.token_path.$value = PRIMITIVE_COLOR_TITLE;
    if (introEmpty) data.doc.page_intro.$value = PRIMITIVE_COLOR_INTRO;
    writeJson(primPath, data);
    console.log(`UPDATED  ${PRIMITIVE_COLOR_REL}`);
    updated++;
  }
} catch (e) {
  console.error(`ERROR    ${PRIMITIVE_COLOR_REL}: ${e.message}`);
  errors++;
}

// ---------------------------------------------------------------------------
// Step 3: Update $metadata.json tokenSetOrder
// ---------------------------------------------------------------------------
try {
  const meta = readJson(METADATA_PATH);
  const order = meta.tokenSetOrder;

  // New metaKeys to insert (only if not already present)
  const newKeys = ENTRIES.map((e) => e.metaKey);

  let metaChanges = 0;

  for (const key of newKeys) {
    if (order.includes(key)) continue; // already present

    // Determine insertion point based on the key prefix
    let insertAfter = null;

    if (['doc/03_semantic/color/brand', 'doc/03_semantic/color/free', 'doc/03_semantic/color/interaction', 'doc/03_semantic/color/neutral', 'doc/03_semantic/color/status'].includes(key)) {
      // Insert after the last s color family or s2_emphasis entry
      for (let i = order.length - 1; i >= 0; i--) {
        if (
          ['doc/03_semantic/color/brand', 'doc/03_semantic/color/free', 'doc/03_semantic/color/interaction', 'doc/03_semantic/color/neutral', 'doc/03_semantic/color/status'].includes(order[i]) ||
          order[i].startsWith('doc/03_semantic/color/s2_emphasis/')
        ) {
          insertAfter = i;
          break;
        }
      }
      if (insertAfter === null) {
        // Fall back: after the last doc/03_semantic/color/ entry
        for (let i = order.length - 1; i >= 0; i--) {
          if (order[i].startsWith('doc/03_semantic/color/')) {
            insertAfter = i;
            break;
          }
        }
      }
    } else if (key.startsWith('doc/03_semantic/color/s1_families/')) {
      // Insert after the last s1_lightness entry
      for (let i = order.length - 1; i >= 0; i--) {
        if (order[i].startsWith('doc/03_semantic/color/s1_lightness/') ||
            order[i].startsWith('doc/03_semantic/color/s1_families/')) {
          insertAfter = i;
          break;
        }
      }
    } else if (key.startsWith('doc/03_semantic/color/s2_emphasis/')) {
      // Insert after the last s2_emphasis entry
      for (let i = order.length - 1; i >= 0; i--) {
        if (order[i].startsWith('doc/03_semantic/color/s2_emphasis/')) {
          insertAfter = i;
          break;
        }
      }
    } else if (key === 'doc/04_component/atom/icon/01_color') {
      // Insert before 02_layout
      const idx = order.indexOf('doc/04_component/atom/icon/02_layout');
      insertAfter = idx !== -1 ? idx - 1 : null;
    }

    if (insertAfter !== null) {
      order.splice(insertAfter + 1, 0, key);
    } else {
      // Append at end as fallback
      order.push(key);
    }

    console.log(`METADATA added: ${key}`);
    metaChanges++;
  }

  if (metaChanges > 0 || placeholderIdx !== -1) {
    writeJson(METADATA_PATH, meta);
    console.log(`METADATA saved (${metaChanges} keys added)`);
  } else {
    console.log('METADATA no changes needed');
  }
} catch (e) {
  console.error(`ERROR    $metadata.json: ${e.message}`);
  errors++;
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\nDone. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`);
if (errors > 0) process.exit(1);
