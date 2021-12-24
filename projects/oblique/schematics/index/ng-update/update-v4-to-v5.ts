import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {warn} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV4Schema {}

export class UpdateV4toV5 implements ObIMigrations {
	dependencies = {};
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV4Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			warn(_context, 'The update schematics from version 4 to 5 have been removed. Please update to version 5 first');
			return chain([])(tree, _context);
		};
	}
}
