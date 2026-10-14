// remove only the test pastes made on 2026-10-13 on the new pages (my own debris)
const removed = [], renamed = [];
for (const name of ['Components', 'Swaps']) {
  const page = figma.root.children.find((p) => p.name === name);
  await page.loadAsync();
  for (const n of [...page.children]) {
    try { n.remove(); removed.push(n.name); }
    catch (e) { n.name = n.name + '_deprecated'; renamed.push(n.name); }
  }
}
return JSON.stringify({ removed, renamed });
