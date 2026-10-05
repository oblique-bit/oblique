import {pathToFileURL} from 'node:url';
import path from 'path';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import ngEslint from '@angular-eslint/eslint-plugin';
import {eslintConfigOblique} from '../../src/linting/eslint-config-oblique.mjs';
import type {ObGroupLogger} from '../../src/logger';
import {isEsLintConfigArray} from './check-lint-rules.guards';
import type {RuleStates} from './check-lint-rules.types';

export function checkRules(logger: ObGroupLogger): void {
	const obliqueRules = getObliqueRules(logger);
	const allRules = getAllRules(logger);
	checkMissingRules(logger, allRules.all, obliqueRules.all);
	checkDeprecatedRules(logger, allRules.all, obliqueRules.all); // rules that are defined in oblique but do not exist anymore
	checkDisabledRules(logger, allRules.disabled, obliqueRules.disabled); // rules that should be disabled but are not
}

function getObliqueRules(logger: ObGroupLogger): RuleStates {
	logger.step('Loading Oblique linting rules');
	if (!isEsLintConfigArray(eslintConfigOblique)) {
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

function getAllRules(logger: ObGroupLogger): RuleStates {
	logger.step('Loading EsLint, TypeScript-EsLint and Angular-EsLint rules');
	const eslintRules = Object.keys(eslint.configs.all.rules);
	const typescriptRules = getTypescriptRules();
	// exclude component-selector and directive-selector as they are very specific to the project and thus not imposed by Oblique
	const exceptions = ['@angular-eslint/component-selector', '@angular-eslint/directive-selector'];
	const angularRules = Object.keys(ngEslint.rules)
		.map(rule => `@angular-eslint/${rule}`)
		.filter(rule => !exceptions.includes(rule));
	return {
		all: [...eslintRules, ...angularRules, ...typescriptRules.all],
		disabled: typescriptRules.disabled,
	};
}

function getTypescriptRules(): RuleStates {
	const allConfig = tsEslint.configs.all.find(config => config.name?.includes('all'));
	if (!allConfig?.rules) {
		throw new Error('Invalid typescript-eslint config');
	}
	const allTypescriptRules = Object.keys(allConfig.rules);
	// exclude deprecated eslint rules that typescript-eslint still references
	const exceptions = ['no-return-await'];
	return {
		// contains all rules created by typescript-eslint
		all: allTypescriptRules.filter(rule => rule.startsWith('@typescript-eslint')),
		// contains all eslint rules that typescript-eslint must deactivate, no-return-await is deprecated and should not be used
		disabled: allTypescriptRules.filter(rule => !rule.startsWith('@typescript-eslint') && !exceptions.includes(rule)),
	};
}

function checkMissingRules(logger: ObGroupLogger, rules: string[], obRules: string[]): void {
	logger.step('Checking for linting rules that are not defined by Oblique');
	checkRuleDelta(
		logger,
		rules.filter(rule => !obRules.includes(rule)),
		'The previous rules need to be defined'
	);
}

function checkDeprecatedRules(logger: ObGroupLogger, rules: string[], obRules: string[]): void {
	logger.step('Checking for linting rules that are deprecated but Oblique still defines');
	checkRuleDelta(
		logger,
		obRules.filter(rule => !rules.includes(rule)),
		'The previous rules are deprecated and should be removed'
	);
}

function checkDisabledRules(logger: ObGroupLogger, rules: string[], obRules: string[]): void {
	logger.step('Checking for linting rules that Oblique needs to disable');
	checkRuleDelta(
		logger,
		rules.filter(rule => !obRules.includes(rule)),
		'The previous rules need to be disabled'
	);
}

function checkRuleDelta(logger: ObGroupLogger, deltaRules: string[], text: string): void {
	if (deltaRules.length) {
		logger.error(deltaRules.join('\n'));
		throwError(text);
	}
}

function throwError(text: string): void {
	const filePath = pathToFileURL(path.resolve('src/linting/eslint-config-oblique.mjs')).href;
	const link = `\u001b]8;;${filePath}\u001b\\projects/toolchain/src/linting/eslint-config-oblique.mjs\u001b]8;;\u001b\\`;
	throw new Error(`${text} in ${link}`);
}
