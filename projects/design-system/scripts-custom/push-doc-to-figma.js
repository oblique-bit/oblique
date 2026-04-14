#!/usr/bin/env node
/**
 * push-doc-to-figma.js
 *
 * Pushes doc/ JSON content (page_intro, recommended, not_recommended) to the
 * _Set Heading instances on a DRAFT copy of the "🎨 Colors – Maintainer" page.
 *
 * The original page (9544:41) is never touched. A new page
 * "🎨 Colors – Doc Review" is created automatically on the first run
 * (duplicated from the original). Subsequent runs reuse the draft page.
 *
 * Each _Set Heading's description text is updated to show all three fields:
 *   <page_intro>
 *
 *   Recommend: <recommended>
 *
 *   Avoid: <not_recommended>
 *
 * Usage:
 *   node scripts-custom/push-doc-to-figma.js           # push all entries
 *   node scripts-custom/push-doc-to-figma.js --dry     # inspect only, no writes
 *
 * Prerequisites:
 *   - Figma Desktop open with DesignSystem@Tokens V9.6 (51tJjbxBSBmjAmKjQmhsz3)
 *   - Desktop Bridge plugin running (Plugins → Development → Figma Desktop Bridge)
 *   - FIGMA_ACCESS_TOKEN env var set (or hardcoded below)
 */
'use strict';

const fs     = require('fs');
const path   = require('path');
const { spawn } = require('child_process');

// ─── Config ────────────────────────────────────────────────────────────────

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const TIMEOUT_MS  = 30000;
const CLONE_TIMEOUT_MS = 120000; // page clone can be slow

const ROOT    = path.join(__dirname, '..');
const DOC_DIR = path.join(ROOT, 'src/lib/themes/doc');

// Original page to duplicate (never modified)
const ORIGINAL_PAGE_ID = '9544:41';
// Name of the draft copy that will be created / reused
const DRAFT_PAGE_NAME  = '🎨 Colors – Doc Review';

// ─── Doc entry map ─────────────────────────────────────────────────────────
// Each entry maps a readable title (as it appears in the Figma _Set Heading)
// to the corresponding doc/ JSON file path.

