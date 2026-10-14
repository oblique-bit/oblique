// ARGS = { page, name, scale }
const page = figma.root.children.find((p) => p.name === ARGS.page);
await page.loadAsync();
const n = page.findOne((x) => x.name === ARGS.name);
const bytes = await n.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: ARGS.scale || 0.5 } });
return JSON.stringify({ w: n.width, h: n.height, b64: figma.base64Encode(bytes) });
