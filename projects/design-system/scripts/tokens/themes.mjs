import {readFileSync} from 'node:fs';
import {checkoutThemeFiles} from './git.mjs';

export function listModes(themesPath) {
	checkoutThemeFiles(themesPath);
	return buildModes(themesPath);
}

function buildModes(sourceFolder) {
	const [baseThemeNames, modes] = parseModes(sourceFolder);
	const themes = listThemes(sourceFolder);
	const tokenSetOrder = getTokenSetOrder(sourceFolder);
	const baseTokenSets = listBaseTokenSets(baseThemeNames, themes);

	return [
		{mode: 'core', tokenSets: [...baseTokenSets, ...listModeTokenSets(modes, themes, {name: 'core'})]},
		...listTokenSets(modes, themes, baseTokenSets),
	].map(mode => ({
		...mode,
		tokenSets: mode.tokenSets
			.filter(tokenSet => !tokenSet.startsWith('NO-DS'))
			.sort((first, second) => tokenSetOrder.get(first) - tokenSetOrder.get(second))
			.map(path => `${sourceFolder}/${path}.json`),
	}));
}

function parseModes(sourceFolder) {
	const rawModes = JSON.parse(readFileSync(`${sourceFolder}/01_global/modes.json`).toString('utf-8')).ob.g.modes;
	const modes = Object.entries(rawModes).map(([group, modes]) => ({group, modes}));

	return [getBaseThemeNames(modes), getModes(modes)];
}

function getBaseThemeNames(modes) {
	return modes
		.filter(mode => mode.modes.$value === 'default')
		.reduce((tokenSets, mode) => [...tokenSets, mode.group], []);
}

function getModes(modes) {
	return modes
		.filter(mode => !mode.modes.$value)
		.flatMap(({group, modes}) => [
			Object.entries(modes).map(([name, value]) => ({
				name,
				group,
				selector: value.$value,
			})),
		])
		.flat();
}

function listThemes(sourceFolder) {
	return JSON.parse(readFileSync(`${sourceFolder}/$themes.json`).toString('utf-8')).filter(
		theme => !theme.group.startsWith('_') && theme.group !== 'R13'
	);
}

function getTokenSetOrder(sourceFolder) {
	const {tokenSetOrder} = JSON.parse(readFileSync(`${sourceFolder}/$metadata.json`).toString('utf-8'));
	return new Map(tokenSetOrder.map((tokenSet, index) => [tokenSet, index]));
}

function listBaseTokenSets(base, themes) {
	return themes.filter(theme => base.includes(theme.name)).flatMap(theme => Object.keys(theme.selectedTokenSets));
}

function listModeTokenSets(modes, themes, refMode) {
	return modes
		.filter(
			mode =>
				(mode.group === refMode.group && mode.name === refMode.name) ||
				(mode.group !== refMode.group && mode.selector === 'default')
		)
		.flatMap(mode => Object.keys(themes.find(theme => theme.name === mode.name).selectedTokenSets));
}

function listTokenSets(modes, themes, baseTokenSets) {
	return modes.map(mode => ({
		...mode,
		tokenSets: baseTokenSets.concat(listModeTokenSets(modes, themes, mode)),
	}));
}
