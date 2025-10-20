import {Injectable} from '@angular/core';
import {keyPrefix} from '../models/tour.model';

@Injectable({providedIn: 'root'})
export class ObtTourMenuVisibility {
	private readonly keySuffix = 'visibility-state';

	/**
	 * Creates a new visibility key or restores it from localStorage if it already exists.
	 * @param key - The unique tourMenuKey identifier.
	 * @param visibility
	 * @returns boolean - The stored or newly created visibility state.
	 */
	changeVisibility(key: string, visibility: boolean): boolean {
		const storeKey = `${keyPrefix.trim()}-${key?.trim() ?? ''}-${this.keySuffix.trim()}`;
		// eslint-disable-next-line @typescript-eslint/init-declarations
		let current: boolean | undefined;
		if (key) {
			current = this.restoreFromStorage(key);
		}
		if (current === visibility) {
			return visibility; // no change -> don't overwrite
		}
		this.saveToStorage(storeKey, visibility);
		return visibility;
	}

	/**
	 * Returns the current menu visibility state.
	 * Defaults to true if no stored value exists.
	 * @returns boolean
	 */
	isVisible(key: string): boolean | null {
		return this.restoreFromStorage(key);
	}

	/**
	 * Saves the visibility state to localStorage under the current key.
	 * @param key identifier key for visibility
	 * @param value - The visibility state to store (true = visible).
	 */
	private saveToStorage(key: string, value: boolean): void {
		if (key) {
			localStorage.setItem(key, JSON.stringify(value));
			return;
		}
		console.error('Menu visibility key must be set before saving.');
	}

	/**
	 * Restores the stored visibility state from localStorage.
	 * @returns boolean | null - The restored visibility state or null if not found.
	 */
	private restoreFromStorage(key: string): boolean | null {
		const storageKey = `${keyPrefix.trim()}-${key?.trim() ?? ''}-${this.keySuffix.trim()}`;
		const stored = localStorage.getItem(storageKey);
		return stored === null ? null : JSON.parse(stored);
	}
}
