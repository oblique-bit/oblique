const names = ['Components', 'Swaps', 'Known breaks'];
const made = [];
for (const n of names) {
  if (!figma.root.children.some((p) => p.name === n)) { const p = figma.createPage(); p.name = n; made.push(n); }
}
return JSON.stringify({ made, pages: figma.root.children.map((p) => p.name) });
