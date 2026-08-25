/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP cross-platform path-confinement helper tests
 */

import {posix, resolve, win32} from 'node:path';
import {isPathInside} from './path.js';

describe('isPathInside', () => {
	it('allows a genuine child path using host path semantics', () => {
		const basePath = process.cwd();

		expect(isPathInside(basePath, resolve(basePath, 'component', 'example.ts'))).toBe(true);
	});

	it.each([
		posix.resolve('/repo/examples', '../outside.ts'),
		posix.resolve('/repo/examples', '../../package.json'),
		'/etc/passwd',
		'/repo/examples-other/file.ts',
	])('rejects the POSIX outside path %s', targetPath => {
		expect(isPathInside('/repo/examples', targetPath, posix)).toBe(false);
	});

	it('rejects Windows parent traversal using Windows path semantics', () => {
		const basePath = 'C:\\repo\\examples';
		const directParentPath = win32.resolve(basePath, '..\\outside.ts');
		const nestedParentPath = win32.resolve(basePath, '..\\..\\package.json');

		expect(win32.relative(basePath, directParentPath)).toBe('..\\outside.ts');
		expect(win32.relative(basePath, nestedParentPath)).toBe('..\\..\\package.json');
		expect(isPathInside(basePath, directParentPath, win32)).toBe(false);
		expect(isPathInside(basePath, nestedParentPath, win32)).toBe(false);
	});

	it('rejects Windows absolute and sibling-prefix paths', () => {
		const basePath = 'C:\\repo\\examples';

		expect(isPathInside(basePath, 'C:\\outside.ts', win32)).toBe(false);
		expect(isPathInside(basePath, 'C:\\repo\\examples-other\\file.ts', win32)).toBe(false);
	});

	it('rejects a Windows target on a different drive', () => {
		const relativePath = win32.relative('C:\\repo\\examples', 'D:\\outside\\file.ts');

		expect(win32.isAbsolute(relativePath)).toBe(true);
		expect(isPathInside('C:\\repo\\examples', 'D:\\outside\\file.ts', win32)).toBe(false);
	});
});
