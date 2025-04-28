import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {addModuleImportToModule} from '@angular/cdk/schematics';
import {ObIMigrations} from './ng-update.model';
import {
	PathPerProject,
	addTsCompilerOption,
	applyInTree,
	createSafeRule,
	getFilePathPerProject,
	getIndexPaths,
	getPackageJsonPath,
	getRootModulePathPerProject,
	infoMigration,
	overwriteIndexFile,
	packageJsonConfigPath,
	readFile,
	replaceInFile
} from '../utils';

export interface IUpdateV8Schema {}

export class UpdateV8toV9 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV8Schema): Rule {
		return (tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Analyzing project');
			return chain([
				this.renameTranslationKeys(),
				this.removeObUseObliqueIconsToken(),
				this.updateBrowserCompatibilityMessages(),
				this.renameJumpLinks(),
				this.useKebabCaseForMixins(),
				this.renameOpened(),
				this.addTelemetryInfo(),
				this.addIconModule()
			])(tree, context);
		};
	}

	private renameTranslationKeys(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Renaming Oblique translation keys');
			const apply = (filePath: string): void => {
				[
					'progressBar',
					'mainContent',
					'checkAll',
					'uncheckAll',
					'searchPlaceholder',
					'defaultTitle',
					'allSelected',
					'offCanvas',
					'topControl',
					'noResults'
				].forEach(key => replaceInFile(tree, filePath, new RegExp(`(?<=i18n\\.oblique[\\w.-]*)${key}`, 'g'), this.toKebabCase(key)));
			};
			return applyInTree(tree, apply, '*.{html,ts,json}');
		});
	}

	private toKebabCase(input: string): string {
		return (
			input
				?.match(/[A-Z]?[a-z]+/g)
				?.map(match => match.toLowerCase())
				?.join('-') ?? ''
		);
	}

	private removeObUseObliqueIconsToken(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Remove ObUseObliqueIcons is set to true');
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, /\s*{\s*provide\s*:\s*ObUseObliqueIcons\s*,\s*useValue\s*:\s*true\s*}\s*,+/g, '');
				replaceInFile(tree, filePath, /,+\s*{\s*provide\s*:\s*ObUseObliqueIcons\s*,\s*useValue\s*:\s*true\s*}\s*/, '');
				replaceInFile(tree, filePath, /ObUseObliqueIcons\s*,?/, '');
			};
			return applyInTree(tree, apply, 'app.module.ts');
		});
	}

	private updateBrowserCompatibilityMessages(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Oblique: Updating browser compatibility check message');
			getIndexPaths(tree).forEach((indexPath: string) =>
				overwriteIndexFile(indexPath, tree, new RegExp(/<noscript>(?:.|\r?\n)*<\/div>/gm))
			);
			return tree;
		});
	}

	private renameJumpLinks(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Rename jumpLinks into skipLinks');
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, /ObIJumpLink/g, 'ObISkipLink');
				replaceInFile(tree, filePath, /jumpLinks/g, 'skipLinks');
			};
			return applyInTree(tree, apply, '*.{ts,html}');
		});
	}

	private useKebabCaseForMixins(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Rename some mixins to use kebab-case');
			const apply = (filePath: string): void => {
				['ob-gridTemplate', 'ob-gridSpan', 'ob-gridWidth', 'ob-flexBase', 'ob-flexGrow', 'ob-dropShadow', 'ob-innerBottomShadow'].forEach(
					mixin => {
						replaceInFile(tree, filePath, new RegExp(mixin, 'g'), this.toKebabCase(mixin));
					}
				);
			};
			return applyInTree(tree, apply, '*.scss');
		});
	}

	private renameOpened(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Rename getOpened to opened$');
			const apply = (filePath: string): void => {
				const fileContent = readFile(tree, filePath);
				const offCanvas = /(?<offCanvas>\w*)\s*:\s*ObOffCanvasService/.exec(fileContent)?.groups?.offCanvas;
				if (offCanvas) {
					replaceInFile(tree, filePath, new RegExp(`${offCanvas}.opened(?!\\$)`), `${offCanvas}.opened$`);
				}
			};
			return applyInTree(tree, apply, '*.ts');
		});
	}

	private addTelemetryInfo(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Update Telemetry info');
			const mainTsPathPerProject = getFilePathPerProject(tree, ['architect', 'build', 'options', 'main']);
			const rootModulesPathPerProject = getRootModulePathPerProject(tree, mainTsPathPerProject);
			this.addTelemetry(tree, context, mainTsPathPerProject, rootModulesPathPerProject);
			this.removeTelemetryDisable(
				tree,
				context,
				rootModulesPathPerProject.map(file => file.path)
			);

			return tree;
		});
	}

	private addTelemetry(
		tree: Tree,
		context: SchematicContext,
		mainTsPathPerProject: PathPerProject[],
		rootModulesPathPerProject: PathPerProject[]
	): void {
		infoMigration(context, "Configure Telemetry for projects that didn't disable it.");
		const tsConfigPathsPerProject = getFilePathPerProject(tree, ['architect', 'build', 'options', 'tsConfig']);
		rootModulesPathPerProject
			.map(file => ({...file, content: readFile(tree, file.path)}))
			.map(file => ({...file, isDisabled: this.extractIsTelemetryDisabled(file.content)}))
			.filter(file => !file.isDisabled)
			.map(file => file.project)
			.map(project => ({
				project,
				mainTsPath: this.getProjectPath(mainTsPathPerProject, project),
				tsConfigPath: this.getProjectPath(tsConfigPathsPerProject, project)
			}))
			.filter(paths => !!paths.mainTsPath && !!paths.tsConfigPath)
			.forEach(paths => {
				this.updateMainTs(tree, paths.mainTsPath, paths.project);
				this.updateTsConfig(tree, paths.tsConfigPath);
				this.updatePackageJson(tree);
			});
	}

	private extractIsTelemetryDisabled(fileContent: string): boolean {
		return /{\s*provide\s*:\s*TELEMETRY_DISABLE\s*,\s*useValue\s*:\s*(?<isDisabled>\w*)}/.exec(fileContent)?.groups?.isDisabled === 'true';
	}

	private getProjectPath(target: PathPerProject[], project: string): string {
		return target.find(config => config.project === project)?.path ?? '';
	}

	private removeTelemetryDisable(tree: Tree, context: SchematicContext, rootModulePaths: string[]): void {
		infoMigration(context, 'Remove TELEMETRY_DISABLE injection token');
		rootModulePaths.forEach(path =>
			replaceInFile(tree, path, /{\s*provide\s*:\s*TELEMETRY_DISABLE\s*,\s*useValue\s*:\s*(?:true|false)}\s*,?/, '')
		);
	}

	private updateMainTs(tree: Tree, mainTsPath: string, project: string): void {
		const content = readFile(tree, mainTsPath);
		if (!/{\s*provide\s*:\s*OB_PROJECT_INFO\s*,\s*useValue/.test(content)) {
			tree.overwrite(
				mainTsPath,
				[
					"import {OB_PROJECT_INFO} from '@oblique/oblique';",
					`import packageInfo from '${getPackageJsonPath(tree, project)}';`,
					content
						.replace(
							/(?<=platformBrowserDynamic\(\s*)\[?\s*(?<providers>{\s*provide.*})?\s*]?\s*(?=\))/s,
							'[$<providers>,\n{provide: OB_PROJECT_INFO, useValue: {name: packageInfo.name, version: packageInfo.version, title: packageInfo.title}}\n]'
						)
						.replace(/\[,/, '[')
				].join('\n')
			);
		}
	}

	private updateTsConfig(tree: Tree, tsConfigPath: string): void {
		const content = readFile(tree, tsConfigPath);
		let replacement = addTsCompilerOption(content, 'resolveJsonModule');
		replacement = addTsCompilerOption(replacement, 'allowSyntheticDefaultImports');
		tree.overwrite(tsConfigPath, replacement);
	}

	private updatePackageJson(tree: Tree): void {
		const content = readFile(tree, packageJsonConfigPath);
		if (!/^\s*"title"/.test(content)) {
			tree.overwrite(
				packageJsonConfigPath,
				content.replace(/^(?<tabs>\s*)"name"\s*:\s*"(?<name>.*)"/m, '$<tabs>"title": "$<name>",\n$<tabs>"name": "$<name>"')
			);
		}
	}

	private addIconModule(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Import Oblique icons in the root module');
			const mainTsPathPerProject = getFilePathPerProject(tree, ['architect', 'build', 'options', 'main']);
			getRootModulePathPerProject(tree, mainTsPathPerProject)
				.map(item => item.path)
				.forEach(rootModulePath => {
					addModuleImportToModule(tree, rootModulePath, 'ObIconModule', '@oblique/oblique');
					const content = readFile(tree, rootModulePath);
					tree.overwrite(
						rootModulePath,
						content.replace(/(?<=imports)(?<prefix>.*)ObIconModule(?!\.forRoot\()/s, '$<prefix>ObIconModule.forRoot()')
					);
				});

			return tree;
		});
	}
}
