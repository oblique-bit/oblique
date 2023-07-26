import {Rule, SchematicContext, SchematicsException, Tree, noop} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import {isImported} from '@schematics/angular/utility/ast-utils';
import {InsertChange, ReplaceChange} from '@schematics/angular/utility/change';
import {createHost} from './host.utils';
import {getSdsSourceRootPath} from './workspace.utils';
import {classify, dasherize} from '@angular-devkit/core/src/utils/strings';
import {insertImport} from '@angular/cdk/schematics';
import * as colors from 'ansi-colors';

export const codeExampleMapperFilePath = `app/component-pages/code-examples.mapper.ts`;

export async function getExampleDirectoryOrFalse(tree: Tree, exampleName: string): Promise<string | false> {
	const exampleDirectoryPath = await createExampleDirectoryPath(tree, exampleName);
	const host = createHost(tree);
	const isDirectory = await host.isDirectory(`${exampleDirectoryPath}`);
	return isDirectory ? tree.getDir(exampleDirectoryPath).path : false;
}

export function createExampleFileName(exampleName: string): string {
	return `${dasherize(exampleName)}-code-examples.component`;
}

export function addImportToFile(toAdd: {symbolName: string; relativePath: string}, pathToFile: string): Rule {
	return async (tree: Tree, context: SchematicContext) => {
		const sourceFile = await getSourceFileOrFalse(pathToFile, tree);
		if (sourceFile) {
			const existsSymbolImport = isImported(sourceFile, toAdd.symbolName, toAdd.relativePath);
			if (existsSymbolImport) {
				showAlreadyExistsMessage(context, {
					elementDescription: 'import',
					symbol: `{${classify(toAdd.symbolName)}} from ${toAdd.relativePath}`
				});
				return noop();
			}
			return changeInsertLeft([insertImport(sourceFile, pathToFile, toAdd.symbolName, toAdd.relativePath) as InsertChange], pathToFile);
		}
		return noop();
	};
}

export async function getSourceFileOrFalse(
	filePath: string,
	tree: Tree,
	scriptKind: ts.ScriptKind = ts.ScriptKind.TS
): Promise<ts.SourceFile | false> {
	const host = createHost(tree);
	if (await host.isFile(filePath)) {
		const file = await createHost(tree).readFile(filePath);
		return ts.createSourceFile(filePath, file.toString(), ts.ScriptTarget.Latest, true, scriptKind);
	}
	return false;
}

export function changeInsertLeft(changes: InsertChange[], path: string): Rule {
	return (tree: Tree) => {
		const updateRecorder = tree.beginUpdate(path);
		changes.forEach((change: InsertChange) => updateRecorder.insertLeft(change.pos, change.toAdd));
		tree.commitUpdate(updateRecorder);
	};
}

export function changeInsertRight(changes: InsertChange[], path: string): Rule {
	return (tree: Tree) => {
		const updateRecorder = tree.beginUpdate(path);
		changes.forEach((change: InsertChange) => {
			updateRecorder.insertRight(change.pos, change.toAdd);
		});
		tree.commitUpdate(updateRecorder);
	};
}

export function replaceUpdate(changes: ReplaceChange[], path: string, startIndex: number): Rule {
	return tree => {
		const replaceRecorder = tree.beginUpdate(path);
		changes.forEach((change: ReplaceChange) => {
			replaceRecorder.remove(startIndex, change.oldText.length);
			replaceRecorder.insertLeft(startIndex, change.newText);
		});
		tree.commitUpdate(replaceRecorder);
	};
}

export async function getExampleComponentPathOrFalse(tree: Tree, exampleName: string): Promise<string | false> {
	const directoryPath = await getExampleDirectoryPath(tree, exampleName);
	const componentPath = `${directoryPath}/${createExampleFileName(exampleName)}.ts`;
	const host = createHost(tree);
	const fileExists = await host.isFile(componentPath);
	return fileExists ? componentPath : false;
}

// path must not exist and only returns the path string
export async function createExampleDirectoryPath(tree: Tree, exampleName: string): Promise<string> {
	return `${await getSdsSourceRootPath(tree)}/app/component-pages/code-examples/${dasherize(exampleName)}`;
}

// path must exist
export async function getExampleDirectoryPath(tree: Tree, exampleName: string): Promise<string> {
	const host = createHost(tree);
	const directoryPath = await createExampleDirectoryPath(tree, exampleName);
	if (await host.isDirectory(directoryPath)) {
		return tree.getDir(directoryPath).path;
	}
	throw new SchematicsException(`Error: Directory at path ${colors.yellowBright(directoryPath)} doesn't exists.`);
}

export function getExampleSymbolName(exampleName: string): string {
	return `${classify(exampleName)}CodeExamplesComponent`;
}

export function showAlreadyExistsMessage(
	context: SchematicContext,
	exist: {elementDescription: 'element' | 'import' | 'slug'; symbol: string; existsIn?: string}
): void {
	context.logger.info(
		`${colors.symbols.info}\tThe ${exist.elementDescription} ${exist.symbol} already exists${
			exist?.existsIn?.length > 0 ? ` ${exist.existsIn}.` : '.'
		} It will not be added again.`
	);
}
