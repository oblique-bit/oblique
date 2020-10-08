import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {checkPrecondition, getDepVersion} from '../ng-add-utils';
import {infoMigration, infoText, installDependencies, success, warn} from '../ng-utils';
import {obliqueFeatures} from './rules/obliqueFeatures';
import {toolchain} from './rules/toolchain';
import {oblique} from './rules/oblique';
import {execSync} from 'child_process';

export function addOblique(_options: any): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([preconditions(), oblique(_options), obliqueFeatures(_options), toolchain(_options), installDependencies(), finalize(_options)])(tree, _context);
}

function preconditions(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoText(_context, 'Executing migrations of package "@oblique/oblique"');
		checkPrecondition(tree, '@angular/core');
		checkPrecondition(tree, '@angular/router');
		if (!getDepVersion(tree, '@angular/localize')) {
			infoMigration(_context, 'Installing missing peer dependency "@angular/localize"');
			execSync('ng add @angular/localize');
		}

		return tree;
	};
}

function finalize(options: any): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		/* eslint-disable max-len */
		const text =
			options.font === 'frutiger'
				? 'Due to licence restrictions, Frutiger font files cannot be delivered with Oblique. \nThey can either be obtained from the federal chancellery intranet\n(https://intranet.bk.admin.ch/bk-intra/de/home/dl-koordination-bund/kommunikation/webforum-bund/Downloads.html) or requested from webforum@bk.admin.ch. Moreover, each project is responsible for the font protection according to its licence. (https://github.com/swiss/styleguide/blob/master/src/assets/fonts/LICENSE). The proposed solution consist of only delivering the font if the Referer Http header is whitelisted.'
				: 'Furtiger is mandatory for CI/CD conformity';
		/* eslint-enable max-len */

		warn(_context, text);
		success(_context, 'Oblique has been successfully integrated. Please review the changes.');
		return tree;
	};
}
