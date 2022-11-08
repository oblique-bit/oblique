import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV9Schema {}

export class UpdateV9toV10 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV9Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => chain([])(tree, _context);
	}
}
