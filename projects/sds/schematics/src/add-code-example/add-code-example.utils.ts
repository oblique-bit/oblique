import {classify, dasherize} from '@angular-devkit/core/src/utils/strings';
import {getSourceNodes} from '@schematics/angular/utility/ast-utils';
import {Rule, SchematicContext, SchematicsException, Tree, apply, chain, mergeWith, move, template, url} from '@angular-devkit/schematics';
import {getSdsSourceRootPath} from '../workspace.utils';
import {addNodeToSyntaxList, checkPropertyLiteralExists} from '../nodes.utils';
import ts, {SyntaxKind} from 'typescript';
import * as colors from 'ansi-colors';
import {AddCodeExampleOptions} from './add-code-example.model';
import {
	addImportToFile,
	codeExampleMapperFilePath,
	createExampleFileName,
	getExampleSymbolName,
	getSourceFileOrFalse,
	showAlreadyExistsMessage
} from '../sds.utils';
import {createHost} from '../host.utils';

export function areCodeExampleOptionsValid(options: AddCodeExampleOptions, tree: Tree, context: SchematicContext): boolean {
	let isValid = true;
	if (!options.name) {
		context.logger.error(`${colors.symbols.cross}\tError: A name must be provided for the example.`);
		isValid = false;
	}
	if (/\W/.test(options.name)) {
		context.logger.error(`${colors.symbols.cross}\tError: The example name should only have [a-zA-Z]`);
		isValid = false;
	}
	return isValid;
}

export function createCodeExampleFile(variables: Record<string, string>, directoryPath: string): Rule {
	const sourceTemplates = url('templates');
	const sourceParametrizedTemplates = apply(sourceTemplates, [template({...variables, dasherize}), move(directoryPath)]);
	return mergeWith(sourceParametrizedTemplates);
}

export function updateMapper(exampleName: string): Rule {
	return () => addSlug(exampleName);
}

function addSlug(exampleName: string): Rule {
	return async (tree: Tree, context: SchematicContext) => {
		const pathToMapper = `${await getSdsSourceRootPath(tree)}/${codeExampleMapperFilePath}`;
		const dasherizedExampleName = dasherize(exampleName);
		const slugText = `${dasherizedExampleName.includes('-') ? `'${dasherizedExampleName}'` : dasherizedExampleName}: ${getExampleSymbolName(
			exampleName
		)}`;
		const mapperSourceFile = await getSourceFileOrFalse(pathToMapper, tree);
		if (!mapperSourceFile) {
			context.logger.warn(
				`Mapper not found at path ${codeExampleMapperFilePath}. Please add your slug ${colors.greenBright(
					slugText
				)} into the mapper's 'codeExamples'-Records manually.`
			);
			return chain([]);
		}
		if (!checkSlugAlreadyExists(mapperSourceFile, exampleName, context)) {
			return chain([
				addNodeToSyntaxList(mapperSourceFile, 'codeExamples', {
					kind: SyntaxKind.ObjectLiteralExpression,
					text: slugText,
					insert: 'ascending'
				}),
				importSlugSymbol(exampleName)
			]);
		}
		return chain([]);
	};
}

async function getMapperPath(tree: Tree): Promise<string> {
	const pathToMapper = `${await getSdsSourceRootPath(tree)}/${codeExampleMapperFilePath}`;
	const host = createHost(tree);
	const mapperExists = await host.isFile(pathToMapper);
	if (mapperExists) {
		return pathToMapper;
	}
	throw new SchematicsException(`Error: Mapper not found at path ${pathToMapper}`);
}

function importSlugSymbol(exampleName: string): Rule {
	return async (tree: Tree) => {
		const pathToMapper = await getMapperPath(tree);
		const relativePath = `./code-examples/${dasherize(exampleName)}/${createExampleFileName(exampleName)}`;
		return addImportToFile({symbolName: getExampleSymbolName(exampleName), relativePath}, pathToMapper);
	};
}

function checkSlugAlreadyExists(sourceFile: ts.SourceFile, name: string, context: SchematicContext): boolean {
	const elementToFind = {
		identifierName: 'codeExamples',
		propertyName: `${dasherize(name)}`,
		className: `${classify(name)}CodeExamplesComponent`
	};
	const alreadyExists = checkPropertyLiteralExists(getSourceNodes(sourceFile), elementToFind);
	if (alreadyExists) {
		showAlreadyExistsMessage(context, {
			elementDescription: 'slug',
			symbol: `${elementToFind.propertyName}`,
			existsIn: `in the array ${elementToFind.identifierName}`
		});
	}
	return alreadyExists;
}
