// figma-run.mjs — what the commands of the icon workflow share: run a Node script of lib/, fill the
// INPUT block of a Figma script, run a Figma script through figma-ds-cli
// ----------------------------------------------------------------------------
// icons.mjs and write-metadata.mjs use it. Not a command of its own. No dependencies. Node 18 or newer.
// ----------------------------------------------------------------------------

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const LIB = dirname(fileURLToPath(import.meta.url));

// a Node script of lib/ (validator, fetch); returns the exit status and the output
export function runNode(script, scriptArgs) {
  const r = spawnSync(process.execPath, [join(LIB, script), ...scriptArgs], { encoding: 'utf8', maxBuffer: 1 << 28 });
  return { status: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

// a Figma script (a file that ends in one JSON line) through figma-ds-cli; cliDir is the folder to run it from
export function runFigma(scriptFile, cliDir) {
  const r = spawnSync('figma-ds-cli', ['eval', '-f', scriptFile], { cwd: cliDir, encoding: 'utf8', maxBuffer: 1 << 30, timeout: 10 * 60 * 1000 });
  if (r.error) throw new Error(`figma-ds-cli did not run: ${r.error.message}`);
  const lines = (r.stdout || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1] || '';
  if (!last.startsWith('{')) throw new Error(`figma-ds-cli returned no JSON (${((r.stdout || '') + (r.stderr || '')).trim().slice(-300) || 'no output'}). Open the Figma file, run "figma-ds-cli connect" and "figma-ds-cli daemon reconnect" and try again.`);
  return last;
}

// a Figma script of lib/ with its INPUT block filled in; returns the path of the generated file
export function generate(templateFile, input, outFile) {
  const text = readFileSync(join(LIB, templateFile), 'utf8');
  const marker = /\/\*__INPUT__\*\/[\s\S]*?\/\*__END__\*\//;
  if (!marker.test(text)) throw new Error(`${templateFile} has no INPUT block`);
  writeFileSync(outFile, text.replace(marker, () => JSON.stringify(input)));
  return outFile;
}
