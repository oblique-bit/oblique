import {type Rule, chain} from '@angular-devkit/schematics';
import {addBrowserslistrc} from './rules/add-browserslistrc.rule';

export function toolchain(): Rule {
	return chain([addBrowserslistrc()]);
}
