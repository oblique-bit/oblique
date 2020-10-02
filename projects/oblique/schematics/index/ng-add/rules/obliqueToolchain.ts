import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {getFileContent} from '@schematics/angular/utility/test';
import {addPackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {angularJsonConfigPath, createDevDependency, getJson, getJsonProperty, importModule, isAngular10} from '../../ng-add-utils';
import {addMainCSS, addTranslationFiles, addTranslationToImports, updateAssets} from './obliqueToolchainFunc';

export function obliqueToolchain(options: any): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			updateAngularJsonStyles(),
			addScssImport('src/scss/styles.scss'),
			addScssImport('src/styles.scss'),
			addPrefix(options.prefix),
			addTranslation(options.langs.split(' '))
		])(tree, _context);
}

function updateAngularJsonStyles(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!tree.exists(angularJsonConfigPath)) {
			return tree;
		}
		const json = getJson(tree, angularJsonConfigPath);
		const defaultProjectName = getJsonProperty(json, 'defaultProject');
		const path = `projects;${defaultProjectName};architect;build;options`;
		const optionsJson: any = getJsonProperty(json, path);
		return chain([updateAssets(json, defaultProjectName, path, optionsJson), addMainCSS(json, defaultProjectName, path, optionsJson)])(tree, _context);
	};
}

function addScssImport(stylesPath: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (tree.exists(angularJsonConfigPath)) {
			const json = getJson(tree, angularJsonConfigPath);
			const defaultProjectName = getJsonProperty(json, 'defaultProject');
			// prettier-ignore
			const styleExt = getJsonProperty(json, `projects;${defaultProjectName};schematics;@schematics/angular:component;style`)
				|| getJsonProperty(json, `schematics;@schematics/angular:component;style`);

			if (styleExt !== 'scss' || !tree.exists(stylesPath)) {
				return tree;
			}

			const layoutContent = getFileContent(tree, stylesPath);
			const scssImport = `@import '~@oblique/oblique/styles/scss/core/variables';`;
			if (!layoutContent.includes(scssImport)) {
				tree.overwrite(stylesPath, scssImport.concat('\n', layoutContent));
			}
		}
		return tree;
	};
}

function addPrefix(prefix: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const json = getJson(tree, angularJsonConfigPath);
		const defaultProjectName = getJsonProperty(json, 'defaultProject');
		json.schematics = {
			'@schematics/angular:component': {
				prefix: prefix,
				style: 'scss'
			},
			'@schematics/angular:directive': {
				prefix: prefix
			}
		};
		json.projects[defaultProjectName].prefix = prefix;
		tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));

		return tree;
	};
}

function addTranslation(langs: string[]): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		addPackageJsonDependency(tree, createDevDependency('@ngx-translate/core', isAngular10(tree)));

		return chain([importModule('HttpClientModule', '@angular/common/http'), addTranslationFiles(langs), addTranslationToImports()])(tree, _context);
	};
}
