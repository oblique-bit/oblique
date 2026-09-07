import type {AgentDraft} from '@opencode-ai/plugin/v2/promise';
import type {AgentV2Info} from '@opencode-ai/sdk/v2/types';

import {describe, expect, it} from '@jest/globals';

import {registerObliqueAgent} from '../src/agent.js';

describe('registerObliqueAgent', () => {
	it('registers the Oblique specialist agent for Oblique Angular projects', () => {
		const updates: AgentV2Info[] = [];
		const draft = {
			update: (id: string, mutate: (agent: AgentV2Info) => void): void => {
				const agent: AgentV2Info = {
					id,
					hidden: false,
					mode: 'primary',
					request: {headers: {}, body: {}},
					permissions: [],
				};
				mutate(agent);
				updates.push(agent);
			},
		} satisfies Pick<AgentDraft, 'update'>;

		registerObliqueAgent(draft, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: true,
			angularVersion: '21.0.0',
			obliqueVersion: '15.4.4',
			packageManager: 'npm',
		});

		expect(updates).toHaveLength(1);
		expect(updates[0]?.id).toBe('oblique');
		expect(updates[0]?.system).toContain('Angular 21.0.0');
		expect(updates[0]?.system).toContain('Oblique MCP');
		expect(updates[0]?.description).toContain('Oblique Angular specialist');
	});

	it('does not register an Oblique agent when the project is not Oblique', () => {
		const updates: AgentV2Info[] = [];
		const draft = {
			update: (id: string, mutate: (agent: AgentV2Info) => void): void => {
				const agent: AgentV2Info = {
					id,
					hidden: false,
					mode: 'primary',
					request: {headers: {}, body: {}},
					permissions: [],
				};
				mutate(agent);
				updates.push(agent);
			},
		} satisfies Pick<AgentDraft, 'update'>;

		registerObliqueAgent(draft, {
			projectRoot: '/tmp/demo',
			isAngularProject: true,
			isObliqueProject: false,
			angularVersion: '21.0.0',
			packageManager: 'npm',
		});

		expect(updates).toHaveLength(0);
	});
});
