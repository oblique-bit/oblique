import fs from 'node:fs';
import path from 'node:path';
import * as cliPackage from '../package.json';

describe('CLI package metadata', () => {
	it('declares the public ob binary', () => {
		expect(cliPackage.bin).toEqual({ob: './src/index.js'});
	});

	it('keeps the declared binary target with a Node shebang', () => {
		const binPath = path.resolve(__dirname, '..', cliPackage.bin.ob).replace(/\.js$/u, '.ts');
		const content = fs.readFileSync(binPath, 'utf8');

		expect(content.startsWith('#!/usr/bin/env node\n')).toBe(true);
	});
});
