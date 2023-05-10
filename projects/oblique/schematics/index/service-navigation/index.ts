import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {Change} from '@schematics/angular/utility/change';
import {addSymbolToNgModuleMetadata, insertImport} from '@schematics/angular/utility/ast-utils';
import {ObliquePackage, applyInTree, createSafeRule, infoMigration, readFile, replaceInFile} from '../utils';
import {appModulePath, applyChanges, createSrcFile} from '../ng-add/ng-add-utils';

export function serviceNavigation(): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
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

export function removeHeaderWidgetCode(): Rule[] {
	return [
		removeCode(/\s*<header-widget-mobile.*\s*.*\s*<\/header-widget-mobile>\s*/g, '<header-widget-mobile> tags'),
		removeCode(/\s*<header-widget\s?(?:obHeaderCustomControl)?\s*>\s*.*\s*<\/header-widget>\s*/g, '<header-widget> tags'),
		removeCode(
			/\s*<ng-template #obHeaderMobileControl>\s*<\/ng-template>\s*/g,
			"ng-templates with obHeaderMobileControl-query if it's empty"
		),
		removeCode(/\s*(?:const|let)?.*headerWidgetScriptElement.*\s?.*\s?;\s*$/gm, 'headerWidgetScriptElement declaration'),
		removeCode(/\s*headerWidgetScriptElement.setAttribute\(.*\s?.*\s*\)?;\s*$/gm, 'headerWidgetScriptElement.setAttribute code'),
		removeCode(
			/\s*document.body.append\(headerWidgetScriptElement\)(?:.*\s?.*\s*)?;\s*$/gm,
			'document.body.append of headerWidgetScriptElement'
		),
		removeCode(/\s*<script.*widget.eportal.admin.ch\/header-widget.js.*<\/script>\s*/g, 'script tags with script header-widget.js'),
		removeCode(
			/\s*(?:const|let)?\s?widgetMobile\s*=\s*document\.getElementById\(.widget-mobile.\);\s*$/gm,
			'widgetMobile variable by Id widget-mobile'
		),
		removeCode(/\s*<ng-template\s*#obHeaderControl>\s*<\/ng-template>\s*/g, 'ng-templates with obHeaderControl-query'),
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
		const providerChanges: Change[] = [];
		const sourceFile = createSrcFile(tree, appModulePath);
		const providerImports: string[] = [];
		providers.forEach((provider: {provide: string; providerName: string; additionalImports?: string[]}) => {
			if (!providerAlreadyExists(provider.providerName, readFile(tree, appModulePath))) {
				providerChanges.push(...addSymbolToNgModuleMetadata(sourceFile, appModulePath, 'providers', provider.provide));
				providerImports.push(...setupImportArray(provider.providerName, tree, provider.additionalImports));
				infoMigration(_context, `Oblique's ServiceNavigation: Adding provider  ${provider.providerName} in ${appModulePath}`);
			}
		});
		const importChanges = importProviderModules(providerImports, sourceFile, _context);
		const changes = [...providerChanges, ...importChanges];
		return applyChanges(tree, appModulePath, changes);
	});
}

export function setupImportArray(providerName: string, tree: Tree, additionalImports?: string[]): string[] {
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

export function importProviderModules(importModuleNames: string[], sourceFile: any, _context: SchematicContext): Change[] {
	return importModuleNames.map(providerModule => {
		infoMigration(_context, `Oblique's ServiceNavigation: Adding import ${providerModule} in ${appModulePath}`);
		return insertImport(sourceFile, appModulePath, providerModule, ObliquePackage);
	});
}
