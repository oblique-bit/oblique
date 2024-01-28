import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {Change} from '@schematics/angular/utility/change';
import {addImportToModule, addSymbolToNgModuleMetadata, insertImport} from '@schematics/angular/utility/ast-utils';
import {
	ObliquePackage,
	addConstructor,
	addInjectionInClass,
	appendCodeToFunction,
	appendPrivateVoidFunctionToClass,
	applyInTree,
	createSafeRule,
	getFilePathPerProject,
	getRootFilesPaths,
	getRootModulePathPerProject,
	infoMigration,
	infoText,
	readFile,
	replaceInFile,
	warn
} from '../utils';
import {applyChanges, createSrcFile} from '../ng-add/ng-add-utils';

export function serviceNavigation(): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addServiceNavigationConfiguration(),
			...removeHeaderWidgetCode(),
			addProvidersToRootModule([
				{
					providerName: 'OB_PAMS_CONFIGURATION',
					provide: '	{provide: OB_PAMS_CONFIGURATION, useValue: {environment: ObEPamsEnvironment.PROD}}\n',
					additionalImports: ['ObEPamsEnvironment']
				}
			]),
			removeEmptyLifecycleHook('ngOnInit'),
			removeEmptyLifecycleHook('ngAfterViewInit')
		])(tree, _context);
}

function addServiceNavigationConfiguration(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		getRootFilesPaths(tree)
			.map(project => ({...project, templateContent: readFile(tree, project.appComponentTemplatePath)}))
			.map(project => ({...project, parameters: extractHeaderWidgetParameters(project.templateContent)}))
			.forEach(({appModulePath, appComponentPath, parameters}) => {
				parameters.forEach(({name, value}) => mapParameter(tree, name, value, appModulePath, appComponentPath, context));
			});

		return tree;
	});
}

