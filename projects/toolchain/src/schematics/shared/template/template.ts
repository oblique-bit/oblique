import {type Rule, apply, mergeWith, url} from '@angular-devkit/schematics';

export function createFromTemplate(path: string, rules: Rule[] = []): Rule {
	return mergeWith(apply(url(path), rules));
}
