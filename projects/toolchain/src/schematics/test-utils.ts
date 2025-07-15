import type * as fs from 'fs';
import type {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import type {Rule} from '@angular-devkit/schematics';

type FsFunctions = keyof Pick<typeof fs, 'readFileSync' | 'existsSync' | 'writeFileSync' | 'unlinkSync' | 'mkdirSync' | 'readdirSync'>;

type FsMocks = Partial<Record<FsFunctions, jest.Mock>>;

export function mockFs(...functionsToMock: FsFunctions[]): FsMocks {
	const mocks: FsMocks = {};

	for (const fn of functionsToMock) {
		mocks[fn] = jest.fn();
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	jest.mock('fs', () => ({
		...jest.requireActual('fs'),
		...mocks
	}));

	return mocks;
}

export async function runRule(runner: SchematicTestRunner, rule: Rule, tree: UnitTestTree): Promise<UnitTestTree> {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		runner.callRule(rule, tree).subscribe({next: treeResolve => resolve(treeResolve as UnitTestTree), error: reject});
	});
}
