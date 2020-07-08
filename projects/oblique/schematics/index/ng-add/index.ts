import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {addPackageDependency, addPreconditions, getObliqueVersion, installDependencies, OBLIQUE_PACKAGE} from '../ng-add-utils';
import {obliqueToolchain} from './rules/obliqueToolchain';
import {obliqueFeatures} from './rules/obliqueFeatures';
import {toolchain} from './rules/toolchain';
import {oblique} from './rules/oblique';

export function addOblique(_options: any): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addPreconditions(),
			addPackageDependency(OBLIQUE_PACKAGE, getObliqueVersion(tree)),
			oblique(_options),
			obliqueFeatures(_options),
			obliqueToolchain(_options),
			toolchain(_options),
			installDependencies()
		])(tree, _context);
}
