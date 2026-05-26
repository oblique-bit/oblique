/**
 * Proposal for the dev: a drop-in replacement for `scripts/tokens/themes.mjs`
 * on `master`, adapted for the `tokens-dev` token-file structure.
 *
 * What stays the same — contract with the rest of the pipeline:
 *  - Exported function name:  `listModes(themesPath)`
 *  - Return shape per build:   `{ name, group, selector, tokenSets: [absolute file paths] }`
 *    (plus the synthetic `{ mode: 'static', tokenSets: [...] }` head entry)
 *  - The git-checkout step:    kept as the first thing `listModes` does, so the
 *                              dev's existing workflow ("CI/build pulls the
 *                              tokens from `tokens-main` and reads them
 *                              locally") still works without changes.
 *  - Module path:              the dev replaces his current
 *                              `scripts/tokens/themes.mjs` with this file.
 *                              `style-dictionary.mjs`, formats, transforms,
 *                              preprocessors stay untouched.
 *
 * What changes — internals only:
 *  - Mode metadata source.     Old: `01_global/modes.json` (root `ob.g.modes`).
 *                              New: per-axis files `01_global/mode_collection/<axis>.json`
 *                              (root `ob.g.mode_collection.<axis>`).
 *  - Uniform "default" rule.   Old: a group with `mode.modes.$value === 'default'`
 *                              in `modes.json` was a base group.
 *                              New: every $themes.json group has a matching
 *                              `mode_collection/<axis>.json` file (including
 *                              `static` and `semantic`); inside each, exactly
 *                              one mode carries `selector.$value === 'default'`.
 *                              That default mode contributes to the always-on
 *                              base. Groups whose only mode is the default one
 *                              are base groups (static, semantic) — they
 *                              contribute to the base and produce no per-mode
 *                              build of their own. Real axes (lightness,
 *                              density, …) contribute their default and
 *                              produce one per-mode build per non-default mode.
 *  - Theme lookup.             Was: `themes.find(t => t.name === mode.name)`
 *                              (name-only). Now: match on (name, group) —
 *                              `ui_scale` and `viewport` both use sm/md/lg,
 *                              so name-only returns the wrong theme.
 *  - viewport range sub-tree.  viewport modes live under
 *                              `ob.g.mode_collection.viewport.range`, peer to
 *                              the breakpoint primitives — one level deeper
 *                              than other axes.
 *  - Non-mode siblings.        Inside each `mode_collection`, children
 *                              without a `selector` field are not modes
 *                              (e.g. `token_family_docs`, `ui_scale`/`density`
 *                              `multiplier`). Filter them out.
 *
 * Notes for the dev:
 *  - This file imports `./git.mjs` for `checkoutThemeFiles`, exactly like the
 *    existing `master` themes.mjs. If that module path differs on master,
 *    adjust the import.
 *  - The output sorting still uses `$metadata.json`'s `tokenSetOrder` map —
 *    same convention as before.
 *  - `NO-DS*` token sets are still filtered out — same convention as before.
 *  - The reference implementation that runs against the live tokens-dev
 *    working copy lives next to this file at `./themes.mjs`. It is
 *    structurally identical except: it does NOT call `checkoutThemeFiles`,
 *    because the system designer reads the local working copy directly.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { checkoutThemeFiles } from './git.mjs';

const FAMILY_DOCS_KEY = 'token_family_docs';

const isBaseGroup = (g) => g.modes.length === 1 && g.modes[0].isDefault;

export function listModes(themesPath) {
	checkoutThemeFiles(themesPath);
	return buildModes(themesPath);
}

function buildModes(themesFolder) {
	const themes = readThemes(themesFolder);
	const tokenSetOrder = readTokenSetOrder(themesFolder);
	const modeGroups = readModeGroups(themesFolder);

	// Per-mode builds come only from axes that have alternative modes to
	// switch to. Base groups (single always-default mode) contribute to the
	// default build but produce no per-mode build of their own.
	const switchableModes = modeGroups
		.filter((g) => !isBaseGroup(g))
		.flatMap((g) => g.modes.map((m) => ({ ...m, group: g.group })));

	const builds = [
		// `static` build: every group's default mode (base groups + axis defaults).
		{ mode: 'static', tokenSets: defaultTokenSets(modeGroups, themes) },
		// one build per non-default mode of each real axis: this mode + every
		// other group's default mode.
		...switchableModes.map((mode) => ({
			name: mode.name,
			group: mode.group,
			selector: mode.selector,
			tokenSets: modeTokenSets(mode, modeGroups, themes),
		})),
	];

	return builds.map((build) => ({
		...build,
		tokenSets: [...new Set(build.tokenSets)]
			.filter((set) => !set.startsWith('NO-DS'))
			.sort((a, b) => (tokenSetOrder.get(a) ?? 0) - (tokenSetOrder.get(b) ?? 0))
			.map((set) => `${themesFolder}/${set}.json`),
	}));
}

function readThemes(themesFolder) {
	return JSON.parse(readFileSync(`${themesFolder}/$themes.json`).toString('utf-8')).filter(
		(theme) => !theme.group.startsWith('_') && theme.group !== 'R13'
	);
}

function readTokenSetOrder(themesFolder) {
	const { tokenSetOrder } = JSON.parse(readFileSync(`${themesFolder}/$metadata.json`).toString('utf-8'));
	return new Map(tokenSetOrder.map((set, index) => [set, index]));
}

/**
 * Reads every `01_global/mode_collection/<axis>.json` →
 * [{group, modes: [{name, selector, isDefault}]}]. The file name is the
 * mode-collection name (and the $themes.json group name). Each mode within
 * the collection carries a `selector.$value` (the .ob-* CSS class string or
 * "default").
 */
