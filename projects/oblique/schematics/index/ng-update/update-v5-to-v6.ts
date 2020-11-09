import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {IMigrations} from './ng-update-utils';
import {addAngularConfigInList, getDefaultAngularConfig, infoMigration, readFile} from '../utils';
import {getTemplate} from '../ng-add/ng-add-utils';

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
				this.addFeatureDetection()
				/* banner */
			])(tree, _context);
		};
	}

	private addFeatureDetection(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Oblique: Adding browser compatibility check');
			let index = getDefaultAngularConfig(tree, ['architect', 'build', 'options', 'index']);
			if (!tree.exists(index)) {
				index = './index.html';
			}
			if (tree.exists(index)) {
				tree.overwrite(
					index,
					readFile(tree, index)
						.replace(/<noscript.*<\/noscript>\s/s, '')
						.replace(/<!--\[if lt.*?endif]-->\s/s, '')
						.replace(/<!--\[if gte.*(<html.*?>).*endif]-->\s/s, '$1')
						.replace('<body>\n', '<body>\n' + getTemplate(tree, 'default-index.html'))
				);
			}
			return addAngularConfigInList(tree, ['architect', 'build', 'options', 'scripts'], 'node_modules/@oblique/oblique/ob-features.js');
		};
	}
}
