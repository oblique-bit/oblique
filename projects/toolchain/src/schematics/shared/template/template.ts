import {type Rule, apply, mergeWith, url} from '@angular-devkit/schematics';

/**
 * Generates files from a source directory.
 *
 * All files in the specified directory are loaded, transformed
 * using the provided rules, and then merged into the host tree.
 *
 * Supports both raw files and angular templates. In the template case,
 * the `template` {@link Rule} is expected.
 *
 * @param path - The path to the source directory containing the files to process.
 * @param rules - The rules to apply to every file in the source directory.
 * @returns A {@link Rule} that merges the transformed files into the host tree.
 */
export function createFromTemplate(path: string, rules: Rule[] = []): Rule {
	return mergeWith(apply(url(path), rules));
}
