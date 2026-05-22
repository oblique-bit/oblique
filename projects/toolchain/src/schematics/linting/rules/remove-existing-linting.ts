import {type Rule, type Tree, chain} from '@angular-devkit/schematics';
import {removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import type {ObGroupLogger} from '../../../logger';
import {closeLogger} from '../../shared/logger-close';
import {deletePropertyFromJsonFile, readJson} from '../../shared/json';

export function removeExistingLinting(logger: ObGroupLogger): Rule {
	return () => {
		const loggerGroup = logger.group('Remove existing lint solution');
		return chain([
			removeLintDependencies(loggerGroup),
			deleteLintConfigurationFiles(loggerGroup),
			deleteLintPackageJsonProperties(loggerGroup),
			closeLogger(loggerGroup),
		]);
	};
}

function removeLintDependencies(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		logger.step('Load package.json');
		const pkg = readJson(tree, 'package.json');
		Object.keys(pkg['devDependencies'] ?? [])
			.filter(key => key.includes('eslint'))
			.forEach(dependency => {
				logger.step(`Remove "${dependency}" dependency`);
				removePackageJsonDependency(tree, dependency);
			});
		return tree;
	};
}

function deleteLintConfigurationFiles(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		[
			'.eslintrc.js',
			'.eslintrc.cjs',
			'.eslintrc.json',
			'.eslintrc',
			'.eslintrc.yml',
			'.eslintrc.yaml',
			'eslint.config.js',
			'eslint.config.mjs',
		]
			.filter(path => tree.exists(path))
			.forEach(path => {
				logger.step(`Remove "${path}" configuration file`);
				tree.delete(path);
			});
		return tree;
	};
}

function deleteLintPackageJsonProperties(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		logger.step(`Remove "eslintConfig" property from package.json`);
		deletePropertyFromJsonFile(tree, 'package.json', 'eslintConfig');
		logger.step(`Remove "scripts.lint" property from package.json`);
		deletePropertyFromJsonFile(tree, 'package.json', 'scripts.lint');
		return tree;
	};
}
