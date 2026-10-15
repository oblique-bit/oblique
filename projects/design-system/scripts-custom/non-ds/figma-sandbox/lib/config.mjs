// Settings of the tool: which Figma files the scripts read from and may write to.
// Read from the file named in SANDBOX_CONFIG, otherwise from config.json in the tool folder (not committed).
// Copy config.example.json to config.json and fill in the file keys.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function loadConfig({ required = true } = {}) {
  const file = process.env.SANDBOX_CONFIG || path.join(root, 'config.json');
  if (!fs.existsSync(file)) {
    if (!required) return null;
    console.error(`Settings file not found: ${file}\nCopy config.example.json to config.json and fill in the file keys.`);
    process.exit(2);
  }
  const c = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const k of ['library', 'sandbox']) {
    if (!c[k] || String(c[k]).startsWith('<')) { console.error(`Setting "${k}" is missing in ${file}`); process.exit(2); }
  }
  c.allowedWrite = Array.isArray(c.allowedWrite) && c.allowedWrite.length ? c.allowedWrite : [c.sandbox];
  c.neverWrite = Array.isArray(c.neverWrite) ? c.neverWrite : [];
  return c;
}

// true when a script may change the file with this key
export function mayWrite(cfg, key) {
  return cfg.allowedWrite.includes(key) && !cfg.neverWrite.includes(key);
}
