import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {warn} from '../utils';

export interface IUpdateV4Schema {}

export class UpdateV4toV5 implements ObIMigrations {
	dependencies = {};
	applyMigrations(_options: IUpdateV4Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			warn(_context, 'The update schematics from version 4 to 5 have been removed. Please update to version 5 first');
			return chain([])(tree, _context);
		};
	}
}
