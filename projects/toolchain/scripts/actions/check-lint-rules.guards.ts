import type {EsLintConfig, RuleEntry, RuleState} from './check-lint-rules.types';

/**
 * Checks whether a value is an array of valid ESLint configuration blocks.
 *
 * @param config - The value to check.
 * @returns `true` if the value is an array of ESLint configuration blocks; otherwise, `false`.
 */
export function isEsLintConfigArray(config: unknown): config is EsLintConfig[] {
	return Array.isArray(config) && config.every(item => isEsLintConfig(item));
}

/**
 * Checks whether a value is a single ESLint configuration block.
 *
 * @param item - The value to check.
 * @returns `true` if the value is an ESLint configuration block; otherwise, `false`.
 */
export function isEsLintConfig(item: unknown): item is EsLintConfig {
	return (
		typeof item === 'object' &&
		item !== null &&
		!Array.isArray(item) &&
		'files' in item &&
		isEsLintFiles(item.files) &&
		'rules' in item &&
		isEsLintRules(item.rules)
	);
}

/**
 * Checks whether a value is a non-empty array of file globs.
 *
 * @param files - The value to check.
 * @returns `true` if the value is a non-empty array of strings; otherwise, `false`.
 */
export function isEsLintFiles(files: unknown): files is string[] {
	return Array.isArray(files) && files.length > 0 && files.every(file => typeof file === 'string');
}

/**
 * Checks whether a value is a map of linting rule entries.
 *
 * @param rules - The value to check.
 * @returns `true` if the value is a map of rule entries; otherwise, `false`.
 */
export function isEsLintRules(rules: unknown): rules is Record<string, RuleEntry> {
	return typeof rules === 'object' && rules !== null && Object.values(rules).every(rule => isEsLintRule(rule));
}

/**
 * Checks whether a value is a single linting rule entry: a state or a state with options.
 *
 * @param rule - The value to check.
 * @returns `true` if the value is a rule entry; otherwise, `false`.
 */
export function isEsLintRule(rule: unknown): rule is RuleEntry {
	return isEsLintRuleState(rule) || (Array.isArray(rule) && rule.length > 0 && isEsLintRuleState(rule[0]));
}

/**
 * Checks whether a value is a valid linting rule state.
 *
 * @param state - The value to check.
 * @returns `true` if the value is `'off'`, `'warn'` or `'error'`; otherwise, `false`.
 */
export function isEsLintRuleState(state: unknown): state is RuleState {
	return typeof state === 'string' && ['off', 'error', 'warn'].includes(state);
}