function extractHeaderWidgetParameters(fileContent: string): {name: string; value: string}[] {
	return (/<header-widget(?<parameters>.*?)(?:><\/header-widget|\/)>/s.exec(fileContent)?.groups?.parameters ?? '')
		.replace(/\s+/gs, ' ')
		.trim()
		.split(/(?<=["']) /)
		.map(attribute => attribute.split('='))
		.map(([name, value]) => ({name: formatKey(name), value: formatValue(value)}));
}

function formatKey(key: string): string {
	return key.replace(/[()[\]]/g, '').replace(/-[a-z]/g, match => match[1].toUpperCase());
}

function formatValue(value: string | undefined): string {
	return (value ?? '').replace(/^["']|["']$/g, '');
}

function mapParameter(
	tree: Tree,
	name: string,
	value: string,
	appModulePath: string,
	appComponentPath: string,
	context: SchematicContext
): void {
	switch (name) {
		case 'environment':
			return mapEnvironment(tree, value, appModulePath);
		case 'languageList':
			return addMasterLayoutConfig(tree, 'locale.locales', `['${value.split(',').join("','")}']`, appModulePath);
		case 'defaultLanguage':
			return addMasterLayoutConfig(tree, 'locale.defaultLanguage', `'${value}'`, appModulePath);
		case 'contact':
			return addMasterLayoutConfig(tree, 'header.serviceNavigation.infoContact', value, appModulePath);
		case 'appId':
			return addMasterLayoutConfig(tree, 'header.serviceNavigation.pamsAppId', value, appModulePath);
		case 'showInfo':
			return addWidgetVisibility(tree, 'displayInfo', value, appModulePath);
		case 'showLanguages':
			return addWidgetVisibility(tree, 'displayLanguages', value, appModulePath);
		case 'showNotifications':
			return addWidgetVisibility(tree, 'displayMessage', value, appModulePath);
		case 'showEportalServices':
			return addWidgetVisibility(tree, 'displayApplications', value, appModulePath);
		case 'loginStatus':
			return mapLoginStatus(tree, value, appComponentPath);
		case 'languageChange':
			return mapLanguageChange(tree, value, appComponentPath);
		case 'links':
		case 'profileLinks':
		case 'customButtons':
			warn(context, `"The ${name}" Header Widget parameter couldn't be automatically migrated, you need to process it manually.`);
			return undefined;
		case 'openInNewTab':
		case 'cms':
		case 'showSettings':
			warn(context, `The "${name}" Header Widget parameter doesn't exist with the Service Navigation, it will be removed.`);
			return undefined;
		default:
			infoText(context, `The "${name}" Header Widget parameter is unknown and will be ignored`);
			return undefined;
	}
}

function addMasterLayoutConfig(tree: Tree, property: string, value: string | boolean, appModulePath: string): void {
	addInjectionInClass(tree, appModulePath, 'ObMasterLayoutConfig', '@oblique/oblique');
	appendPrivateVoidFunctionToClass(tree, appModulePath, 'configureServiceNavigation');
	addConstructor(tree, appModulePath);
	appendCodeToFunction(tree, appModulePath, 'constructor', `this.configureServiceNavigation();`);
	appendCodeToFunction(tree, appModulePath, 'configureServiceNavigation', `this.masterLayoutConfig.${property} = ${value};`);
}

function mapEnvironment(tree: Tree, value: string, appModulePath: string): void {
	const sourceFile = createSrcFile(tree, appModulePath);
	const changes = [
		...addSymbolToNgModuleMetadata(
			sourceFile,
			appModulePath,
			'providers',
			`{provide: OB_PAMS_CONFIGURATION, useValue: {environment: ObEEnvironment.${value}}}`
		),
		...addImportToModule(sourceFile, appModulePath, 'OB_PAMS_CONFIGURATION', '@oblique/oblique'),
		...addImportToModule(sourceFile, appModulePath, 'ObEEnvironment', '@oblique/oblique')
	];
	applyChanges(tree, appModulePath, changes);
}

function addWidgetVisibility(tree: Tree, property: string, value: string, appModulePath: string): void {
	return addMasterLayoutConfig(
		tree,
		`header.serviceNavigation.${property}`,
		typeof value === 'boolean' ? value : value === 'true',
		appModulePath
	);
}

function mapLoginStatus(tree: Tree, value: string, appComponentPath: string): void {
	addInjectionInClass(tree, appComponentPath, 'ObMasterLayoutService', '@oblique/oblique');
	addConstructor(tree, appComponentPath);
	appendCodeToFunction(
		tree,
		appComponentPath,
		'constructor',
		`this.masterLayoutService.header.loginState$.subscribe($event => this.${value})`
	);
}

function mapLanguageChange(tree: Tree, value: string, appComponentPath: string): void {
	addInjectionInClass(tree, appComponentPath, 'TranslateService', '@ngx-translate/core');
	addConstructor(tree, appComponentPath);
	appendCodeToFunction(
		tree,
		appComponentPath,
		'constructor',
		`this.translateService.onLangChange.subscribe(({lang}) => this.${value.replace('$event', 'lang')})`
	);
}

export function removeHeaderWidgetCode(): Rule[] {
	return [
		removeCode(/^\s*<ng-template #obHeaderMobileControl>\s*<header-widget-mobile.*?<\/ng-template>\s*$/gms, '<header-widget-mobile> tags'),
		removeCode(
			/(?:^\s*<ng-template #obHeaderControl>\s*)?^\s*<header-widget.*(?:<\/header-widget>|\/>)\s*$(?:\s*<\/ng-template>\s*$)?/gms,
			'<header-widget> tags'
		),
		removeCode(/\s*(?:const|let)?.*headerWidgetScriptElement.*\s?.*\s?;\s*$/gm, 'headerWidgetScriptElement declaration'),
		removeCode(/\s*headerWidgetScriptElement\.setAttribute\(.*\s?.*\s*\)?;\s*$/gm, 'headerWidgetScriptElement.setAttribute code'),
		removeCode(
			/\s*document.body.append\(headerWidgetScriptElement\)(?:.*\s?.*\s*)?;\s*$/gm,
			'document.body.append of headerWidgetScriptElement'
		),
		removeCode(/\s*<script.*widget\.eportal<.admin\.ch\/header-widget\.js.*<\/script>\s*/g, 'script tags with script header-widget.js'),
		removeCode(
			/\s*(?:const|let)?\s?widgetMobile\s*=\s*document\.getElementById\(.widget-mobile.\);\s*$/gm,
			'widgetMobile variable by Id widget-mobile'
		),
		removeCode(
			/\s*(?:const|let)?.*obliqueHeader\s=\sdocument\.querySelector\(.\.ob-header-controls.\);\s*obliqueHeader\.prepend\(widgetMobile\);\s*$/gm,
			'variable obliqueHeader that prepend widgetMobile'
		)
	];
}

export function removeEmptyLifecycleHook(methodName: 'ngOnInit' | 'ngAfterViewInit'): Rule {
	const interfaceName = methodName.slice(2, methodName.length);
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		const methodRegexp = new RegExp(`\\s*(?:public)?\\s*${methodName}\\(\\)(?::\\s*void)?\\s*{\\s*}$`, 'gm');
		const interfaceRegexp = new RegExp(`\\s*${interfaceName},?\\s*`, 'g');
		const toApply = (filePath: string): void => {
			const hasEmptyLifecycleHook = methodRegexp.test(readFile(tree, filePath));
			if (hasEmptyLifecycleHook) {
				infoMigration(_context, `Remove empty ${methodName} in ${filePath}`);
				replaceInFile(tree, filePath, methodRegexp, '');
				replaceInFile(tree, filePath, interfaceRegexp, '');
				replaceInFile(tree, filePath, /(?<=implements\s*.*),(?={)/, ' ');
				replaceInFile(tree, filePath, /(?<=import\s*.*),(?=})/g, '');
			}
		};
		return applyInTree(tree, toApply, '*.ts');
	});
}

export function removeCode(regex: RegExp, caseDescription: string): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		const toApply = (filePath: string): void => {
			if (readFile(tree, filePath).match(regex)) {
				infoMigration(_context, `Remove ${caseDescription} in ${filePath}`);
				replaceInFile(tree, filePath, regex, '');
			}
		};
		return applyInTree(tree, toApply, '*.{ts,html}');
	});
}

export function addProvidersToRootModule(providers: {provide: string; providerName: string; additionalImports?: string[]}[]): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		const mainTsPathPerProject = getFilePathPerProject(tree, ['architect', 'build', 'options', 'main']);
		getRootModulePathPerProject(tree, mainTsPathPerProject).forEach(({path: appModulePath}) => {
			const providerChanges: Change[] = [];
			const sourceFile = createSrcFile(tree, appModulePath);
			const providerImports: string[] = [];
			providers.forEach((provider: {provide: string; providerName: string; additionalImports?: string[]}) => {
				if (!providerAlreadyExists(provider.providerName, readFile(tree, appModulePath))) {
					providerChanges.push(...addSymbolToNgModuleMetadata(sourceFile, appModulePath, 'providers', provider.provide));
					providerImports.push(...setupImportArray(provider.providerName, tree, appModulePath, provider.additionalImports));
					infoMigration(_context, `Oblique's ServiceNavigation: Adding provider  ${provider.providerName} in ${appModulePath}`);
				}
			});
			const importChanges = importProviderModules(providerImports, sourceFile, appModulePath, _context);
			const changes = [...providerChanges, ...importChanges];
			applyChanges(tree, appModulePath, changes);
		});
		return tree;
	});
}

