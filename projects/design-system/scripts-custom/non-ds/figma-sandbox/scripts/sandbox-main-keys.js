const keys = {};
for (const p of figma.root.children) {
  if (p.name === 'Components' || p.name === 'Swaps' || p.name === 'Known breaks') continue;
  await p.loadAsync();
  for (const i of p.findAllWithCriteria({ types: ['INSTANCE'] })) {
    const mc = await i.getMainComponentAsync();
    if (mc && mc.remote) keys[mc.key] = mc.name;
  }
}
return JSON.stringify(keys);
