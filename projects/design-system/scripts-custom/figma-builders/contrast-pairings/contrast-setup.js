/**
 * Phase 1 — Contrast Pairings Setup
 *
 * Installs `globalThis.__CP` with builder functions for the
 * "🎨 Colors – Contrast Pairings" page in Figma.
 *
 * Called once per session. Phase 2 scripts use __CP.buildCategory().
 */
(async () => {

  // ══════════════════════════════════════════════════════════════════
  // SPEC — IDs and layout constants for the contrast pairings page
  // ══════════════════════════════════════════════════════════════════

  const SPEC = {
    file: {
      key: '51tJjbxBSBmjAmKjQmhsz3',
      name: 'DesignSystem-Tokens-V9.6'
    },
    page: {
      id: '9559:21413',
      name: '🎨  Colors – Contrast Pairings'
    },
    section: {
      id: '9564:1006818',
      name: 'Contrast Pairings — S3 Semantic Colors'
    },
    colorCategoriesFrame: '9564:1005836',

    components: {
      contrastSwatch: '9564:773985',
      sectionBar: '9544:35238',
      groupHeader: '9544:35265',
      badgeComponentSet: '9117:25535',
      badgeResolved: '9117:25540',
      badgeCritical: '9117:25544',
      iconCheckmark: '47:1127',
      iconXmark: '47:679'
    },

    categories: {
      neutral: '9561:410202',
      interaction: '9561:410210',
      status: '9561:410218'
    },

    statusColumnsFrame: '9564:1056948',
    statusColumns: {
      column1: '9564:1057909',
      column2: '9564:1057910',
      column3: '9564:1057911',
      column4: '9564:1057912'
    },

    layout: {
      categorySpacing: 64,
      rowSpacing: 24,
      groupSpacing: 16,
      statusGroupSpacing: 32,
      statusColumnSpacing: 32,
      categoryItemSpacing: 32,
      statusCategoryItemSpacing: 48,
      swatchWidth: 500,
      swatchHeight: 797
    },

    sectionBarTexts: {
      neutral: {
        tierLetter: 'Neutral',
        sectionTitle: 'Contrast Pairings',
        purpose: 'Purpose: Validates WCAG contrast for neutral foreground/background color pairings.',
        guideline: 'Guideline: 25 swatches organized by contrast level (highest, high, medium, low, lowest).',
        breadcrumb: 'ob.s3.color.neutral.fg × ob.s3.color.neutral.bg'
      },
      interaction: {
        tierLetter: 'Interaction',
        sectionTitle: 'Contrast Pairings',
        purpose: 'Purpose: Validates WCAG contrast for interactive element color pairings.',
        guideline: 'Guideline: 7 swatches covering interaction states (default, hover, active, visited, disabled, focus)',
        breadcrumb: 'ob.s3.color.interaction fg × bg combinations'
      },
      status: {
        tierLetter: 'Status',
        sectionTitle: 'Contrast Pairings',
        purpose: 'Purpose: Validates WCAG contrast for all 12 status category color pairings.',
        guideline: 'Guideline: 96 swatches across 12 status types, each with status-fg and neutral-fg variants.',
        breadcrumb: 'ob.s3.color.status × ob.s3.color.neutral.fg'
      }
    },

    sectionBarColors: {
      neutral: { r: 226 / 255, g: 232 / 255, b: 240 / 255 },
      interaction: { r: 191 / 255, g: 219 / 255, b: 254 / 255 },
      status: { r: 254 / 255, g: 243 / 255, b: 199 / 255 }
    },

    miniBadge: {
      resolvedBg: 'VariableID:6313:5028',
      resolvedFg: 'VariableID:6313:5025',
      criticalBg: 'VariableID:6313:5076',
      criticalFg: 'VariableID:6313:5073'
    },

    statusOrder: [
      'info', 'critical', 'resolved', 'attention',
      'closed', 'disabled', 'fatal', 'pending',
      'confirmed', 'progress', 'scheduled', 'waiting'
    ],

    statusColumnLayout: [
      ['info', 'critical', 'resolved'],
      ['attention', 'closed', 'disabled'],
      ['fatal', 'pending', 'confirmed'],
      ['progress', 'scheduled', 'waiting']
    ],

    // Contrast levels per category
    neutralContrastLevels: ['highest', 'high', 'medium', 'low', 'lowest'],
    neutralBgLevels: ['highest', 'high', 'medium', 'low', 'lowest'],
    statusBgLevels: ['highest', 'high', 'medium', 'low'],
    statusFgLevels: ['highest', 'high', 'medium', 'low']
  };

  // ══════════════════════════════════════════════════════════════════
  // Font Loading
  // ══════════════════════════════════════════════════════════════════

  const FONTS = [
    { family: 'Noto Sans', style: 'ExtraBold' },
    { family: 'Noto Sans', style: 'Bold' },
    { family: 'Noto Sans', style: 'SemiBold' },
    { family: 'Noto Sans', style: 'Medium' },
    { family: 'Noto Sans', style: 'Regular' },
    { family: 'Noto Sans', style: 'Light' },
    { family: 'Inter', style: 'Regular' },
    { family: 'Inter', style: 'Medium' },
  ];

  const fontResults = await Promise.all(
    FONTS.map(f => figma.loadFontAsync(f)
      .then(() => f.family + ' ' + f.style + ' OK')
      .catch(e => f.family + ' ' + f.style + ' FAIL: ' + e.message)
    )
  );

  // ══════════════════════════════════════════════════════════════════
  // Helpers
  // ══════════════════════════════════════════════════════════════════

  function findChild(node, name) {
    if (!node || !node.children) return null;
    return node.children.find(c => c.name === name) || null;
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

  // ══════════════════════════════════════════════════════════════════
  // Variable Cache
  // ══════════════════════════════════════════════════════════════════

  let variableCache = null;
  async function getAllVariables() {
    if (!variableCache) {
      variableCache = await figma.variables.getLocalVariablesAsync('COLOR');
    }
    return variableCache;
  }

  async function findVariableByTokenPath(tokenPath) {
    const vars = await getAllVariables();
    const slashPath = tokenPath.replace(/\./g, '/');
    return vars.find(v => v.name === tokenPath || v.name === slashPath) || null;
  }

  async function findVariableById(varId) {
    return await figma.variables.getVariableByIdAsync(varId);
  }

  // ══════════════════════════════════════════════════════════════════
  // Text
  // ══════════════════════════════════════════════════════════════════

  async function setText(textNode, content) {
    if (!textNode || textNode.type !== 'TEXT') return false;
    textNode.characters = String(content);
    return true;
  }

  // ══════════════════════════════════════════════════════════════════
  // Variable Binding
  // ══════════════════════════════════════════════════════════════════

  async function bindFill(node, variableId) {
    if (!node) return false;
    const variable = await findVariableById(variableId);
    if (!variable) return false;
    const currentPaint = (node.fills && node.fills[0]) || figma.util.solidPaint('#808080');
    const boundPaint = figma.variables.setBoundVariableForPaint(currentPaint, 'color', variable);
    node.fills = [boundPaint];
    return true;
  }

  async function bindFillByPath(node, tokenPath) {
    if (!node) return false;
    const variable = await findVariableByTokenPath(tokenPath);
    if (!variable) return false;
    const currentPaint = (node.fills && node.fills[0]) || figma.util.solidPaint('#808080');
    const boundPaint = figma.variables.setBoundVariableForPaint(currentPaint, 'color', variable);
    node.fills = [boundPaint];
    return true;
  }

  // ══════════════════════════════════════════════════════════════════
  // WCAG Contrast Calculation
  // ══════════════════════════════════════════════════════════════════

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

  function getWCAGResults(ratio) {
    return {
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
      aaLarge: ratio >= 3,
      aaaLarge: ratio >= 4.5
    };
  }

  function formatRatio(ratio) {
    // Round to 1 decimal for clean values, 2 decimals otherwise
    const rounded = Math.round(ratio * 100) / 100;
    const str = rounded % 1 === 0 ? rounded.toFixed(1) : String(rounded);
    return str + ' : 1';
  }

  // Resolve a variable to its RGB value in light mode
  async function resolveVariableColor(varId) {
    const variable = await findVariableById(varId);
    if (!variable) return null;
    const modeIds = Object.keys(variable.valuesByMode);
    if (modeIds.length === 0) return null;
    // Use first mode (typically light) 
    const value = variable.valuesByMode[modeIds[0]];
    if (value && typeof value.r === 'number') {
      return { r: value.r, g: value.g, b: value.b };
    }
    // If it's an alias, resolve it
    if (value && value.type === 'VARIABLE_ALIAS') {
      return await resolveVariableColor(value.id);
    }
    return null;
  }

  // ══════════════════════════════════════════════════════════════════
  // Content Determination Logic
  // ══════════════════════════════════════════════════════════════════

  function determineContent(ratio, fgToken, bgToken) {
    const wcag = getWCAGResults(ratio);

    let cs, cmps;

    if (wcag.aaa) {
      // AAA normal text — all sizes all weights
      cs = 'Content: H1–H6, body, lead, strong';
      cmps = 'Component: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, all weights';
    } else if (wcag.aa) {
      // AA normal text — all sizes all weights
      cs = 'Content: H1–H6, body, lead, strong';
      cmps = 'Component: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, all weights';
    } else if (wcag.aaLarge) {
      // Only passes large text AA (3:1 ≤ ratio < 4.5)
      cs = 'Content: H1–H4, bold body, lead';
      cmps = 'Component: lg, xl, 2xl, 3xl, 4xl (bold below xl)';
    } else if (ratio >= 2.5) {
      // Below AA large but still above decorative threshold
      cs = 'Decorative only, no semantic content';
      cmps = '';
    } else {
      cs = 'decorative only';
      cmps = 'n/A';
    }

    return { cs, cmps };
  }

  function determineEmph(fgToken, bgToken) {
    // Check emphasis_low rule: interaction elements on saturated status backgrounds
    if (fgToken === 'ob.h.link.color.default') {
      if (bgToken.includes('status.') &&
          (bgToken.includes('contrast_high.') ||
           bgToken.includes('contrast_medium.') ||
           bgToken.includes('contrast_low.')) &&
          !bgToken.includes('contrast_highest.')) {
        return 'emphasis_low required on saturated status bg';
      }
    }
    return null;
  }

  // ══════════════════════════════════════════════════════════════════
  // Swatch Builder — creates and populates a _ContrastSwatch instance
  // ══════════════════════════════════════════════════════════════════

  async function buildSwatch(swatchData) {
    const comp = await figma.getNodeByIdAsync(SPEC.components.contrastSwatch);
    const instance = comp.createInstance();

    // -- Preview Area --
    const previewArea = findChild(instance, 'previewArea');
    if (previewArea && swatchData.bv) {
      await bindFill(previewArea, swatchData.bv);
    }

    // Bind fg color to all sample text nodes in previewArea
    const sampleTexts = findAllByType(previewArea, 'TEXT').filter(t => t.name === 'sample-link');
    for (const st of sampleTexts) {
      if (swatchData.fv) {
        await bindFill(st, swatchData.fv);
      }
    }

    // -- Meta Area --
    const metaArea = findChild(instance, 'metaArea');
    const metaContent = findChild(metaArea, 'meta-content');

    // Paired colors
    const pairedColors = findChild(metaContent, 'paired-colors');
    const fgRow = findChild(pairedColors, 'fgRow');
    const bgRow = findChild(pairedColors, 'bgRow');

    // fg-value text
    const fgValue = findByName(fgRow, 'fg-value');
    if (fgValue) await setText(fgValue, swatchData.fg);

    // bg-value text
    const bgValue = findByName(bgRow, 'bg-value');
    if (bgValue) await setText(bgValue, swatchData.bg);

    // Color dots - bind to variables
    const fgDot = findByName(fgRow, 'colorDot');
    const bgDot = findByName(bgRow, 'colorDot');
    if (fgDot && swatchData.fv) await bindFill(fgDot, swatchData.fv);
    if (bgDot && swatchData.bv) await bindFill(bgDot, swatchData.bv);

    // WCAG section
    const wcagFrame = findChild(metaContent, 'WCAG');
    const ratioSection = findChild(wcagFrame, 'ratioSection');

    // Ratio value
    const ratioBox = findChild(ratioSection, 'ratio-box');
    const ratioDisplay = findChild(ratioBox, 'ratio-display');
    const ratioValue = findByName(ratioDisplay, 'ratio-value');
    if (ratioValue) await setText(ratioValue, swatchData.r);

    // Badges — set pass/fail state
    const badgesCol = findChild(ratioSection, 'badges-column');
    const badgeRows = findChild(badgesCol, 'badge-rows');
    const normalRow = findChild(badgeRows, 'badges-normal-text');
    const largeRow = findChild(badgeRows, 'badges-large-text');

    await setBadgeState(normalRow, 'badge-AA', swatchData.aa);
    await setBadgeState(normalRow, 'badge-AAA', swatchData.aaa);
    // Large text: AA ≥ 3:1, AAA ≥ 4.5:1
    const ratio = parseFloat(swatchData.r);
    await setBadgeState(largeRow, 'badge-AA', ratio >= 3);
    await setBadgeState(largeRow, 'badge-AAA', ratio >= 4.5);

    // Recommended for / Not recommended for sections
    const recFor = findChild(metaContent, 'Recommended for');
    const notRecFor = findChild(metaContent, 'Not recommended for');

    // Determine content and component recommendations
    const { recommended, notRecommended } = splitRecommendations(swatchData);

    // Set Recommended for
    if (recFor) {
      const contentRow = findChild(recFor, 'content-row');
      const compRow = findChild(recFor, 'component-row');
      const contentVal = findByName(contentRow, 'content-value');
      const compVal = findByName(compRow, 'component-value');
      if (contentVal) await setText(contentVal, recommended.cs);
      if (compVal) await setText(compVal, recommended.cmps);

      // Mini-badge (checkmark/resolved)
      const headingRow = findChild(recFor, 'heading-row');
      const miniBadge = findChild(headingRow, 'mini-badge');
      if (miniBadge) {
        await setMiniBadgeStyle(miniBadge, 'resolved');
      }
    }

    // Set Not recommended for
    if (notRecFor) {
      const contentRow = findChild(notRecFor, 'content-row');
      const compRow = findChild(notRecFor, 'component-row');
      const contentVal = findByName(contentRow, 'content-value');
      const compVal = findByName(compRow, 'component-value');
      if (contentVal) {
        let notRecText = notRecommended.cs;
        if (swatchData.emph) {
          notRecText += ' | \u26A0 emphasis_low required';
        }
        await setText(contentVal, notRecText);
      }
      if (compVal) await setText(compVal, notRecommended.cmps);

      // Mini-badge (xmark/critical)
      const headingRow = findChild(notRecFor, 'heading-row');
      const miniBadge = findChild(headingRow, 'mini-badge');
      if (miniBadge) {
        await setMiniBadgeStyle(miniBadge, 'critical');
      }
    }

    return instance;
  }

  function splitRecommendations(swatchData) {
    const ratio = parseFloat(swatchData.r);
    const wcag = getWCAGResults(ratio);

    let recommended = { cs: '', cmps: '' };
    let notRecommended = { cs: 'n/A', cmps: '' };

    if (wcag.aaa) {
      recommended.cs = 'H1–H6, body, lead, strong, link';
      recommended.cmps = 'md, lg, xl, 2xl, 3xl, 4xl, all weights';
      notRecommended.cs = 'n/A';
      notRecommended.cmps = 'xs, sm';
    } else if (wcag.aa) {
      recommended.cs = 'H1–H6, body, lead, strong';
      recommended.cmps = 'xs, sm, md, lg, xl, 2xl, 3xl, 4xl, all weights';
      notRecommended.cs = 'n/A';
      notRecommended.cmps = 'xs, sm';
    } else if (wcag.aaLarge) {
      recommended.cs = 'H1–H4, bold body, lead';
      recommended.cmps = 'lg, xl, 2xl, 3xl, 4xl (bold below xl)';
      notRecommended.cs = 'body, small, caption';
      notRecommended.cmps = 'xs, sm, md';
    } else {
      recommended.cs = 'decorative only';
      recommended.cmps = 'n/A';
      notRecommended.cs = 'all semantic content';
      notRecommended.cmps = 'all sizes';
    }

    return { recommended, notRecommended };
  }

  async function setBadgeState(row, badgeName, pass) {
    if (!row) return;
    const badge = findChild(row, badgeName);
    if (!badge || badge.type !== 'INSTANCE') return;

    const targetVariant = pass ? 'status=resolved' : 'status=critical';
    const componentSet = await figma.getNodeByIdAsync(SPEC.components.badgeComponentSet);
    if (!componentSet || !componentSet.children) return;
    const targetComp = componentSet.children.find(c => c.name === targetVariant);
    if (targetComp) {
      await badge.swapComponent(targetComp);
    }
  }

  async function setMiniBadgeStyle(miniBadge, style) {
    if (!miniBadge) return;
    // mini-badge is a 20×20 circle frame with an icon instance inside
    // style: 'resolved' (green + checkmark) or 'critical' (red + xmark)
    const varIds = style === 'resolved'
      ? { bg: SPEC.miniBadge.resolvedBg, fg: SPEC.miniBadge.resolvedFg }
      : { bg: SPEC.miniBadge.criticalBg, fg: SPEC.miniBadge.criticalFg };

    await bindFill(miniBadge, varIds.bg);

    // Swap icon
    const iconInst = miniBadge.children?.find(c => c.type === 'INSTANCE');
    if (iconInst) {
      const iconId = style === 'resolved' ? SPEC.components.iconCheckmark : SPEC.components.iconXmark;
      const iconComp = await figma.getNodeByIdAsync(iconId);
      if (iconComp) {
        await iconInst.swapComponent(iconComp);
        // Bind icon fill color
        const vector = findByType(iconInst, 'VECTOR');
        if (vector) {
          await bindFill(vector, varIds.fg);
        }
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Section Bar Builder
  // ══════════════════════════════════════════════════════════════════

  async function buildSectionBar(categoryName) {
    const comp = await figma.getNodeByIdAsync(SPEC.components.sectionBar);
    const instance = comp.createInstance();

    const texts = SPEC.sectionBarTexts[categoryName];
    if (texts) {
      const tierLetter = findByName(instance, 'tierLetter');
      const sectionTitle = findByName(instance, '__sectionTitle');
      const purpose = findByName(instance, 'purpose');
      const guideline = findByName(instance, 'guideline');
      const breadcrumb = findByName(instance, 'sectionBreadcrumb');

      if (tierLetter) await setText(tierLetter, texts.tierLetter);
      if (sectionTitle) await setText(sectionTitle, texts.sectionTitle);
      if (purpose) await setText(purpose, texts.purpose);
      if (guideline) await setText(guideline, texts.guideline);
      if (breadcrumb) await setText(breadcrumb, texts.breadcrumb);
    }

    // Set color bar
    const colorBar = findChild(instance, 'Color Bar');
    if (colorBar) {
      const color = SPEC.sectionBarColors[categoryName];
      if (color) {
        colorBar.fills = [{ type: 'SOLID', color, opacity: 1 }];
      }
    }

    return instance;
  }

  // ══════════════════════════════════════════════════════════════════
  // Group Header Builder
  // ══════════════════════════════════════════════════════════════════

  async function buildGroupHeader(title, description) {
    const comp = await figma.getNodeByIdAsync(SPEC.components.groupHeader);
    const instance = comp.createInstance();

    const titleNode = findByName(instance, 'groupTitle');
    const descNode = findByName(instance, 'groupDescription');
    if (titleNode) await setText(titleNode, title);
    if (descNode) await setText(descNode, description);

    return instance;
  }

  // ══════════════════════════════════════════════════════════════════
  // Category Builders
  // ══════════════════════════════════════════════════════════════════

  /**
   * Build the Neutral category.
   * Structure: Section Bar → 5 fg-level rows (each with 5 bg-level swatches) → text link header → text link row
   */
  async function buildNeutral(data) {
    const categoryFrame = await figma.getNodeByIdAsync(SPEC.categories.neutral);
    if (!categoryFrame) return { error: 'Neutral category frame not found' };

    // Clear existing children
    const existing = [...categoryFrame.children];
    for (const child of existing) child.remove();

    // Section Bar
    const sBar = await buildSectionBar('neutral');
    categoryFrame.appendChild(sBar);
    sBar.layoutSizingHorizontal = 'FILL';

    let swatchCount = 0;
    let bindCount = 0;

    // Build contrast-level rows
    for (const fgLevel of SPEC.neutralContrastLevels) {
      const rowFrame = figma.createFrame();
      rowFrame.name = 'Row: fg contrast_' + fgLevel;
      rowFrame.layoutMode = 'HORIZONTAL';
      rowFrame.itemSpacing = SPEC.layout.rowSpacing;
      rowFrame.fills = [];
      rowFrame.primaryAxisSizingMode = 'AUTO';
      rowFrame.counterAxisSizingMode = 'AUTO';
      categoryFrame.appendChild(rowFrame);

      for (const bgLevel of SPEC.neutralBgLevels) {
        const swatchData = data.find(d =>
          d.fg.includes('neutral.fg.contrast_' + fgLevel) &&
          d.bg.includes('neutral.bg.contrast_' + bgLevel) &&
          !d.fg.startsWith('ob.h.')
        );
        if (swatchData) {
          const swatch = await buildSwatch(swatchData);
          swatch.name = 'fg:' + fgLevel + ' × bg:' + bgLevel;
          rowFrame.appendChild(swatch);
          swatchCount++;
          bindCount += 2; // fg + bg
        }
      }
    }

    // Text link section
    const textLinkSwatches = data.filter(d =>
      d.bg.includes('neutral.bg.') && d.fg === 'ob.h.link.color.default'
    );

    if (textLinkSwatches.length > 0) {
      const headerInst = await buildGroupHeader(
        'Neutral – with text link',
        'ob.h.link.color.default × ob.s3.color.neutral bg'
      );
      categoryFrame.appendChild(headerInst);

      const linkRow = figma.createFrame();
      linkRow.name = 'Row: text link';
      linkRow.layoutMode = 'HORIZONTAL';
      linkRow.itemSpacing = SPEC.layout.rowSpacing;
      linkRow.fills = [];
      linkRow.primaryAxisSizingMode = 'AUTO';
      linkRow.counterAxisSizingMode = 'AUTO';
      categoryFrame.appendChild(linkRow);

      for (const bgLevel of SPEC.neutralBgLevels) {
        const sd = textLinkSwatches.find(d => d.bg.includes('contrast_' + bgLevel));
        if (sd) {
          const swatch = await buildSwatch(sd);
          swatch.name = 'link × bg:' + bgLevel;
          linkRow.appendChild(swatch);
          swatchCount++;
          bindCount += 2;
        }
      }
    }

    return { category: 'neutral', swatchCount, bindCount };
  }

  /**
   * Build the Interaction category.
   * Structure: Section Bar → Interaction States row (7 swatches) → text link header → text link row
   */
  async function buildInteraction(data) {
    const categoryFrame = await figma.getNodeByIdAsync(SPEC.categories.interaction);
    if (!categoryFrame) return { error: 'Interaction category frame not found' };

    const existing = [...categoryFrame.children];
    for (const child of existing) child.remove();

    // Section Bar
    const sBar = await buildSectionBar('interaction');
    categoryFrame.appendChild(sBar);
    sBar.layoutSizingHorizontal = 'FILL';

    let swatchCount = 0;
    let bindCount = 0;

    // Interaction states row
    const interactionSwatches = data.filter(d =>
      d.bg.includes('interaction.') && !d.fg.startsWith('ob.h.')
    );

    if (interactionSwatches.length > 0) {
      const statesRow = figma.createFrame();
      statesRow.name = 'Row: Interaction States';
      statesRow.layoutMode = 'HORIZONTAL';
      statesRow.itemSpacing = SPEC.layout.rowSpacing;
      statesRow.fills = [];
      statesRow.primaryAxisSizingMode = 'AUTO';
      statesRow.counterAxisSizingMode = 'AUTO';
      categoryFrame.appendChild(statesRow);

      for (const sd of interactionSwatches) {
        // Try to extract state name from fg/bg tokens
        const stateName = extractInteractionState(sd.fg, sd.bg);
        const swatch = await buildSwatch(sd);
        swatch.name = 'Swatch: ' + stateName;
        statesRow.appendChild(swatch);
        swatchCount++;
        bindCount += 2;
      }
    }

    // Text link section
    const textLinkSwatches = data.filter(d =>
      d.bg.includes('interaction.') && d.fg === 'ob.h.link.color.default'
    );

    if (textLinkSwatches.length > 0) {
      const headerInst = await buildGroupHeader(
        'Interaction – with text link',
        'ob.h.link.color.default × ob.s3.color.interaction bg'
      );
      categoryFrame.appendChild(headerInst);

      const linkRow = figma.createFrame();
      linkRow.name = 'Row: text link';
      linkRow.layoutMode = 'HORIZONTAL';
      linkRow.itemSpacing = SPEC.layout.rowSpacing;
      linkRow.fills = [];
      linkRow.primaryAxisSizingMode = 'AUTO';
      linkRow.counterAxisSizingMode = 'AUTO';
      categoryFrame.appendChild(linkRow);

      for (const sd of textLinkSwatches) {
        const stateName = extractInteractionState(sd.fg, sd.bg);
        const swatch = await buildSwatch(sd);
        swatch.name = 'link × ' + stateName;
        linkRow.appendChild(swatch);
        swatchCount++;
        bindCount += 2;
      }
    }

    return { category: 'interaction', swatchCount, bindCount };
  }

  function extractInteractionState(fg, bg) {
    // Extract state from token paths like ob.s3.color.interaction.state.bg.enabled...
    const states = ['enabled', 'hover', 'focus', 'pressed', 'selected', 'disabled', 'visited'];
    const combined = fg + ' ' + bg;
    for (const s of states) {
      if (combined.includes('.' + s + '.') || combined.includes('.' + s + '_')) return s;
    }
    return 'unknown';
  }

  /**
   * Build the Status category.
   * Structure: Section Bar → Status Columns frame (4 cols × 3 groups each)
   * Each group: Header (in-hue fg) → 4 bg-level rows → Header (text link) → text link row
   */
  async function buildStatus(data) {
    const categoryFrame = await figma.getNodeByIdAsync(SPEC.categories.status);
    if (!categoryFrame) return { error: 'Status category frame not found' };

    const existing = [...categoryFrame.children];
    for (const child of existing) child.remove();

    // Section Bar
    const sBar = await buildSectionBar('status');
    categoryFrame.appendChild(sBar);
    sBar.layoutSizingHorizontal = 'FILL';

    // Status Columns frame
    const columnsFrame = figma.createFrame();
    columnsFrame.name = 'Status Columns';
    columnsFrame.layoutMode = 'HORIZONTAL';
    columnsFrame.itemSpacing = SPEC.layout.statusColumnSpacing;
    columnsFrame.fills = [];
    columnsFrame.primaryAxisSizingMode = 'AUTO';
    columnsFrame.counterAxisSizingMode = 'AUTO';
    categoryFrame.appendChild(columnsFrame);

    let swatchCount = 0;
    let bindCount = 0;

    for (let colIdx = 0; colIdx < SPEC.statusColumnLayout.length; colIdx++) {
      const column = figma.createFrame();
      column.name = 'Column ' + (colIdx + 1);
      column.layoutMode = 'VERTICAL';
      column.itemSpacing = SPEC.layout.statusGroupSpacing;
      column.fills = [];
      column.primaryAxisSizingMode = 'AUTO';
      column.counterAxisSizingMode = 'AUTO';
      columnsFrame.appendChild(column);

      for (const statusName of SPEC.statusColumnLayout[colIdx]) {
        const group = figma.createFrame();
        group.name = 'Group: ' + statusName;
        group.layoutMode = 'VERTICAL';
        group.itemSpacing = SPEC.layout.groupSpacing;
        group.fills = [];
        group.primaryAxisSizingMode = 'AUTO';
        group.counterAxisSizingMode = 'AUTO';
        column.appendChild(group);

        // In-Hue Foregrounds header
        const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
        const inHueHeader = await buildGroupHeader(
          capitalize(statusName) + ' – In-Hue Foregrounds',
          statusName + ' foreground × ' + statusName + ' background'
        );
        inHueHeader.name = 'Header: ' + capitalize(statusName) + ' (in-hue fg)';
        group.appendChild(inHueHeader);

        // Build rows for each bg level
        for (const bgLevel of SPEC.statusBgLevels) {
          const rowSwatches = data.filter(d =>
            d.bg.includes('status.' + statusName + '.bg.contrast_' + bgLevel) &&
            !d.fg.startsWith('ob.h.') &&
            d.fg.includes('status.' + statusName + '.')
          );

          // Sort by fg contrast level: highest, high, medium, low
          const sortOrder = { highest: 0, high: 1, medium: 2, low: 3 };
          rowSwatches.sort((a, b) => {
            const aLevel = extractContrastLevel(a.fg);
            const bLevel = extractContrastLevel(b.fg);
            return (sortOrder[aLevel] || 99) - (sortOrder[bLevel] || 99);
          });

          if (rowSwatches.length > 0) {
            const row = figma.createFrame();
            row.name = 'Row: ' + statusName + ' bg_' + bgLevel;
            row.layoutMode = 'HORIZONTAL';
            row.itemSpacing = SPEC.layout.rowSpacing;
            row.fills = [];
            row.primaryAxisSizingMode = 'AUTO';
            row.counterAxisSizingMode = 'AUTO';
            group.appendChild(row);

            for (const sd of rowSwatches) {
              const fgLevel = extractContrastLevel(sd.fg);
              const swatch = await buildSwatch(sd);
              swatch.name = 'fg:' + fgLevel + ' × bg:' + bgLevel;
              row.appendChild(swatch);
              swatchCount++;
              bindCount += 2;
            }
          }
        }

        // Text link header and row
        const textLinkSwatches = data.filter(d =>
          d.bg.includes('status.' + statusName + '.bg.') &&
          d.fg === 'ob.h.link.color.default'
        );

        if (textLinkSwatches.length > 0) {
          const linkHeader = await buildGroupHeader(
            capitalize(statusName) + ' – with text link',
            'ob.h.link.color.default × ' + statusName + ' background'
          );
          linkHeader.name = 'Header: ' + capitalize(statusName) + ' (text link)';
          group.appendChild(linkHeader);

          // Sort by bg contrast level
          const sortOrder = { highest: 0, high: 1, medium: 2, low: 3 };
          textLinkSwatches.sort((a, b) => {
            const aLevel = extractContrastLevel(a.bg);
            const bLevel = extractContrastLevel(b.bg);
            return (sortOrder[aLevel] || 99) - (sortOrder[bLevel] || 99);
          });

          const linkRow = figma.createFrame();
          linkRow.name = 'Row: text link × ' + statusName;
          linkRow.layoutMode = 'HORIZONTAL';
          linkRow.itemSpacing = SPEC.layout.rowSpacing;
          linkRow.fills = [];
          linkRow.primaryAxisSizingMode = 'AUTO';
          linkRow.counterAxisSizingMode = 'AUTO';
          group.appendChild(linkRow);

          for (const sd of textLinkSwatches) {
            const bgLevel = extractContrastLevel(sd.bg);
            const swatch = await buildSwatch(sd);
            swatch.name = 'link × bg:' + bgLevel;
            linkRow.appendChild(swatch);
            swatchCount++;
            bindCount += 2;
          }
        }
      }
    }

    return { category: 'status', swatchCount, bindCount };
  }

  function extractContrastLevel(tokenPath) {
    const match = tokenPath.match(/contrast_(\w+)/);
    return match ? match[1] : 'unknown';
  }

  // ══════════════════════════════════════════════════════════════════
  // Plugin Data Management
  // ══════════════════════════════════════════════════════════════════

  async function updatePluginData(swatchDataArray) {
    const section = await figma.getNodeByIdAsync(SPEC.section.id);
    if (!section) return false;
    section.setPluginData('swatchDataEnhanced', JSON.stringify(swatchDataArray));
    return true;
  }

  async function getPluginData() {
    const section = await figma.getNodeByIdAsync(SPEC.section.id);
    if (!section) return null;
    const raw = section.getPluginData('swatchDataEnhanced');
    return raw ? JSON.parse(raw) : null;
  }

  // ══════════════════════════════════════════════════════════════════
  // Main Build Entry Point
  // ══════════════════════════════════════════════════════════════════

  async function buildCategory(categoryName, data) {
    switch (categoryName) {
      case 'neutral': return await buildNeutral(data);
      case 'interaction': return await buildInteraction(data);
      case 'status': return await buildStatus(data);
      default: return { error: 'Unknown category: ' + categoryName };
    }
  }

  async function buildAll(data) {
    const results = {};

    // Split data by category
    const neutralData = data.filter(d =>
      (d.fg.includes('neutral.') || d.fg === 'ob.h.link.color.default') &&
      d.bg.includes('neutral.')
    );
    const interactionData = data.filter(d =>
      d.bg.includes('interaction.')
    );
    const statusData = data.filter(d =>
      d.bg.includes('status.')
    );

    results.neutral = await buildNeutral(neutralData);
    results.interaction = await buildInteraction(interactionData);
    results.status = await buildStatus(statusData);

    // Update pluginData with all swatch IDs
    await collectAndStorePluginData(data);

    return results;
  }

  async function collectAndStorePluginData(originalData) {
    // After building, traverse the section to find all swatch instances
    // and create pluginData entries for them
    const section = await figma.getNodeByIdAsync(SPEC.section.id);
    if (!section) return;

    const instances = [];
    function findInstances(node) {
      if (node.type === 'INSTANCE') {
        // Check if it's a _ContrastSwatch instance
        const hasPreview = node.children?.find(c => c.name === 'previewArea');
        const hasMeta = node.children?.find(c => c.name === 'metaArea');
        if (hasPreview && hasMeta) {
          instances.push(node);
        }
      }
      if (node.children) node.children.forEach(c => findInstances(c));
    }
    findInstances(section);

    // Match instances to original data by reading their fg/bg text values
    const pluginData = [];
    for (const inst of instances) {
      const metaArea = findChild(inst, 'metaArea');
      const metaContent = findChild(metaArea, 'meta-content');
      const pairedColors = findChild(metaContent, 'paired-colors');
      const fgRow = findChild(pairedColors, 'fgRow');
      const bgRow = findChild(pairedColors, 'bgRow');
      const fgValue = findByName(fgRow, 'fg-value');
      const bgValue = findByName(bgRow, 'bg-value');

      const fg = fgValue?.characters || '';
      const bg = bgValue?.characters || '';

      // Find matching original data
      const match = originalData.find(d => d.fg === fg && d.bg === bg);
      if (match) {
        pluginData.push({
          id: inst.id,
          fg: match.fg,
          bg: match.bg,
          r: match.r,
          cs: match.cs,
          cmps: match.cmps,
          aa: match.aa,
          aaa: match.aaa,
          fv: match.fv,
          bv: match.bv,
          emph: match.emph || undefined
        });
      }
    }

    await updatePluginData(pluginData);
    return pluginData.length;
  }

  // ══════════════════════════════════════════════════════════════════
  // Store on globalThis
  // ══════════════════════════════════════════════════════════════════

  globalThis.__CP = {
    buildCategory,
    buildAll,
    buildSwatch,
    buildSectionBar,
    buildGroupHeader,
    updatePluginData,
    getPluginData,
    collectAndStorePluginData,
    SPEC,
    fonts: fontResults
  };

  // Pre-warm variable cache
  await getAllVariables();

  return {
    installed: true,
    fonts: fontResults,
    varCount: (await getAllVariables()).length
  };
})()
