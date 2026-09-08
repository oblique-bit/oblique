import {describe, expect, it} from '@jest/globals';
import type {Config} from '@opencode-ai/plugin';

import {registerObliqueAgent} from '../src/agent.js';

describe('registerObliqueAgent', () => {
	it('registers the Oblique specialist agent through the V1 configuration model', () => {
		const config: Config = {};

		registerObliqueAgent(config, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: true,
			angularVersion: '21.0.0',
			obliqueVersion: '15.4.4',
			packageManager: 'npm',
		});

		expect(config.agent?.['oblique']?.mode).toBe('primary');
		expect(config.agent?.['oblique']?.prompt).toContain('Angular 21.0.0');
		expect(config.agent?.['oblique']?.prompt).toContain('Oblique MCP');
		expect(config.agent?.['oblique']?.description).toContain('Oblique Angular specialist');
	});

	it('does not overwrite an explicitly configured Oblique agent', () => {
		const config: Config = {agent: {oblique: {prompt: 'user prompt'}}};

		registerObliqueAgent(config, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: true,
		});

		expect(config.agent?.['oblique']?.prompt).toBe('user prompt');
	});

	it('does not register an Oblique agent when the project is not Oblique', () => {
		const config: Config = {};

		registerObliqueAgent(config, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: false,
			angularVersion: '21.0.0',
			packageManager: 'npm',
		});

		expect(config.agent).toBeUndefined();
	});
});
