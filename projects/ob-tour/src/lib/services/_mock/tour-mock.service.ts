import {Subject} from 'rxjs';
import type {ObTourConfig} from '../../models/tour-config.model';
import type {ObTourStep} from '../../models/tour-step.model';
import {signal} from '@angular/core';

export class ObTourServiceMock {
	updateConfig = new Subject<ObTourConfig[]>();

	activeTour = signal<ObTourConfig | null>(null);
	currentStep = signal<ObTourStep | null>(null);

	init = jest.fn<unknown, [ObTourConfig[]]>((config: ObTourConfig[]) => {
		this.updateConfig.next(config);
	});

	startTour = jest.fn<() => void, [string?]>();

	hasNextStep = jest.fn<boolean, []>();
	hasPreviousStep = jest.fn<boolean, []>();
	nextStep = jest.fn<() => void, []>();
	prevStep = jest.fn<() => void, []>();
	finishTour = jest.fn<() => void, []>();

	setActiveTour(tour: ObTourConfig | null): void {
		this.activeTour.update(() => tour);
	}

	setCurrentStep(step: ObTourStep | null): void {
		this.currentStep.update(() => step);
	}
}