function readModeGroups(themesFolder) {
	const dir = `${themesFolder}/01_global/mode_collection`;
	const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
	return files.map((file) => {
		const axis = file.replace(/\.json$/, '');
		const raw = JSON.parse(readFileSync(`${dir}/${file}`).toString('utf-8')).ob.g.mode_collection[axis];
		// viewport keeps its mode values under a `range` sub-tree (peer to the
		// `breakpoint` primitives); every other axis has its mode values as
		// direct children of the collection.
		const container = axis === 'viewport' ? raw.range : raw;
		// Skip non-mode siblings: token_family_docs and any other sub-tree (e.g.
		// ui_scale/density `multiplier`) have no `selector` field.
		const modes = Object.entries(container)
			.filter(([, def]) => def.selector?.$value !== undefined)
			.map(([name, def]) => {
				const selector = def.selector.$value;
				return { name, selector, isDefault: selector === 'default' };
			});
		return { group: axis, modes };
	});
}

function themeFor(themes, name, group) {
	// Match on name AND group: `ui_scale` and `viewport` both carry sm/md/lg,
	// so a name-only lookup would pick the wrong theme.
	const theme = themes.find((t) => t.name === name && t.group === group);
	if (!theme) {
		throw new Error(`No theme "${name}" in group "${group}" found in $themes.json`);
	}
	return theme;
}

/** Token sets of every group at its default mode (base groups + axis defaults). */
function defaultTokenSets(modeGroups, themes) {
	return modeGroups.flatMap((g) => {
		const def = g.modes.find((m) => m.isDefault);
		return def ? Object.keys(themeFor(themes, def.name, g.group).selectedTokenSets) : [];
	});
}

/** This mode's own token sets + every other group at its default mode. */
function modeTokenSets(mode, modeGroups, themes) {
	const own = Object.keys(themeFor(themes, mode.name, mode.group).selectedTokenSets);
	const others = modeGroups
		.filter((g) => g.group !== mode.group)
		.flatMap((g) => {
			const def = g.modes.find((m) => m.isDefault);
			return def ? Object.keys(themeFor(themes, def.name, g.group).selectedTokenSets) : [];
		});
	return [...own, ...others];
}
