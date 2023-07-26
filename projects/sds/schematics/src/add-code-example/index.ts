import {classify, dasherize} from '@angular-devkit/core/src/utils/strings';
import {Rule, SchematicContext, Tree, chain, noop} from '@angular-devkit/schematics';
import {areCodeExampleOptionsValid, createCodeExampleFile, updateMapper} from './add-code-example.utils';
import {createExampleDirectoryPath, getExampleDirectoryOrFalse, getExampleSymbolName} from '../sds.utils';
import * as colors from 'ansi-colors';
import {AddCodeExampleOptions} from './add-code-example.model';

export function addCodeExamples(options: AddCodeExampleOptions): Rule {
	return () => chain([addExampleComponent(options)]);
}

function addExampleComponent(options: AddCodeExampleOptions): Rule {
	return async (tree: Tree, context: SchematicContext) => {
		const exampleExists = await getExampleDirectoryOrFalse(tree, options.name);
		if (exampleExists) {
			context.logger.info(`${colors.symbols.info}\tInfo: Example ${options.name} already exists at path ${colors.yellow(exampleExists)}.`);
			return chain([]);
		}
		if (areCodeExampleOptionsValid(options, tree, context)) {
			return chain([
				createCodeExampleFile(
					{...options, dasherizedName: dasherize(options.name), classifiedName: classify(options.name)},
					await createExampleDirectoryPath(tree, options.name)
				),
				updateMapper(options.name),
				() => showAddCodeExampleCompletedMessage(context, options)
			]);
		}
		return noop();
	};
}

function showAddCodeExampleCompletedMessage(context: SchematicContext, options: AddCodeExampleOptions): void {
	context.logger.info(
		colors.greenBright(
			`${colors.symbols.check}\tThe schematic to generate code-example with name ${colors.bold(
				getExampleSymbolName(options.name)
			)} has been completed.`
		)
	);
}
