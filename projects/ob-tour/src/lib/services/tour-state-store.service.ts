import {Injectable} from '@angular/core';
import {ObtStoredTourData, ObtTour, ObtTourState, keyPrefix} from '../models/tour.model';

const keySuffix = 'states';

@Injectable({providedIn: 'root'})
export class ObtTourStateStoreService {
	private readonly storage = window.localStorage;

	/**
	 * Saves the current state of a tour inside a specific set.
	 * @param setKey - The parent set identifier.
	 * @param tour - The tour to be saved.
	 * @param stepIndex - The current step index of the tour.
	 * @param state - The current tour state.
	 */
	saveState(setKey: string, tour: ObtTour, stepIndex: number, state: ObtTourState): void {
		if (!tour?.storageKey) {
			console.error('ObtTourStateStoreService: missing storageKey in tour config:', tour?.tourTitle);
			return;
		}

		const data: ObtStoredTourData = {
			state,
			currentStepIndex: stepIndex,
			timestamp: Date.now()
		};

		const allStates = this.loadAllStates(setKey);
		allStates[tour.storageKey] = data;
		this.storage.setItem(this.buildStorageKey(setKey), JSON.stringify(allStates));
	}

	/**
	 * Loads stored state data for a specific tour inside a set.
	 * @param setKey - The parent set identifier.
	 * @param tourKey - The unique storageKey of the tour.
	 * @returns The stored tour state or null if not found.
	 */
	loadStoredTourStateData(setKey: string, tourKey: string): ObtStoredTourData | null {
		const allStates = this.loadAllStates(setKey);
		return allStates[tourKey] ?? null;
	}

	/**
	 * Clears all stored tour states for a given set.
	 * @param setKey - The parent set identifier.
	 */
	clearState(setKey: string): void {
		this.storage.removeItem(this.buildStorageKey(setKey));
	}

	/**
	 * Loads all stored tour states for a given set.
	 * @param setKey - The parent set identifier.
	 * @returns A record of all stored tours within the set.
	 */
	private loadAllStates(setKey: string): Record<string, ObtStoredTourData> {
		const raw = this.storage.getItem(this.buildStorageKey(setKey));
		return raw ? (JSON.parse(raw) as Record<string, ObtStoredTourData>) : {};
	}

	/**
	 * Builds a unique localStorage key for a given set of tours.
	 * @param setKey - The unique identifier of the tour set.
	 */
	private buildStorageKey(setKey: string): string {
		return `${keyPrefix.trim()}-${setKey.trim()}-${keySuffix}`.trim();
	}
}
