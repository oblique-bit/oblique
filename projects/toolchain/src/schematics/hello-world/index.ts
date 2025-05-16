import type {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';

export function helloWorld(option: {name: string; content: string}): Rule {
	return (tree: Tree, context: SchematicContext) => {
		tree.create(option.name, `${option.content} example`);
		context.logger.info('Create hello-world-file!');
		return tree;
	};
}
