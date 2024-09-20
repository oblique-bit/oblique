import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {addDependency, checkPrecondition, getPreconditionVersion} from './ng-add-utils';
import {ObIOptionsSchema} from './ng-add.model';
import {
	checkForSSR,
	checkForStandalone,
	createSafeRule,
	infoMigration,
	infoText,
	installDependencies,
	isSuccessful,
	success,
	warn
} from '../utils';
import {obliqueFeatures} from './rules/obliqueFeatures';
import {toolchain} from './rules/toolchain';
import {oblique} from './rules/oblique';

export function addOblique(_options: ObIOptionsSchema): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			checkForStandalone(),
			checkForSSR(),
			preconditions(),
			oblique(_options),
			obliqueFeatures(_options),
			toolchain(_options),
			installDependencies(),
			finalize(_options)
		])(tree, _context);
}

function preconditions(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoText(_context, 'Executing migrations of package "@oblique/oblique"');

		checkPrecondition(tree, '@angular/core');
		checkPrecondition(tree, '@angular/router');

		installMissingDependencies(tree, _context, ['@popperjs/core', 'angular-oauth2-oidc', 'jwt-decode']);

		return tree;
	};
}

function installMissingDependencies(tree: Tree, context: SchematicContext, dependencies: string[]): void {
	dependencies
		.filter(dependency => getPreconditionVersion(tree, dependency))
		.forEach(dependency => {
			infoMigration(context, `Installing missing peer dependency "${dependency}"`);
			addDependency(tree, dependency);
		});
}

function finalize(options: ObIOptionsSchema): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		/* eslint-enable max-len */
		if (isSuccessful) {
			success(_context, 'Oblique has been successfully integrated. Please review the changes.');
		} else {
			warn(_context, 'Oblique has only been partially integrated. Please check for warnings in the console and review the changes.');
		}
		if (options.husky) {
			infoText(_context, 'Please run "npm prepare" to finalize Husky installation.');
		}

		return tree;
	});
}
