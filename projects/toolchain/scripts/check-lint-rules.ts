import {pathToFileURL} from 'node:url';
import path from 'path';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import ngEslint from '@angular-eslint/eslint-plugin';
import eslintConfigOblique from '../src/linting/eslint-config-oblique.mjs';
import {Log} from '../../../scripts/shared/log';

Log.start('Checking linting rules');
checkRules();
Log.success('All linting rules are correct');

type RuleState = 'off' | 'warn' | 'error';
type RuleEntry = RuleState | [RuleState, ...unknown[]];
interface EslintConfig {
	files: string[];
	rules: Record<string, RuleEntry>;
}

export function checkRules(): void {
	const obliqueRules = getObliqueRules();
	const allRules = getAllRules();
	checkMissingRules(allRules.all, obliqueRules.all);
	checkDeprecatedRules(allRules.all, obliqueRules.all); // rules that are defined in oblique but do not exist anymore
	checkDisabledRules(allRules.disabled, obliqueRules.disabled); // rules that should be disabled but are not
}

function getObliqueRules(): {all: string[]; disabled: string[]} {
	Log.info('Loading Oblique linting rules');
	if (!isESLintConfigArray(eslintConfigOblique)) {
		throw new Error('Invalid Eslint config');
	}
	const rules = eslintConfigOblique[0].rules;

	return {
		all: Object.keys(rules),
		disabled: Object.entries(rules)
			.filter(([, state]) => (Array.isArray(state) ? state[0] === 'off' : state === 'off'))
			.map(([name]) => name),
	};
}

function isESLintConfigArray(config: unknown): config is EslintConfig[] {
	return Array.isArray(config) && config.every(item => isEsLintConfig(item));
}

function isEsLintConfig(item: unknown): item is {rules: Record<string, RuleEntry>} {
	return (
		typeof item === 'object' &&
		item !== null &&
		!Array.isArray(item) &&
		'files' in item &&
		isEslintFiles(item.files) &&
		'rules' in item &&
		isEslintRules(item.rules)
	);
}

function isEslintFiles(files: unknown): files is string[] {
	return Array.isArray(files) && files.length > 0 && files.every(file => typeof file === 'string');
}

function isEslintRules(rules: unknown): rules is Record<string, RuleEntry> {
	return typeof rules === 'object' && rules !== null && Object.values(rules).every(rule => isEslintRule(rule));
}

function isEslintRule(rule: unknown): rule is RuleEntry {
	return isEslintRuleState(rule) || (Array.isArray(rule) && rule.length > 0 && isEslintRuleState(rule[0]));
}

function isEslintRuleState(state: unknown): state is RuleState {
	return typeof state === 'string' && ['off', 'error', 'warn'].includes(state);
}

function getAllRules(): {all: string[]; disabled: string[]} {
	Log.info('Loading EsLint, TypeScript-EsLint and Angular-EsLint rules');
	const eslintRules = Object.keys(eslint.configs.all.rules);
	const typescriptRules = getTypescriptRules();
	// exclude component-selector and directive-selector as they are very specific to the project and thus not imposed by Oblique
	const exceptions = ['@angular-eslint/component-selector', '@angular-eslint/directive-selector'];
	const angularRules = Object.keys(ngEslint.configs.all.rules).filter(rule => !exceptions.includes(rule));
	return {
		all: [...eslintRules, ...angularRules, ...typescriptRules.all],
		disabled: typescriptRules.disabled,
	};
}

function getTypescriptRules(): {all: string[]; disabled: string[]} {
	const allTypescriptRules = Object.keys(tsEslint.configs.all.find(config => config.name.includes('all')).rules);
	// exclude deprecated eslint rules that typescript-eslint still references
	const exceptions = ['no-return-await'];
	return {
		// contains all rules created by typescript-eslint
		all: allTypescriptRules.filter(rule => rule.startsWith('@typescript-eslint')),
		// contains all eslint rules that typescript-eslint must deactivate, no-return-await is deprecated and should not be used
		disabled: allTypescriptRules.filter(rule => !rule.startsWith('@typescript-eslint') && !exceptions.includes(rule)),
	};
}

function checkMissingRules(rules: string[], obRules: string[]): void {
	Log.info('Checking for linting rules that are not defined by Oblique');
	const missingRules = rules.filter(rule => !obRules.includes(rule));
	if (missingRules.length) {
		console.error(missingRules);
		throwError('The previous rules need to be defined');
	}
}

function checkDeprecatedRules(rules: string[], obRules: string[]): void {
	Log.info('Checking for linting rules that are deprecated but Oblique still defines');
	const deprecatedRules = obRules.filter(rule => !rules.includes(rule));
	if (deprecatedRules.length) {
		console.error(deprecatedRules);
		throwError('The previous rules are deprecated and should be removed');
	}
}

function checkDisabledRules(rules: string[], obRules: string[]): void {
	Log.info('Checking for linting rules that Oblique needs to disable');
	const disabledRules = rules.filter(rule => !obRules.includes(rule));
	if (disabledRules.length) {
		console.error(disabledRules);
		throwError('The previous rules need to be disabled');
	}
}

function throwError(text: string): void {
	const filePath = pathToFileURL(path.resolve('src/linting/eslint-config-oblique.mjs')).href;
	const link = `\u001b]8;;${filePath}\u001b\\projects/toolchain/src/linting/eslint-config-oblique.mjs\u001b]8;;\u001b\\`;
	throw new Error(`${text} in ${link}`);
}
