import type {Rule, Tree} from '@angular-devkit/schematics';
import {
	type NodeDependency,
	NodeDependencyType,
	addPackageJsonDependency,
	removePackageJsonDependency
} from '@schematics/angular/utility/dependencies';
import {currentToolchainVersion} from '../../version';

export function addToolchain(): Rule {
	return (tree: Tree) => {
		const dep: NodeDependency = {
			type: NodeDependencyType.Dev,
			name: '@oblique/toolchain',
			version: `^${currentToolchainVersion}`,
			overwrite: false
		};
		removePackageJsonDependency(tree, '@oblique/toolchain'); // to remove it from dependencies
		addPackageJsonDependency(tree, dep);

		return tree;
	};
}
