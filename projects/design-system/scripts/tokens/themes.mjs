import {readFileSync} from 'node:fs';
import {checkoutThemeFiles} from './git.mjs';

export function getThemes(themesPath) {
	checkoutThemeFiles(themesPath);
	return listThemeFiles(themesPath);
}

function listThemeFiles(sourceFolder) {
	return JSON.parse(readFileSync(`${sourceFolder}/$metadata.json`).toString('utf-8'))
		.tokenSetOrder.filter(path => !path.includes('NO-DS'))
		.map(path => `${sourceFolder}/${path}.json`);
}
