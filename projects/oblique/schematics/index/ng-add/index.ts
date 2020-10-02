import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {colors} from '@angular-devkit/core/src/terminal';
import {getAngularVersion, installDependencies} from '../ng-add-utils';
import {obliqueToolchain} from './rules/obliqueToolchain';
import {obliqueFeatures} from './rules/obliqueFeatures';
import {toolchain} from './rules/toolchain';
import {oblique} from './rules/oblique';
import {execSync} from 'child_process';

export function addOblique(_options: any): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([addPreconditions(), oblique(_options), obliqueFeatures(_options), obliqueToolchain(_options), toolchain(_options), installDependencies()])(
			tree,
			_context
		);
}

function addPreconditions(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const pkg = tree.read('./package.json').toString();
		const error = checkPreconditions(tree, pkg);
		if (error) {
			throw new Error(`[ERROR] ${error}`);
		}
		if (!pkg.includes('"@angular/localize"')) {
			_context.logger.info(colors.blue('- Seems there is no @localize, will add it for you...'));
			execSync('ng add @angular/localize');
		}

		_context.logger.info(colors.black(colors.bold(`\nTHANK YOU FOR USING OBLIQUE! STARTING ADDING OBLIQUE TO YOUR PROJECT 💙 \n`)));

		return tree;
	};
}

function checkPreconditions(tree: Tree, pkg: string): string {
	if (getAngularVersion(tree) < 9) {
		return 'Oblique 5 needs at least Angular 9. Please upgrade Angular and restart the script.';
	}
	if (!pkg.includes('"@angular/router"')) {
		return 'Oblique needs the @angular/router package to work properly. Please integrate it and restart the script.';
	}

	return '';
}
