import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { IMigratable } from './update-schema';
import { colors } from '@angular-devkit/core/src/terminal';
import { PROJECT_PACKAGE_JSON, OB_PACKAGE, getFile, OB_PACKAGE_JSON, upsertPackageJSONDependency } from '../utils';

export class UpdateV4toV5 implements IMigratable {
	updateToLatest(_options: any, latestVersion: string): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`Set latest major oblique dependency`));

			const projectPackageJSON = JSON.parse(getFile(tree, PROJECT_PACKAGE_JSON));
			projectPackageJSON['dependencies'][OB_PACKAGE] = latestVersion;
			tree.overwrite(PROJECT_PACKAGE_JSON, JSON.stringify(projectPackageJSON, null, '\t'));

			_context.logger.info(colors.black(`... done `) + colors.green(`✔`));
			return tree;
		};
	}

	updatePeerDependencies(_options: any): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`Update peer dependencies`));

			const obPackageJSON = JSON.parse(getFile(tree, OB_PACKAGE_JSON));
			const changes: Rule[] = [];
			Object.keys(obPackageJSON['peerDependencies']).forEach(name => {
				changes.push(upsertPackageJSONDependency(name, obPackageJSON['peerDependencies'][name]));
			});

			return chain(changes)(tree, _context);
		};
	}

	applyMigrations(_options: any): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`Apply migrations`));
			return chain([
				migratePopUpService(),
				migrateMasterLayout(),
				migrateTestingModule(),
				migrateDatePicker(),
				migrateWindow()
			])(tree, _context);
		};
	}
}

function migratePopUpService(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.logger.info(colors.blue(`- PopUpService`) + colors.green(` ✔`));
		// TODO
		return tree;
	};
}

function migrateMasterLayout(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.logger.info(colors.blue(`- MasterLayout`) + colors.green(` ✔`));
		// TODO
		return tree;
	};
}

function migrateTestingModule(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.logger.info(colors.blue(`- TestingModule`) + colors.green(` ✔`));
		// TODO
		return tree;
	};
}

function migrateDatePicker(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.logger.info(colors.blue(`- DatePicker`) + colors.green(` ✔`));
		// TODO
		return tree;
	};
}

function migrateWindow(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.logger.info(colors.blue(`- Window`) + colors.green(` ✔`));
		// TODO
		return tree;
	};
}
