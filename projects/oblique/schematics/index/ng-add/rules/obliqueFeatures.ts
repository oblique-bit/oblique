import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {addPackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {addDeclarationToModule, addImportToModule, addProviderToModule, addRouteDeclarationToModule, insertImport} from '@schematics/angular/utility/ast-utils';
import {
	angularJsonConfigPath,
	applyChanges,
	appModulePath,
	createDevDependency,
	getJson,
	getJsonProperty,
	listFiles,
	OBLIQUE_PACKAGE,
	routingModulePath,
	addFile,
	getTemplate
} from '../../ng-add-utils';
import * as ts from 'typescript';

export function obliqueFeatures(options: any): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addAjv(options.ajv),
			addUnknownRoute(options.unknownRoute),
			addDefaultComponent(options.theme, options.prefix),
			addDefaultComponentToAppModule(options.theme),
			addDefaultComponentRouteToAppRoutingModule(),
			addInterceptors(options.httpInterceptors),
			addBanner(options.banner)
		])(tree, _context);
}

function addAjv(ajv: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (ajv) {
			addPackageJsonDependency(tree, createDevDependency('ajv'));

			let tsConfig = getJson(tree, 'tsconfig.base.json');
			if (tsConfig) {
				// Angular 10
				const json = getJson(tree, angularJsonConfigPath);
				const defaultProjectName = getJsonProperty(json, 'defaultProject');
				if (!json.projects[defaultProjectName].architect.build.options.allowedCommonJsDependencies) {
					json.projects[defaultProjectName].architect.build.options.allowedCommonJsDependencies = [];
				}
				json.projects[defaultProjectName].architect.build.options.allowedCommonJsDependencies.push('ajv');

				tree.overwrite('angular.json', JSON.stringify(json, null, 2));
			}
		}
		return tree;
	};
}

function addUnknownRoute(unknownRoute: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (unknownRoute && tree.exists(routingModulePath)) {
			const sourceFileText: any = tree.read(routingModulePath);
			const sourceFile = ts.createSourceFile(routingModulePath, sourceFileText.toString('utf-8'), ts.ScriptTarget.Latest, true);
			const changes: Change[] = addImportToModule(sourceFile, routingModulePath, 'ObUnknownRouteModule', OBLIQUE_PACKAGE);

			changes.push(addRouteDeclarationToModule(sourceFile, 'app-routing.module.ts', "{path: '**', redirectTo: 'unknown-route'}"));
			tree = applyChanges(tree, routingModulePath, changes);
		}
		return tree;
	};
}

function addDefaultComponent(theme: string, prefix: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		addFile(tree, 'src/app/home/home.component.html', getTemplate(`home-${theme}.component.html`));
		addFile(tree, 'src/app/home/home.component.scss', getTemplate(`home.component.scss.config`));
		addFile(tree, 'src/app/home/home.component.ts', getTemplate('home.component.ts.config').replace('_APP_PREFIX_PLACEHOLDER_', prefix));
		return tree;
	};
}

function addDefaultComponentToAppModule(theme: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (tree.exists(appModulePath)) {
			const sourceFileText: any = tree.read(appModulePath);
			const sourceFile = ts.createSourceFile(appModulePath, sourceFileText.toString('utf-8'), ts.ScriptTarget.Latest, true);
			const changes: Change[] = addDeclarationToModule(sourceFile, appModulePath, 'HomeComponent', './home/home.component');
			const routingModule = tree.exists(routingModulePath) ? routingModulePath : appModulePath;

			if (theme === 'material') {
				changes.push(...addImportToModule(sourceFile, routingModule, 'MatButtonModule', '@angular/material/button'));
				changes.push(...addImportToModule(sourceFile, routingModule, 'MatCardModule', '@angular/material/card'));
			}

			tree = applyChanges(tree, appModulePath, changes);
		}
		return tree;
	};
}

function addDefaultComponentRouteToAppRoutingModule(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const routingModule = tree.exists(routingModulePath) ? routingModulePath : appModulePath;
		if (tree.exists(routingModule)) {
			const sourceFileText: any = tree.read(routingModule);
			const sourceFile = ts.createSourceFile(routingModule, sourceFileText.toString('utf-8'), ts.ScriptTarget.Latest, true);
			const changes: Change[] = [];
			const fileName = routingModule.split('/').pop() as string;
			changes.push(insertImport(sourceFile, routingModule, 'HomeComponent', './home/home.component'));
			changes.push(addRouteDeclarationToModule(sourceFile, fileName, "{path: '', redirectTo: 'home', pathMatch: 'full'}"));
			changes.push(addRouteDeclarationToModule(sourceFile, fileName, "{path: 'home', component: HomeComponent}"));
			tree = applyChanges(tree, routingModule, changes);
		}
		return tree;
	};
}

function addInterceptors(httpInterceptors: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (httpInterceptors) {
			const obliqueInterceptorModuleName = 'ObHttpApiInterceptor';
			const obliqueInterceptorProvider = '{provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true}';
			const sourceFileText: any = tree.read(appModulePath);
			const sourceFile = ts.createSourceFile(appModulePath, sourceFileText.toString('utf-8'), ts.ScriptTarget.Latest, true);
			const changes: Change[] = addProviderToModule(sourceFile, appModulePath, obliqueInterceptorProvider, OBLIQUE_PACKAGE);
			if (changes.length > 1) {
				(changes[1] as InsertChange).toAdd = (changes[1] as InsertChange).toAdd.replace(obliqueInterceptorProvider, obliqueInterceptorModuleName);
			}
			changes.push(insertImport(sourceFile, appModulePath, 'HTTP_INTERCEPTORS', '@angular/common/http'));
			tree = applyChanges(tree, appModulePath, changes);
		}
		return tree;
	};
}

function addBanner(banner: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (banner) {
			addBannerData(tree);
			tree = provideBanner(tree);
		}
		return tree;
	};
}

function addBannerData(tree: Tree): void {
	const src = 'src/environments';
	listFiles(src)
		.filter(file => file.indexOf('prod') === -1)
		.map(file => `${src}/${file}`)
		.forEach(file => {
			const env = file.match(/environment\.(?<env>.*)\.ts/)?.groups?.env || 'local';
			let content = tree.read(file);
			if (content) {
				tree.overwrite(file, content.toString().replace('\n};', `,\n  banner: {text: '${env}'}\n};`));
			}
		});
}

function provideBanner(tree: Tree): Tree {
	const provider = "{provide: OB_BANNER, useValue: environment['banner']}";
	const sourceFileText: any = tree.read(appModulePath);
	const sourceFile = ts.createSourceFile(appModulePath, sourceFileText.toString('utf-8'), ts.ScriptTarget.Latest, true);
	const changes: Change[] = addProviderToModule(sourceFile, appModulePath, provider, OBLIQUE_PACKAGE);
	if (changes.length > 1) {
		(changes[1] as InsertChange).toAdd = (changes[1] as InsertChange).toAdd.replace(provider, 'OB_BANNER');
	}
	changes.push(insertImport(sourceFile, appModulePath, 'environment', '../environments/environment'));
	return applyChanges(tree, appModulePath, changes);
}
