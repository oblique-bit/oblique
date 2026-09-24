import type {ObGroupLogger} from '../../../logger';
import {type Rule, type Tree, chain} from '@angular-devkit/schematics';
import {closeLogger} from '../../shared/logger-close';
import {callExternalSchematics} from '../../shared/external-schematics';

export function installAngularEslint(logger: ObGroupLogger): Rule {
	return () => {
		const loggerGroup = logger.group('Add angular-eslint');
		return chain([
			callExternalSchematics(loggerGroup, 'angular-eslint', 'ng-add'),
			deleteLintConfigurationFiles(loggerGroup),
			closeLogger(loggerGroup),
		]);
	};
}

function deleteLintConfigurationFiles(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		// this unwanted file is added by angular-eslint
		const esLintConfigPath = 'eslint.config.js';
		if (tree.exists(esLintConfigPath)) {
			logger.step(`Remove "${esLintConfigPath}" configuration file`);
			tree.delete(esLintConfigPath);
		}
		return tree;
	};
}
