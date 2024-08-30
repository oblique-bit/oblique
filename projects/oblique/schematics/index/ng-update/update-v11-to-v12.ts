import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {checkForSSR, checkForStandalone} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV11Schema {}

export class UpdateV11toV12 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV11Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => chain([checkForStandalone(), checkForSSR()])(tree, _context);
	}
}
