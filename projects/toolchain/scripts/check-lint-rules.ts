import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import ngEslint from '@angular-eslint/eslint-plugin';
import eslintConfigOblique from '../src/linting/eslint-config-oblique.mjs';
import {Log} from '../../../scripts/shared/log';

Log.start('Checking linting rules');
checkRules();
Log.success('All linting rules are correct');

export function checkRules(): void {
	const obliqueRules = getObliqueRules();
	const allRules = getAllRules();
	checkMissingRules(allRules.all, obliqueRules.all);
	checkDeprecatedRules(allRules.all, obliqueRules.all); // rules that are defined in oblique but do not exist anymore
	checkDisabledRules(allRules.disabled, obliqueRules.disabled); // rules that should be disabled but are not
}

function getObliqueRules(): {all: string[]; disabled: string[]} {
	Log.info('Loading Oblique linting rules');
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access -- because eslintConfigOblique is not typed
	const rules: Record<string, string> = eslintConfigOblique[0].rules;

	return {
		all: Object.keys(rules),
		disabled: Object.entries(rules)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructuring imposes to define the variable even if not used
			.filter(([name, state]) => state === 'off')
			.map(([name]) => name)
	};
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
		disabled: typescriptRules.disabled
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
		disabled: allTypescriptRules.filter(rule => !rule.startsWith('@typescript-eslint') && !exceptions.includes(rule))
	};
}

function checkMissingRules(rules: string[], obRules: string[]): void {
	Log.info('Checking for linting rules that are not defined by Oblique');
	const missingRules = rules.filter(rule => !obRules.includes(rule));
	if (missingRules.length) {
		console.error(missingRules);
		throw new Error('The previous rules need to be defined');
	}
}

function checkDeprecatedRules(rules: string[], obRules: string[]): void {
	Log.info('Checking for linting rules that are deprecated but Oblique still defines');
	const deprecatedRules = obRules.filter(rule => !rules.includes(rule));
	if (deprecatedRules.length) {
		console.error(deprecatedRules);
		throw new Error('The previous rules are deprecated and should be removed');
	}
}

function checkDisabledRules(rules: string[], obRules: string[]): void {
	Log.info('Checking for linting rules that Oblique needs to disable');
	const disabledRules = rules.filter(rule => !obRules.includes(rule));
	if (disabledRules.length) {
		console.error(disabledRules);
		throw new Error('The previous rules need to be disabled');
	}
}
