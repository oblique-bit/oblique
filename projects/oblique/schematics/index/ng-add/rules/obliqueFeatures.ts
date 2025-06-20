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
	getTemplate,
	routingModulePath
} from '../ng-add-utils';
import {ObIOptionsSchema} from '../ng-add.model';
import {ObliquePackage, addFile, createSafeRule, infoMigration, readFile, setOrCreateAngularProjectsConfig, writeFile} from '../../utils';

export function obliqueFeatures(options: ObIOptionsSchema): Rule {
	return (tree: Tree, context: SchematicContext) =>
		chain([
			addObliqueProviders(),
			addAjv(options.ajv),
			addUnknownRoute(options.unknownRoute),
			addInterceptors(options.httpInterceptors),
			addBanner(options.banner, options.environments),
			addDefaultHomeComponent(options.prefix),
			addExternalLink(options.externalLink),
			addAccessibilityStatementConfiguration(options.title)
		])(tree, context);
}

function addObliqueProviders(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique feature: Adding Oblique configuration');
		const sourceFile = createSrcFile(tree, appModulePath);
		const changes = addProviderToModule(sourceFile, appModulePath, 'provideObliqueConfiguration()', '@oblique/oblique')
			.filter((change: Change) => change instanceof InsertChange)
			.map((change: InsertChange) => adaptInsertChange(tree, change, 'provideObliqueConfiguration()', 'provideObliqueConfiguration'));
		return applyChanges(tree, appModulePath, changes);
	});
}

function addAjv(ajv: boolean): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (ajv) {
			infoMigration(context, 'Oblique feature: Adding schema validation');
			addDevDependency(tree, 'ajv');
			addDevDependency(tree, 'ajv-formats');
		}
		setOrCreateAngularProjectsConfig(tree, ['architect', 'build', 'options', 'allowedCommonJsDependencies'], ['ajv', 'ajv-formats']);
		return tree;
	});
}

function addUnknownRoute(unknownRoute: boolean): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		const routingModule = tree.exists(routingModulePath) ? routingModulePath : appModulePath;
		if (unknownRoute && tree.exists(routingModule)) {
			infoMigration(context, 'Oblique feature: Adding unknown route');
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
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (httpInterceptors) {
			infoMigration(context, 'Oblique feature: Adding http interceptor');
			const obliqueInterceptorModuleName = 'ObHttpApiInterceptor';
			const obliqueInterceptorProvider = '{provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true}';
			const sourceFile = createSrcFile(tree, appModulePath);
			const changes = addProviderToModule(sourceFile, appModulePath, obliqueInterceptorProvider, ObliquePackage)
				.concat(addProviderToModule(sourceFile, appModulePath, 'provideHttpClient(withInterceptorsFromDi())', '@angular/common/http'))
				.filter((change: Change) => change instanceof InsertChange)
				.map((change: InsertChange) => adaptInsertChange(tree, change, obliqueInterceptorProvider, obliqueInterceptorModuleName))
				.map((change: InsertChange) =>
					adaptInsertChange(
						tree,
						change,
						'provideHttpClient(withInterceptorsFromDi())',
						'provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi'
					)
				);
			tree = applyChanges(tree, appModulePath, changes);
		} else {
			const sourceFile = createSrcFile(tree, appModulePath);
			const changes = addProviderToModule(sourceFile, appModulePath, 'provideHttpClient()', '@angular/common/http')
				.filter((change: Change) => change instanceof InsertChange)
				.map((change: InsertChange) => adaptInsertChange(tree, change, 'provideHttpClient()', 'provideHttpClient'));
			tree = applyChanges(tree, appModulePath, changes);
		}
		return tree;
	});
}

function addBanner(banner: boolean, environments: string): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (banner && environments) {
			infoMigration(context, 'Oblique feature: Adding environment banner');
			const provider = '{provide: OB_BANNER, useValue: environment.banner}';
			const sourceFile = createSrcFile(tree, appModulePath);
			const changes: Change[] = addProviderToModule(sourceFile, appModulePath, provider, ObliquePackage)
				.concat(insertImport(sourceFile, appModulePath, 'environment', '../environments/environment'))
				.filter((change: Change) => change instanceof InsertChange)
				.map((change: InsertChange) => adaptInsertChange(tree, change, provider.replace(/\..*$/, ''), 'OB_BANNER'));

			applyChanges(tree, appModulePath, changes);
		}
		return tree;
	});
}
function addDefaultHomeComponent(prefix: string): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique feature: Adding default home component');
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

		changes.push(...addImportToModule(sourceFile, appModulePath, 'MatButtonModule', '@angular/material/button'));
		changes.push(...addImportToModule(sourceFile, appModulePath, 'MatCardModule', '@angular/material/card'));
		changes.push(...addImportToModule(sourceFile, appModulePath, 'MatIconModule', '@angular/material/icon'));

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
			changes.push(
				addRouteDeclarationToModule(
					sourceFile,
					fileName,
					"{path: '', redirectTo: 'home', pathMatch: 'full'},{path: 'home', component: HomeComponent}"
				)
			);
		}
		applyChanges(tree, routingModule, changes);
	}
}

function addExternalLink(externalLink: boolean): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (externalLink) {
			infoMigration(context, 'Oblique feature: Adding external link module');
			const sourceFile = createSrcFile(tree, appModulePath);
			const changes: Change[] = addImportToModule(sourceFile, appModulePath, 'ObExternalLinkModule', ObliquePackage);
			return applyChanges(tree, appModulePath, changes);
		}
		return tree;
	});
}

function addAccessibilityStatementConfiguration(applicationTitle: string): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique feature: Adding accessibility statement configuration');
		const content = readFile(tree, appModulePath);
		const newContent = content.replace(
			/(?<=provideObliqueConfiguration\()(?=\))/,
			`{accessibilityStatement: {applicationName: '${applicationTitle}', conformity: 'none', applicationOperator: 'Replace me with the name and address of the federal office that exploit this application, HTML is permitted', contact: {/* at least 1 email or phone number has to be provided */ emails: [''], phones: ['']}}}`
		);
		writeFile(tree, appModulePath, newContent);
		return tree;
	});
}
