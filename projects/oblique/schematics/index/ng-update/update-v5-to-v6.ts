import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {IMigrations} from './ng-update-utils';
import {infoMigration} from '../utils';

export interface IUpdateV5Schema {}

export class UpdateV5toV6 implements IMigrations {
	dependencies = {
		'@angular/core': 11,
		'@angular/router': (angular: number) => angular,
		'@ngx-translate/core': 14,
		'@ng-bootstrap/ng-bootstrap': [8, 0],
		'@angular/material': (angular: number) => [angular, 0],
		ajv: [6, 0]
	};

	applyMigrations(_options: IUpdateV5Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Analyzing project');

			return chain([
				/* banner */
			])(tree, _context);
		};
	}
}
