import {Rule, SchematicContext, SchematicsException, Tree, chain, noop, schematic} from '@angular-devkit/schematics';
import {
	addPreviewToPreviewsInCodeExample,
	areOptionsValid,
	createPreviewDirectoryPath,
	createPreviewFiles,
	getDirectoryOrFalse,
	getPreviewSymbolName
} from './add-preview.utils';
import {dasherize} from '@angular-devkit/core/src/utils/strings';
import {AddPreviewOptions} from './add-preview.model';
import {AddCodeExampleOptions} from '../add-code-example/add-code-example.model';
import {getExampleDirectoryOrFalse, getExampleSymbolName} from '../sds.utils';
import * as colors from 'ansi-colors';

export function addPreview(options: AddPreviewOptions): Rule {
	return () => chain([setupExample(options.codeExample), setupPreviewComponent(options)]);
}

function setupExample(codeExample: string): Rule {
	return async (tree: Tree, context: SchematicContext) => {
		const exampleExists = await getExampleDirectoryOrFalse(tree, dasherize(codeExample));
		if (!exampleExists) {
			context.logger.info(
				`${colors.symbols.info}\tThe code-example with name ${getExampleSymbolName(
					codeExample
				)} doesn't exists. Creating new code-example ${getExampleSymbolName(codeExample)}.`
			);
			return runAddExampleSchematic(codeExample);
		}
		return noop();
	};
}

function runAddExampleSchematic(exampleName: string): Rule {
	return () => schematic('add-code-example', {name: exampleName} as AddCodeExampleOptions);
}

function setupPreviewComponent(options: AddPreviewOptions): Rule {
	return async (tree: Tree, context: SchematicContext) => {
		if (areOptionsValid(options, context)) {
			const previewExists = await getDirectoryOrFalse(options, tree);
			if (previewExists) {
				context.logger.warn(
					`${colors.symbols.cross}  Error: Preview ${colors.bold(dasherize(options.preview))} already exists at path  ${previewExists}.`
				);
				return noop();
			}
			return chain([createPreview(options)]);
		}
		return noop();
	};
}

function createPreview(options: AddPreviewOptions) {
	return async (tree: Tree, context: SchematicContext) => {
		// checks again to get sure the example exists
		const exampleExists = await getExampleDirectoryOrFalse(tree, options.codeExample);
		if (!exampleExists) {
			throw new SchematicsException(
				`Error: Could not find a code example at ${exampleExists}. A code example must exist to create within the preview.`
			);
		}
		return chain([
			createPreviewFiles(
				{
					...options,
					dasherizedPreviewName: dasherize(options.preview),
					componentName: getPreviewSymbolName(options.preview, options.codeExample),
					dasherizedCodeExampleName: dasherize(options.codeExample)
				},
				await createPreviewDirectoryPath(options, tree)
			),
			addPreviewToPreviewsInCodeExample(options.preview, options.codeExample),
			() => {
				showAddPreviewCompleteMessage(context, options);
			}
		]);
	};
}

function showAddPreviewCompleteMessage(context: SchematicContext, options: AddPreviewOptions): void {
	context.logger.info(
		colors.greenBright(
			`${colors.symbols.check}\tThe schematic to generate preview with name ${colors.bold(
				getPreviewSymbolName(options.preview, options.codeExample)
			)} in example ${colors.bold(getExampleSymbolName(options.codeExample))} has been completed.`
		)
	);
}
