import {join} from 'node:path';
import type * as fs from 'fs';
import {readFileSync, readdirSync} from 'fs';
import type {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import type {Rule, Tree} from '@angular-devkit/schematics';
import * as template from './shared/template/template';

type FsFunctions = keyof Pick<
	typeof fs,
	'readFileSync' | 'existsSync' | 'writeFileSync' | 'unlinkSync' | 'mkdirSync' | 'readdirSync'
>;

type FsMocks = Partial<Record<FsFunctions, jest.Mock>>;

export function mockFs(...functionsToMock: FsFunctions[]): FsMocks {
	const mocks: FsMocks = {};

	for (const fn of functionsToMock) {
		mocks[fn] = jest.fn();
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	jest.mock('fs', () => ({
		...jest.requireActual('fs'),
		...mocks,
	}));

	return mocks;
}

export async function runRule(runner: SchematicTestRunner, rule: Rule, tree: UnitTestTree): Promise<UnitTestTree> {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		runner.callRule(rule, tree).subscribe({next: treeResolve => resolve(treeResolve as UnitTestTree), error: reject});
	});
}

/**
 * In tests based on {@link callRule}, the SchematicContext do not contain the template directory, meaning that
 * {@link createFromTemplate} throws an error. To circumvent this problem, `mockCreateFromTemplate` manually
 * creates the files
 */
export function mockCreateFromTemplate(collection: string): void {
	jest.spyOn(template, 'createFromTemplate').mockImplementation((templateDir: string) => (tree: Tree) => {
		const dir = join(__dirname, `/${collection}/${templateDir}`);
		readdirSync(dir).forEach(file => {
			const content = readFileSync(`${dir}/${file}`);
			tree.create(`/${file}`, content);
		});

		return tree;
	});
}
