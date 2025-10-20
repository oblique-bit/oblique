import {signal} from '@angular/core';
import {ObtTour, ObtTourState} from '../../models/tour.model';

// eslint-disable-next-line max-lines-per-function
export const createObtTourServiceMock = (): {
	menuKey: string;
	update: jest.Mock;
	startTour: jest.Mock;
	nextStep: jest.Mock;
	prevStep: jest.Mock;
	finishTour: jest.Mock;
	closeTour: jest.Mock;
	skipTour: jest.Mock;
	pauseTour: jest.Mock;
	restartTour: jest.Mock;
	resumeIfPossible: jest.Mock;
	hasNextStep: jest.Mock;
	hasPreviousStep: jest.Mock;
	clearLocalStorage: jest.Mock;
	config: jest.Mock;
	activeTourKey: ReturnType<typeof signal<string | null>>;
	activeStepIndex: ReturnType<typeof signal<number | null>>;
	state: ReturnType<typeof signal<ObtTourState>>;
	activeTour: ReturnType<typeof signal<ObtTour | null>>;
	activeStep: ReturnType<typeof signal<any | null>>;
} => {
	return {
		menuKey: 'testKey',
		update: jest.fn(),
		startTour: jest.fn(),
		nextStep: jest.fn(),
		prevStep: jest.fn(),
		finishTour: jest.fn(),
		closeTour: jest.fn(),
		skipTour: jest.fn(),
		pauseTour: jest.fn(),
		restartTour: jest.fn(),
		resumeIfPossible: jest.fn(),
		hasNextStep: jest.fn().mockReturnValue(false),
		hasPreviousStep: jest.fn().mockReturnValue(false),
		clearLocalStorage: jest.fn(),
		config: jest.fn().mockReturnValue([] as ObtTour[]),

		// Signals
		activeTourKey: signal<string | null>(null),
		activeStepIndex: signal<number | null>(null),
		state: signal<ObtTourState>('new'),
		activeTour: signal<ObtTour | null>(null),
		activeStep: signal<any | null>(null)
	};
};

export type ObtTourServiceMock = ReturnType<typeof createObtTourServiceMock>;
