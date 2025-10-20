import {Injectable, computed, effect, inject, signal} from '@angular/core';
import {ObtStoredTourData, ObtTour, ObtTourState, ObtTourStep} from '../models/tour.model';
import {ObtTourStateStoreService} from './tour-state-store.service';

@Injectable()
export class ObtTourService {
	/** Full list of all tours */
	readonly config = signal<ObtTour[]>([]);

	/** Currently active tour key (storageKey) */
	readonly activeTourKey = signal<string | null>(null);

	/** Currently active step index (0-based) */
	readonly activeStepIndex = signal<number | null>(null);

	/** Current runtime state of the tour */
	readonly state = signal<ObtTourState>('new');

	/** Computed property for the currently active tour */
	readonly activeTour = computed<ObtTour | null>(() => {
		const key = this.activeTourKey();
		return this.config().find(tour => tour.storageKey === key) ?? null;
	});

	public menuKey = '';

	/** Computed property for the currently active step */
	readonly activeStep = computed<ObtTourStep | null>(() => {
		const tour = this.activeTour();
		const idx = this.activeStepIndex();
		return tour && idx !== null ? tour.steps[idx] : null;
	});

	private readonly stateStore = inject(ObtTourStateStoreService);

	constructor() {
		effect(() => {
			// by changes of state, activeTour and activeIndex
			const tour = this.activeTour();
			const idx = this.activeStepIndex();
			const currentState = this.state();
			this.updateActiveTour(tour, idx, currentState);
		});
	}

	/** Initialize or update tours and ensure persisted states exist */
	update(config: ObtTour[]): void {
		const tours = config.map(tour => {
			const stored = this.stateStore.loadStoredTourStateData(this.menuKey, tour.storageKey);

			if (!stored) {
				const initialState = tour.state ?? 'new';
				this.stateStore.saveState(this.menuKey, tour, 0, initialState);
			}
			return {
				storageKey: tour.storageKey,
				tourTitle: tour.tourTitle,
				tourDescription: tour.tourDescription,
				steps: tour.steps,
				lastUpdated: new Date(this.getTimestamp(stored)),
				trigger: tour.trigger ?? 'manual',
				state: stored?.state ?? tour.state ?? 'new'
			} satisfies ObtTour;
		});

		this.config.set([...tours]);
	}

	/** Starts a tour from the beginning */
	startTour(key: string): void {
		this.activeTourKey.set(key);
		this.activeStepIndex.set(0);
		this.state.set('inProgress');
	}

	/** Proceeds to the next step if available */
	nextStep(): void {
		const idx = this.activeStepIndex();
		if (this.hasNextStep()) {
			this.activeStepIndex.set(idx + 1);
			this.state.set('inProgress');
		}
	}

	/** Goes one step back if possible */
	prevStep(): void {
		const idx = this.activeStepIndex();
		if (idx !== null && idx > 0) {
			this.activeStepIndex.set(idx - 1);
			this.state.set('inProgress');
		}
	}

	/** Marks the tour as done
	 * @param storeKey identifier key of the tour
	 * */
	finishTour(storeKey: string): void {
		this.activeTourKey.set(storeKey);
		const tour = this.config().find(obtTour => obtTour.storageKey === storeKey);
		const idx = this.activeStepIndex() ?? 0;
		if (tour) {
			this.stateStore.saveState(this.menuKey, tour, idx, 'done');
		}
		this.state.set('done');
		this.refreshConfigAfterStateChange();
		this.closeTour();
	}

	/** Resets the current active tour references */
	closeTour(): void {
		this.activeStepIndex.set(null);
		this.activeTourKey.set(null);
	}

	/** Marks the tour as skipped */
	skipTour(storeKey: string): void {
		this.activeTourKey.set(storeKey);
		const tour = this.activeTour();
		const idx = this.activeStepIndex() ?? 0;

		if (tour) {
			this.stateStore.saveState(this.menuKey, tour, idx, 'skipped');
		}
		this.state.set('skipped');
		this.state.set(null);
		this.closeTour();
	}

	/** Pauses the current tour and persists progress */
	pauseTour(): void {
		this.state.set('inProgress');
		this.activeStepIndex.set(null);
		this.activeTourKey.set(null);
		this.refreshConfigAfterStateChange();
		this.closeTour();
	}

	/** Restarts the tour from the beginning */
	restartTour(key: string): void {
		this.startTour(key);
		this.refreshConfigAfterStateChange();
	}

	/** Resumes a tour if stored progress exists */
	resumeIfPossible(storageKey: string): void {
		const tour = this.config().find(obtTour => obtTour.storageKey === storageKey);
		if (!tour) {
			return;
		}

		const stored = this.stateStore.loadStoredTourStateData(this.menuKey, storageKey);
		if (stored) {
			this.activeTourKey.set(storageKey);
			this.activeStepIndex.set(stored.currentStepIndex);
			this.state.set(stored.state);
			this.refreshConfigAfterStateChange();
		}
	}

	/** Whether a next step is available */
	hasNextStep(): boolean {
		const tour = this.activeTour();
		const index = this.activeStepIndex();
		return !!tour && index !== null && !!tour.steps && index < tour.steps.length - 1;
	}

	/** Whether a previous step is available */
	hasPreviousStep(): boolean {
		const index = this.activeStepIndex();
		return index !== null && index > 0;
	}

	clearLocalStorage(): void {
		this.stateStore.clearState(this.menuKey);
		this.state.set('new');
		this.activeStepIndex.set(null);
		this.activeTourKey.set(null);
		const resetTours = this.config().map(tour => ({
			...tour,
			state: 'new' as ObtTourState,
			lastUpdated: new Date()
		}));
		this.update(resetTours);
	}

	/** Refreshes the config list after a state change (for UI updates) */
	private refreshConfigAfterStateChange(): void {
		const updatedTours = this.config().map(tour => {
			const stored = this.stateStore.loadStoredTourStateData(this.menuKey, tour.storageKey);
			return stored ? {...tour, state: stored.state ?? 'new'} : tour;
		});
		this.config.set([...updatedTours]);
	}

	private getTimestamp(stored?: ObtStoredTourData): number {
		if (this.state() === 'skipped' || this.state() === 'done' || this.state() === 'inProgress') {
			return Date.now();
		}
		return stored?.timestamp ?? Date.now();
	}
	private updateActiveTour(tour: ObtTour | null, idx: number | null, currentState: ObtTourState | null): void {
		let index = idx;
		if (!tour || index === null) {
			return;
		}
		if (currentState === 'done') {
			index = tour.steps.length - 1;
		}
		this.stateStore.saveState(this.menuKey, tour, index, currentState);
	}
}
