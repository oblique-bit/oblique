import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {infoMigration} from '../utils';
import {removePolyFill} from './ng-update-utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV7Schema {}

export class UpdateV6toV7 implements ObIMigrations {
	dependencies = {};

	applyMigrations(_options: IUpdateV7Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Analyzing project');
			return chain([this.adaptPolyfills()])(tree, _context);
		};
	}

	adaptPolyfills(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Removing IE 11 polyfills');
			removePolyFill(tree, 'web-animations-js', /import\s+['"]web-animations-js['"];/);
			removePolyFill(tree, 'classlist.js', /import\s+['"]classlist.js['"];/);
		};
	}
}
