/**
 * Mode discovery for the Style Dictionary build.
 *
 * Reads $themes.json, $metadata.json, and per-axis mode metadata from
 * 01_global/mode_collection/<axis>.json (root ob.g.mode_collection.<axis>).
 * Returns one build descriptor per mode:
 *  - { mode: 'static', tokenSets } — every group at its default mode.
 *  - { name, group, selector, tokenSets } — one per non-default mode of
 *    each real axis.
 *
 * Uniform "default" rule: every $themes.json group has a matching
 * mode_collection/<axis>.json file (including base groups static and
 * semantic). Inside each file, exactly one mode carries
 * selector.$value === 'default'. That default mode's token sets contribute
 * to the always-on base. Single-mode base groups (static, semantic)
 * contribute their tokens to every build and produce no per-mode build of
 * their own. Real axes (lightness, density, …) contribute their default
 * mode and produce one per-mode build per non-default mode.
 *
 * viewport modes live one level deeper, under
 * ob.g.mode_collection.viewport.range, peer to the breakpoint primitives.
 * Theme lookup matches on (name, group) since ui_scale and viewport share
 * the mode names sm/md/lg.
 */

import {readdirSync, readFileSync} from 'node:fs';
import {checkoutThemeFiles} from './git.mjs';

const isBaseGroup = g => g.modes.length === 1 && g.modes[0].isDefault;

export function listModes(themesPath) {
	checkoutThemeFiles(themesPath);
	return buildModes(themesPath);
}

function buildModes(themesFolder) {
	const themes = readThemes(themesFolder);
	const tokenSetOrder = readTokenSetOrder(themesFolder);
	const modeGroups = readModeGroups(themesFolder);

	const switchableModes = modeGroups
		.filter(g => !isBaseGroup(g))
		.flatMap(g => g.modes.map(m => ({...m, group: g.group})));

	const builds = [
		{mode: 'static', tokenSets: defaultTokenSets(modeGroups, themes)},
		...switchableModes.map(mode => ({
			name: mode.name,
			group: mode.group,
			selector: mode.selector,
			tokenSets: modeTokenSets(mode, modeGroups, themes),
		})),
	];

	return builds.map(build => ({
		...build,
		tokenSets: [...new Set(build.tokenSets)]
			.filter(set => !set.startsWith('NO-DS'))
			.sort((a, b) => (tokenSetOrder.get(a) ?? 0) - (tokenSetOrder.get(b) ?? 0))
			.map(set => `${themesFolder}/${set}.json`),
	}));
}

function readThemes(themesFolder) {
	return JSON.parse(readFileSync(`${themesFolder}/$themes.json`).toString('utf-8')).filter(
		theme => !theme.group.startsWith('_') && theme.group !== 'R13'
	);
}

function readTokenSetOrder(themesFolder) {
	const {tokenSetOrder} = JSON.parse(readFileSync(`${themesFolder}/$metadata.json`).toString('utf-8'));
	return new Map(tokenSetOrder.map((set, index) => [set, index]));
}

function readModeGroups(themesFolder) {
	const dir = `${themesFolder}/01_global/mode_collection`;
	return readdirSync(dir)
		.filter(f => f.endsWith('.json'))
		.map(file => {
			const axis = file.replace(/\.json$/, '');
			const raw = JSON.parse(readFileSync(`${dir}/${file}`).toString('utf-8')).ob.g.mode_collection[axis];
			// viewport keeps its mode values under a `range` sub-tree (peer to
			// the `breakpoint` primitives); every other axis has its mode values
			// as direct children of the collection.
			const container = axis === 'viewport' ? raw.range : raw;
			// Skip non-mode siblings: token_family_docs and any sub-tree (e.g.
			// ui_scale / density `multiplier`) without a `selector` field.
			const modes = Object.entries(container)
				.filter(([, def]) => def.selector?.$value !== undefined)
				.map(([name, def]) => ({
					name,
					selector: def.selector.$value,
					isDefault: def.selector.$value === 'default',
				}));
			return {group: axis, modes};
		});
}

function themeFor(themes, name, group) {
	// Match on name AND group: ui_scale and viewport both carry sm/md/lg, so a
	// name-only lookup would pick the wrong theme.
	const theme = themes.find(t => t.name === name && t.group === group);
	if (!theme) {
		throw new Error(`No theme "${name}" in group "${group}" found in $themes.json`);
	}
	return theme;
}

function defaultTokenSets(modeGroups, themes) {
	return modeGroups.flatMap(g => {
		const def = g.modes.find(m => m.isDefault);
		return def ? Object.keys(themeFor(themes, def.name, g.group).selectedTokenSets) : [];
	});
}

function modeTokenSets(mode, modeGroups, themes) {
	const own = Object.keys(themeFor(themes, mode.name, mode.group).selectedTokenSets);
	const others = modeGroups
		.filter(g => g.group !== mode.group)
		.flatMap(g => {
			const def = g.modes.find(m => m.isDefault);
			return def ? Object.keys(themeFor(themes, def.name, g.group).selectedTokenSets) : [];
		});
	return [...own, ...others];
}
