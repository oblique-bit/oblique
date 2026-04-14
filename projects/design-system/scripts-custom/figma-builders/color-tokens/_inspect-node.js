'use strict';
const http = require('http');
const MCP_URL = 'http://127.0.0.1:3845/mcp';
const TIMEOUT_MS = 30000;
const LIST_TOOLS = process.argv[2] === '--list-tools';

function postMCP(body, sessionId) {
  return new Promise((resolve, reject) => {
    const url = new URL(MCP_URL);
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
    if (sessionId) headers['mcp-session-id'] = sessionId;
    const payload = JSON.stringify(body);
    const opts = { hostname: url.hostname, port: url.port, path: url.pathname, method: 'POST', headers, timeout: TIMEOUT_MS + 5000 };
    const req = http.request(opts, res => {
      let raw = '';
      const sid = res.headers['mcp-session-id'] || sessionId;
      res.setEncoding('utf8');
      res.on('data', c => raw += c);
      res.on('end', () => resolve({ status: res.statusCode, raw, sessionId: sid }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('HTTP timeout')); });
    req.end(payload);
  });
}

function parseSSE(raw) {
  const lines = raw.split('\n');
  let lastData = null;
  for (const ln of lines) { if (ln.startsWith('data: ')) lastData = ln.slice(6); }
  if (!lastData) return null;
  try { return JSON.parse(lastData); } catch { return lastData; }
}

async function run() {
  const initRes = await postMCP({ jsonrpc:'2.0', id:1, method:'initialize', params:{ protocolVersion:'2024-11-05', capabilities:{}, clientInfo:{ name:'inspector', version:'1.0' } } });
  const sid = initRes.sessionId;
  await postMCP({ jsonrpc:'2.0', method:'notifications/initialized' }, sid);

  if (LIST_TOOLS) {
    const tRes = await postMCP({ jsonrpc:'2.0', id:2, method:'tools/list', params:{} }, sid);
    const p = parseSSE(tRes.raw);
    const tools = p && p.result && p.result.tools;
    console.log(JSON.stringify(tools ? tools.map(t => t.name) : p, null, 2));
    return;
  }

  const nodeId = process.argv[2] || '9966:20125';

  const code = `(async () => {
    const node = await figma.getNodeByIdAsync(${JSON.stringify(nodeId)});
    if (!node) return JSON.stringify({ error: 'node not found: ' + ${JSON.stringify(nodeId)} });
    function serializeNode(n, depth) {
      if (depth <= 0) return { name: n.name, type: n.type };
      const out = { name: n.name, type: n.type, id: n.id };
      if (n.characters !== undefined) out.characters = n.characters.slice(0, 200);
      if (n.componentProperties) out.componentProperties = n.componentProperties;
      if (n.children) out.children = n.children.map(c => serializeNode(c, depth - 1));
      return out;
    }
    return JSON.stringify(serializeNode(node, 5));
  })()`;

  const res = await postMCP({ jsonrpc:'2.0', id:2, method:'tools/call', params:{ name:'figma_execute', arguments:{ code, timeout: 30000 } } }, sid);
  const parsed = parseSSE(res.raw);
  const result = parsed?.result?.content?.[0]?.text;
  if (result) {
    try { console.log(JSON.stringify(JSON.parse(result), null, 2)); }
    catch { console.log(result); }
  } else {
    console.log('raw:', JSON.stringify(parsed, null, 2));
  }
}
run().catch(e => console.error('ERR', e.message));
