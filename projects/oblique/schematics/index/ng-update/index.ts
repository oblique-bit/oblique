import {execSync} from 'child_process';
// install ts-morph tools as dev dependency
console.info('Preparing tools for migration, please wait...');
execSync('npm i -D --silent ts-morph');
execSync('npm i -D --silent @ts-morph/common');
import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {IUpdateSchema, IMigratable} from './update-schema';
import {UpdateV4toV5} from './update-v4-to-v5';
import {colors} from '@angular-devkit/core/src/terminal';
import {OB_VERSION, OB_LATEST, OB_LAST_MAJOR_SUPPORT_VERSION, SchematicsUtil} from '../ng-update-utils';

export function initalize(_options: IUpdateSchema): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const util: SchematicsUtil = SchematicsUtil.getInstance();
		const readVersion = util.getCurrentObliqueVersion(tree) || '100';
		const match = readVersion.match(/\d+/);
		const numericObVersion = match && match.length > 0 ? match[0] : '100';

		if (parseInt(numericObVersion, 0) < OB_LAST_MAJOR_SUPPORT_VERSION) {
			throw new Error(`[ERROR] Oblique Major ${numericObVersion} is not supported anymore - no migration possible. Sorry.`);
		}

		let migratable: IMigratable = {} as IMigratable;
		let latestVersion = OB_LATEST;

		switch (_options.targetVersion) {
			case '5':
				migratable = new UpdateV4toV5();
				latestVersion = OB_VERSION['version-5'].LATEST;
				break;
			case '6':
				_context.logger.info(colors.red('\nNOT SUPPORTED YET, TRY VERSION 5 - ABORTING\n'));
				return tree;
			default:
		}

		_context.logger.info(colors.black(colors.bold(`\nTHANK YOU FOR USING OBLIQUE! STARTING MIGRATION TO OBLIQUE V${_options.targetVersion} 💙 \n`)));

		return chain([
			migratable.applyMigrations(_options),
			migratable.updateToLatest(_options, latestVersion),
			migratable.updatePeerDependencies(_options),
			finish(),
			util.installDependencies()
		])(tree, _context);
	};
}

export function finish(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.logger.info(colors.black(colors.bold("\n WE'RE DONE WITH OBLIQUE MIGRATIONS 👌 !")));
		_context.logger.info(colors.black(colors.bold('LET US JUST UPDATE OTHER PACKAGES TO CONCLUDE.')));
		_context.logger.info(colors.black(colors.bold('run ng update and npm outdated to discover the concerned packages \n')));
		_context.logger.info(colors.black(colors.bold('\n NOTE: Please check that the changes are correct')));
		_context.logger.info(colors.black(colors.bold("especially it's possible that some word containing 'or' have been wrongly changed")));
		_context.logger.info(colors.black(colors.bold('or if you have implementations that are named the same as in Oblique!')));
	};
}
