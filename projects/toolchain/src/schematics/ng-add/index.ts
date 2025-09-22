import {type Rule, chain} from '@angular-devkit/schematics';

import {addToolchain} from './rules/add-toolchain-dependency.rule';
import {addBrowserslistrc} from './rules/add-browserslistrc.rule';

export function toolchain(): Rule {
	return chain([addToolchain(), addBrowserslistrc()]);
}
