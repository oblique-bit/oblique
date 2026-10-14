let n = 0; const names = [];
for (const p of figma.root.children) { await p.loadAsync(); for (const c of p.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] })) { n++; names.push(p.name + ':' + c.name); } }
return JSON.stringify({ localComponents: n, names });
