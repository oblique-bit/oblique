/**
 * resize-cell-role.js
 *
 * Resizes all "Cell: Role" frames on the current Figma page to match
 * the target width calculated from the longest $description value.
 *
 * Run via Figma Desktop Bridge plugin.
 * See initial-setup-rules.md for sizing rationale.
 *
 * Target widths (as of 2025-04-14):
 *   Cell frame:      848px
 *   Inner text layer: 832px (848 - 8px padding each side)
 */

const TARGET_CELL_WIDTH = 848;
const TARGET_TEXT_WIDTH = TARGET_CELL_WIDTH - 16; // 8px padding each side

const results = { resized: 0, skipped: 0, noText: 0 };

const page = figma.currentPage;
const cellRoleNodes = page.findAll(n => n.name === 'Cell: Role');

for (const cell of cellRoleNodes) {
  if (cell.type !== 'FRAME') {
    results.skipped++;
    continue;
  }

  cell.resize(TARGET_CELL_WIDTH, cell.height);

  const textNode = cell.findOne(n => n.type === 'TEXT');
  if (textNode) {
    textNode.resize(TARGET_TEXT_WIDTH, textNode.height);
    results.resized++;
  } else {
    results.noText++;
  }
}

return {
  page: page.name,
  targetCellWidth: TARGET_CELL_WIDTH,
  targetTextWidth: TARGET_TEXT_WIDTH,
  ...results,
  total: cellRoleNodes.length,
};
