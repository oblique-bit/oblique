// Visit every page so Figma loads the remote library content of the instances (after a restart nested content loads lazily
// and reads are incomplete). Changes only the current page view, which is restored at the end.
const start = figma.currentPage;
for (const p of figma.root.children) { await figma.setCurrentPageAsync(p); await new Promise((r) => setTimeout(r, 1500)); }
await figma.setCurrentPageAsync(start);
return JSON.stringify({ visited: figma.root.children.length, back: figma.currentPage.name });
