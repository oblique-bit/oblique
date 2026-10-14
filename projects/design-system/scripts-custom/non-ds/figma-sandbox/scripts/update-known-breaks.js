// ARGS = { day, release, summaryAdd, rows: { <row key>: <text> }, fallback: <text> }
// Fills the column "last result" of the page "Known breaks" after a real library update.
// Rows that already carry a build-time BREAK text keep it and get the new result appended.
for (const f of [{ family: 'Inter', style: 'Regular' }, { family: 'Inter', style: 'Bold' }]) await figma.loadFontAsync(f);
const page = figma.root.children.find((p) => p.name === 'Known breaks'); await page.loadAsync();
const root = page.children.find((c) => c.name === 'Sandbox / Known breaks');
let n = 0, special = 0;
for (const row of root.children) {
  if (!row.name.startsWith('row / ') || row.children.length < 4) continue;
  const key = row.name.slice(6);
  const last = row.children[3];
  const add = Object.prototype.hasOwnProperty.call(ARGS.rows, key) ? ARGS.rows[key] : ARGS.fallback;
  if (Object.prototype.hasOwnProperty.call(ARGS.rows, key)) special++;
  const cur = last.characters;
  last.characters = (cur.startsWith('BREAK') ? cur + ' | ' : '') + ARGS.release + ' (' + ARGS.day + '): ' + add;
  n++;
}
const sum = root.children.find((c) => c.name === 'summary');
if (sum) sum.characters = sum.characters + '\n' + ARGS.summaryAdd;
return JSON.stringify({ rows: n, special, summary: !!sum });
