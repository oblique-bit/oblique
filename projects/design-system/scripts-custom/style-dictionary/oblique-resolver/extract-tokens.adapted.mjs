/**
 * Entry point for the local Oblique token resolver.
 *
 * Replaces scripts/extract-tokens.mjs from `master`. Differences:
 *  - reads the LOCAL src/lib/themes working copy — no git remote, no fetch;
 *  - does NOT delete src/lib/themes afterwards;
 *  - writes the generated CSS into ./output/ by default, so the public
 *    src/lib/ tree stays untouched.
 *
 * Run:   node extract-tokens.adapted.mjs                  -> output/lib/css/layers/tokens.css
 *        node extract-tokens.adapted.mjs ../../../src/lib -> writes the real artifact into src/lib
 */
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { generateCSS } from './style-dictionary.mjs';
import { listModes } from './themes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
// here   = projects/design-system/scripts-custom/style-dictionary/oblique-resolver
// dsRoot = projects/design-system — three levels up.
const dsRoot = resolve(here, '..', '..', '..');
const themesFolder = join(dsRoot, 'src', 'lib', 'themes');

const outArg = process.argv[2];
const libFolder = outArg ? resolve(process.cwd(), outArg) : join(here, 'output', 'lib');
mkdirSync(libFolder, { recursive: true });

const modes = listModes(themesFolder);
console.log(`Resolving ${modes.length} mode builds`);
console.log(`  themes in : ${themesFolder}`);
console.log(`  css out   : ${libFolder}`);

await generateCSS(modes, libFolder);

console.log(`\nDone → ${join(libFolder, 'css', 'layers', 'tokens.css')}`);
