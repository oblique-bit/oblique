import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { IMigratable } from './update-schema';
import { colors } from '@angular-devkit/core/src/terminal';
import {
	PROJECT_PACKAGE_JSON,
	OB_PACKAGE,
	OB_PACKAGE_JSON,
	PROJECT_ROOT_DIR,
	PROJECT_ANGULAR_JSON,
	SchematicsUtil} from '../utils';

export class UpdateV4toV5 implements IMigratable {

	static util: SchematicsUtil = SchematicsUtil.getInstance();

	updateToLatest(_options: any, latestVersion: string): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(colors.bold(`Setting latest major oblique dependency`)) + colors.green(` ✔`));

			const projectPackageJSON = JSON.parse(UpdateV4toV5.util.getFile(tree, PROJECT_PACKAGE_JSON));
			projectPackageJSON['dependencies'][OB_PACKAGE] = latestVersion;
			tree.overwrite(PROJECT_PACKAGE_JSON, JSON.stringify(projectPackageJSON, null, '\t'));

			return tree;
		};
	}

	updatePeerDependencies(_options: any): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(colors.bold(`Update peer dependencies`)));

			const obPackageJSON = JSON.parse(UpdateV4toV5.util.getFile(tree, OB_PACKAGE_JSON));
			const changes: Rule[] = [];
			Object.keys(obPackageJSON['peerDependencies']).forEach(name => {
				changes.push(UpdateV4toV5.util.updatePackageJSONDependency(name, obPackageJSON['peerDependencies'][name]));
			});

			return chain(changes)(tree, _context);
		};
	}

	applyMigrations(_options: any): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(colors.bold(`Analyzing project 🧬`)));

			UpdateV4toV5.util.loadBusinessSymbols(tree);

			_context.logger.info(colors.blue(colors.bold(`Applying migrations 🏁`)));

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
				this.migrateNavTree()
			])(tree, _context);
		};
	}

	private migratePopUpService(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`- PopUpService`) + colors.green(` ✔`));
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toInject = 'private readonly popUpService: PopUpService';
			const toApply = (filePath: string) => {
				const confirm = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.confirm/g), 'this.popUpService.confirm');
				const alert = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.alert/g), 'this.popUpService.alert');
				const prompt = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.prompt/g), 'this.popUpService.prompt');
				if ( confirm || alert || prompt ) {
					UpdateV4toV5.util.addToConstructor(tree, filePath, toInject);
					UpdateV4toV5.util.addImport(tree, filePath, 'PopUpService', OB_PACKAGE);
				}
			};
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply, 'component.ts')
			])(tree, _context);
		};
	}

	private migratePopUpServiceSpecs(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toApply = (filePath: string) => {
				const confirm = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.confirm/g), 'this.popUpService.confirm');
				const alert = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.alert/g), 'this.popUpService.alert');
				const prompt = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\.prompt/g), 'this.popUpService.prompt');
				if ( confirm || alert || prompt ) {
					UpdateV4toV5.util.addImport(tree, filePath, 'PopUpService', OB_PACKAGE);
					UpdateV4toV5.util.addImport(tree, filePath, 'MockPopUpService', OB_PACKAGE);
					UpdateV4toV5.util.addToTestBedConfig(tree, filePath, '{provide: PopUpService, useClass: MockPopUpService }', 'providers');
				}
			};
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply, '.spec.ts')
			])(tree, _context);
		};
	}

	private migrateMasterLayout(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`- MasterLayout`) + colors.green(` ✔`));
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toApply = (filePath: string) => {
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/MasterLayoutNavigationService\.isScrollable/g), 'MasterLayoutNavigationService\.scrollMode');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/MasterLayoutConfig\.isScrollable/g), 'MasterLayoutConfig\.scrollMode');
			};
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply)
			])(tree, _context);
		};
	}

	private migrateTestingModule(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`- TestingModule`) + colors.green(` ✔`));
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toApply = (filePath: string) => {
				UpdateV4toV5.util.removeImport(tree, filePath, 'MockTranslateService');
				UpdateV4toV5.util.addImport(tree, filePath, 'ObliqueTestingModule', OB_PACKAGE);
				UpdateV4toV5.util.addImport(tree, filePath, 'MockTranslateService', OB_PACKAGE);
				UpdateV4toV5.util.addImport(tree, filePath, 'TranslateService', '@ngx-translate/core');
				UpdateV4toV5.util.addToTestBedConfig(tree, filePath, 'ObliqueTestingModule', 'imports');
				UpdateV4toV5.util.removeFromTestBedConfig(tree, filePath, 'ObliqueModule', 'imports');
				UpdateV4toV5.util.removeImplicitDeclarations(tree, filePath, 'declarations');
				UpdateV4toV5.util.removeImplicitDeclarations(tree, filePath, 'imports');
				UpdateV4toV5.util.removeImplicitDeclarations(tree, filePath, 'providers');
				UpdateV4toV5.util.addToTestBedConfig(tree, filePath, '{ provide: TranslateService, useClass: MockTranslateService }', 'providers');
			};
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply, '.spec.ts')
			])(tree, _context);
		};
	}

	private migrateDatePickerModule(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`- DatePickerModule`) + colors.green(` ✔`));
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toApply = (filePath: string) => {
				if ( UpdateV4toV5.util.hasImport(tree, filePath, 'DatepickerModule', OB_PACKAGE) ) {
					UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp('DatepickerModule\\.forRoot\\(\\)', 'g'), 'DatepickerModule');
				}
			};
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply, '.ts')
			])(tree, _context);
		};
	}

	private migrateDatePickerHTML(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`- DatePicker`) + colors.green(` ✔`));
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toApply = (filePath: string) => {
				let html = UpdateV4toV5.util.getFile(tree, filePath);
				if ( html.indexOf('</or-date-picker>') !== -1 ) {
					const projections = UpdateV4toV5.util.extractProjections('or-date-picker', html);
					const childRegex = /(<(\w)*)/g;
					const classRegex = /(class=("|')(\w|-|_)*("|'))/g;
					html = html.replace(/(<or-date-picker((\s)*(\w)*(\[|\]|]|=|")*)*>)/g, '');
					html = html.replace(/<\/or-date-picker>/g, '\t</or-date-picker>');
					projections.forEach((projection: string) => {
						html = html.replace(projection, projection.replace(childRegex, '<or-date-picker').replace('ngbDatepicker', '').replace(classRegex, ''));
					});
					tree.overwrite(filePath, html);
				}
			};
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply, '.html')
			])(tree, _context);
		};
	}

	private migrateWindow(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`- Window`) + colors.green(` ✔`));
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toInject = '@Inject(WINDOW) private readonly window';
			const toApply = (filePath: string) => {
				if ( UpdateV4toV5.util.getClassImplementation(tree, filePath).join('').indexOf('window.') !== -1 ) {
					const window = UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/window\./g), 'this.window.');
					if ( window ) {
						UpdateV4toV5.util.addImport(tree, filePath, 'Inject', '@angular/core');
						UpdateV4toV5.util.addImport(tree, filePath, 'WINDOW', OB_PACKAGE);
						UpdateV4toV5.util.addToConstructor(tree, filePath, toInject);
					}
				};
				}
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply, '.ts')
			])(tree, _context);
		};
	}

	private migrateNavTree(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`- NavTree`) + colors.green(` ✔`));
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toApply = (filePath: string) => {
				let html = UpdateV4toV5.util.getFile(tree, filePath);
				if ( html.indexOf('</or-nav-tree>') !== -1 ) {
					const projections = UpdateV4toV5.util.extractProjections('or-nav-tree', html);
					projections.forEach((projection: string) => {
						html = html.replace(projection, '');
					});
					html = html.split('<or-nav-tree').map((fragment: string, index: number) => {
						const projection = ( projections[index] ) ? projections[index] : '' ;
						return fragment + projection.split('\n').map((line: string) => line.replace('\t', '')).join('\n');
					}).join('\t<or-nav-tree');
					tree.overwrite(filePath, html);
				}
			};
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply, '.html')
			])(tree, _context);
		};
	}

	private migrateAutomaticTheming(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`- Automatic Theming`) + colors.green(` ✔`));
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toApply = (filePath: string) => {
				UpdateV4toV5.util.removeImport(tree, filePath, 'OBLIQUE_THEME');
				UpdateV4toV5.util.removeImport(tree, filePath, 'FRUTIGER');
				const oldContent = UpdateV4toV5.util.getFile(tree, filePath);
				const obliqueTheme = UpdateV4toV5.util.readSymbolInNgModule(tree, filePath, 'OBLIQUE_THEME');
				const frutigerConfig = UpdateV4toV5.util.readSymbolInNgModule(tree, filePath, 'FRUTIGER');
				const usedTheme = UpdateV4toV5.util.extractFromBrackets('{}', obliqueTheme).replace(/\s/g, '').split('useValue:')[1];
				const usingFrutiger = UpdateV4toV5.util.extractFromBrackets('{}', frutigerConfig).replace(/\s/g, '').split('useValue:')[1];

				if ( usingFrutiger === 'false' ) {
					tree.overwrite(filePath, oldContent.replace(frutigerConfig, '{ provide: OBLIQUE_FONT, useValue: FONTS.ROBOTO }'));
					UpdateV4toV5.util.addImport(tree, filePath, 'OBLIQUE_FONT', OB_PACKAGE);
					UpdateV4toV5.util.addImport(tree, filePath, 'FONTS', OB_PACKAGE);
				}

				tree.overwrite(filePath, UpdateV4toV5.util.getFile(tree, filePath).replace(obliqueTheme, ''));

				const themeFile = ( usedTheme === 'THEMES.BOOTSTRAP' ) ? 'oblique-bootstrap.css' : 'oblique-material.css' ;
				const stylePath = `node_modules/@oblique/oblique/styles/css/${themeFile}`;

				const projectJSON = JSON.parse(UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
				Object.entries(projectJSON['projects']).forEach((project: any) => {
					const config = project[1];
					if (config.hasOwnProperty('architect') &&
					config.architect.hasOwnProperty('build') &&
					config.architect.build.hasOwnProperty('options') &&
					config.architect.build.options.hasOwnProperty('styles') ) {
						config.architect.build.options.styles.push(stylePath);
					}
				});

				tree.overwrite(PROJECT_ANGULAR_JSON, JSON.stringify(projectJSON, null, '\t'));
			};
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply, 'app.module.ts')
			])(tree, _context);
		};
	}

	private migrateColorPalette(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			_context.logger.info(colors.blue(`- Color Palette`) + colors.green(` ✔`));
			const srcRoot = UpdateV4toV5.util.getJSONProperty('sourceRoot', UpdateV4toV5.util.getFile(tree, PROJECT_ANGULAR_JSON));
			const toApply = (filePath: string) => {
				const placeholder = 'PLACEHOLDER' + Date.now();
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\$brand-secondary/g), '#66afe9');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\$gray-lighter-2/g), placeholder);
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\$gray-lighter/g), '$gray-extra-light');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(placeholder, 'g'), '$gray-lighter');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\$brand-extralight/g), '$brand-extra-light');
				UpdateV4toV5.util.replaceInFile(tree, filePath, new RegExp(/\_nav-tabs.scss/g), '_tabs.scss');
			};
			return chain([
				UpdateV4toV5.util.applyInTree(PROJECT_ROOT_DIR + srcRoot, toApply, '.scss')
			])(tree, _context);
		};
	}

}
