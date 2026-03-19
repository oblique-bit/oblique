/**
 * Inspect Components — dumps the tree structure of all Figma row/header
 * components used by the color-table builder.
 *
 * Run via Figma MCP `figma_execute` with this file's contents.
 * Returns a JSON map of component label → node tree.
 */
(async () => {
  const COMPONENTS = {
    "2-mode/set/row": "3:317442",
    "2-mode/set/header": "3:317445",
    "2-mode/withRole/row": "1:1966",
    "2-mode/withRole/header": "1:1888",
    "2-mode/noRole/row": "1:2067",
    "2-mode/noRole/header": "1:2087",
    "4-mode/set/row": "3:317443",
    "4-mode/set/rowLow": "3:317444",
    "4-mode/set/header": "3:317446",
    "4-mode/withRole/row": "1:1914",
    "4-mode/withRole/rowLow": "1:1939",
    "4-mode/withRole/header": "1:1871",
    "4-mode/noRole/row": "1:2100",
    "4-mode/noRole/rowLow": "1:2123",
    "4-mode/noRole/header": "1:2145",
    "4-mode/separator": "1:1963",
    "primitive/header": "1:1903",
    "primitive/row": "1:1988",
    "utility/swatch": "1:1998",
    "utility/sectionBar": "1:1839",
    "utility/setHeading": "1:1857",
    "utility/groupHeader": "1:1866"
  };

  function mapNode(n, depth) {
    if (depth > 5) return { name: n.name, type: n.type, note: '(max depth)' };
    const info = { name: n.name, type: n.type };
    if (n.type === 'TEXT') {
      info.chars = n.characters?.substring(0, 80);
      info.fontSize = n.fontSize;
    }
    if (n.type === 'INSTANCE') info.componentName = n.mainComponent?.name;
    if (n.children && n.children.length > 0) {
      info.children = n.children.map(c => mapNode(c, depth + 1));
    }
    return info;
  }

  const result = {};
  for (const [label, id] of Object.entries(COMPONENTS)) {
    const node = await figma.getNodeByIdAsync(id);
    result[label] = node ? mapNode(node, 0) : 'NOT FOUND';
  }

  return result;
})()
