import {describe, expect, it} from '@jest/globals';

import {createObliqueAiInstructions} from '../src/instructions.js';

describe('createObliqueAiInstructions', () => {
	it('builds concise guidance with detected Angular and Oblique versions', () => {
		const instruction = createObliqueAiInstructions({
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: true,
			angularVersion: '21.0.0',
			obliqueVersion: '15.4.4',
			packageManager: 'npm',
		});

		expect(instruction).toContain('This project uses Angular 21.0.0 and Oblique 15.4.4.');
		expect(instruction).toContain('query the Oblique MCP before inventing Oblique APIs or selectors');
		expect(instruction).toContain('Before implementing UI functionality');
		expect(instruction).not.toContain('copied');
	});

	it('returns undefined for non-Oblique projects', () => {
		expect(
			createObliqueAiInstructions({
				projectRoot: '/tmp/demo',
				isAngularProject: true,
				isObliqueProject: false,
				angularVersion: '21.0.0',
				packageManager: 'npm',
			})
		).toBeUndefined();
	});

	it('omits unknown version values without inventing them', () => {
		const instruction = createObliqueAiInstructions({
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: true,
			obliqueVersion: '15.4.4',
			packageManager: 'npm',
		});

		expect(instruction).toContain('This project uses Oblique 15.4.4.');
		expect(instruction).not.toContain('This project uses Angular');
	});
});
