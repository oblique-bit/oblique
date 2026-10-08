import {type ObGroupLogger, obCreateLogger} from '../../src/logger';
import * as linting from '../../src/linting/eslint-config-oblique.mjs';
import tsEslint from 'typescript-eslint';
import {checkRules} from './check-lint-rules';

describe(checkRules.name, () => {
	let logger: ObGroupLogger;

	beforeEach(() => {
		logger = obCreateLogger(true).group('logger');
	});

	test('passes for the current Oblique linting configuration', () => {
		expect(() => checkRules(logger)).not.toThrow();
	});

	test('throws when a rule is missing from the Oblique configuration', () => {
		const error = runWithPatchedObliqueRules({removeRule: 'array-callback-return'});
		expect(error.message).toContain('The previous rules need to be defined');
	});

	test('throws when the Oblique configuration defines a deprecated rule', () => {
		const error = runWithPatchedObliqueRules({addRule: {'@typescript-eslint/deprecated-rule': 'error'}});
		expect(error.message).toContain('The previous rules are deprecated and should be removed');
	});

	test('throws when the Oblique configuration does not disable a required rule', () => {
		const error = runWithPatchedObliqueRules({enableRule: 'class-methods-use-this'});
		expect(error.message).toContain('The previous rules need to be disabled');
	});

	test('throws when the Oblique linting configuration is invalid', () => {
		const original = linting.eslintConfigOblique;
		const invalidConfig = [{files: ['**/*.ts'], rules: {'array-callback-return': 'bogus'}}];
		const spy = vi.spyOn(linting, 'eslintConfigOblique', 'get').mockReturnValue(invalidConfig as never);
		try {
			expect(() => checkRules(logger)).toThrow('Invalid Eslint config');
		} finally {
			spy.mockRestore();
			expect(linting.eslintConfigOblique).toBe(original);
		}
	});

	test('throws when the typescript-eslint configuration cannot be resolved', () => {
		const original = tsEslint.configs;
		const configsClone = {...original, all: []};
		const spy = vi.spyOn(tsEslint, 'configs', 'get').mockReturnValue(configsClone as never);
		try {
			expect(() => checkRules(logger)).toThrow('Invalid typescript-eslint config');
		} finally {
			spy.mockRestore();
			expect(tsEslint.configs).toBe(original);
		}
	});

	/**
	 * Runs `checkRules` against a patched Oblique linting configuration and returns the thrown error.
	 * The patch is reverted after the run.
	 */
	function runWithPatchedObliqueRules(patch: {
		removeRule?: string;
		addRule?: Record<string, string>;
		enableRule?: string;
	}): Error {
		const rules = linting.eslintConfigOblique[0].rules;
		const patchedRules: Record<string, unknown> = Object.fromEntries(
			Object.entries(rules).filter(([name]) => name !== patch.removeRule)
		);
		if (patch.addRule) {
			Object.assign(patchedRules, patch.addRule);
		}
		if (patch.enableRule) {
			patchedRules[patch.enableRule] = 'error';
		}
		return patchObliqueRules(
			[{...linting.eslintConfigOblique[0], rules: patchedRules}] as typeof linting.eslintConfigOblique,
			() => {
				try {
					checkRules(logger);
				} catch (error) {
					return error as Error;
				}
				throw new Error('Expected checkRules to throw');
			}
		);
	}

	/** Patches the Oblique linting configuration for the duration of the given run. */
	function patchObliqueRules<T>(config: typeof linting.eslintConfigOblique, run: () => T): T {
		const spy = vi.spyOn(linting, 'eslintConfigOblique', 'get').mockReturnValue(config as never);
		try {
			return run();
		} finally {
			spy.mockRestore();
		}
	}
});
