import {AddPreviewOptions} from './add-preview.model';
import {createHost} from '../host.utils';
import {Rule, SchematicContext, Tree, apply, chain, mergeWith, move, noop, template, url} from '@angular-devkit/schematics';
import {camelize, classify, dasherize} from '@angular-devkit/core/src/utils/strings';
import {
	addImportToFile,
	createExampleFileName,
	getExampleComponentPathOrFalse,
	getExampleDirectoryOrFalse,
	getExampleDirectoryPath,
	getSourceFileOrFalse
} from '../sds.utils';
import {isImported} from '@schematics/angular/utility/ast-utils';
import {addNodeToSyntaxList} from '../nodes.utils';
import {SourceFile, SyntaxKind} from 'typescript';
import * as colors from 'ansi-colors';

export function createPreviewFiles(variables: Record<string, string>, pathToFeature: string): Rule {
	const sourceTemplates = url('templates');
	const sourceParametrizedTemplates = apply(sourceTemplates, [template({...variables, dasherize}), move(pathToFeature)]);
	return mergeWith(sourceParametrizedTemplates);
}

export async function getDirectoryOrFalse(options: AddPreviewOptions, tree: Tree): Promise<string | false> {
	if (await getExampleDirectoryOrFalse(tree, options.codeExample)) {
		const previewDirectoryPath = await createPreviewDirectoryPath(options, tree);
		const host = createHost(tree);
		const isDirectory = await host.isDirectory(previewDirectoryPath);
		return isDirectory ? tree.getDir(previewDirectoryPath).path : false;
	}
	return false;
}

export function addPreviewToPreviewsInCodeExample(previewName: string, exampleName: string): Rule {
	return async (tree: Tree, context: SchematicContext) => {
		let exampleComponentFilePath = await getExampleComponentPathOrFalse(tree, exampleName);
		const previewSymbolName = getPreviewSymbolName(previewName, exampleName);
		const previewTextToAdd = createPreviewsElementText(previewName, exampleName, previewSymbolName);
		if (!exampleComponentFilePath) {
			showExampleComponentPathNotFoundWarning(context, previewTextToAdd, exampleName);
			return noop();
		}
		exampleComponentFilePath = `${exampleComponentFilePath}`;
		let sourceFile = await getSourceFileOrFalse(exampleComponentFilePath, tree);
		if (exampleComponentFilePath && !sourceFile) {
			showExampleComponentSourceFileNotFoundWarning(context, {exampleComponentFilePath, previewTextToAdd, exampleName});
			return noop();
		}
		sourceFile = sourceFile as SourceFile;
		const symbolImportPath = `../${dasherize(exampleName)}/previews/${dasherize(previewName)}/${getPreviewFileName(
			previewName,
			exampleName
		)}`;
		if (exampleComponentFilePath && !isImported(sourceFile, previewSymbolName, symbolImportPath)) {
			return chain([
				addNodeToSyntaxList(sourceFile, 'previews', {
					kind: SyntaxKind.ArrayLiteralExpression,
					text: previewTextToAdd,
					insert: 'right'
				}),
				addImportToFile({symbolName: previewSymbolName, relativePath: symbolImportPath}, exampleComponentFilePath)
			]);
		}

		return chain([]);
	};
}

function createPreviewsElementText(previewName: string, exampleName: string, previewSymbolName: string): string {
	const textSpace = `\n\t\t\t`;
	return `{${textSpace}component: ${previewSymbolName},${textSpace}idParts: ['${getIdParts(previewName)}'],${textSpace}title: '${classify(
		exampleName
	)} ${camelize(previewName)}',${textSpace}snippets: [${textSpace}\tthis.getSnippet('${dasherize(exampleName)}', '${dasherize(
		previewName
	)}/${getPreviewFileName(previewName, exampleName)}.html', 'HTML'),${textSpace}\tthis.getSnippet('${dasherize(exampleName)}', '${dasherize(
		previewName
	)}/${getPreviewFileName(previewName, exampleName)}.ts', 'TS')]}`;
}

function getIdParts(previewName: string): string {
	return `${dasherize(previewName).split('-').join("', '")}`;
}

function showExampleComponentPathNotFoundWarning(context: SchematicContext, previewTextToAdd: string, exampleName: string): void {
	context.logger.warn(
		`File with name ${createExampleFileName(exampleName)} not found. Please add your preview \n${colors.greenBright(
			previewTextToAdd
		)}\n into ${createExampleFileName(exampleName)} 'previews'-Array manually.`
	);
}

function showExampleComponentSourceFileNotFoundWarning(
	context: SchematicContext,
	messageData: {
		exampleComponentFilePath: string;
		previewTextToAdd: string;
		exampleName: string;
	}
): void {
	context.logger.warn(
		`File of example component not found at path ${messageData.exampleComponentFilePath}. Please add your preview \n${colors.greenBright(
			messageData.previewTextToAdd
		)}\n into ${createExampleFileName(messageData.exampleName)} 'previews'-Array manually.`
	);
}

export function getPreviewFileName(previewName: string, exampleName: string): string {
	return `${dasherize(exampleName)}-example-${dasherize(previewName)}-preview.component`;
}

export function getPreviewSymbolName(previewName: string, exampleName: string): string {
	return `${classify(exampleName)}Example${classify(previewName)}PreviewComponent`;
}

export function areOptionsValid(options: AddPreviewOptions, context: SchematicContext): boolean {
	let isValid = true;
	if (!options.preview) {
		context.logger.error(
			`Error: A preview must be provided for the component. For example: run the schematic or script with the arguments ${colors.white(
				colors.bgBlackBright(`--code-example="yourExample" --preview="yourPreview"`)
			)} or ${colors.white(colors.bgBlackBright(`yourFeature yourFeatureState`))}.`
		);
		isValid = false;
	}
	if (!options.codeExample) {
		context.logger.error('Error: A code example must be provided for the component.');
		isValid = false;
	}
	return isValid;
}

export async function createPreviewDirectoryPath(options: AddPreviewOptions, tree: Tree): Promise<string> {
	const exampleDirectoryPath: string = await getExampleDirectoryPath(tree, options.codeExample);
	return `${exampleDirectoryPath}/previews/${dasherize(options.preview)}`;
}
