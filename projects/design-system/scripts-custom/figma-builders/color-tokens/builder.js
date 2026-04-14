/**
 * builder.js — Color table builder (pure logic).
 *
 * Expects the following variables to be in scope (injected by mcp-executor.js):
 *   SPEC    — full config object (from config.json)
 *   VAR_MAP — { [tokenName]: variableId } pre-built from Phase 1 warmup
 *
 * Called from an async IIFE composed by mcp-executor.js.
 */

// ── Helpers ─────────────────────────────────────────────────────────────────

function findChild(node, name) {
  if (!node || !node.children) return null;
  return node.children.find(c => c.name === name) || null;
}

function findFirstText(node) {
  if (!node) return null;
  if (node.type === 'TEXT') return node;
  if (node.children) {
    for (const c of node.children) {
      const t = findFirstText(c);
      if (t) return t;
    }
  }
  return null;
}

function findByType(node, type) {
  if (!node) return null;
  if (node.type === type) return node;
  if (node.children) {
    for (const c of node.children) {
      const found = findByType(c, type);
      if (found) return found;
    }
  }
  return null;
}

function findAllByType(node, type) {
  const results = [];
  if (!node) return results;
  if (node.type === type) results.push(node);
  if (node.children) {
    for (const c of node.children) {
      results.push(...findAllByType(c, type));
    }
  }
  return results;
}

const ROLE_PARTS = ['bg', 'fg', 'border', 'shadow', 'focus_ring', 'no_color'];
function extractRole(tokenName) {
  return tokenName.split('.').find(p => ROLE_PARTS.includes(p)) || '';
}

function findInstance(node, name) {
  if (!node || !node.children) return null;
  return node.children.find(c => c.name === name && c.type === 'INSTANCE') || null;
}

function findRect(node, name) {
  if (!node || !node.children) return null;
  return node.children.find(c => c.name === name && c.type === 'RECTANGLE') || null;
}

function navigate(node, ...names) {
  let current = node;
  for (const raw of names) {
    if (!current) return null;
    const name = raw.replace(/ (INSTANCE|RECTANGLE|FRAME|TEXT)$/, '');
    current = findChild(current, name);
  }
  return current;
}

// ── Variable Lookup (uses VAR_MAP injected by executor) ─────────────────────

async function findVariableByTokenPath(tokenPath) {
  const slashPath = tokenPath.replace(/\./g, '/');
  const id = VAR_MAP[tokenPath] || VAR_MAP[slashPath];
  if (!id) return null;
  return await figma.variables.getVariableByIdAsync(id);
}

const collectionCache = {};
async function getCollection(id) {
  if (!collectionCache[id]) {
    collectionCache[id] = await figma.variables.getVariableCollectionByIdAsync(id);
  }
  return collectionCache[id];
}

// ── Swatch Binding ───────────────────────────────────────────────────────────

async function bindSwatchFill(swatchRect, tokenPath) {
  if (!swatchRect || swatchRect.type !== 'RECTANGLE') return { bound: false, reason: 'not a rectangle' };
  const variable = await findVariableByTokenPath(tokenPath);
  if (!variable) return { bound: false, reason: 'variable not found: ' + tokenPath };
  try {
    const currentPaint = swatchRect.fills[0] || figma.util.solidPaint('#808080');
    const boundPaint = figma.variables.setBoundVariableForPaint(currentPaint, 'color', variable);
    swatchRect.fills = [boundPaint];
    return { bound: true };
  } catch (e) {
    return { bound: false, reason: e.message };
  }
}

async function setSwatchModeOverrides(swatchInstance, overrideKey) {
  if (!swatchInstance || swatchInstance.type !== 'INSTANCE') return;
  const overrides = SPEC.swatchModeOverrides[overrideKey];
  if (!overrides) return;
  for (const [collectionName, modeName] of Object.entries(overrides)) {
    const collSpec = SPEC.collections[collectionName];
    if (!collSpec) continue;
    const collection = await getCollection(collSpec.id);
    if (!collection) continue;
    const modeId = collSpec.modes[modeName];
    if (!modeId) continue;
    swatchInstance.setExplicitVariableModeForCollection(collection, modeId);
  }
}

