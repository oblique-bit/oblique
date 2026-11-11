(async () => {
  /**
   * write-descriptions.js — write new description texts into the icon components of a Figma page
   * ----------------------------------------------------------------------------
   * WHY: the texts of an icon (usage, category, keywords, purpose type, description, old name)
   * live in the description of its Figma component. This script writes finished description
   * texts into the components. It changes nothing else: no geometry, name, fill or instance.
   *
   * WHAT IT DOES per entry of INPUT.items  { "<name without prefix>": { expected, description } }:
   *   - looks for the component with this name on the page
   *   - writes the new description only when the current description still equals `expected`
   *     (the text at the time of the export). A description that someone changed in between is
   *     left alone and reported as "changed".
   *   - reads the description back after writing.
   * It never creates or deletes anything.
   *
   * HOW TO RUN: not by hand. write-metadata.mjs fills INPUT between the markers below and runs
   * the result with `figma-ds-cli eval -f`. Mode `scan` writes nothing and reports what would
   * happen. Mode `apply` saves a restore point first (version history), then writes.
   * ----------------------------------------------------------------------------
   */

  const INPUT = /*__INPUT__*/ { mode: 'scan', fileKeyGuard: null, pageName: 'Icons', namePrefix: 'icon/', restorePoint: false, label: 'Before icon metadata', items: {} } /*__END__*/;

  const results = [];
  const finish = (extra) => JSON.stringify({ ok: true, mode: INPUT.mode, file: figma.root.name, fileKey: figma.fileKey, results, ...extra });

  if (INPUT.mode === 'apply' && INPUT.fileKeyGuard !== figma.fileKey) {
    return JSON.stringify({ ok: false, reason: 'FILE KEY GUARD — refusing to write', expected: INPUT.fileKeyGuard, open: { fileKey: figma.fileKey, name: figma.root.name } });
  }

  // the pages are listed without loading them; only the icon page is loaded
  const pages = figma.root.children.filter((p) => p.name.includes(INPUT.pageName));
  if (pages.length !== 1) return JSON.stringify({ ok: false, reason: `${pages.length} pages contain "${INPUT.pageName}"`, pages: pages.map((p) => p.name) });
  const page = pages[0];
  await page.loadAsync();

  const prefix = INPUT.namePrefix;
  const prefixLower = prefix.toLowerCase();
  const comps = page.findAll((n) => n.type === 'COMPONENT' && n.name.toLowerCase().startsWith(prefixLower));
  if (!comps.length) return JSON.stringify({ ok: false, reason: `no component with the prefix "${prefix}" on the page` });
  const byName = new Map(comps.map((c) => [c.name.slice(prefix.length).toLowerCase(), c]));

  const entries = Object.entries(INPUT.items);
  if (INPUT.mode === 'apply' && INPUT.restorePoint && entries.length) {
    await figma.saveVersionHistoryAsync(INPUT.label, 'Restore point before description texts are written into the icon components');
  }

  for (const [name, item] of entries) {
    const c = byName.get(name.toLowerCase());
    if (!c) { results.push({ name, status: 'missing', reason: 'no component with this name on the page' }); continue; }
    if (c.description !== item.expected) { results.push({ name, status: 'changed', reason: 'the description is not the one of the export any more' }); continue; }
    if (INPUT.mode === 'scan') { results.push({ name, status: 'would-write' }); continue; }
    c.description = item.description;
    const back = c.description;
    if (back === item.description) results.push({ name, status: 'written' });
    else results.push({ name, status: 'error', reason: 'the description read back differs from the text written' });
  }

  return finish({ components: comps.length });
})()
