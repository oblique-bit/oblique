import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {
	addDeclarationToModule,
	addImportToModule,
	addProviderToModule,
	addRouteDeclarationToModule,
	insertImport
} from '@schematics/angular/utility/ast-utils';
import {
	adaptInsertChange,
	addDevDependency,
	appModulePath,
	applyChanges,
	createSrcFile,
	getAngularVersion,
	getTemplate,
	routingModulePath
} from '../ng-add-utils';
import {ObIOptionsSchema} from '../ng-add.model';
import {ObliquePackage, addAngularConfigInList, addFile, createSafeRule, infoMigration, readFile} from '../../utils';

export function obliqueFeatures(options: ObIOptionsSchema): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addAjv(options.ajv),
			addUnknownRoute(options.unknownRoute),
			addInterceptors(options.httpInterceptors),
			addBanner(options.banner),
			addDefaultHomeComponent(options.prefix),
			addExternalLink(options.externalLink)
		])(tree, _context);
}

function addAjv(ajv: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (ajv) {
			infoMigration(_context, 'Oblique feature: Adding schema validation');
			addDevDependency(tree, 'ajv');
			addDevDependency(tree, 'ajv-formats');
			if (getAngularVersion(tree) >= 10) {
				addAngularConfigInList(tree, ['architect', 'build', 'options', 'allowedCommonJsDependencies'], 'ajv');
				addAngularConfigInList(tree, ['architect', 'build', 'options', 'allowedCommonJsDependencies'], 'ajv-formats');
			}
		}
		return tree;
	});
}

function addUnknownRoute(unknownRoute: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		const routingModule = tree.exists(routingModulePath) ? routingModulePath : appModulePath;
		if (unknownRoute && tree.exists(routingModule)) {
			infoMigration(_context, 'Oblique feature: Adding unknown route');
			const sourceFile = createSrcFile(tree, routingModule);
			const changes: Change[] = addImportToModule(sourceFile, routingModule, 'ObUnknownRouteModule', ObliquePackage);
			const fileName = routingModule.split('/').pop();
			if (fileName) {
				changes.push(addRouteDeclarationToModule(sourceFile, fileName, "{path: '**', redirectTo: 'unknown-route'}"));
			}
			tree = applyChanges(tree, routingModule, changes);
		}
		return tree;
	});
}

function addInterceptors(httpInterceptors: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (httpInterceptors) {
			infoMigration(_context, 'Oblique feature: Adding http interceptor');
			const obliqueInterceptorModuleName = 'ObHttpApiInterceptor';
			const obliqueInterceptorProvider = '{provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true}';
			const sourceFile = createSrcFile(tree, appModulePath);
			const changes = addProviderToModule(sourceFile, appModulePath, obliqueInterceptorProvider, ObliquePackage)
				.concat(insertImport(sourceFile, appModulePath, 'HTTP_INTERCEPTORS', '@angular/common/http'))
				.filter((change: Change) => change instanceof InsertChange)
				.map((change: InsertChange) => adaptInsertChange(tree, change, obliqueInterceptorProvider, obliqueInterceptorModuleName));

			tree = applyChanges(tree, appModulePath, changes);
		}
		return tree;
	});
}

function addBanner(banner: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (banner) {
			infoMigration(_context, 'Oblique feature: Adding environment banner');
			addBannerData(tree);
			tree = provideBanner(tree);
		}
		return tree;
	});
}

function addBannerData(tree: Tree): void {
	const src = 'src/environments';
	tree
		.getDir(src)
		.subfiles.map(file => `${src}/${file}`)
		.forEach(file => {
			const env = /environment\.(?<env>.*)\.ts/.exec(file)?.groups?.env || 'local';
			const content = readFile(tree, file);
			const banner = env === 'prod' ? 'undefined' : `{text: '${env}'}`;
			if (content) {
				tree.overwrite(file, content.replace('\n};', `,\n  banner: ${banner}\n};`));
			}
		});
}

function provideBanner(tree: Tree): Tree {
	const provider = '{provide: OB_BANNER, useValue: environment.banner}';
	const sourceFile = createSrcFile(tree, appModulePath);
	const changes: Change[] = addProviderToModule(sourceFile, appModulePath, provider, ObliquePackage)
		.concat(insertImport(sourceFile, appModulePath, 'environment', '../environments/environment'))
		.filter((change: Change) => change instanceof InsertChange)
		.map((change: InsertChange) => adaptInsertChange(tree, change, provider.replace(/\..*$/, ''), 'OB_BANNER'));

	return applyChanges(tree, appModulePath, changes);
}

function addDefaultHomeComponent(prefix: string): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique feature: Adding default home component');
		addDefaultComponent(tree, prefix);
		addDefaultComponentToAppModule(tree);
		addDefaultComponentRouteToAppRoutingModule(tree);

		return tree;
	});
}

function addDefaultComponent(tree: Tree, prefix: string): void {
	addFile(tree, 'src/app/home/home.component.html', getTemplate(tree, `home.component.html`));
	addFile(tree, 'src/app/home/home.component.scss', getTemplate(tree, `home.component.scss.config`));
	addFile(
		tree,
		'src/app/home/home.component.ts',
		getTemplate(tree, 'home.component.ts.config').replace('_APP_PREFIX_PLACEHOLDER_', prefix)
	);
}

function addDefaultComponentToAppModule(tree: Tree): void {
	if (tree.exists(appModulePath)) {
		const sourceFile = createSrcFile(tree, appModulePath);
		const changes: Change[] = addDeclarationToModule(sourceFile, appModulePath, 'HomeComponent', './home/home.component');
		const routingModule = tree.exists(routingModulePath) ? routingModulePath : appModulePath;

		changes.push(...addImportToModule(sourceFile, routingModule, 'MatButtonModule', '@angular/material/button'));
		changes.push(...addImportToModule(sourceFile, routingModule, 'MatCardModule', '@angular/material/card'));

		applyChanges(tree, appModulePath, changes);
	}
}

function addDefaultComponentRouteToAppRoutingModule(tree: Tree): void {
	const routingModule = tree.exists(routingModulePath) ? routingModulePath : appModulePath;
	if (tree.exists(routingModule)) {
		const sourceFile = createSrcFile(tree, routingModule);
		const changes: Change[] = [];
		const fileName = routingModule.split('/').pop();
		if (fileName) {
			changes.push(insertImport(sourceFile, routingModule, 'HomeComponent', './home/home.component'));
			changes.push(addRouteDeclarationToModule(sourceFile, fileName, "{path: '', redirectTo: 'home', pathMatch: 'full'}"));
			changes.push(addRouteDeclarationToModule(sourceFile, fileName, "{path: 'home', component: HomeComponent}"));
		}
		applyChanges(tree, routingModule, changes);
	}
}

function addExternalLink(externalLink: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (externalLink) {
			infoMigration(_context, 'Oblique feature: Adding external link module');
			const sourceFile = createSrcFile(tree, appModulePath);
			const changes: Change[] = addImportToModule(sourceFile, appModulePath, 'ObExternalLinkModule', ObliquePackage);
			return applyChanges(tree, appModulePath, changes);
		}
		return tree;
	});
}
