import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {addToolchain} from './add-toolchain-dependency.rule';
import {currentToolchainVersion} from '../../version';

const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));

describe(`addToolchainDependencyRule`, () => {
	let pkg: Record<string, unknown>;
	beforeEach(async () => {
		const tree = new UnitTestTree(new HostTree());
		tree.create('/package.json', JSON.stringify({dependencies: {}, devDependencies: {}}));
		const result = await new Promise<UnitTestTree>((res, rej) => {
			runner.callRule(addToolchain(), tree).subscribe({next: treeRes => res(treeRes as UnitTestTree), error: rej});
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		pkg = JSON.parse(result.readContent('/package.json'));
	});

	test('add @oblique/toolchain as a devDependency', () => {
		expect(pkg.devDependencies['@oblique/toolchain']).toBe(`^${currentToolchainVersion}`);
	});

	test("don't add @oblique/toolchain as a dependency", () => {
		expect(pkg.dependencies['@oblique/toolchain']).toBeUndefined();
	});
});
