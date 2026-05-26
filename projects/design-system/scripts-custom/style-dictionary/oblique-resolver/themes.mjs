/**
 * Mode discovery for the Oblique token resolver — adapted for the tokens-dev
 * branch structure.
 *
 * This replaces scripts/tokens/themes.mjs from `master`. The original was
 * written for the `tokens-main` branch and reads `01_global/modes.json`
 * (root key `ob.g.modes`). The `tokens-dev` branch has restructured the
 * mode metadata into per-axis files under `01_global/mode_collection/<axis>.json`
 * (root path `ob.g.mode_collection.<axis>`), and — unlike the original — this
 * version reads the LOCAL working copy instead of checking the themes out
 * from a remote branch and deleting them afterwards.
 *
 * Uniform "default" rule: every $themes.json group has a matching
 * `mode_collection/<axis>.json` file (including `static` and `semantic`).
 * In every file, exactly one mode carries `selector.$value === "default"`.
 * That default mode's token sets contribute to the always-on base. Groups
 * whose only mode is the default one are base groups (static, semantic):
 * they contribute to the base and produce no per-mode build of their own.
 * Real axes (lightness, density, …) contribute their default and produce
 * one per-mode build per non-default mode.
 *
 * Output shape is identical to the original `listModes`, so the unchanged
 * style-dictionary.mjs / formats / transforms / preprocessors consume it as-is.
 */
import { readdirSync, readFileSync } from 'node:fs';

const FAMILY_DOCS_KEY = 'token_family_docs';

const isBaseGroup = (g) => g.modes.length === 1 && g.modes[0].isDefault;

export function listModes(themesFolder) {
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
	// Match on name AND group: `ui_scale` and `viewport` both have sm/md/lg,
	// so a name-only lookup (as in the original) would pick the wrong theme.
	const theme = themes.find((t) => t.name === name && t.group === group);
	if (!theme) {
		throw new Error(`No theme "${name}" in group "${group}" found in $themes.json`);
	}
	return theme;
}

/** Token sets of every mode group at its default mode. */
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
