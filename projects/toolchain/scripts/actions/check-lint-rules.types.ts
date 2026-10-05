/**
 * The state a linting rule can be configured with.
 */
export type RuleState = 'off' | 'warn' | 'error';

/**
 * A single linting rule entry: either a plain state or a state with its options.
 */
export type RuleEntry = RuleState | [RuleState, ...unknown[]];

/**
 * The shape of an ESLint configuration block as used by the Oblique linting configuration.
 */
export interface EsLintConfig {
	files: string[];
	rules: Record<string, RuleEntry>;
}

/**
 * The linting rules of a linting solution, split into all defined rules and the rules that must be disabled.
 */
export interface RuleStates {
	all: string[];
	disabled: string[];
}
