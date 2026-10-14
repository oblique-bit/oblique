const out = [];
for (const page of figma.root.children) {
  await page.loadAsync();
  for (const n of page.findAllWithCriteria({ types: ['COMPONENT_SET'] })) {
    out.push({ set: n.name, key: n.key, variants: n.children.map((c) => ({ name: c.name, key: c.key, id: c.id })) });
  }
}
return JSON.stringify(out);
