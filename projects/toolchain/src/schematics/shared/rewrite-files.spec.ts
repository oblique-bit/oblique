import {HostTree} from '@angular-devkit/schematics';
import {rewriteFiles} from './rewrite-files';

describe(rewriteFiles.name, () => {
	test('rewrites selected files only', () => {
		const tree = new HostTree();
		tree.create('a.ts', 'const x = 1;');
		tree.create('b.txt', 'const x = 1;');

		const result = rewriteFiles(
			tree,
			path => path.endsWith('.ts'),
			source => `${source}!`
		);

		expect(result).toBe(tree);
		expect(tree.readText('a.ts')).toBe('const x = 1;!');
		expect(tree.readText('b.txt')).toBe('const x = 1;');
	});

	test('leaves files whose transform returns the same source untouched', () => {
		const tree = new HostTree();
		tree.create('a.ts', 'const x = 1;');
		const overwrite = vi.spyOn(tree, 'overwrite');

		rewriteFiles(
			tree,
			() => true,
			source => source
		);

		expect(tree.readText('a.ts')).toBe('const x = 1;');
		expect(overwrite).not.toHaveBeenCalled();
	});

	test('never rewrites files under node_modules', () => {
		const tree = new HostTree();
		tree.create('node_modules/some-package/index.ts', 'const x = 1;');
		tree.create('src/main.ts', 'const x = 1;');
		const overwrite = vi.spyOn(tree, 'overwrite');

		rewriteFiles(
			tree,
			path => path.endsWith('.ts'),
			source => `${source}!`
		);

		expect(tree.readText('node_modules/some-package/index.ts')).toBe('const x = 1;');
		expect(tree.readText('src/main.ts')).toBe('const x = 1;!');
		expect(overwrite).toHaveBeenCalledTimes(1);
	});
});