export function setupImportArray(providerName: string, tree: Tree, appModulePath: string, additionalImports?: string[]): string[] {
	const providerImports: string[] = [];
	if (additionalImports && additionalImports.length > 0) {
		providerImports.push(...additionalImports);
	}
	providerImports.push(providerName);
	return providerImports.filter(importToAdd => !moduleImportAlreadyExists(importToAdd, readFile(tree, appModulePath)));
}

export function moduleImportAlreadyExists(importName: string, fileContent: string): boolean {
	const hasImportRegex = new RegExp(`import\\s*{[^}]*${importName}[^}]*}\\s*from\\s*['"]${ObliquePackage}['"];`, 'gm');
	return hasImportRegex.test(fileContent);
}

export function providerAlreadyExists(providerName: string, fileContent: string): boolean {
	const hasProviderRegex = new RegExp(`(?<=providers\\s*:\\s*\\[[^\\]]*)\\b${providerName}\\b(?=[^\\]]*])`, 'gm');
	return hasProviderRegex.test(fileContent);
}

export function importProviderModules(
	importModuleNames: string[],
	sourceFile: any,
	appModulePath: string,
	_context: SchematicContext
): Change[] {
	return importModuleNames.map(providerModule => {
		infoMigration(_context, `Oblique's ServiceNavigation: Adding import ${providerModule} in ${appModulePath}`);
		return insertImport(sourceFile, appModulePath, providerModule, ObliquePackage);
	});
}
