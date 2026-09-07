import type {CommandV2Info} from '@opencode-ai/sdk/v2/types';

import {describe, expect, it} from '@jest/globals';

import {registerObliqueReviewCommand} from '../src/review.js';

describe('registerObliqueReviewCommand', () => {
	it('registers an Oblique review command for Oblique projects', () => {
		const updates: CommandV2Info[] = [];
		const draft = {
			update: (name: string, mutate: (command: CommandV2Info) => void): void => {
				const command: CommandV2Info = {
					name,
					template: '',
				};
				mutate(command);
				updates.push(command);
			},
		} as const;

		registerObliqueReviewCommand(draft, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: true,
			angularVersion: '21.0.0',
			obliqueVersion: '15.4.4',
			packageManager: 'npm',
		});

		expect(updates).toHaveLength(1);
		expect(updates[0]?.name).toBe('oblique-review');
		expect(updates[0]?.template).toContain('/oblique-review');
		expect(updates[0]?.description).toContain('query the Oblique MCP');
		expect(updates[0]?.agent).toBe('oblique');
	});

	it('does not create the review command when the project is not Oblique', () => {
		const updates: CommandV2Info[] = [];
		const draft = {
			update: (name: string, mutate: (command: CommandV2Info) => void): void => {
				const command: CommandV2Info = {
					name,
					template: '',
				};
				mutate(command);
				updates.push(command);
			},
		} as const;

		registerObliqueReviewCommand(draft, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: false,
			angularVersion: '21.0.0',
			packageManager: 'npm',
		});

		expect(updates).toHaveLength(0);
	});
});
