import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {applyInTree, createSafeRule, infoMigration, removeImport, replaceInFile} from '../utils';
import {ObIMigrations} from './ng-update.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV9Schema {}

export class UpdateV9toV10 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV9Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => chain([this.renameIcons(), this.removeObUseObliqueIcons()])(tree, _context);
	}

	private renameIcons(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Rename attachement into attachment for icon names');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /svgIcon="attachement/g, 'svgIcon="attachment');
				replaceInFile(tree, filePath, /svgIcon="mail-attachement/g, 'svgIcon="mail-attachment');
				replaceInFile(tree, filePath, /ObEIcon.ATTACHEMENT/g, 'ObEIcon.ATTACHMENT');
				replaceInFile(tree, filePath, /ObEIcon.MAIL_ATTACHEMENT/g, 'ObEIcon.MAIL_ATTACHMENT');
			};
			return applyInTree(tree, toApply, '*.{ts,html}');
		});
	}

	private removeObUseObliqueIcons(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove ObUseObliqueIcons');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObUseObliqueIcons', '@oblique/oblique');
				replaceInFile(tree, filePath, /(?:,\s*)?{\s*provide\s*:\s*ObUseObliqueIcons\s*,\s*useValue\s*:\s*(?:true|false)\s*}/, '');
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}
}
