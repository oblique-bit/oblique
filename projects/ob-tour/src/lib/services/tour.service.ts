import {Injectable, computed, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {ObTourConfig} from './../models/tour-config.model';
import {ObTourStep} from './../models/tour-step.model';

@Injectable({
	providedIn: 'root'
})
export class ObtTourService {
	public readonly updateConfig = new Subject<ObTourConfig[]>();

	readonly activeTour = computed<ObTourConfig | null>(() => {
		const list = this.config();
		const title = this.activeTourTitle();
		if (!list || !title) {
			return null;
		}
		return this.findTour(title);
	});

	readonly currentStep = computed<ObTourStep | null>(() => {
		const tour = this.activeTour();
		const index = this.activeStepIndex();
		if (!tour || index === null || !tour.steps || index < 0 || index >= tour.steps.length) {
			return null;
		}
		return tour.steps[index];
	});

	private readonly config = signal<ObTourConfig[] | null>(null);
	private readonly activeTourTitle = signal<string | null>(null);
	private readonly activeStepIndex = signal<number | null>(null);
	private scrollContainer: HTMLElement | Window = window;
	private previousScrollTop = 0;
	init(config: ObTourConfig[]): void {
		this.config.set(config);
		this.activeTourTitle.update(() => null);
		this.activeStepIndex.update(() => null);
		this.updateConfig.next(config);
	}

	startTour(title?: string): void {
		this.scrollContainer = this.getScrollableContainer();
		this.previousScrollTop = this.scrollContainer === window ? window.scrollY : (this.scrollContainer as HTMLElement).scrollTop;

		const list = this.config();
		if (!list || list.length === 0) {
			return;
		}
		const tour = this.findTour(title);
		if (!tour?.steps?.length) {
			return;
		}
		this.activeTourTitle.update(() => tour.tourTitle);
		this.activeStepIndex.update(() => 0);
	}

	hasNextStep(): boolean {
		const tour = this.activeTour();
		const index = this.activeStepIndex();
		return !!tour && index !== null && index < tour.steps.length - 1;
	}

	hasPreviousStep(): boolean {
		const index = this.activeStepIndex();
		return index !== null && index > 0;
	}

	nextStep(): void {
		if (this.hasNextStep()) {
			this.activeStepIndex.update(index => (index ?? 0) + 1);
		}
	}

	prevStep(): void {
		if (this.hasPreviousStep()) {
			this.activeStepIndex.update(index => (index ?? 1) - 1);
		}
	}

	finishTour(): void {
		if (this.previousScrollTop !== undefined) {
			document.scrollingElement.scrollTo({top: this.previousScrollTop});
		}
		this.activeStepIndex.set(null);
		this.activeTourTitle.set(null);
	}

	private findTour(title?: string): ObTourConfig | null {
		const list = this.config();
		if (!list || list.length === 0) {
			return null;
		}

		if (title) {
			const found = list.find(tour => tour?.tourTitle === title);
			return found ?? null;
		}

		return list[0] ?? null;
	}

	private scrollToTarget(element: HTMLElement): Promise<void> {
		return new Promise(resolve => {
			element.scrollIntoView({behavior: 'smooth', block: 'center'});
			setTimeout(resolve, 500);
		});
	}

	private getScrollableContainer(): HTMLElement | Window {
		const possibleContainers = [
			document.querySelector('.ob-layout-content'),
			document.querySelector('main'),
			document.querySelector('.mat-drawer-content'),
			document.scrollingElement,
			document.documentElement
		];
		for (const container of possibleContainers) {
			if (container instanceof HTMLElement && container.scrollHeight > container.clientHeight) {
				return container;
			}
		}
		return window;
	}
}
