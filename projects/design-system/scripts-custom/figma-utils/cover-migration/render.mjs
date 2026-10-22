// Fill the __ARGS__ placeholder of a plugin script with a JSON object and print the result.
// Full-line comments are removed: `figma-ds-cli eval -f` silently returns nothing when the file has them.
// usage: node render.mjs <script.js> '<json>'  >  /tmp/run.js
import { readFileSync } from 'node:fs';
const [file, json] = process.argv.slice(2);
const args = JSON.parse(json || '{}');
const code = readFileSync(file, 'utf8').split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n');
process.stdout.write(code.replace('__ARGS__', JSON.stringify(args)));
