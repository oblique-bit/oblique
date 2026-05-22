/**
 * Local Style Dictionary build for the Oblique design tokens.
 *
 * Purpose: deterministic resolution of token values. Instead of an AI
 * guessing what `ob.s.color...` resolves to, this walks the actual JSON,
 * follows every `{reference}`, evaluates Token Studio math, and writes the
 * final resolved values to ./build/.
 *
 * Source of truth: ../../src/lib/themes/ (Token Studio multi-file format).
 *
 * Each theme in $themes.json is a *mode-slice*, not a self-contained set.
 * Slices in the colour groups (s1_lightness, s2_emphasis, semantic, static)
 * resolve fully on their own once the always-on global sets are added.
 * Slices in the other groups (ui_scale, typography_context, density,
 * viewport, motion) reference primitives that their slice does not carry —
 * those will report unresolved references. That is expected; this script
 * builds whatever resolves and reports the rest rather than crashing.
 *
 * Run:  npm run build            (all themes)
 *       node build.js light      (one theme by name)
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary);

const here = dirname(fileURLToPath(import.meta.url));
// here = projects/design-system/scripts-custom/style-dictionary;
// the token source is two levels up under the design-system root.
const themesDir = join(here, '..', '..', 'src', 'lib', 'themes');
const buildDir = join(here, 'build');
mkdirSync(buildDir, { recursive: true });
const themes = JSON.parse(readFileSync(join(themesDir, '$themes.json'), 'utf8'));

/**
 * Foundational global sets that other sets reference but that $themes.json
 * does not list per theme — in Figma they live in always-present collections.
 * They have no mode variants, so adding them as resolution sources is safe.
 */
const ALWAYS_ON = [
  '01_global/themes_scoped/static',
  '01_global/themes_user/lightness/static',
];

/** Flat map of dotted token path -> resolved value. Best shape for lookups. */
StyleDictionary.registerFormat({
  name: 'json/flat-path',
  format: ({ dictionary }) => {
    const out = {};
    for (const t of dictionary.allTokens) out[t.path.join('.')] = t.value ?? t.$value;
    return JSON.stringify(out, null, 2) + '\n';
  },
});

const wanted = process.argv[2]; // optional theme name filter
const selected = wanted ? themes.filter((t) => t.name === wanted) : themes;
if (wanted && selected.length === 0) {
  console.error(`No theme named "${wanted}". Available: ${themes.map((t) => t.name).join(', ')}`);
  process.exit(1);
}

const results = [];
for (const theme of selected) {
  // selectedTokenSets keys are set paths relative to themes/; "disabled" sets are skipped.
  const themeSets = Object.entries(theme.selectedTokenSets)
    .filter(([, mode]) => mode !== 'disabled')
    .map(([set]) => set);
  const sets = [...new Set([...ALWAYS_ON, ...themeSets])];
  const sources = sets.map((set) => join(themesDir, `${set}.json`));
  const id = `${theme.group}__${theme.name}`.replace(/[^\w]+/g, '_');

  const sd = new StyleDictionary({
    source: sources,
    preprocessors: ['tokens-studio'],
    platforms: {
      json: {
        transformGroup: 'tokens-studio',
        buildPath: 'build/',
        files: [{ destination: `${id}.json`, format: 'json/flat-path' }],
      },
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/kebab'],
        buildPath: 'build/',
        files: [{ destination: `${id}.css`, format: 'css/variables' }],
      },
    },
    // Warn on broken references instead of aborting the whole run.
    log: { verbosity: 'silent', warnings: 'disabled', errors: { brokenReferences: 'console' } },
  });

  try {
    await sd.buildAllPlatforms();
    results.push({ id, sets: sets.length, ok: true });
    console.log(`✓ ${id}  (${sets.length} sets)`);
  } catch (err) {
    results.push({ id, sets: sets.length, ok: false, err: err.message.split('\n')[0] });
    console.log(`✗ ${id}  — ${err.message.split('\n')[0]}`);
  }
}

const ok = results.filter((r) => r.ok).length;
console.log(`\n${ok}/${results.length} themes built → ${buildDir}`);
