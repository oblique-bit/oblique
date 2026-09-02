// These helpers replicate `@angular-devkit/core`'s `strings.dasherize`/`decamelize` (MIT licensed).
// The CLI passes option names to Angular CLI commands, which dasherize them and reject any other
// form in strict mode. We inline a copy instead of depending on `@angular-devkit/core` to avoid
// pulling that dependency into the CLI for a single utility.
const stringDasherizeRegexp = /[ _]/gu;
const stringDecamelizeRegexp = /(?<lowercase>[a-z\d])(?<uppercase>[A-Z])/gu;

/**
 * Converts a camelized string into all lower case separated by underscores.
 *
 * @example decamelize('innerHTML') // 'inner_html'
 * @param str The string to decamelize.
 * @returns The decamelized string.
 */
export function decamelize(str: string): string {
	return str.replace(stringDecamelizeRegexp, '$<lowercase>_$<uppercase>').toLowerCase();
}

/**
 * Replaces underscores, spaces, or camelCase with dashes.
 *
 * @example dasherize('applicationOperator') // 'application-operator'
 * @param str The string to dasherize.
 * @returns The dasherized string.
 */
export function dasherize(str: string): string {
	return decamelize(str).replace(stringDasherizeRegexp, '-');
}