// ── Text ─────────────────────────────────────────────────────────────────────

async function setText(textNode, content) {
  if (!textNode || textNode.type !== 'TEXT') return false;
  textNode.characters = String(content);
  return true;
}

// ── Swatch Node Accessors ────────────────────────────────────────────────────

function getSwatchNodes2Mode(row, mode) {
  const cellName = mode === 'light' ? 'Cell: Light' : 'Cell: Dark';
  const cell = findChild(row, cellName);
  if (!cell) return { instance: null, rect: null, hex: null };
  const Mode = mode.charAt(0).toUpperCase() + mode.slice(1);
  const instName = 'swatch' + Mode;
  const inst = findInstance(cell, instName) || cell.children?.find(c => c.type === 'INSTANCE') || null;
  const rect = inst ? findRect(inst, 'swatch') : null;
  const hex = findChild(cell, 'hex' + Mode)
    || findAllByType(cell, 'TEXT').find(t => t.name?.toLowerCase().includes('hex'));
  return { instance: inst, rect, hex };
}

function getSwatchNodes4Mode(row, mode) {
  const parts = mode.split('-');
  const lightDark = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  // Both high and low row components use fixed cell names: Cell: Light/Low and Cell: Dark/High
  const fixedSuffix = lightDark === 'Light' ? 'Low' : 'High';
  const cellName = 'Cell: ' + lightDark + '/' + fixedSuffix;
  const cell = findChild(row, cellName);
  if (!cell) return { instance: null, rect: null, hex: null };
  const instanceName = 'swatch' + lightDark + fixedSuffix;
  const inst = findInstance(cell, instanceName) || cell.children?.find(c => c.type === 'INSTANCE') || null;
  const rect = inst ? findRect(inst, 'swatch') : findByType(cell, 'RECTANGLE');
  const hexName = 'hex' + lightDark + fixedSuffix;
  const hex = findChild(cell, hexName) || findAllByType(cell, 'TEXT').pop();
  return { instance: inst, rect, hex };
}

function getSwatchNodesPrimitive(row) {
  const cell = findChild(row, 'Cell: Swatch');
  if (!cell) return { instance: null, rect: null, hex: null };
  const wrapper = findChild(cell, 'Swatch Wrapper');
  const inst = wrapper
    ? wrapper.children?.find(c => c.type === 'INSTANCE') || null
    : cell.children?.find(c => c.type === 'INSTANCE') || null;
  const rect = inst ? findRect(inst, 'swatch') : findByType(cell, 'RECTANGLE');
  const hex = findAllByType(cell, 'TEXT').find(t => t.name?.toLowerCase().includes('hex'))
    || findAllByType(cell, 'TEXT').pop();
  return { instance: inst, rect, hex };
}

function setBorderVisible(swatchInstance) {
  if (!swatchInstance) return;
  const border = findChild(swatchInstance, 'border') || findRect(swatchInstance, 'border');
  if (border) border.visible = true;
}

function setAlphaProperties(swatchInstance, tokenName) {
  if (!swatchInstance || !tokenName) return;
  if (!tokenName.includes('_alpha')) return;
  if (tokenName.includes('white_alpha')) {
    swatchInstance.setProperties({
      'showAlphaDark#9510:8': true,
      'showBorder#9510:6': true
    });
  } else {
    swatchInstance.setProperties({
      'showAlphaLight#9510:7': true
    });
  }
}

