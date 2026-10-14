const out = [];
for (const page of figma.root.children) {
  await page.loadAsync();
  const nodes = page.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] });
  for (const n of nodes) {
    if (n.type === 'COMPONENT' && n.parent && n.parent.type === 'COMPONENT_SET') continue;
    let defs = null;
    try { defs = n.componentPropertyDefinitions; } catch (e) { defs = { __error: String(e) }; }
    const rec = {
      page: page.name, pageId: page.id, id: n.id, type: n.type, name: n.name, key: n.key,
      w: Math.round(n.width), h: Math.round(n.height),
      parent: n.parent ? n.parent.name : null, parentType: n.parent ? n.parent.type : null,
      defs,
    };
    if (n.type === 'COMPONENT_SET') {
      rec.variantCount = n.children.length;
      rec.defaultVariantId = n.defaultVariant ? n.defaultVariant.id : null;
      rec.defaultVariantKey = n.defaultVariant ? n.defaultVariant.key : null;
      rec.variantNames = n.children.slice(0, 6).map((c) => c.name);
    }
    out.push(rec);
  }
}
return JSON.stringify(out);
