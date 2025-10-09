import {register} from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import {logVerbosityLevels} from 'style-dictionary/enums';
import {coreFormat} from './style-dictionary-formats.mjs';
import {colorTransform, kebabTransform} from './style-dictionary-transforms.mjs';
import {compositionPreprocessor} from './style-dictionary-preprocessors.mjs';

register(StyleDictionary, {});
StyleDictionary.registerFormat(coreFormat);
StyleDictionary.registerTransform(kebabTransform);
StyleDictionary.registerTransform(colorTransform);
StyleDictionary.registerPreprocessor(compositionPreprocessor);

export async function generateCSS(files, libFolder) {
	const modes = [{exclude: /(?:prose|lg|sm|low|mobile|dark|compact|spacious)\.json/}];

	for (const config of buildConfigs(modes, files, libFolder)) {
		await config.buildAllPlatforms();
	}
}

function buildConfigs(modes, files, libFolder) {
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
							'ts/shadow/innerShadow'
						],
						files: [
							{
								destination: `${libFolder}/styles/oblique-tokens.css`,
								format: coreFormat.name
							}
						]
					}
				},
				log: {
					verbosity: logVerbosityLevels.verbose
				}
			})
	);
}
