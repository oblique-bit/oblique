import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {addDependency, checkPrecondition, getPreconditionVersion} from './ng-add-utils';
import {ObIOptionsSchema} from './ng-add.model';
import {infoMigration, infoText, installDependencies, success, warn} from '../utils';
import {obliqueFeatures} from './rules/obliqueFeatures';
import {toolchain} from './rules/toolchain';
import {oblique} from './rules/oblique';
import {execSync} from 'child_process';

export function addOblique(_options: ObIOptionsSchema): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([preconditions(), oblique(_options), obliqueFeatures(_options), toolchain(_options), installDependencies(), finalize(_options)])(tree, _context);
}

function preconditions(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoText(_context, 'Executing migrations of package "@oblique/oblique"');

		checkPrecondition(tree, '@angular/core');
		checkPrecondition(tree, '@angular/router');

		installAngularLocalizeIfMissing(tree, _context);
		installPopperjsIfMissing(tree, _context);

		return tree;
	};
}

function installAngularLocalizeIfMissing(tree: Tree, context: SchematicContext): void {
	const angularLocalizeVersion = getPreconditionVersion(tree, '@angular/localize');

	if (angularLocalizeVersion) {
		infoMigration(context, 'Installing missing peer dependency "@angular/localize"');
		execSync(`ng add @angular/localize@${angularLocalizeVersion} --skip-confirmation`);
	}
}

function installPopperjsIfMissing(tree: Tree, context: SchematicContext): void {
	const popperjsVersion = getPreconditionVersion(tree, '@popperjs/core');

	if (popperjsVersion) {
		infoMigration(context, 'Installing missing peer dependency "@popperjs/core"');
		addDependency(tree, '@popperjs/core');
	}
}

function finalize(options: ObIOptionsSchema): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		/* eslint-disable max-len */
		const text =
			options.font === 'frutiger'
				? 'Due to licence restrictions, Frutiger font files cannot be delivered with Oblique. \nThey can either be obtained from the federal chancellery intranet\n(https://intranet.bk.admin.ch/bk-intra/de/home/dl-koordination-bund/kommunikation/webforum-bund/Downloads.html) or requested from webforum@bk.admin.ch. Moreover, each project is responsible for the font protection according to its licence. (https://github.com/swiss/styleguide/blob/master/src/assets/fonts/LICENSE). The proposed solution consist of only delivering the font if the Referer Http header is whitelisted.'
				: 'Frutiger is mandatory for CI/CD conformity';
		/* eslint-enable max-len */

		warn(_context, text);
		success(_context, 'Oblique has been successfully integrated. Please review the changes.');
		return tree;
	};
}
