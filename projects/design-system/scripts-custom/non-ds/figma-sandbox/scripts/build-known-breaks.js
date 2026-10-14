// ARGS = { rows: [[fixture group, override types, expected, last result]], header: bool, title: str }
const page = figma.root.children.find((p) => p.name === 'Known breaks');
await figma.setCurrentPageAsync(page);
for (const f of [{ family: 'Inter', style: 'Regular' }, { family: 'Inter', style: 'Bold' }]) await figma.loadFontAsync(f);
function autoFrame(dir) { const f = figma.createFrame(); f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.fills = []; f.clipsContent = false; return f; }
function cellText(str, w, bold) { const t = figma.createText(); t.fontName = { family: 'Inter', style: bold ? 'Bold' : 'Regular' }; t.fontSize = 12; t.characters = str; t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); t.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]; return t; }
const W = [420, 380, 300, 260];
let root = page.children.find((c) => c.name === 'Sandbox / Known breaks');
if (!root) {
  root = autoFrame('VERTICAL'); root.name = 'Sandbox / Known breaks'; root.itemSpacing = 6; root.paddingTop = root.paddingBottom = root.paddingLeft = root.paddingRight = 40;
  root.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  const t = figma.createText(); t.fontName = { family: 'Inter', style: 'Bold' }; t.fontSize = 20; t.characters = ARGS.title; root.appendChild(t);
  const hd = autoFrame('HORIZONTAL'); hd.name = 'header'; hd.itemSpacing = 16;
  ['fixture group', 'override types', 'expected after a library update', 'last result'].forEach((s, i) => hd.appendChild(cellText(s, W[i], true)));
  root.appendChild(hd); page.appendChild(root); root.x = 0; root.y = 0;
}
for (const r of ARGS.rows) {
  const row = autoFrame('HORIZONTAL'); row.name = 'row / ' + r[0]; row.itemSpacing = 16; row.counterAxisAlignItems = 'MIN';
  r.forEach((s, i) => row.appendChild(cellText(String(s), W[i], false)));
  root.appendChild(row);
}
return JSON.stringify({ rows: root.children.length });
