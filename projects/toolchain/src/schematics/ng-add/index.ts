import {type Rule, chain} from '@angular-devkit/schematics';

import {addToolchain} from './rules/add-toolchain-dependency.rule';

export function toolchain(): Rule {
	return chain([addToolchain()]);
}
