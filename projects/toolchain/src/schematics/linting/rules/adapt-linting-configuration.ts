import {type Rule, type Tree, chain, template} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../../logger';
import {addPropertyToJsonFile, readJson} from '../../shared/json';
import {closeLogger} from '../../shared/logger-close';
import {createFromTemplate} from '../../shared/template/template';

export function adaptLintingConfiguration(logger: ObGroupLogger, prefix: string): Rule {
	return () => {
		const loggerGroup = logger.group('Adapt linting configuration');
		return chain([
			addLintPackageJsonProperties(loggerGroup),
			addConfigurationFiles(loggerGroup, prefix),
			closeLogger(loggerGroup),
		]);
	};
}

function addLintPackageJsonProperties(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		logger.step(`Add "scripts.format" property to package.json`);
		addPropertyToJsonFile(tree, 'package.json', {key: 'scripts.format', value: 'npm run lint -- --fix'});
		return tree;
	};
}

function addConfigurationFiles(logger: ObGroupLogger, prefix: string): Rule {
	return (tree: Tree) => {
		logger.step(`Add "eslint.config.mjs" and "tsconfig.eslint.json" configuration files`);
		const tsconfig = readJson(tree, 'tsconfig.json');
		const references = tsconfig['references'] ?? [];
		if (Array.isArray(references)) {
			references.push({path: 'tsconfig.eslint.json'});
			addPropertyToJsonFile(tree, 'tsconfig.json', {key: 'references', value: references});
		} else {
			logger.stepError(
				'Could not reference "tsconfig.eslint.json" in "tsconfig.json" because "references" array is invalid. ' +
					'Lint script might report additional errors about environment files'
			);
		}
		return createFromTemplate('./templates', [template({prefix})]);
	};
}
