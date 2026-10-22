// After the paste: report the selected node. It must be an INSTANCE whose main component is remote
// (linked to the template library). Use its id as "instanceId" for fill-cover.js.
// ARGS: { key }
(async () => {
  const A = __ARGS__;
  if (figma.fileKey !== A.key) return JSON.stringify({ wrongFile: figma.fileKey });
  const sel = figma.currentPage.selection; const n = sel[0];
  const m = n && n.type === 'INSTANCE' ? await n.getMainComponentAsync() : null;
  return JSON.stringify({ count: sel.length, id: n ? n.id : null, type: n ? n.type : null, main: m ? m.name + ' remote=' + m.remote : null });
})()
