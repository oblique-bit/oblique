import {describe, expect, it} from '@jest/globals';
import type {Config} from '@opencode-ai/plugin';

import {registerObliqueReviewCommand} from '../src/review.js';

describe('registerObliqueReviewCommand', () => {
	it('registers an Oblique review command through the V1 configuration model', () => {
		const config: Config = {};

		registerObliqueReviewCommand(config, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: true,
			angularVersion: '21.0.0',
			obliqueVersion: '15.4.4',
			packageManager: 'npm',
		});

		expect(config.command?.['oblique-review']?.template).toContain('/oblique-review');
		expect(config.command?.['oblique-review']?.description).toContain('query the Oblique MCP');
		expect(config.command?.['oblique-review']?.agent).toBe('oblique');
	});

	it('preserves an explicitly configured review command', () => {
		const config: Config = {command: {'oblique-review': {template: 'user template'}}};

		registerObliqueReviewCommand(config, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: true,
		});

		expect(config.command?.['oblique-review']?.template).toBe('user template');
	});

	it('does not create the review command when the project is not Oblique', () => {
		const config: Config = {};

		registerObliqueReviewCommand(config, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: false,
			angularVersion: '21.0.0',
			packageManager: 'npm',
		});

		expect(config.command).toBeUndefined();
	});
});
