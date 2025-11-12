import {register} from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import {logVerbosityLevels} from 'style-dictionary/enums';
import {componentFormat, coreFormat} from './style-dictionary-formats.mjs';
import {colorTransform, kebabTransform} from './style-dictionary-transforms.mjs';
import {compositionPreprocessor} from './style-dictionary-preprocessors.mjs';
import {existsSync} from 'node:fs';

register(StyleDictionary, {});
StyleDictionary.registerFormat(coreFormat);
StyleDictionary.registerFormat(componentFormat);
StyleDictionary.registerTransform(kebabTransform);
StyleDictionary.registerTransform(colorTransform);
StyleDictionary.registerPreprocessor(compositionPreprocessor);

export async function generateCSS(files, libFolder) {
	const modes = [
		{exclude: /(?:prose|lg|sm|low|mobile|dark|compact|spacious)\.json/},
		{
			exclude: /(?:prose|lg|sm|low|mobile|light|compact|spacious)\.json/,
			selector: '@media (prefers-color-scheme: dark)',
		},
		{exclude: /(?:prose|lg|sm|low|desktop|dark|compact|spacious)\.json/, selector: '@media (width <= 767px)'},
		{exclude: /(?:prose|md|sm|low|mobile|dark|compact|spacious)\.json/, selector: '.ob-size-lg'},
		{exclude: /(?:prose|lg|md|low|mobile|dark)|compact|spacious\.json/, selector: '.ob-size-sm'},
		{exclude: /(?:prose|lg|md|low|mobile|dark)|standard|spacious\.json/, selector: '.ob-density-compact'},
		{exclude: /(?:prose|lg|md|low|mobile|dark)|compact|standard\.json/, selector: '.ob-density-spacious'},
		{exclude: /(?:interface|lg|sm|low|mobile|dark|compact|spacious)\.json/, selector: '.ob-typography-context-prose'},
	];

	for (const config of buildConfigs(modes, files, libFolder)) {
		await config.buildAllPlatforms();
	}
}

function buildConfigs(modes, files, libFolder) {
	const components = listComponents(files, libFolder);
	return modes.map(
		mode =>
			new StyleDictionary({
				source: files.filter(file => !mode.exclude.test(file)),
				preprocessors: [compositionPreprocessor.name, 'tokens-studio'],
				expand: true,
				platforms: {
					css: {
						transforms: [
							kebabTransform.name,
							colorTransform.name,
							'ts/color/modifiers',
							'ts/size/px',
							'ts/resolveMath',
							'ts/shadow/innerShadow',
						],
						files: [
							{
								destination: `${libFolder}/styles/oblique-tokens.css`,
								format: coreFormat.name,
								options: {
									mode: mode.selector,
								},
							},
							...components.map(component => ({
								destination: `${libFolder}/${component}/${component}-tokens.css`,
								format: componentFormat.name,
								options: {
									mode: mode.selector,
									component,
								},
							})),
						],
					},
				},
				log: {
					verbosity: logVerbosityLevels.verbose,
				},
			})
	);
}

function listComponents(files, libFolder) {
	return [
		...new Set(
			files
				.filter(path => path.includes('/04_component/'))
				.map(path => /(?<=component\/(?:atom|molecule)\/)[\w-]+/.exec(path)[0])
		),
	].filter(component => existsSync(`${libFolder}/${component}`));
}
