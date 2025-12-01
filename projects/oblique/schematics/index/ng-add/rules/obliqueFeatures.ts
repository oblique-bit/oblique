import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {
	addDeclarationToModule,
	addImportToModule,
	addProviderToModule,
	addRouteDeclarationToModule,
	insertImport,
} from '@schematics/angular/utility/ast-utils';
import {
	adaptInsertChange,
	addDevDependency,
	angularAppFilesNames,
	appModulePath,
	applyChanges,
	createSrcFile,
	getTemplate,
	routingModulePath,
} from '../ng-add-utils';
import {ObIOptionsSchema} from '../ng-add.model';
import {
	ObliquePackage,
	addFile,
	createSafeRule,
	infoMigration,
	readFile,
	replaceInFile,
	setOrCreateAngularProjectsConfig,
	writeFile,
} from '../../utils';

export function obliqueFeatures(options: ObIOptionsSchema): Rule {
	return (tree: Tree, context: SchematicContext) => {
		return chain([
			addObliqueProviders(),
			addAjv(options.ajv),
			addUnknownRoute(options.unknownRoute),
			enableAnchorScrolling(),
			addInterceptors(options.httpInterceptors),
			addBanner(options.banner, options.environments),
			addDefaultHomeComponent(options.prefix),
			addExternalLink(options.externalLink),
			setObliqueConfiguration(options.title, options.applicationOperator, options.contact, options.hasLanguageInUrl),
		])(tree, context);
	};
}

function addObliqueProviders(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique feature: Adding Oblique configuration');
		const sourceFile = createSrcFile(tree, appModulePath);
		const changes = addProviderToModule(sourceFile, appModulePath, 'provideObliqueConfiguration()', '@oblique/oblique')
			.filter((change: Change) => change instanceof InsertChange)
			.map((change: InsertChange) =>
				adaptInsertChange(tree, change, 'provideObliqueConfiguration()', 'provideObliqueConfiguration')
			);
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
		setOrCreateAngularProjectsConfig(
			tree,
			['architect', 'build', 'options', 'allowedCommonJsDependencies'],
			['ajv', 'ajv-formats']
		);
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

function enableAnchorScrolling(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique feature: enabling anchor scrolling');
		const content = readFile(tree, routingModulePath);
		const newContent = content.replace(
			'RouterModule.forRoot(routes)',
			'RouterModule.forRoot(routes, { anchorScrolling: "enabled" })'
		);
		writeFile(tree, routingModulePath, newContent);
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
				.concat(
					addProviderToModule(
						sourceFile,
						appModulePath,
						'provideHttpClient(withInterceptorsFromDi())',
						'@angular/common/http'
					)
				)
				.filter((change: Change) => change instanceof InsertChange)
				.map((change: InsertChange) =>
					adaptInsertChange(tree, change, obliqueInterceptorProvider, obliqueInterceptorModuleName)
				)
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
		removeTitleTest(tree);

		return tree;
	});
}

function addDefaultComponent(tree: Tree, prefix: string): void {
	addFile(tree, 'src/app/home/home.html', getTemplate(tree, `home.html`));
	addFile(tree, 'src/app/home/home.scss', getTemplate(tree, `home.scss.config`));
	addFile(
		tree,
		'src/app/home/home.ts',
		getTemplate(tree, 'home.ts.config').replace('_APP_PREFIX_PLACEHOLDER_', prefix)
	);
}

function addDefaultComponentToAppModule(tree: Tree): void {
	if (tree.exists(appModulePath)) {
		const sourceFile = createSrcFile(tree, appModulePath);
		const changes: Change[] = addDeclarationToModule(sourceFile, appModulePath, 'Home', './home/home');

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
			changes.push(insertImport(sourceFile, routingModule, 'Home', './home/home'));
			changes.push(
				addRouteDeclarationToModule(
					sourceFile,
					fileName,
					"{path: '', redirectTo: 'home', pathMatch: 'full'},{path: 'home', component: Home}"
				)
			);
		}
		applyChanges(tree, routingModule, changes);
	}
}

function removeTitleTest(tree: Tree): void {
	const appSpecFile = `src/app/${angularAppFilesNames.appComponentSpec}`;
	replaceInFile(tree, appSpecFile, /import\s+{[^}]*}.*from\s+['"]@angular\/core['"];/, '');
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

function parseContact(contacts: string): {emails: string[]; phones: string[]} {
	return {
		emails:
			contacts
				?.trim()
				.split(/\s*,\s*/)
				.filter((element: string) => element.includes('@')) ?? [],

		phones:
			contacts
				?.trim()
				.split(/\s*,\s*/)
				.filter((element: string) => !element.includes('@')) ?? [],
	};
}

function validateContact(emails?: string[], phones?: string[]): void {
	if (isEmpty(emails) && isEmpty(phones)) {
		throw new Error('You must provide at least one contact method: email or phone.');
	}
}

function isEmpty(array?: string[]): boolean {
	return !array || array.length === 0;
}

function setObliqueConfiguration(
	applicationTitle: string,
	applicationOperator: string,
	contact: string,
	hasLanguageInUrl: boolean
): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique feature: Adding accessibility statement configuration');
		const {emails, phones} = parseContact(contact);
		validateContact(emails, phones);

		const content = readFile(tree, appModulePath);
		const accessibilityConfig = buildAccessibilityConfig(applicationTitle, applicationOperator, emails, phones);
		const hasLanguageInUrlConfig = buildHasLanguageInUrlConfig(hasLanguageInUrl);

		const newContent = content.replace(
			/(?<=provideObliqueConfiguration\()(?=\))/,
			`{${accessibilityConfig}, ${hasLanguageInUrlConfig}}`
		);
		writeFile(tree, appModulePath, newContent);
		return tree;
	});
}

function buildAccessibilityConfig(
	title: string,
	applicationOperator: string,
	emails: string[] = [],
	phones: string[] = []
): string {
	const contactFields = [
		...emails.map(email => `{email: '${email}'}`),
		...phones.map(phone => `{phone: '${phone}'}`),
	].join(', ');

	const createdOn = new Date().toISOString().split('T')[0];

	return `accessibilityStatement: {
			applicationName: '${title}',
			conformity: 'none',
			createdOn: new Date('${createdOn}'),
			applicationOperator: '${applicationOperator}',
			contact: [${contactFields}]
		}`;
}

function buildHasLanguageInUrlConfig(hasLanguageInUrl: boolean): string {
	return `hasLanguageInUrl: ${hasLanguageInUrl}`;
}
