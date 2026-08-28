/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 bounded in-memory Oblique project plan store
 */

import {randomUUID} from 'node:crypto';

const millisecondsPerSecond = 1_000;
const secondsPerMinute = 60;
const planTtlMinutes = 10;
export const projectPlanTtlMilliseconds = planTtlMinutes * secondsPerMinute * millisecondsPerSecond;
export const projectPlanExpirySeconds = projectPlanTtlMilliseconds / millisecondsPerSecond;
export const maximumProjectPlans = 100;
const maximumPlanIdGenerationAttempts = 16;

export type NpmrcMode = 'federal' | 'external';

export interface ObliqueProjectPlan {
	projectName: string;
	parentDirectory: string;
	destinationPath: string;
	obliqueVersion: string;
	obliqueCliVersion: string;
	angularVersion: string;
	nodeRequirement: string;
	npmrcMode: NpmrcMode;
	executable: 'npx';
	args: string[];
}

interface PlanRecord {
	plan: ObliqueProjectPlan;
	expiresAt: number;
	used: boolean;
}

export type PlanTakeResult =
	{status: 'ready'; plan: ObliqueProjectPlan} | {status: 'not-found' | 'expired' | 'already-used'};
export type PlanPutResult = {status: 'ready'; planId: string; expiresInSeconds: number} | {status: 'full'};

export interface ObliqueProjectPlanStoreOptions {
	now?: () => number;
	ttlMilliseconds?: number;
	maximumPlans?: number;
	createPlanId?: () => string;
}

export class ObliqueProjectPlanStore {
	readonly #plans = new Map<string, PlanRecord>();
	readonly #locks = new Set<string>();
	private readonly now: () => number;
	private readonly ttlMilliseconds: number;
	private readonly maximumPlans: number;
	private readonly createPlanId: () => string;

	constructor(options: ObliqueProjectPlanStoreOptions = {}) {
		this.now = options.now ?? Date.now;
		this.ttlMilliseconds = options.ttlMilliseconds ?? projectPlanTtlMilliseconds;
		this.maximumPlans = options.maximumPlans ?? maximumProjectPlans;
		this.createPlanId = options.createPlanId ?? randomUUID;
	}

	put(plan: ObliqueProjectPlan): PlanPutResult {
		this.removeExpired();
		if (this.#plans.size >= this.maximumPlans) {
			return {status: 'full'};
		}
		const planId = this.getAvailablePlanId();
		if (planId === undefined) {
			return {status: 'full'};
		}
		this.#plans.set(planId, {plan: clonePlan(plan), expiresAt: this.now() + this.ttlMilliseconds, used: false});
		return {status: 'ready', planId, expiresInSeconds: Math.ceil(this.ttlMilliseconds / millisecondsPerSecond)};
	}

	get(planId: string): PlanTakeResult {
		const record = this.#plans.get(planId);
		if (record === undefined) {
			return {status: 'not-found'};
		}
		if (record.expiresAt <= this.now()) {
			this.#plans.delete(planId);
			return {status: 'expired'};
		}
		if (record.used) {
			return {status: 'already-used'};
		}
		return {status: 'ready', plan: clonePlan(record.plan)};
	}

	take(planId: string): PlanTakeResult {
		const result = this.get(planId);
		if (result.status !== 'ready') {
			return result;
		}
		const record = this.#plans.get(planId);
		if (record === undefined) {
			return {status: 'not-found'};
		}
		record.used = true;
		return result;
	}

	acquireDestination(destinationPath: string): boolean {
		if (this.#locks.has(destinationPath)) {
			return false;
		}
		this.#locks.add(destinationPath);
		return true;
	}

	releaseDestination(destinationPath: string): void {
		this.#locks.delete(destinationPath);
	}

	get size(): number {
		this.removeExpired();
		return this.#plans.size;
	}

	private removeExpired(): void {
		for (const [planId, record] of this.#plans) {
			if (record.expiresAt <= this.now()) {
				this.#plans.delete(planId);
			}
		}
	}

	private getAvailablePlanId(): string | undefined {
		for (let attempt = 0; attempt < maximumPlanIdGenerationAttempts; attempt += 1) {
			const planId = this.createPlanId();
			if (!this.#plans.has(planId)) {
				return planId;
			}
		}
		return undefined;
	}
}

function clonePlan(plan: ObliqueProjectPlan): ObliqueProjectPlan {
	return {...plan, args: [...plan.args]};
}
