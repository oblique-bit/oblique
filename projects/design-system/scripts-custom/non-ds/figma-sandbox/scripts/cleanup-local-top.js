// remove top-level LOCAL components pasted by the failed batch mode (debris of this run); keep instances
const page = figma.root.children.find((p) => p.name === 'Components');
await page.loadAsync();
const removed = [], renamed = [], kept = [];
for (const n of [...page.children]) {
  if (n.type === 'INSTANCE') { kept.push(n.id); continue; }
  try { n.remove(); removed.push(n.name); } catch (e) { n.name = n.name + '_deprecated'; renamed.push(n.name); }
}
return JSON.stringify({ removed: removed.length, renamed: renamed.length, kept: kept.length });
