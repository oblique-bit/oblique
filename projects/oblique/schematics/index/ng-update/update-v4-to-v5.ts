import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {SchematicsUtil} from './ng-update-utils';
import {ObIMigrations} from './ng-update.model';
import {applyInTree, infoMigration, ObliquePackage, readFile, setAngularProjectsConfig} from '../utils';

export interface IUpdateV4Schema {}

export class UpdateV4toV5 implements ObIMigrations {
	dependencies = {
		'@angular/core': [9, 10],
		'@angular/router': (angular: number) => angular,
		'@ngx-translate/core': (angular: number) => (angular === 9 ? 12 : angular === 10 ? 13 : [12, 13]),
		'@ng-bootstrap/ng-bootstrap': (angular: number) => (angular === 9 ? [6, 0] : angular === 10 ? [7, 0] : [6, 7]),
		'@angular/material': (angular: number) => [angular, 0],
		ajv: [6, 0]
	};

	private static readonly util: SchematicsUtil = SchematicsUtil.getInstance();
	private static hasTranslateMultiLoader = false;

	applyMigrations(_options: IUpdateV4Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Analyzing project');
			UpdateV4toV5.util.loadBusinessSymbols(tree);

			return chain([
				this.migrateColorPalette(),
				this.migrateAutomaticTheming(),
				this.migratePopUpService(),
				this.migratePopUpServiceSpecs(),
				this.migrateMasterLayout(),
				this.migrateTestingModule(),
				this.migrateDatePickerModule(),
				this.migrateDatePickerHTML(),
				this.migrateWindow(),
				this.migrateNavTree(),
				this.migrateTextControlClearHTML(),
				this.migrateTextControlClearTS(),
				this.migrateInterceptor(),
				this.migrateTranslationFiles(),
				this.migrateTranslationCallsTS(),
				this.migrateTranslationCallsHTML(),
				this.migratePrefixesTS(),
				this.migratePrefixesHTML(),
				this.cleanUp()
			])(tree, _context);
		};
	}

	private migratePopUpService(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating PopUpService');
			const toInject = 'private readonly popUpService: PopUpService';
			const toApply = (filePath: string) => {
				const confirm = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.confirm/g), 'this.popUpService.confirm');
				const alert = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.alert/g), 'this.popUpService.alert');
				const prompt = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.prompt/g), 'this.popUpService.prompt');
				if (confirm || alert || prompt) {
					UpdateV4toV5.util.addToConstructor(tree, filePath, toInject);
					UpdateV4toV5.util.addImport(tree, filePath, 'PopUpService', ObliquePackage);
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private migratePopUpServiceSpecs(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			const toApply = (filePath: string) => {
				const confirm = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.confirm/g), 'this.popUpService.confirm');
				const alert = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.alert/g), 'this.popUpService.alert');
				const prompt = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.prompt/g), 'this.popUpService.prompt');
				if (confirm || alert || prompt) {
					UpdateV4toV5.util.addImport(tree, filePath, 'PopUpService', ObliquePackage);
					UpdateV4toV5.util.addImport(tree, filePath, 'MockPopUpService', ObliquePackage);
					UpdateV4toV5.util.addToTestBedConfig(tree, filePath, '{provide: PopUpService, useClass: MockPopUpService }', 'providers');
				}
			};
			return applyInTree(tree, toApply, '*.spec.ts');
		};
	}

	private migrateMasterLayout(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating scroll mode');
			const comment = `// TODO: The isScrollable property has been replaced by the scrollMode property that accepts 3 values:
//	* ObEScrollMode.AUTO (default value), that makes the navigation scrollable only when necessary
//	* ObEScrollMode.ENABLED, that always makes the navigation scrollable
//	* ObEScrollMode.DISABLED, that never makes the navigation scrollable
// As we cannot guess your use case, you have to adapt it yourself according to your needs.`;
			const toApply = (filePath: string) => {
				UpdateV4toV5.util.replaceInFile(tree, filePath, /(.*.navigation\.isScrollable)/gm, `${comment}\n$1`);
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private migrateTestingModule(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating testing module');
			const toApply = (filePath: string) => {
				if (readFile(tree, filePath).indexOf('configureTestingModule') !== -1) {
					UpdateV4toV5.util.removeImport(tree, filePath, 'MockTranslateService');
					UpdateV4toV5.util.addImport(tree, filePath, 'ObliqueTestingModule', ObliquePackage);
					UpdateV4toV5.util.addImport(tree, filePath, 'MockTranslateService', ObliquePackage);
					UpdateV4toV5.util.addImport(tree, filePath, 'TranslateService', '@ngx-translate/core');
					UpdateV4toV5.util.addToTestBedConfig(tree, filePath, 'ObliqueTestingModule', 'imports');
					UpdateV4toV5.util.removeFromTestBedConfig(tree, filePath, 'ObliqueModule', 'imports');
					UpdateV4toV5.util.removeImplicitDeclarations(tree, filePath, 'declarations');
					UpdateV4toV5.util.removeImplicitDeclarations(tree, filePath, 'imports');
					UpdateV4toV5.util.removeImplicitDeclarations(tree, filePath, 'providers');
					UpdateV4toV5.util.addToTestBedConfig(tree, filePath, '{ provide: TranslateService, useClass: MockTranslateService }', 'providers');
				}
			};
			return applyInTree(tree, toApply, '*.spec.ts');
		};
	}

	private migrateDatePickerModule(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating date picker');
			const toApply = (filePath: string) => {
				if (UpdateV4toV5.util.hasImport(tree, filePath, 'DatepickerModule', ObliquePackage)) {
					UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('DatepickerModule\\.forRoot\\(\\)', 'g'), 'DatepickerModule');
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private migrateDatePickerHTML(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			const toApply = (filePath: string) => {
				let html = readFile(tree, filePath);
				if (html.indexOf('</or-date-picker>') !== -1) {
					const projections = UpdateV4toV5.util.extractProjections('or-date-picker', html);
					const classRegex = /(class=("|')(\w|-|_)*("|'))/g;
					const attributeRegex = /(<((\w|-)+))|(<\/((\w|-)+))/g;

					let capture = false;
					let htmlSnippet: string[] = [];
					const htmlSnippets: string[] = [];

					html.split('\n').forEach((line: string) => {
						// start record
						capture = line.indexOf('<or-date-picker') !== -1 ? true : capture;
						if (capture) {
							htmlSnippet.push(line);
						}
						// save records and clean
						if (capture && line.indexOf('</or-date-picker>') !== -1) {
							htmlSnippets.push(htmlSnippet.join('\n'));
							capture = false;
							htmlSnippet = [];
						}
					});

					htmlSnippets.forEach((snippet: string, index: number) => {
						if (projections[index].trim() !== '') {
							const attributeList = UpdateV4toV5.util.extractFromBrackets('<>', snippet);
							const newSnippet = snippet.replace(`<${attributeList}>`, '');
							html = html.replace(snippet, newSnippet);
						}
					});

					projections.forEach((projection: string) => {
						if (projection.trim() !== '') {
							const matches = projection.match(attributeRegex) || [];
							const modifiedProjection = projection.replace(matches[0], '<or-date-picker').replace(matches[1], '</or-date-picker');
							html = html.replace(projection, modifiedProjection.replace('ngbDatepicker', '').replace(classRegex, ''));
						}
					});

					tree.overwrite(filePath, html);
				}
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private migrateWindow(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating Window token');
			const toInject = '@Inject(WINDOW) private readonly window';
			const toApply = (filePath: string) => {
				if (UpdateV4toV5.util.getClassImplementation(tree, filePath).join('').indexOf('window.') !== -1) {
					const window = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\./g), 'this.window.');
					if (window) {
						UpdateV4toV5.util.addImport(tree, filePath, 'Inject', '@angular/core');
						UpdateV4toV5.util.addImport(tree, filePath, 'WINDOW', ObliquePackage);
						UpdateV4toV5.util.addToConstructor(tree, filePath, toInject);
					}
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private migrateNavTree(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating nav tree');
			const toApply = (filePath: string) => {
				let html = readFile(tree, filePath);
				if (html.indexOf('</or-nav-tree>') !== -1) {
					const projections = UpdateV4toV5.util.extractProjections('or-nav-tree', html);
					projections.forEach((projection: string) => {
						html = html.replace(projection, '');
					});
					html = html
						.split('<or-nav-tree')
						.map((fragment: string, index: number) => {
							const projection = projections[index] ? projections[index] : '';
							return (
								fragment +
								projection
									.split('\n')
									.map((line: string) => line.replace('\t', ''))
									.join('\n')
							);
						})
						.join('\t<or-nav-tree');
					tree.overwrite(filePath, html);
				}
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private migrateAutomaticTheming(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating theme & font');
			const toApply = (filePath: string) => {
				UpdateV4toV5.util.removeImport(tree, filePath, 'OBLIQUE_THEME');
				UpdateV4toV5.util.removeImport(tree, filePath, 'FRUTIGER');
				const oldContent = readFile(tree, filePath);
				const obliqueTheme = UpdateV4toV5.util.readSymbolInNgModule(tree, filePath, 'OBLIQUE_THEME');
				const frutigerConfig = UpdateV4toV5.util.readSymbolInNgModule(tree, filePath, 'FRUTIGER');
				const usedTheme = UpdateV4toV5.util.extractFromBrackets('{}', obliqueTheme).replace(/\s/g, '').split('useValue:')[1];
				const usingFrutiger = UpdateV4toV5.util.extractFromBrackets('{}', frutigerConfig).replace(/\s/g, '').split('useValue:')[1];

				if (usingFrutiger === 'false') {
					tree.overwrite(filePath, oldContent.replace(frutigerConfig, '{ provide: OBLIQUE_FONT, useValue: FONTS.ROBOTO }'));
					UpdateV4toV5.util.addImport(tree, filePath, 'OBLIQUE_FONT', ObliquePackage);
				}

				const regexp = new RegExp(`[ \\t]*${obliqueTheme},?(\\r\\n|\\n|\\r)?`);
				tree.overwrite(filePath, readFile(tree, filePath).replace(regexp, ''));
				tree.overwrite(filePath, readFile(tree, filePath).replace('FONTS.ARIAL', 'FONTS.NONE'));
				tree.overwrite(filePath, readFile(tree, filePath).replace('FRUTIGER', 'FONTS.FRUTIGER'));
				UpdateV4toV5.util.addImport(tree, filePath, 'FONTS', ObliquePackage);

				const obliqueStyleKind = usedTheme === 'THEMES.BOOTSTRAP' ? 'oblique-bootstrap.css' : 'oblique-material.css';
				const obliqueStyleLocation = 'node_modules/@oblique/oblique/styles/css';

				setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: any) => {
					const obliqueStyleOrder = [`${obliqueStyleLocation}/oblique-core.css`, `${obliqueStyleLocation}/${obliqueStyleKind}`];
					// add oblique-compat only if it was present before
					if (config.includes(`${obliqueStyleLocation}/oblique-compat.css`)) {
						obliqueStyleOrder.push(`${obliqueStyleLocation}/oblique-compat.css`);
					}

					// same for oblique-utilities.css
					if (config.includes(`${obliqueStyleLocation}/oblique-utilities.css`)) {
						obliqueStyleOrder.push(`${obliqueStyleLocation}/oblique-utilities.css`);
					}

					// ... and same for oblique-components.css
					if (config.includes(`${obliqueStyleLocation}/oblique-components.css`)) {
						obliqueStyleOrder.push(`${obliqueStyleLocation}/oblique-components.css`);
					}

					const projectStyles = config
						.filter((styleUrl: string) => !obliqueStyleOrder.includes(styleUrl))
						.filter((styleUrl: string) => !obliqueStyleOrder.includes(styleUrl.replace(/scss/g, 'css')));
					return [...obliqueStyleOrder, ...projectStyles];
				});

				// ... and check for multi translate loader!
				if (readFile(tree, filePath).indexOf('new MultiTranslateLoader') !== -1) {
					UpdateV4toV5.hasTranslateMultiLoader = true;
				}
			};
			return applyInTree(tree, toApply, 'app.module.ts');
		};
	}

	private migrateColorPalette(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating color palette');
			const toApply = (filePath: string) => {
				const placeholder = 'PLACEHOLDER' + Date.now();
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\$brand-secondary/g), '#66afe9');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\$gray-lighter-2/g), placeholder);
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\$gray-lighter/g), '$gray-extra-light');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(placeholder, 'g'), '$gray-lighter');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\$brand-extralight/g), '$brand-extra-light');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\_nav-tabs.scss/g), '_tabs.scss');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\$spacing-md/g), '$spacing-sm');
			};
			return applyInTree(tree, toApply, '*.scss');
		};
	}

	private migrateTextControlClearHTML(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating text control clear');
			const toApply = (filePath: string) => {
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/orTextControlClear/g), 'orInputClear');
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private migrateTextControlClearTS(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			const toApply = (filePath: string) => {
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/MockTextControlClearModule/g), 'MockInputClearModule');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/MockTextControlClearDirective/g), 'MockInputClearDirective');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/TextControlClearModule/g), 'InputClearModule');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/ControlClearDirective/g), 'InputClearDirective');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\/text-control-clear\//g), '/input-clear/');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/text-control-clear\.module/g), 'input-clear.module');
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private migrateInterceptor(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating interceptor');
			const toApply = (filePath: string) => {
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/ObliqueHttpInterceptorModule/g), 'HttpApiInterceptorModule');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/ObliqueHttpInterceptorEvents/g), 'HttpApiInterceptorEvents');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/ObliqueHttpInterceptorConfig/g), 'HttpApiInterceptorConfig');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/ObliqueHttpInterceptor/g), 'HttpApiInterceptor');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/ObliqueRequest/g), 'HttpApiRequest');
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private migrateTranslationFiles(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			const toApply = (filePath: string) => {
				this.migrateTranslationKeys(tree, filePath);
			};
			return applyInTree(tree, toApply, '*.json');
		};
	}

	private migrateTranslationCallsTS(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating translations');
			const toApply = (filePath: string) => {
				this.migrateTranslationKeys(tree, filePath);
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private migrateTranslationCallsHTML(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			const toApply = (filePath: string) => {
				this.migrateTranslationKeys(tree, filePath);
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private migrateTranslationKeys(tree: Tree, filePath: string): void {
		if (!UpdateV4toV5.hasTranslateMultiLoader) {
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.error.http.general'), 'i18n.oblique.http.error.general');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.error.http.status.0'), 'i18n.oblique.http.error.status.0');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.error.http.status.400'), 'i18n.oblique.http.error.status.400');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.error.http.status.404'), 'i18n.oblique.http.error.status.404');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.error.http.status.500'), 'i18n.oblique.http.error.status.500');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.error.http.status.501'), 'i18n.oblique.http.error.status.501');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.error.http.status.502'), 'i18n.oblique.http.error.status.502');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.error.http.status.503'), 'i18n.oblique.http.error.status.503');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.error.http.timeout'), 'i18n.oblique.http.error.timeout');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.accesskey.mainContent'), 'i18n.oblique.master-layout.accesskey.mainContent');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.accesskey.homepage'), 'i18n.oblique.master-layout.accesskey.homepage');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.accesskey.navigation'), 'i18n.oblique.master-layout.accesskey.navigation');
			UpdateV4toV5.util.replaceInFile(
				tree,
				filePath,
				new RegExp('i18n.accessible.globalNavigationMenu'),
				'i18n.oblique.master-layout.accessible.globalNavigationMenu'
			);
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.oblique.controls.title'), 'i18n.oblique.master-layout.header.controls.title');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.notification.type.info'), 'i18n.oblique.notification.type.info');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.notification.type.success'), 'i18n.oblique.notification.type.success');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.notification.type.warning'), 'i18n.oblique.notification.type.warning');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.notification.type.error'), 'i18n.oblique.notification.type.error');
			UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('i18n.topControl.backToTop'), 'i18n.oblique.scrolling.topControl');
		}
	}

	private migratePrefixesTS(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating prefix from "or" to "ob"');
			const toApply = (filePath: string) => {
				// special renaming
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('ORNavigationLink', 'g'), 'ObINavigationLink');
				UpdateV4toV5.util.updateClassIdentifiers(tree, filePath);
				// clean up since it's not always deterministic
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('ObOb', 'g'), 'Ob');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('NgbOb', 'g'), 'Ngb');
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private migratePrefixesHTML(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			const toApply = (filePath: string) => {
				this.transformTags(tree, filePath);
				this.transformDirectives(tree, filePath);
				this.transformVariables(tree, filePath);
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private transformTags(tree: Tree, filePath: string): void {
		UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/<or-/g), '<ob-');
		UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/<\/or-/g), '</ob-');
	}

	private transformDirectives(tree: Tree, filePath: string): void {
		UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\s+\[or/g), ' [ob');

		// orPi_cker2 (with leading whitespace/tab/line break):
		const matches = readFile(tree, filePath).match(/\s+or[A-Z0-9_]+(\w)*/g) || [];
		matches.forEach(match => {
			const content = readFile(tree, filePath);
			tree.overwrite(filePath, content.replace(match, match.replace('or', 'ob')));
		});
	}

	private transformVariables(tree: Tree, filePath: string): void {
		UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\s+#or/g), ' #ob');

		//#oneOr_MoreWords="orWords_3" matches double or single quotes:
		const variableMatches = readFile(tree, filePath).match(/#(\w)*=(\"|')(or[A-Z0-9_]+(\w)*)(\"|\')/g) || [];
		variableMatches.forEach(match => {
			const variable = match.split('=')[1];
			const newContent = match.replace(variable, variable.replace('or', 'ob'));
			const content = readFile(tree, filePath);
			tree.overwrite(filePath, content.replace(match, newContent));
		});
	}

	private cleanUp(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Cleaning up');
			const toApply = (filePath: string) => {
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('this.this.', 'g'), 'this.');
				UpdateV4toV5.util.cleanUp(tree, filePath);
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}
}