const ENTRIES = [
  // S3 compiled families
  { titles: ['Brand'],              docRelPath: '03_semantic/color/brand.json' },
  { titles: ['Free'],               docRelPath: '03_semantic/color/free.json' },
  { titles: ['Interaction'],        docRelPath: '03_semantic/color/interaction.json' },
  { titles: ['Neutral'],            docRelPath: '03_semantic/color/neutral.json' },
  { titles: ['Status'],             docRelPath: '03_semantic/color/status.json' },
  { titles: ['Compiled'],           docRelPath: '03_semantic/color/compiled.json' },

  // S1 families (same readable titles as S3 but in a different section)
  // Titles may be prefixed with "S1" on the Figma page — both variants are handled
  { titles: ['S1 Free',   'Free'],       docRelPath: '03_semantic/color/s1_families/free.json' },
  { titles: ['S1 Interaction', 'Interaction'], docRelPath: '03_semantic/color/s1_families/interaction.json' },
  { titles: ['S1 Neutral', 'Neutral'],   docRelPath: '03_semantic/color/s1_families/neutral.json' },
  { titles: ['S1 Status', 'Status'],     docRelPath: '03_semantic/color/s1_families/status.json' },

  // S2 emphasis
  { titles: ['Interaction State', 'High', 'High Emphasis'],
    docRelPath: '03_semantic/color/s2_emphasis/interaction_state.json' },
  { titles: ['High Emphasis', 'Emphasis High'],
    docRelPath: '03_semantic/color/s2_emphasis/high.json' },
  { titles: ['Low Emphasis', 'Emphasis Low'],
    docRelPath: '03_semantic/color/s2_emphasis/low.json' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function readDoc(relPath) {
  const full = path.join(DOC_DIR, relPath);
  if (!fs.existsSync(full)) return null;
  const data = JSON.parse(fs.readFileSync(full, 'utf8'));
  return {
    token_path:         data?.doc?.token_path?.$value         ?? '',
    page_intro:        data?.doc?.page_intro?.$value        ?? '',
    recommended:       data?.doc?.recommended?.$value       ?? '',
    not_recommended:   data?.doc?.not_recommended?.$value   ?? '',
    semantic_assigned: data?.doc?.semantic_assigned?.$value ?? '',
  };
}

// Maps each doc JSON field to its canonical Figma layer name(s).
// First name is the current canonical; subsequent names are legacy fallbacks.
const FIELD_LAYER_MAP = {
  token_path:         ['__token_path',        '__page_title', '__setName'],
  page_intro:        ['__page_intro',       '__setDescription'],
  recommended:       ['__recommended'],
  not_recommended:   ['__not_recommended'],
  semantic_assigned: ['__semantic_assigned'],
};

// ─── Stdio MCP Client (figma-console-mcp) ─────────────────────────────────

class StdioMCPClient {
  constructor() {
    this.process = null;
    this.requestId = 0;
    this.pending = new Map();
    this.buffer = '';
    this.ready = false;
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.process = spawn('npx', ['-y', 'figma-console-mcp@latest'], {
        env: { ...process.env, FIGMA_ACCESS_TOKEN, ENABLE_MCP_APPS: 'true' },
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false,
      });

      let stderrBuf = '';
      this.process.stderr.on('data', (chunk) => {
        stderrBuf += chunk.toString();
        const lines = stderrBuf.split('\n').filter(Boolean);
        const last = lines[lines.length - 1] ?? '';
        if (/error/i.test(last)) process.stderr.write('  [mcp] ' + last + '\n');
      });

      this.process.stdout.on('data', (chunk) => {
        this.buffer += chunk.toString();
        this._processBuffer();
      });

      this.process.on('error', (err) => reject(new Error('Failed to start figma-console-mcp: ' + err.message)));
      this.process.on('exit', (code) => {
        if (!this.ready) reject(new Error('figma-console-mcp exited ' + code + '\n' + stderrBuf.slice(-500)));
        for (const [, p] of this.pending) { p.reject(new Error('Process exited')); clearTimeout(p.timer); }
        this.pending.clear();
      });

      setTimeout(async () => {
        try { await this._initialize(); this.ready = true; resolve(); }
        catch (err) { reject(err); }
      }, 2000);
    });
  }

  async _initialize() {
    await this._send('initialize', {
      protocolVersion: '2024-11-05', capabilities: {},
      clientInfo: { name: 'push-doc-to-figma', version: '1.0.0' },
    }, 15000);
    this._sendNotification('notifications/initialized');
  }

  async execute(code, timeout = TIMEOUT_MS) {
    const result = await this._send('tools/call', {
      name: 'figma_execute',
      arguments: { code, timeout },
    }, timeout + 5000);

    if (result?.content) {
      for (const item of result.content) {
        if (item.text) {
          try { return JSON.parse(item.text); } catch { return item.text; }
        }
      }
    }
    return result;
  }

  _send(method, params, timeout = TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Timeout after ${timeout}ms for ${method}`));
      }, timeout);
      this.pending.set(id, { resolve, reject, timer });
      this.process.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }

  _sendNotification(method, params) {
    this.process.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
  }

  _processBuffer() {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject, timer } = this.pending.get(msg.id);
          clearTimeout(timer); this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else resolve(msg.result);
        }
      } catch { /* non-JSON server log, ignore */ }
    }
  }

  stop() {
    if (this.process) { this.process.stdin.end(); this.process.kill('SIGTERM'); this.process = null; }
  }
}

// ─── Phase 0: page setup ──────────────────────────────────────────────────

const PAGE_SETUP_CODE = `
(async () => {
  const ORIGINAL_ID = '${ORIGINAL_PAGE_ID}';
  const DRAFT_NAME  = '${DRAFT_PAGE_NAME}';

  const existing = figma.root.children.find(p => p.name === DRAFT_NAME);
  if (existing) return { pageId: existing.id, pageName: existing.name, created: false };

  const origPage = figma.root.children.find(p => p.id === ORIGINAL_ID);
  if (!origPage) return { error: 'Original page not found: ' + ORIGINAL_ID };

  const draftPage = origPage.clone();
  draftPage.name = DRAFT_NAME;
  return { pageId: draftPage.id, pageName: draftPage.name, created: true };
})()
`;

// ─── Phase 1: inspect ──────────────────────────────────────────────────────

function buildInspectCode(pageId) {
  return `
(async () => {
  await figma.loadAllPagesAsync();
  const page = figma.root.children.find(p => p.id === '${pageId}');
  if (!page) return { error: 'Draft page not found: ${pageId}' };

  const results = [];

  function findSetHeadings(node) {
    if (node.type === 'INSTANCE') {
      const compName = node.mainComponent?.name ?? '';
      // Match _Set Heading, setHeading, or Set Heading components
      if (/set.?heading/i.test(compName) || /set heading/i.test(compName)) {
        const textNodes = node.findAll(n => n.type === 'TEXT');
        // Find title by canonical or legacy layer name
        const titleNode = textNodes.find(t => t.name === '__token_path' || t.name === '__page_title' || t.name === '__setName')
          ?? textNodes[0];
        const title = titleNode?.characters ?? '(no title)';
        // Build layer-name → node-ID map for all text nodes
        const textLayerMap = {};
        for (const t of textNodes) textLayerMap[t.name] = t.id;
        results.push({
          id:           node.id,
          compName,
          title,
          textLayerMap,
        });
      }
    }
    if ('children' in node) {
      for (const c of node.children) findSetHeadings(c);
    }
  }

  findSetHeadings(page);
  return { count: results.length, entries: results };
})()
`;
}

// ─── Phase 2: update ───────────────────────────────────────────────────────

function buildUpdateCode(updates) {
  // updates: Array<{ nodeId, title, fields: { [fieldName]: string }, textLayerMap: { [layerName]: nodeId } }>
  return `
(async () => {
  const updates = ${JSON.stringify(updates)};
  const FIELD_LAYER_MAP = ${JSON.stringify(FIELD_LAYER_MAP)};
  const log = [];

  for (const u of updates) {
    const instance = await figma.getNodeByIdAsync(u.nodeId);
    if (!instance) { log.push({ id: u.nodeId, status: 'not found' }); continue; }

    const allText = instance.findAll(n => n.type === 'TEXT');

    for (const [fieldName, content] of Object.entries(u.fields)) {
      const candidateNames = FIELD_LAYER_MAP[fieldName] ?? [];
      let textNode = null;

      // Resolve: try each candidate layer name (canonical first, then legacy fallbacks)
      for (const layerName of candidateNames) {
        const nodeId = u.textLayerMap[layerName];
        if (nodeId) {
          textNode = await figma.getNodeByIdAsync(nodeId);
          if (textNode) break;
        }
        textNode = allText.find(t => t.name === layerName) ?? null;
        if (textNode) break;
      }

      if (!textNode || textNode.type !== 'TEXT') {
        log.push({ id: u.nodeId, title: u.title, field: fieldName, status: 'layer not found' });
        continue;
      }

      try {
        await figma.loadFontAsync(textNode.fontName);
        textNode.characters = content;
        log.push({ id: u.nodeId, title: u.title, field: fieldName, status: 'updated', chars: content.length });
      } catch (e) {
        log.push({ id: u.nodeId, title: u.title, field: fieldName, status: 'error: ' + e.message });
      }
    }
  }

  return { updated: log.filter(l => l.status === 'updated').length, log };
})()
`;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const args   = process.argv.slice(2);
  const dryRun = args.includes('--dry');

  // Load doc content
  const docMap = {};
  for (const entry of ENTRIES) {
    const doc = readDoc(entry.docRelPath);
    if (!doc) { console.warn(`  WARN  doc file not found: ${entry.docRelPath}`); continue; }
    docMap[entry.docRelPath] = { ...entry, doc };
  }

  console.log(`\n  Loaded ${Object.keys(docMap).length} doc entries`);
  if (dryRun) console.log('  DRY RUN — no Figma writes will happen\n');

  // Connect to Figma MCP
  console.log('  Connecting to Figma MCP server (figma-console-mcp via stdio)...');
  const client = new StdioMCPClient();
  try {
    await client.start();
  } catch (err) {
    console.error('\n  ERROR: Cannot connect to MCP server.');
    console.error('  Make sure Figma Desktop is open and the Desktop Bridge plugin is running.');
    console.error('  Details:', err.message);
    process.exit(1);
  }
  console.log('  Connected\n');

  // Phase 0: duplicate original page → draft (if needed)
  console.log('  Phase 0: preparing draft page...');
  const setup = await client.execute(PAGE_SETUP_CODE, CLONE_TIMEOUT_MS);
  if (!setup || setup.error) {
    console.error('  ERROR during page setup:', setup?.error ?? 'no result');
    process.exit(1);
  }
  console.log(`  ${setup.created ? 'Created' : 'Found existing'} draft page: "${setup.pageName}" (${setup.pageId})\n`);

  // Phase 1: discover _Set Heading instances on the draft page
  console.log('  Phase 1: scanning draft page for _Set Heading instances...');
  const inspection = await client.execute(buildInspectCode(setup.pageId));
  if (!inspection || inspection.error) {
    console.error('  ERROR during inspection:', inspection?.error ?? 'no result');
    process.exit(1);
  }

  const { count, entries: figmaEntries } = inspection;
  console.log(`  Found ${count} _Set Heading instance(s)\n`);

  if (count === 0) {
    console.log('  Nothing to update. Verify the component name filter in INSPECT_CODE if this is unexpected.');
    process.exit(0);
  }

  // Phase 2: match Figma headings to doc entries
  const updates = [];
  const unmatched = [];

  for (const fe of figmaEntries) {
    const titleClean = fe.title.trim();

    // Try to match this Figma heading to a doc entry
    let matched = null;
    for (const entry of Object.values(docMap)) {
      if (entry.titles.some(t => t.toLowerCase() === titleClean.toLowerCase())) {
        matched = entry;
        break;
      }
    }

    if (!matched) {
      unmatched.push(titleClean);
      continue;
    }

    const fields = {};
    for (const fieldName of Object.keys(FIELD_LAYER_MAP)) {
      const val = matched.doc[fieldName] ?? '';
      if (val) fields[fieldName] = val;
    }

    if (Object.keys(fields).length === 0) {
      console.log(`  SKIP  "${titleClean}" — doc content is empty`);
      continue;
    }

    updates.push({
      nodeId:       fe.id,
      title:        titleClean,
      fields,
      textLayerMap: fe.textLayerMap,
      docFile:      matched.docRelPath,
    });

    console.log(`  MATCH "${titleClean}" → ${matched.docRelPath}`);
    for (const [k, v] of Object.entries(fields)) {
      console.log(`        ${k}: ${v.slice(0, 80)}${v.length > 80 ? '…' : ''}`);
    }
  }

  if (unmatched.length > 0) {
    console.log(`\n  UNMATCHED headings (no corresponding doc entry):`);
    for (const t of unmatched) console.log(`    - "${t}"`);
  }

  if (updates.length === 0) {
    console.log('\n  No updates to apply.');
    process.exit(0);
  }

  console.log(`\n  ${updates.length} update(s) queued.`);

  if (dryRun) {
    console.log('\n  DRY RUN complete — pass without --dry to apply changes.\n');
    process.exit(0);
  }

  // Phase 3: apply updates
  console.log('\n  Phase 2: applying updates to Figma...');
  const updateCode = buildUpdateCode(updates);
  const result = await client.execute(updateCode);

  if (!result) {
    console.error('  ERROR: No result from Figma update execution');
    client.stop();
    process.exit(1);
  }

  console.log(`\n  Updated: ${result.updated ?? 0} field(s)`);
  if (result.log) {
    for (const entry of result.log) {
      const icon = entry.status === 'updated' ? '✓' : '✗';
      const field = entry.field ? ` [${entry.field}]` : '';
      console.log(`  ${icon}  "${entry.title ?? entry.id}"${field} — ${entry.status}`);
    }
  }

  console.log('\n  Done. Open Figma to review the updated descriptions.\n');
  client.stop();
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
