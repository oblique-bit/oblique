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

export async function generateCSS(modes, libFolder) {
	const components = listComponents(modes, libFolder);
	for (const config of buildConfigs(modes, libFolder, components)) {
		await config.buildAllPlatforms();
	}
}

function buildConfigs(modes, libFolder, components) {
	return modes.map(
		mode =>
			new StyleDictionary({
				source: mode.tokenSets,
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

function listComponents(modes, libFolder) {
	return [
		...new Set(
			modes
				.flatMap(mode => mode.tokenSets)
				.filter(path => path.includes('/04_component/'))
				.map(path => /(?<=component\/(?:atom|molecule)\/)[\w-]+/.exec(path)[0])
		),
	].filter(component => existsSync(`${libFolder}/${component}`));
}
