import {Rule, SchematicContext, Tree, chain, externalSchematic} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {
	addImport,
	addInjectionInClass,
	applyInTree,
	createSafeRule,
	infoMigration,
	readFile,
	removeHtmlTagAttribute,
	removeImport,
	removeInjectionInClass,
	replaceInFile,
	setAngularProjectsConfig
} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV10Schema {}

export class UpdateV10toV11 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV10Schema): Rule {
		return (tree: Tree, _context: SchematicContext) =>
			chain([
				this.replaceObPopUpWithWindowInTests(),
				this.replaceObPopUpWithWindow(),
				this.removeInputVariantInNavTree(),
				this.removeInputActivateAncestorsInNavTree(),
				this.removeObSearchBox(),
				this.removeFakeFocus(),
				this.replaceScssWithCssStylesInAngularJson(),
				this.replaceNgContainerToken('obHeaderCustomControl'),
				this.replaceNgContainerToken('obLocales'),
				this.wrapOneLinerContentProjectionWithNgTemplate('obHeaderCustomControl'),
				this.wrapOneLinerContentProjectionWithNgTemplate('obLocales'),
				this.wrapMultiLinerContentProjectionWithNgTemplate('obHeaderCustomControl'),
				this.wrapMultiLinerContentProjectionWithNgTemplate('obLocales'),
				this.removeContentProjectionMarker('obHeaderCustomControl'),
				this.removeContentProjectionMarker('obLocales'),
				this.removeActivateServiceNavigationToken(),
				this.removeTableCicd(),
				this.runMDCMigration()
			])(tree, _context);
	}

	private replaceObPopUpWithWindowInTests(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Replace ObPopUpService with Window');
			const apply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (content.includes('ObPopUpService')) {
					addImport(tree, filePath, 'WINDOW', '@oblique/oblique');
					removeImport(tree, filePath, 'ObPopUpService', '@oblique/oblique');
					removeImport(tree, filePath, 'ObMockPopUpService', '@oblique/oblique');
					replaceInFile(
						tree,
						filePath,
						/\{\s*provide\s*:\s*ObPopUpService\s*,\s*useClass\s*:\s*Ob(?:Mock)?PopUpService\s*},?/g,
						'{provide: WINDOW, useValue: window},'
					);
					const propertyName =
						/(?<propertyName>\w+)\s*(?::\s*ObPopUpService)?\s*=\s*TestBed\s*\.\s*inject\(\s*ObPopUpService\s*\)\s*;/.exec(content)?.groups
							?.propertyName;
					if (propertyName) {
						replaceInFile(tree, filePath, new RegExp(`let\\s+${propertyName}\\s*(?::\\s*ObPopUpService\\s*)?;`, 'g'), '');
						replaceInFile(tree, filePath, new RegExp(`${propertyName}`, 'g'), 'window');
						replaceInFile(tree, filePath, /[^;]*TestBed\s*.\s*inject\(\s*ObPopUpService\s*\)\s*;/gs, '');
					}
				}
			};
			return applyInTree(tree, apply, '*.spec.ts');
		});
	}

	private replaceObPopUpWithWindow(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Replace ObPopUpService with Window');
			const apply = (filePath: string): void => {
				const varName = /(?<varname>\w+)\s*:\s*ObPopUpService/.exec(readFile(tree, filePath))?.groups?.varname;
				if (varName) {
					addInjectionInClass(tree, filePath, 'WINDOW', '@oblique/oblique');
					removeInjectionInClass(tree, filePath, 'ObPopUpService', '@oblique/oblique');
					replaceInFile(tree, filePath, new RegExp(`${varName}`, 'g'), 'window');
				}
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private removeInputVariantInNavTree(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove the @Input "variant" in the nav-tree component');
			const apply = (filePath: string): void => {
				removeHtmlTagAttribute(tree, filePath, 'ob-nav-tree', 'variant');
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private removeInputActivateAncestorsInNavTree(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove the @Input "activateAncestors" in the nav-tree component');
			const apply = (filePath: string): void => {
				removeHtmlTagAttribute(tree, filePath, 'ob-nav-tree', 'activateAncestors');
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private removeObSearchBox(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove search box feature');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObSearchBoxModule', '@oblique/oblique');
				removeImport(tree, filePath, 'ObSearchBoxComponent', '@oblique/oblique');
				removeImport(tree, filePath, 'ObISearchWidgetItem', '@oblique/oblique');
				replaceInFile(tree, filePath, /ObSearchBoxModule\s*,?\s*/, '');
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private removeFakeFocus(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove fake focus');
			const apply = (filePath: string): void => {
				removeImport(tree, filePath, 'ObNavTreeFakeFocusDirective', '@oblique/oblique');
				replaceInFile(tree, filePath, /\[?obNavTreeFakeFocus]?\s*=\s*["'].*?["']\s*/g, '');
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private replaceScssWithCssStylesInAngularJson(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Replace scss with css styles in angular.json');
			return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: string[]) => {
				const styles = ['oblique-core', 'oblique-alert', 'oblique-icons'];
				styles.forEach(style => {
					const index = config.indexOf(`node_modules/@oblique/oblique/styles/scss/${style}.scss`);
					if (index !== -1) {
						config[index] = `node_modules/@oblique/oblique/styles/css/${style}.css`;
					}
				});
				return config;
			});
		});
	}

	private replaceNgContainerToken(token: string): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Replace ${token} with #obHeaderControl`);
			const apply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					new RegExp(`<ng-container[^>]*?${token}.*?>(?<content>.*?)<\\/ng-container>`, 'gs'),
					'<ng-template #obHeaderControl>$<content></ng-template>'
				);
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private wrapOneLinerContentProjectionWithNgTemplate(token: string): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Wrap one liner ${token} with #obHeaderControl`);
			const apply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					new RegExp(`(?<content><(?<tag>[\\w-]+).*?${token}.*?>.*?<\\/\\k<tag>>)`, 'g'),
					'<ng-template #obHeaderControl>$<content></ng-template>'
				);
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private wrapMultiLinerContentProjectionWithNgTemplate(token: string): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Wrap ${token} with #obHeaderControl`);
			const apply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					new RegExp(`(?<content>(?<whitespace>[\t ]*)<(?<tag>[\\w-]+)[^<]*?${token}.*?>.*?^\\k<whitespace><\\/\\k<tag>>)`, 'gsm'),
					'<ng-template #obHeaderControl>\n$<content>\n</ng-template>'
				);
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private removeContentProjectionMarker(token: string): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Remove ${token} content projection marker`);
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, new RegExp(`\\s*${token}`, 'g'), '');
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private removeActivateServiceNavigationToken(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Remove OB_ACTIVATE_SERVICE_NAVIGATION token`);
			const apply = (filePath: string): void => {
				replaceInFile(
					tree,
					filePath,
					/{\s*provide\s*:\s*OB_ACTIVATE_SERVICE_NAVIGATION\s*,\s*useValue\s*:\s*(?:true|false)\s*}\s*,?\s*/,
					''
				);
				replaceInFile(tree, filePath, /OB_ACTIVATE_SERVICE_NAVIGATION\s*,?\s*/, '');
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private removeTableCicd(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Remove ob-table-cicd class`);
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, /\[class\.ob-table-cicd]=["']\w+["']/g, ''); // [class.ob-table-cicd]="true"
				replaceInFile(tree, filePath, /['"]ob-table-cicd["']\s*:[^},]*,?/g, ''); // [ngClass]="{'ob-table-cicd': true}"
				replaceInFile(tree, filePath, /ob-table-cicd/g, ''); // class="ob-table-cicd"
				replaceInFile(tree, filePath, /class\s*=\s*["']\s*["']/g, ''); // class=""
				replaceInFile(tree, filePath, /\[ngClass]\s*=\s*['"]\{\s*}\s*["']/g, ''); // [ngClass]="{}"
			};
			return applyInTree(tree, apply, '*.html');
		});
	}

	private runMDCMigration(): Rule {
		return createSafeRule((tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, `Runs the mdc-migration.`);
			return externalSchematic('@angular/material', 'mdc-migration', {
				components: ['all']
			});
		});
	}
}
