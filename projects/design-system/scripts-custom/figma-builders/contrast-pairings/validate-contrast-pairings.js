/**
 * Validate Contrast Pairings — 🎨 Colors – Contrast Pairings
 *
 * Runs inside Figma's plugin context via the Desktop Bridge MCP.
 * Validates every _ContrastSwatch instance on the page:
 *
 *   1. Variable bindings — previewArea bg, sample-link fg fills,
 *      colorDot fills all match their token path text
 *   2. Contrast ratio — displayed ratio matches computed WCAG ratio
 *   3. Badge states — AA/AAA badges for normal/large text match thresholds
 *   4. Structure — all expected child nodes exist
 *
 * Usage (via MCP executor or Figma Console):
 *   • Paste this entire file into figma_execute
 *   • Or: node mcp-executor.js --validate (once wired into executor)
 *
 * Output: { summary, errors[], warnings[], stats }
 */
(async () => {
  const PAGE_ID = '9559:21413';
  const SECTION_ID = '9564:1006818';
  const CATEGORIES_FRAME_ID = '9564:1005836';

  const CATEGORY_IDS = {
    neutral: '9561:410202',
    interaction: '9561:410210',
    status: '9561:410218',
    free: '9709:52372',
    navigation: '10202:986611'
  };

  // ── Helpers ──────────────────────────────────────────────────────

  function findChild(node, name) {
    return node?.children?.find(c => c.name === name) || null;
  }

  function findByName(node, name) {
    if (!node) return null;
    if (node.name === name) return node;
    if (node.children) {
      for (const c of node.children) {
        const found = findByName(c, name);
        if (found) return found;
      }
    }
    return null;
  }

  // ── WCAG Contrast ───────────────────────────────────────────────

  function sRGBtoLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function relativeLuminance(r, g, b) {
    return 0.2126 * sRGBtoLinear(r) + 0.7152 * sRGBtoLinear(g) + 0.0722 * sRGBtoLinear(b);
  }

  function contrastRatio(lum1, lum2) {
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  // ── Variable Resolution ─────────────────────────────────────────

  let varCache = null;
  async function getAllVars() {
    if (!varCache) varCache = await figma.variables.getLocalVariablesAsync('COLOR');
    return varCache;
  }

  // Build name→id lookup (both slash and dot forms)
  let nameToId = null;
  async function buildNameIndex() {
    if (nameToId) return nameToId;
    const vars = await getAllVars();
    nameToId = new Map();
    for (const v of vars) {
      nameToId.set(v.name, v.id);
      nameToId.set(v.name.replace(/\//g, '.'), v.id);
    }
    return nameToId;
  }

  async function resolveColor(varId, visited) {
    if (!visited) visited = new Set();
    if (visited.has(varId)) return null;
    visited.add(varId);
    const v = await figma.variables.getVariableByIdAsync(varId);
    if (!v) return null;
    const modeIds = Object.keys(v.valuesByMode);
    if (modeIds.length === 0) return null;
    const val = v.valuesByMode[modeIds[0]];
    if (val && typeof val.r === 'number') return { r: val.r, g: val.g, b: val.b };
    if (val && val.type === 'VARIABLE_ALIAS') return resolveColor(val.id, visited);
    return null;
  }

  // Normalize token text to variable name format:
  // Text may include extra segments (e.g. ".state.") that the variable omits
  function textMatchesVarName(text, varName) {
    const dotName = varName.replace(/\//g, '.');
    if (text === dotName) return true;
    // Strip known extra segments from text and re-compare
    const normalized = text
      .replace('.state.', '.')      // interaction: ob.s3.color.interaction.state.fg → ob.s3.color.interaction.fg
      .replace('.status.', '.');    // status: if same pattern
    return normalized === dotName;
  }

  // ── Swatch Validator ────────────────────────────────────────────

  async function validateSwatch(inst) {
    const issues = [];
    const path = inst.name;

    // ── Structure check ──
    const previewArea = findChild(inst, 'previewArea');
    const metaArea = findChild(inst, 'metaArea');
    if (!previewArea) { issues.push({ severity: 'error', msg: 'Missing previewArea', path }); return issues; }
    if (!metaArea) { issues.push({ severity: 'error', msg: 'Missing metaArea', path }); return issues; }

    const metaContent = findChild(metaArea, 'meta-content');
    if (!metaContent) { issues.push({ severity: 'error', msg: 'Missing meta-content', path }); return issues; }

    const pairedColors = findChild(metaContent, 'paired-colors');
    if (!pairedColors) { issues.push({ severity: 'error', msg: 'Missing paired-colors', path }); return issues; }

    const fgRow = findChild(pairedColors, 'fgRow');
    const bgRow = findChild(pairedColors, 'bgRow');
    if (!fgRow) issues.push({ severity: 'error', msg: 'Missing fgRow', path });
    if (!bgRow) issues.push({ severity: 'error', msg: 'Missing bgRow', path });

    const wcagFrame = findChild(metaContent, 'WCAG');
    if (!wcagFrame) issues.push({ severity: 'error', msg: 'Missing WCAG frame', path });

    // ── Read token path texts ──
    const fgValue = findByName(fgRow, 'fg-value');
    const bgValue = findByName(bgRow, 'bg-value');
    const fgTokenText = fgValue?.characters?.trim() || '';
    const bgTokenText = bgValue?.characters?.trim() || '';

    if (!fgTokenText) issues.push({ severity: 'error', msg: 'Empty fg-value text', path });
    if (!bgTokenText) issues.push({ severity: 'error', msg: 'Empty bg-value text', path });

    // ── Validate variable bindings ──
    // Strategy: check what IS bound, then verify the bound variable
    // name is consistent with the displayed token path text.

    // Check previewArea bg fill binding
    const paBoundVar = previewArea.boundVariables?.fills?.[0]?.id;
    let paBoundVarName = '';
    if (!paBoundVar) {
      issues.push({ severity: 'error', msg: 'previewArea fill not bound to variable', path });
    } else {
      const v = await figma.variables.getVariableByIdAsync(paBoundVar);
      paBoundVarName = v?.name || '';
      if (bgTokenText && !textMatchesVarName(bgTokenText, paBoundVarName)) {
        issues.push({ severity: 'error', msg: 'previewArea bound to "' + paBoundVarName + '" but text says "' + bgTokenText + '"', path });
      }
    }

    // Check sample-link text fill bindings
    const sampleLinks = previewArea.children?.filter(c => c.name === 'sample-link' && c.type === 'TEXT') || [];
    let slBoundVarName = '';
    for (let i = 0; i < sampleLinks.length; i++) {
      const sl = sampleLinks[i];
      const slBound = sl.boundVariables?.fills?.[0]?.id;
      if (!slBound) {
        issues.push({ severity: 'error', msg: 'sample-link[' + i + '] fill not bound', path });
      } else {
        const v = await figma.variables.getVariableByIdAsync(slBound);
        const vname = v?.name || '';
        if (i === 0) slBoundVarName = vname;
        if (fgTokenText && !textMatchesVarName(fgTokenText, vname)) {
          issues.push({ severity: 'error', msg: 'sample-link[' + i + '] bound to "' + vname + '" but text says "' + fgTokenText + '"', path });
        }
      }
    }
    if (sampleLinks.length === 0) {
      issues.push({ severity: 'warning', msg: 'No sample-link text nodes in previewArea', path });
    }

    // Check colorDot fill bindings
    const fgDot = findByName(fgRow, 'colorDot');
    const bgDot = findByName(bgRow, 'colorDot');

    if (fgDot) {
      const fgDotBound = fgDot.boundVariables?.fills?.[0]?.id;
      if (!fgDotBound) {
        issues.push({ severity: 'error', msg: 'fg colorDot fill not bound', path });
      } else if (sampleLinks[0]?.boundVariables?.fills?.[0]?.id && fgDotBound !== sampleLinks[0].boundVariables.fills[0].id) {
        issues.push({ severity: 'error', msg: 'fg colorDot bound to different variable than sample-link', path });
      }
    }

    if (bgDot) {
      const bgDotBound = bgDot.boundVariables?.fills?.[0]?.id;
      if (!bgDotBound) {
        issues.push({ severity: 'error', msg: 'bg colorDot fill not bound', path });
      } else if (paBoundVar && bgDotBound !== paBoundVar) {
        issues.push({ severity: 'error', msg: 'bg colorDot bound to different variable than previewArea', path });
      }
    }

    // ── Contrast ratio validation ──
    // Resolve actual colors from bound variables
    const fgBoundId = sampleLinks[0]?.boundVariables?.fills?.[0]?.id;
    const bgBoundId = paBoundVar;

    let computedRatio = null;
    if (fgBoundId && bgBoundId) {
      const fgRgb = await resolveColor(fgBoundId);
      const bgRgb = await resolveColor(bgBoundId);
      if (fgRgb && bgRgb) {
        const fgLum = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
        const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
        computedRatio = contrastRatio(fgLum, bgLum);
      }
    }

    // Read displayed ratio
    const ratioSection = findByName(wcagFrame, 'ratioSection');
    const ratioBox = findChild(ratioSection, 'ratio-box');
    const ratioDisplay = findChild(ratioBox, 'ratio-display');
    const ratioValueNode = findByName(ratioDisplay, 'ratio-value');
    const displayedRatioText = ratioValueNode?.characters?.trim() || '';
    // Parse "17.4 : 1" format → 17.4
    const displayedRatio = parseFloat((displayedRatioText.split(':')[0] || '').trim());

    if (!displayedRatioText) {
      issues.push({ severity: 'error', msg: 'Empty ratio-value text', path });
    } else if (computedRatio !== null) {
      // Allow tolerance of 0.15 for rounding differences
      const diff = Math.abs(computedRatio - displayedRatio);
      if (diff > 0.15) {
        issues.push({
          severity: 'error',
          msg: 'Ratio mismatch: displayed ' + displayedRatioText +
               ' vs computed ' + computedRatio.toFixed(1) + ' : 1 (diff: ' + diff.toFixed(2) + ')',
          path
        });
      }
    }

    // ── Badge state validation ──
    const badgesCol = findByName(ratioSection, 'badges-column');
    const badgeRows = findChild(badgesCol, 'badge-rows');
    const normalRow = findChild(badgeRows, 'badges-normal-text');
    const largeRow = findChild(badgeRows, 'badges-large-text');

    const ratio = computedRatio !== null ? computedRatio : displayedRatio;
    if (ratio && !isNaN(ratio)) {
      // Expected states
      const expected = {
        normalAA: ratio >= 4.5 ? 'resolved' : 'critical',
        normalAAA: ratio >= 7 ? 'resolved' : 'critical',
        largeAA: ratio >= 3 ? 'resolved' : 'critical',
        largeAAA: ratio >= 4.5 ? 'resolved' : 'critical'
      };

      // Read actual badge states
      const normalAA = findChild(normalRow, 'badge-AA');
      const normalAAA = findChild(normalRow, 'badge-AAA');
      const largeAA = findChild(largeRow, 'badge-AA');
      const largeAAA = findChild(largeRow, 'badge-AAA');

      function checkBadge(badge, label, expectedState) {
        if (!badge || badge.type !== 'INSTANCE') {
          issues.push({ severity: 'error', msg: label + ' badge missing or not instance', path });
          return;
        }
        const actual = badge.componentProperties?.status?.value;
        if (actual !== expectedState) {
          issues.push({
            severity: 'error',
            msg: label + ' badge: expected ' + expectedState + ' but got ' + actual +
                 ' (ratio=' + (typeof ratio === 'number' ? ratio.toFixed(1) : ratio) + ')',
            path
          });
        }
      }

      checkBadge(normalAA, 'normal AA', expected.normalAA);
      checkBadge(normalAAA, 'normal AAA', expected.normalAAA);
      checkBadge(largeAA, 'large AA', expected.largeAA);
      checkBadge(largeAAA, 'large AAA', expected.largeAAA);
    }

    return issues;
  }

  // ── Category Traversal ──────────────────────────────────────────

  function collectSwatchInstances(node) {
    const result = [];
    if (node.type === 'INSTANCE') {
      const hasPreview = node.children?.find(c => c.name === 'previewArea');
      const hasMeta = node.children?.find(c => c.name === 'metaArea');
      if (hasPreview && hasMeta) {
        result.push(node);
        return result; // don't recurse into swatch instances
      }
    }
    if (node.children) {
      for (const c of node.children) {
        result.push(...collectSwatchInstances(c));
      }
    }
    return result;
  }

  // ── Main ────────────────────────────────────────────────────────

  const allErrors = [];
  const allWarnings = [];
  const stats = { total: 0, valid: 0, withErrors: 0, withWarnings: 0 };
  const perCategory = {};

  // Pre-warm caches
  await getAllVars();
  await buildNameIndex();

  for (const [catName, catId] of Object.entries(CATEGORY_IDS)) {
    const catNode = await figma.getNodeByIdAsync(catId);
    if (!catNode) {
      allErrors.push({ severity: 'error', msg: 'Category frame not found: ' + catName, path: catName });
      continue;
    }

    const swatches = collectSwatchInstances(catNode);
    const catStats = { count: swatches.length, errors: 0, warnings: 0 };

    for (const inst of swatches) {
      stats.total++;
      const issues = await validateSwatch(inst);
      const errors = issues.filter(i => i.severity === 'error');
      const warnings = issues.filter(i => i.severity === 'warning');

      if (errors.length > 0) {
        stats.withErrors++;
        catStats.errors += errors.length;
        for (const e of errors) allErrors.push({ ...e, category: catName });
      }
      if (warnings.length > 0) {
        stats.withWarnings++;
        catStats.warnings += warnings.length;
        for (const w of warnings) allWarnings.push({ ...w, category: catName });
      }
      if (errors.length === 0 && warnings.length === 0) {
        stats.valid++;
      }
    }

    perCategory[catName] = catStats;
  }

  const summary = stats.withErrors === 0
    ? '✅ All ' + stats.total + ' swatches valid'
    : '❌ ' + stats.withErrors + '/' + stats.total + ' swatches have errors (' + allErrors.length + ' total issues)';

  return {
    summary,
    stats,
    perCategory,
    errors: allErrors.slice(0, 50), // cap output to avoid overflow
    warnings: allWarnings.slice(0, 20),
    errorCount: allErrors.length,
    warningCount: allWarnings.length
  };
})()
