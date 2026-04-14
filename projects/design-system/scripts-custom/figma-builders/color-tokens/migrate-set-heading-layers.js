/**
 * migrate-set-heading-layers.js
 *
 * Renames text layers in the _Set Heading component (9544:35256) so their names
 * match the doc JSON field that feeds them, and adds missing layers for
 * the three fields that had no dedicated layer before.
 *
 * Layer rename map:
 *   __setName        → __token_path
 *   __setDescription → __page_intro
 *
 * New layers added (cloned from __page_intro for consistent styling):
 *   __recommended
 *   __not_recommended
 *   __semantic_assigned
 *
 * Run via Figma MCP `figma_execute` with this file's contents, or paste
 * directly into the Figma Console when the Desktop Bridge plugin is active.
 */
(async () => {
  const COMPONENT_ID = '9544:35256';

  const comp = await figma.getNodeByIdAsync(COMPONENT_ID);
  if (!comp) return { error: 'Component 9544:35256 not found' };
  if (comp.type !== 'COMPONENT') return { error: `Node is ${comp.type}, expected COMPONENT` };

  const log = [];

  // ── Step 1: rename existing layers ───────────────────────────────────────
  const RENAMES = {
    '__setName':        '__token_path',
    '__setDescription': '__page_intro',
  };

  const allChildren = comp.findAll(n => n.type === 'TEXT');

  for (const textNode of allChildren) {
    if (RENAMES[textNode.name]) {
      const oldName = textNode.name;
      textNode.name = RENAMES[textNode.name];
      log.push({ action: 'renamed', id: textNode.id, from: oldName, to: textNode.name });
    }
  }

  // ── Step 2: add missing text layers (clone __page_intro for consistent styling) ──
  const NEW_LAYERS = ['__recommended', '__not_recommended', '__semantic_assigned'];

  // Re-find after rename
  const allText = comp.findAll(n => n.type === 'TEXT');
  const introNode = allText.find(t => t.name === '__page_intro');

  if (!introNode) {
    log.push({ action: 'warning', note: '__page_intro not found — skipping new layer creation' });
    return { log };
  }

  for (const layerName of NEW_LAYERS) {
    // Skip if already exists
    if (allText.find(t => t.name === layerName)) {
      log.push({ action: 'skipped', layer: layerName, reason: 'already exists' });
      continue;
    }

    const clone = introNode.clone();
    clone.name = layerName;
    clone.characters = '';

    // Insert directly after __page_intro in the component's children
    comp.appendChild(clone);

    log.push({ action: 'created', layer: layerName, id: clone.id });
  }

  // ── Result ────────────────────────────────────────────────────────────────
  const renamed  = log.filter(e => e.action === 'renamed').length;
  const created  = log.filter(e => e.action === 'created').length;
  const skipped  = log.filter(e => e.action === 'skipped').length;
  const warnings = log.filter(e => e.action === 'warning').length;

  return {
    component: { name: comp.name, id: comp.id },
    summary: { renamed, created, skipped, warnings },
    log,
  };
})()
