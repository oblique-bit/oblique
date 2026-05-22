/**
 * resolve.mjs — run the official token build on the local tokens-dev tokens.
 *
 * This does NOT re-implement the build. It drives the system developer's real,
 * unmodified `extract-tokens.mjs` inside the `oblique-build` worktree (a
 * checkout of `master`), with this folder's two overlay files applied first:
 *
 *   themes.mjs            mode discovery, rewritten for the tokens-dev
 *                         token structure
 *   style-dictionary.mjs  broken references downgraded to warnings — temporary,
 *                         while tokens-dev has undefined ob.s.shadow.* refs
 *
 * Output is the developer's exact format, verified byte-identical to his
 * official build. One-time setup is described in ../WORKFLOW.md.
 *
 * Run:  node resolve.mjs
 */
import {execSync} from 'node:child_process';
import {cpSync, rmSync, existsSync, mkdirSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dsRoot = resolve(here, '..', '..', '..'); // projects/design-system
const repoRoot = resolve(dsRoot, '..', '..'); // the oblique repo root
const worktree = process.env.OBLIQUE_WORKTREE
	? resolve(process.env.OBLIQUE_WORKTREE)
	: resolve(repoRoot, '..', 'oblique-build');
const wtDs = join(worktree, 'projects', 'design-system');

function fail(message) {
	console.error(`\n  resolve.mjs: ${message}\n`);
	process.exit(1);
}

function restoreWorktree() {
	execSync('git checkout -- .', {cwd: wtDs});
}

if (!existsSync(wtDs)) {
	fail(
		`worktree not found at ${worktree}\n` +
			'  create it once:  git worktree add -b tokens-pr-staging ../oblique-build origin/master'
	);
}
if (!existsSync(join(wtDs, 'node_modules', 'style-dictionary'))) {
	fail(
		'build dependencies missing in the worktree\n' +
			'  install them once:  npm --prefix ../oblique-build/projects/design-system install \\\n' +
			'      --no-save style-dictionary@5.4.0 @tokens-studio/sd-transforms@2.0.3'
	);
}

// 1. apply the overlay onto the developer's verbatim files
for (const file of ['themes.mjs', 'style-dictionary.mjs']) {
	cpSync(join(here, file), join(wtDs, 'scripts', 'tokens', file));
}

// 2. copy the local tokens in — the developer's script reads src/lib/themes
const wtThemes = join(wtDs, 'src', 'lib', 'themes');
rmSync(wtThemes, {recursive: true, force: true});
cpSync(join(dsRoot, 'src', 'lib', 'themes'), wtThemes, {recursive: true});

// 3. run the developer's real, unmodified extract-tokens.mjs
console.log('Resolving tokens with the official build (oblique-build worktree)…');
try {
	execSync('node scripts/extract-tokens.mjs', {cwd: wtDs, stdio: 'inherit'});
} catch {
	restoreWorktree();
	fail('the build failed — see the output above');
}

// 4. copy the resolved CSS back into the local tree
const cssRelative = join('src', 'lib', 'css', 'layers', 'tokens.css');
const cssOut = join(dsRoot, cssRelative);
mkdirSync(dirname(cssOut), {recursive: true});
cpSync(join(wtDs, cssRelative), cssOut);

// 5. leave the worktree pristine
restoreWorktree();

// success summary — the caveat text is pulled live from this folder's README
let known = '';
try {
	const lines = readFileSync(join(here, 'README.md'), 'utf8').split('\n');
	const start = lines.findIndex(l => l.startsWith('## Known'));
	if (start !== -1) {
		let end = lines.length;
		for (let i = start + 1; i < lines.length; i++) {
			if (lines[i].startsWith('## ')) { end = i; break; }
		}
		known = lines.slice(start + 1, end).join('\n').trim().replace(/`/g, '');
	}
} catch { /* README is optional */ }

console.log(`
  ✓ Resolved — ran the developer’s official build in the oblique-build worktree.

  CSS written to  projects/design-system/${cssRelative}
                  :root + mode blocks (.ob-lightness-dark, .ob-density-*, …)`);

if (known) {
	console.log('\n  Note — from oblique-resolver/README.md:');
	for (const line of known.split('\n')) console.log('  ' + line);
}

console.log(`
  Next: the handoff — push the token JSON to tokens-main.
  Full workflow → scripts-custom/style-dictionary/WORKFLOW.md
`);
