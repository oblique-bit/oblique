import {type Rule, type SchematicContext, type Tree, chain} from '@angular-devkit/schematics';
import {addBrowserslistrc} from './rules/add-browserslistrc.rule';

export function toolchain(): Rule {
	return (tree: Tree, context: SchematicContext) => {
		return chain([addBrowserslistrc()])(tree, context);
	};
}
