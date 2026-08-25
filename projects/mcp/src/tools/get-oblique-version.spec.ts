/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 1 initial server
 */

import {getObliqueMajorVersion, getObliqueVersion} from './get-oblique-version.js';

describe('getObliqueVersion', () => {
	it('maps metadata from the repository package file', () => {
		const metadata = {
			version: '99.1.2',
			engines: {node: '>=22.12.0'},
			dependencies: {'@angular/core': '^21.2.20'},
			repository: {url: 'https://github.com/oblique-bit/oblique.git'},
		};

		expect(getObliqueVersion(metadata)).toEqual({
			obliqueVersion: '99.1.2',
			angularVersion: '^21.2.20',
			nodeRequirement: '>=22.12.0',
			repository: 'oblique-bit/oblique',
		});
	});

	it('extracts the positive major version used for CMS component selection', () => {
		expect(
			getObliqueMajorVersion({
				version: '15.4.4',
				engines: {node: '>=22.12.0'},
				dependencies: {'@angular/core': '^21.2.20'},
				repository: {url: 'https://github.com/oblique-bit/oblique.git'},
			})
		).toBe(15);
	});

	it('rejects a package version without a positive major number', () => {
		expect(() =>
			getObliqueMajorVersion({
				version: 'invalid',
				engines: {node: '>=22.12.0'},
				dependencies: {'@angular/core': '^21.2.20'},
				repository: {url: 'https://github.com/oblique-bit/oblique.git'},
			})
		).toThrow('Unable to determine an Oblique major version');
	});
});
