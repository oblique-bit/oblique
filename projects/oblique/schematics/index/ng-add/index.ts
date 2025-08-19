import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {addDependency, checkForMultiProject, checkPrecondition, getPreconditionVersion} from './ng-add-utils';
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

export function addOblique(options: ObIOptionsSchema): Rule {
	return (tree: Tree, context: SchematicContext) =>
		chain([
			checkForStandalone(),
			checkForMultiProject(),
			checkForSSR(),
			preconditions(),
			oblique(options),
			obliqueFeatures(options),
			toolchain(options),
			installDependencies(),
			finalize(options)
		])(tree, context);
}

function preconditions(): Rule {
	return (tree: Tree, context: SchematicContext) => {
		infoText(context, 'Executing migrations of package "@oblique/oblique"');

		checkPrecondition(tree, '@angular/core');
		checkPrecondition(tree, '@angular/router');

		installMissingDependencies(tree, context, ['@popperjs/core', 'angular-oauth2-oidc', 'jwt-decode']);

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
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (isSuccessful) {
			success(context, 'Oblique has been successfully integrated. Please review the changes.');
		} else {
			warn(context, 'Oblique has only been partially integrated. Please check for warnings in the console and review the changes.');
		}
		if (options.husky) {
			infoText(context, 'Please run "npm prepare" to finalize Husky installation.');
		}

		return tree;
	});
}
