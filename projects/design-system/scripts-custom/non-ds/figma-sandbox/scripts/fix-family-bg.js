// the family "end of life footer / link" has white text: give its card a dark background so the fixtures are visible
const page = figma.root.children.find((p) => p.name === 'Components'); await page.loadAsync();
const out = [];
for (const f of page.findAll((n) => n.type === 'FRAME' && n.name.startsWith('family / '))) {
  if (!/footer \/ link|logo \/ footer/.test(f.name)) continue;
  f.fills = [{ type: 'SOLID', color: { r: 0.25, g: 0.27, b: 0.3 } }];
  const title = f.children.find((c) => c.type === 'TEXT');
  if (title) title.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  out.push(f.name.slice(0, 80));
}
return JSON.stringify(out);
