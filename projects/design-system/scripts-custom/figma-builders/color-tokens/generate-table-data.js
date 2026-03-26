const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'per-table-scripts');
const OUT_DIR = path.join(__dirname, 'extracted-json');

fs.mkdirSync(OUT_DIR, { recursive: true });

const files = [
  'split-data-s1-neutral.js',
  'split-data-s1-interaction.js',
  'split-data-s3-neutral.js',
  'split-data-s3-interaction.js',
  'split-data-s2-interaction.js',
  'split-data-s1-status-left.js',
  'split-data-s1-status-right.js',
  'split-data-s3-status-left.js',
  'split-data-s3-status-right.js',
  'split-data-s1-free-left.js',
  'split-data-s1-free-right.js',
  'split-data-s3-free-left.js',
  'split-data-s3-free-right.js',
];

for (const file of files) {
  const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  const match = content.match(/const TABLES = (\{[\s\S]*?\});/);
  if (!match) { console.log(file + ': NO_MATCH'); continue; }
  const tables = JSON.parse(match[1]);
  const key = Object.keys(tables)[0];
  const t = tables[key];
  // Strip semanticAssigned (keep description for Role column)
  for (const g of t.groups) {
    for (const tok of g.tokens) {
      delete tok.semanticAssigned;
    }
  }
  delete t.heading;
  const compact = JSON.stringify(t);
  console.log(`${key}: ${compact.length} bytes`);
  fs.writeFileSync(path.join(OUT_DIR, `_compact-${key}.json`), compact);
}
