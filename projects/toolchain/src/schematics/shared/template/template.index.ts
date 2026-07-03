import {type Rule, type SchematicContext, type Tree, chain, template} from '@angular-devkit/schematics';
import {createFromTemplate} from './template';
import type {ObSchemaOptions} from '../types';

export function templateIndex(): Rule {
	return (tree: Tree, context: SchematicContext) => {
		return chain([createFromTemplate('./templates')])(tree, context);
	};
}
export function templateOptions(options: ObSchemaOptions): Rule {
	return (tree: Tree, context: SchematicContext) => {
		return chain([createFromTemplate('./templates', [template(options)])])(tree, context);
	};
}
