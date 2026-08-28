import {type Rule, type Tree, chain, move, template} from '@angular-devkit/schematics';
import {addImportToModule} from '@schematics/angular/utility/ast-utils';
import type {Statement} from 'typescript';
import type {ObGroupLogger} from '../../../logger';
import {createFromTemplate} from '../../shared/template/template';
import {
	applyChanges,
	createSrcFile,
	insertClassProperty,
	removeClassProperty,
	removeStatement,
} from '../../shared/ast/ts';

const obliquePackage = '@oblique/oblique';
const masterLayoutModule = 'ObMasterLayoutModule';
const appModulePath = 'src/app/app-module.ts';
const appComponentPath = 'src/app/app.ts';
const appSpecPath = 'src/app/app.spec.ts';
const appTemplatePath = 'src/app/app.html';

export default function rootLayout(logger: ObGroupLogger, title: string, applicationOperator: string): Rule {
	return chain([
		(tree: Tree) => {
			logger.step('Embed Oblique master layout');
			return tree;
		},
		importMasterLayoutModule(),
		applyMasterLayout(title, applicationOperator),
		replaceTitleWithYearSignal(),
		removeTitleTest(),
	]);
}

function importMasterLayoutModule(): Rule {
	return (tree: Tree) => {
		if (!tree.exists(appModulePath)) {
			return tree;
		}
		const sourceFile = createSrcFile(tree, appModulePath);
		applyChanges(tree, appModulePath, addImportToModule(sourceFile, appModulePath, masterLayoutModule, obliquePackage));
		return tree;
	};
}

function applyMasterLayout(title: string, applicationOperator: string): Rule {
	return (tree: Tree) => {
		if (!tree.exists(appTemplatePath)) {
			return tree;
		}
		tree.delete(appTemplatePath);
		return createFromTemplate('./templates/root-layout', [
			template({title, applicationOperator}),
			move('master-layout.html', appTemplatePath),
		]);
	};
}

function replaceTitleWithYearSignal(): Rule {
	return (tree: Tree) => {
		if (!tree.exists(appComponentPath)) {
			return tree;
		}
		const sourceFile = createSrcFile(tree, appComponentPath);
		const changes = [
			removeClassProperty(sourceFile, 'App', 'title'),
			insertClassProperty(sourceFile, 'App', 'readonly year = signal(new Date().getFullYear());'),
		];
		applyChanges(tree, appComponentPath, changes);
		return tree;
	};
}

function removeTitleTest(): Rule {
	return (tree: Tree) => {
		if (!tree.exists(appSpecPath)) {
			return tree;
		}
		const sourceFile = createSrcFile(tree, appSpecPath);
		const isTitleTest = (statement: Statement): boolean =>
			statement.getText(sourceFile).includes('should render title');
		applyChanges(tree, appSpecPath, [removeStatement(sourceFile, appSpecPath, isTitleTest)]);
		return tree;
	};
}
