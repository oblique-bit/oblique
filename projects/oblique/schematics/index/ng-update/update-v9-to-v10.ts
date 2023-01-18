import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {applyInTree, createSafeRule, infoMigration, removeImport, replaceInFile, setAngularProjectsConfig} from '../utils';
import {ObIMigrations} from './ng-update.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV9Schema {}

export class UpdateV9toV10 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV9Schema): Rule {
		return (tree: Tree, _context: SchematicContext) =>
			chain([
				this.renameIcons(),
				this.removeObUseObliqueIcons(),
				this.removeTelemetryFromMainTs(),
				this.removeBootstrapCSS(),
				this.removeMaterialCSS()
			])(tree, _context);
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

	private removeTelemetryFromMainTs(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove the OB_PROJECT_INFO injection token');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'OB_PROJECT_INFO', '@oblique/oblique');
				replaceInFile(tree, filePath, /import\s+packageInfo\s+from\s+['"]\.\.\/package\.json['"]\s*;\s?/s, '');
				replaceInFile(tree, filePath, /(?:,\s*)?{\s*provide\s*:\s*OB_PROJECT_INFO\s*,\s*useValue\s*:\s*{.*}\s*}/s, '');
				replaceInFile(tree, filePath, /\s*\[\s*]\s*/, '');
			};
			return applyInTree(tree, apply, 'main.ts');
		});
	}

	private removeBootstrapCSS(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove oblique-bootstrap and oblique-utilities from angular.json');
			const apply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					/^\s*"node_modules\/@oblique\/oblique\/styles\/s?css\/oblique-(?:utilities|bootstrap)\.s?css",?\n?/gm,
					''
				);
			};
			return applyInTree(tree, apply, 'angular.json');
		});
	}

	private removeMaterialCSS(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove oblique-material from angular.json');
			return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: any) =>
				(config || []).filter((style: string) => !/node_modules\/@oblique\/oblique\/styles\/s?css\/oblique-material\.s?css/.test(style))
			);
		});
	}
}
