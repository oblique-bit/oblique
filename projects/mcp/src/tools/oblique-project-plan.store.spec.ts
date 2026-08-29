/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 bounded in-memory project plan store tests
 */

import {type ObliqueProjectPlan, ObliqueProjectPlanStore} from './oblique-project-plan.store.js';

const plan: ObliqueProjectPlan = {
	projectName: 'employee-portal',
	applicationOperator: 'Federal Test Office',
	contact: 'accessibility@example.test',
	parentDirectory: '/workspace',
	destinationPath: '/workspace/employee-portal',
	obliqueVersion: '15.4.4',
	obliqueCliVersion: '15.4.4',
	angularVersion: '21',
	nodeRequirement: '>=22.12.0',
	npmrcMode: 'federal',
	executable: 'npx',
	args: [
		'--yes',
		'@oblique/cli@15.4.4',
		'new',
		'employee-portal',
		'--applicationOperator=Federal Test Office',
		'--contact=accessibility@example.test',
		'--npmrc',
	],
};

describe('ObliqueProjectPlanStore', () => {
	it('creates fresh opaque IDs, injects ID generation, and never overwrites an active collision', () => {
		const planIds = ['first', 'first', 'second'];
		const store = new ObliqueProjectPlanStore({createPlanId: () => planIds.shift() ?? 'unexpected'});
		const first = put(store, plan);
		const second = put(store, plan);
		const stored = store.get(first);

		expect(first).toBe('first');
		expect(second).toBe('second');
		expect(store.size).toBe(2);
		expect(stored).toMatchObject({status: 'ready', plan});
		if (stored.status === 'ready') {
			stored.plan.args.push('untrusted');
		}
		expect(store.get(first)).toMatchObject({status: 'ready', plan});
	});

	it('preserves consumed tombstones until expiry and distinguishes replay from unknown plans', () => {
		let now = 0;
		const store = new ObliqueProjectPlanStore({
			now: () => now,
			ttlMilliseconds: 10,
			maximumPlans: 2,
			createPlanId: () => `plan-${now}`,
		});
		const planId = put(store, plan);

		expect(store.take(planId)).toMatchObject({status: 'ready'});
		expect(store.get(planId)).toEqual({status: 'already-used'});
		expect(store.get('unknown')).toEqual({status: 'not-found'});
		now = 10;
		expect(store.get(planId)).toEqual({status: 'expired'});
		expect(store.get(planId)).toEqual({status: 'not-found'});
	});

	it('does not consume a fabricated ready result when the record is no longer present', () => {
		const store = new ObliqueProjectPlanStore();
		jest.spyOn(store, 'get').mockReturnValueOnce({status: 'ready', plan});

		expect(store.take('missing')).toEqual({status: 'not-found'});
		expect(store.take('unknown')).toEqual({status: 'not-found'});
	});

	it('fails safely when an injected UUID generator repeatedly collides', () => {
		const store = new ObliqueProjectPlanStore({createPlanId: () => 'duplicate'});
		put(store, plan);

		expect(store.put(plan)).toEqual({status: 'full'});
		expect(store.get('duplicate')).toMatchObject({status: 'ready', plan});
	});

	it('purges expired entries before enforcing capacity and never silently evicts live plans', () => {
		let now = 0;
		let index = 0;
		const store = new ObliqueProjectPlanStore({
			now: () => now,
			ttlMilliseconds: 10,
			maximumPlans: 2,
			createPlanId: () => `plan-${now}-${index++}`,
		});
		const first = put(store, plan);
		const second = put(store, {...plan, projectName: 'other-project', destinationPath: '/workspace/other-project'});

		expect(store.put({...plan, projectName: 'third-project', destinationPath: '/workspace/third-project'})).toEqual({
			status: 'full',
		});
		expect(store.get(first)).toMatchObject({status: 'ready'});
		expect(store.get(second)).toMatchObject({status: 'ready'});
		now = 10;
		expect(
			store.put({...plan, projectName: 'third-project', destinationPath: '/workspace/third-project'})
		).toMatchObject({status: 'ready'});
		expect(store.size).toBe(1);
	});

	it('bounds live plans and consumed tombstones together', () => {
		let index = 0;
		const store = new ObliqueProjectPlanStore({
			now: () => 0,
			ttlMilliseconds: 10,
			maximumPlans: 2,
			createPlanId: () => `plan-${index++}`,
		});
		const first = put(store, plan);
		put(store, {...plan, projectName: 'other-project', destinationPath: '/workspace/other-project'});

		expect(store.take(first)).toMatchObject({status: 'ready'});
		expect(store.put({...plan, projectName: 'third-project', destinationPath: '/workspace/third-project'})).toEqual({
			status: 'full',
		});
		expect(store.get(first)).toEqual({status: 'already-used'});
	});

	it('serializes access to the canonical destination without blocking unrelated destinations', () => {
		const store = new ObliqueProjectPlanStore();

		expect(store.acquireDestination(plan.destinationPath)).toBe(true);
		expect(store.acquireDestination(plan.destinationPath)).toBe(false);
		expect(store.acquireDestination('/workspace/other-project')).toBe(true);
		store.releaseDestination(plan.destinationPath);
		expect(store.acquireDestination(plan.destinationPath)).toBe(true);
	});
});

function put(store: ObliqueProjectPlanStore, projectPlan: ObliqueProjectPlan): string {
	const result = store.put(projectPlan);
	if (result.status !== 'ready') {
		throw new Error('Expected the plan store to have capacity.');
	}
	return result.planId;
}
