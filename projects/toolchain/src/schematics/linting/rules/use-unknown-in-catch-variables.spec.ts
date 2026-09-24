import {HostTree, type Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {firstValueFrom} from 'rxjs';
import {obMockLogger} from '../../../logger/mock';
import {useUnknownInCatchVariables} from './use-unknown-in-catch-variables';

const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
const {logger} = obMockLogger();

function rewrite(source: string): Promise<string> {
	const tree = new HostTree();
	tree.create('src/main.ts', source);
	return firstValueFrom(runner.callRule(useUnknownInCatchVariables(logger.group('A')), tree)).then(resultTree =>
		resultTree.readText('src/main.ts')
	);
}

describe(useUnknownInCatchVariables.name, () => {
	let inputTree: Tree;

	beforeEach(() => {
		inputTree = new HostTree();
	});

	test('rewrites catch variables in TypeScript files', async () => {
		inputTree.create('src/main.ts', 'try {} catch (e) {}\nconst p = Promise.resolve(); p.catch(e => {})');
		inputTree.create('src/other.ts', 'const x = 1;');
		inputTree.create('readme.md', 'try {} catch (e) {}');

		const resultTree = await firstValueFrom(runner.callRule(useUnknownInCatchVariables(logger.group('A')), inputTree));

		expect(resultTree.readText('src/main.ts')).toBe(
			'try {} catch (e: unknown) {}\nconst p = Promise.resolve(); p.catch((e: unknown) => {})'
		);
		expect(resultTree.readText('src/other.ts')).toBe('const x = 1;');
		expect(resultTree.readText('readme.md')).toBe('try {} catch (e) {}');
	});

	test('leaves already compliant files untouched', async () => {
		inputTree.create('src/main.ts', 'try {} catch (e: unknown) {}');

		const resultTree = await firstValueFrom(runner.callRule(useUnknownInCatchVariables(logger.group('A')), inputTree));

		expect(resultTree.readText('src/main.ts')).toBe('try {} catch (e: unknown) {}');
	});

	test('does not fail when the tree has no TypeScript files', async () => {
		inputTree.create('readme.md', 'hello');

		await expect(
			firstValueFrom(runner.callRule(useUnknownInCatchVariables(logger.group('A')), inputTree))
		).resolves.toBeDefined();
	});
});

describe('catch variable rewriting', () => {
	describe('try...catch', () => {
		test('adds unknown to an untyped catch variable', async () => {
			await expect(rewrite('try {} catch (e) {}')).resolves.toBe('try {} catch (e: unknown) {}');
		});

		test('replaces any with unknown', async () => {
			await expect(rewrite('try {} catch (e: any) {}')).resolves.toBe('try {} catch (e: unknown) {}');
		});

		test('keeps an already unknown catch variable', async () => {
			await expect(rewrite('try {} catch (e: unknown) {}')).resolves.toBe('try {} catch (e: unknown) {}');
		});

		test('keeps a non-any explicit catch variable type', async () => {
			await expect(rewrite('try {} catch (e: Error) {}')).resolves.toBe('try {} catch (e: Error) {}');
		});

		test('keeps a catch clause without a variable', async () => {
			await expect(rewrite('try {} catch {}')).resolves.toBe('try {} catch {}');
		});

		test('keeps a destructured catch variable', async () => {
			await expect(rewrite('try {} catch ({message}) {}')).resolves.toBe('try {} catch ({message}) {}');
		});

		test('preserves surrounding formatting', async () => {
			const source = 'function f() {\n\ttry {\n\t\tdoWork();\n\t} catch (e) {\n\t\thandle(e);\n\t}\n}';
			await expect(rewrite(source)).resolves.toBe(
				'function f() {\n\ttry {\n\t\tdoWork();\n\t} catch (e: unknown) {\n\t\thandle(e);\n\t}\n}'
			);
		});
	});

	describe('promise rejection callbacks', () => {
		test('wraps a paren-less callback parameter', async () => {
			await expect(rewrite('const p = Promise.resolve(); p.catch(e => {})')).resolves.toBe(
				'const p = Promise.resolve(); p.catch((e: unknown) => {})'
			);
		});

		test('adds unknown to a parenthesized callback parameter', async () => {
			await expect(rewrite('const p = Promise.resolve(); p.catch((e) => {})')).resolves.toBe(
				'const p = Promise.resolve(); p.catch((e: unknown) => {})'
			);
		});

		test('replaces any with unknown in a callback parameter', async () => {
			await expect(rewrite('const p = Promise.resolve(); p.catch((e: any) => {})')).resolves.toBe(
				'const p = Promise.resolve(); p.catch((e: unknown) => {})'
			);
		});

		test('adds unknown to a function expression callback parameter', async () => {
			await expect(rewrite('const p = Promise.resolve(); p.catch(function (e) {})')).resolves.toBe(
				'const p = Promise.resolve(); p.catch(function (e: unknown) {})'
			);
		});

		test('keeps an already unknown callback parameter', async () => {
			await expect(rewrite('const p = Promise.resolve(); p.catch((e: unknown) => {})')).resolves.toBe(
				'const p = Promise.resolve(); p.catch((e: unknown) => {})'
			);
		});

		test('types only the first parameter of a multi-parameter callback', async () => {
			await expect(rewrite('const p = Promise.resolve(); p.catch((error, extra) => {})')).resolves.toBe(
				'const p = Promise.resolve(); p.catch((error: unknown, extra) => {})'
			);
		});

		test('keeps a callback without parameters', async () => {
			await expect(rewrite('const p = Promise.resolve(); p.catch(() => {})')).resolves.toBe(
				'const p = Promise.resolve(); p.catch(() => {})'
			);
			await expect(rewrite('const p = Promise.resolve(); p.catch(function () {})')).resolves.toBe(
				'const p = Promise.resolve(); p.catch(function () {})'
			);
		});

		test('keeps a call without a callback', async () => {
			await expect(rewrite('const p = Promise.resolve(); p.catch()')).resolves.toBe(
				'const p = Promise.resolve(); p.catch()'
			);
		});

		test('keeps a callback that is not a function literal', async () => {
			await expect(rewrite('const p = Promise.resolve(); p.catch(handleError)')).resolves.toBe(
				'const p = Promise.resolve(); p.catch(handleError)'
			);
		});

		test('rewrites a chained promise call', async () => {
			await expect(rewrite('Promise.resolve().catch(e => {})')).resolves.toBe(
				'Promise.resolve().catch((e: unknown) => {})'
			);
		});

		test('rewrites a call on a union type that contains a promise', async () => {
			const source = 'const p: Promise<void> | undefined = undefined; (p as Promise<void> | undefined).catch(e => {})';
			await expect(rewrite(source)).resolves.toBe(
				'const p: Promise<void> | undefined = undefined; (p as Promise<void> | undefined).catch((e: unknown) => {})'
			);
		});

		test('keeps a catch method of a non-promise object', async () => {
			const source = 'const registry = {catch() {}}; registry.catch(e => {})';
			await expect(rewrite(source)).resolves.toBe(source);
		});

		test('keeps a bare identifier catch call', async () => {
			const source = 'p.catch(e => {})';
			await expect(rewrite(source)).resolves.toBe(source);
		});
	});

	test('does not touch unrelated callbacks', async () => {
		await expect(rewrite('values.map(e => e * 2)')).resolves.toBe('values.map(e => e * 2)');
	});

	test('handles several occurrences in one file', async () => {
		const source = 'try {} catch (e) {}\ntry {} catch (err: any) {}\nconst p = Promise.resolve(); p.catch(e => {})';
		await expect(rewrite(source)).resolves.toBe(
			'try {} catch (e: unknown) {}\ntry {} catch (err: unknown) {}\nconst p = Promise.resolve(); p.catch((e: unknown) => {})'
		);
	});

	test('returns the source unchanged when nothing needs fixing', async () => {
		const source = 'const x = 1;';
		await expect(rewrite(source)).resolves.toBe(source);
	});
});