function populateReferenceCell(row, references, tier) {
  const refCell = findChild(row, 'Cell: Reference');
  if (!refCell) return;
  // Only write to 'tokenReference' text nodes. Never touch pill text (fixed component value).
  if (tier === 's1' || tier === 's3') {
    const lightRef = references?.light || references || '';
    const darkRef = references?.dark || references || '';
    const lightLine = findChild(refCell, 'refLine-light');
    const darkLine = findChild(refCell, 'refLine-dark');
    if (lightLine) {
      const refText = lightLine.children?.find(c => c.name === 'tokenReference' && c.type === 'TEXT');
      if (refText) setText(refText, lightRef);
    }
    if (darkLine) {
      const refText = darkLine.children?.find(c => c.name === 'tokenReference' && c.type === 'TEXT');
      if (refText) setText(refText, darkRef);
    }
  } else if (tier === 's2') {
    const lightLine = findChild(refCell, 'refLine-light');
    const darkLine = findChild(refCell, 'refLine-dark');
    for (const line of [lightLine, darkLine]) {
      if (!line) continue;
      const refText = line.children?.find(c => c.name === 'tokenReference' && c.type === 'TEXT');
      if (refText) setText(refText, references || '');
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD TABLE
// ═══════════════════════════════════════════════════════════════════════════

async function buildTable(tableId, tableData) {
  const log = [];
  const tableNodeId = SPEC.tableIds[tableId];
  if (!tableNodeId) return { error: 'No table node ID for ' + tableId };
  const tableFrame = await figma.getNodeByIdAsync(tableNodeId);
  if (!tableFrame) return { error: 'Table frame not found: ' + tableNodeId };

  const compType = tableData.component;
  const hasRole  = tableData.role === true;
  const isPrimitive = compType === 'primitive';
  const is4Mode     = compType === '4-mode';

  // Resolve component IDs from SPEC.components (no separate COMP_MAP needed)
  let compIds;
  if (isPrimitive) {
    compIds = SPEC.components.primitive;
  } else {
    const modeMap = SPEC.components[compType];
    if (!modeMap) return { error: 'Unknown component type: ' + compType };
    compIds = { ...(hasRole ? modeMap.withRole : modeMap.noRole), separator: modeMap.separator || null };
  }

  const rowComp        = await figma.getNodeByIdAsync(compIds.row);
  const headerComp     = await figma.getNodeByIdAsync(compIds.header);
  const rowLowComp     = compIds.rowLow     ? await figma.getNodeByIdAsync(compIds.rowLow)     : null;
  const separatorComp  = compIds.separator  ? await figma.getNodeByIdAsync(compIds.separator)  : null;
  const groupHeaderComp = await figma.getNodeByIdAsync(SPEC.components.utility.groupHeader);

  if (!rowComp || !headerComp) {
    return { error: 'Row or header component not found for ' + compType + ' (role=' + hasRole + ')' };
  }

  // Clear existing children
  const existingChildren = [...tableFrame.children];
  log.push('Clearing ' + existingChildren.length + ' existing children');
  for (const child of existingChildren) child.remove();

  // Add header
  const headerInstance = headerComp.createInstance();
  tableFrame.appendChild(headerInstance);
  headerInstance.layoutSizingHorizontal = 'FILL';
  log.push('Header created');

  let tokenCount = 0, bindCount = 0, bindFail = 0;

  for (const group of tableData.groups) {
    if (groupHeaderComp) {
      const gh = groupHeaderComp.createInstance();
      tableFrame.appendChild(gh);
      gh.layoutSizingHorizontal = 'FILL';
      const textNodes = findAllByType(gh, 'TEXT');
      if (textNodes.length >= 1) await setText(textNodes[0], group.title);
      if (textNodes.length >= 2) await setText(textNodes[1], group.description);
      log.push('Group: ' + group.title + ' (' + group.tokens.length + ' tokens)');
    }

    for (let i = 0; i < group.tokens.length; i++) {
      const token = group.tokens[i];

      if (is4Mode) {
        // ── 4-mode: two rows per token (high + low) ──
        const highRow = rowComp.createInstance();
        tableFrame.appendChild(highRow);
        highRow.layoutSizingHorizontal = 'FILL';
        const nameCell = findChild(highRow, 'Cell: Name');
        if (nameCell) await setText(findFirstText(nameCell), token.name);
        if (hasRole) { const roleCell = findChild(highRow, 'Cell: Role'); if (roleCell) await setText(findFirstText(roleCell), extractRole(token.name)); }
        const emphCell = findChild(highRow, 'Cell: Emphasis');
        if (emphCell) await setText(findFirstText(emphCell), 'high');
        const highRef = token.references ? token.references.high : token.reference;
        populateReferenceCell(highRow, highRef, tableData.tier);
        for (const mode of ['light-high', 'dark-high']) {
          const { instance: swInst, rect: swRect, hex: hexNode } = getSwatchNodes4Mode(highRow, mode);
          const bindResult = await bindSwatchFill(swRect, token.name);
          if (bindResult.bound) bindCount++; else bindFail++;
          await setSwatchModeOverrides(swInst, mode);
          setBorderVisible(swInst);
          setAlphaProperties(swInst, token.name);
          if (hexNode && token.hex?.[mode]) await setText(hexNode, token.hex[mode]);
        }
        if (rowLowComp) {
          const lowRow = rowLowComp.createInstance();
          tableFrame.appendChild(lowRow);
          lowRow.layoutSizingHorizontal = 'FILL';
          const lowNameCell = findChild(lowRow, 'Cell: Name');
          if (lowNameCell) await setText(findFirstText(lowNameCell), token.name);
          if (hasRole) { const lowRoleCell = findChild(lowRow, 'Cell: Role'); if (lowRoleCell) await setText(findFirstText(lowRoleCell), extractRole(token.name)); }
          const lowEmphCell = findChild(lowRow, 'Cell: Emphasis');
          if (lowEmphCell) await setText(findFirstText(lowEmphCell), 'low');
          const lowRef = token.references ? token.references.low : token.reference;
          populateReferenceCell(lowRow, lowRef, tableData.tier);
          for (const mode of ['light-low', 'dark-low']) {
            const { instance: swInst, rect: swRect, hex: hexNode } = getSwatchNodes4Mode(lowRow, mode);
            const bindResult = await bindSwatchFill(swRect, token.name);
            if (bindResult.bound) bindCount++; else bindFail++;
            await setSwatchModeOverrides(swInst, mode);
            setBorderVisible(swInst);
            setAlphaProperties(swInst, token.name);
            if (hexNode && token.hex?.[mode]) await setText(hexNode, token.hex[mode]);
          }
        }
        if (separatorComp && i < group.tokens.length - 1) {
          const sep = separatorComp.createInstance();
          tableFrame.appendChild(sep);
          sep.layoutSizingHorizontal = 'FILL';
        }
        tokenCount++;

      } else if (isPrimitive) {
        // ── Primitive: one row per token ──
        const row = rowComp.createInstance();
        tableFrame.appendChild(row);
        row.layoutSizingHorizontal = 'FILL';
        const nameCell = findChild(row, 'Cell: Name') || findChild(row, 'Cell: Token Name');
        if (nameCell) await setText(findFirstText(nameCell), token.name);
        const { instance: swInst, rect: swRect, hex: hexNode } = getSwatchNodesPrimitive(row);
        const bindResult = await bindSwatchFill(swRect, token.name);
        if (bindResult.bound) bindCount++; else bindFail++;
        setBorderVisible(swInst);
        setAlphaProperties(swInst, token.name);
        const hexVal = token.hex?.['light-high'] || token.value || '';
        if (hexNode) await setText(hexNode, hexVal);
        tokenCount++;

      } else {
        // ── 2-mode: one row per token ──
        const row = rowComp.createInstance();
        tableFrame.appendChild(row);
        row.layoutSizingHorizontal = 'FILL';
        const nameCell = findChild(row, 'Cell: Name');
        if (nameCell) await setText(findFirstText(nameCell), token.name);
        if (hasRole) { const roleCell = findChild(row, 'Cell: Role'); if (roleCell) await setText(findFirstText(roleCell), extractRole(token.name)); }
        populateReferenceCell(row, token.references || token.reference, tableData.tier);
        for (const mode of ['light', 'dark']) {
          const { instance: swInst, rect: swRect, hex: hexNode } = getSwatchNodes2Mode(row, mode);
          const bindResult = await bindSwatchFill(swRect, token.name);
          if (bindResult.bound) bindCount++; else bindFail++;
          await setSwatchModeOverrides(swInst, mode);
          setBorderVisible(swInst);
          setAlphaProperties(swInst, token.name);
          const hexKey = mode === 'light' ? 'light-high' : 'dark-high';
          if (hexNode && token.hex?.[hexKey]) await setText(hexNode, token.hex[hexKey]);
        }
        tokenCount++;
      }
    }
  }

  log.push('Built ' + tokenCount + ' tokens, ' + bindCount + ' swatches bound, ' + bindFail + ' failed');
  return { tableId, tokenCount, bindCount, bindFail, log };
}
