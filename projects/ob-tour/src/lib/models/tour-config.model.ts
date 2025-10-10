import {ObTourStep} from './tour-step.model';

/**
 * Configuration object for a single tour.
 *
 */
export interface ObTourConfig {
	/** Title of the tour. */
	tourTitle: string;
	/** General description of the tour. */
	tourDescription: string;
	/** Ordered list of steps that define the tour. The index defines the ordering */
	steps: ObTourStep[];
	/** Key for persisting tour stat*/
	storageKey?: string;
	/**
	 * Defines how and when the tour should be triggered.
	 * Defaults to [{ type: 'manual' }] if not provided.
	 */
	triggers?: ObTourTrigger[];
	state: ObTourState;
}

/**
 * Wrapper configuration that allows registering multiple tours within an application.
 */
export interface ObtToursConfig {
	tours: ObTourConfig[];
}

export type ObtBadgePosition = 'left' | 'right';

export enum ObtMenuPositionsY {
	AUTO = 'auto',
	ABOVE = 'above',
	BELOW = 'below'
}

export enum ObtMenuPositionsX {
	AUTO = 'auto',
	START = 'start',
	END = 'end'
}

export interface ObtMenuPosition {
	originX: ObtMenuPositionsX;
	originY: ObtMenuPositionsY;
}

/**
 * Defines the possible trigger mechanisms for a tour.
 */
export type ObTourTrigger =
	/** Manual trigger: is not automatically announced. */
	| {type: 'manual'}
	/** Delayed auto trigger: tour announces automatically after a delay (in minutes). */
	| {type: 'delayedAuto'; delayInMinutes: number};

export type ObTourAction = 'start' | 'skip' | 'restart' | 'resume';
export const TOUR_STATES = ['new', 'done', 'inProgress'] as const;
export type ObTourState = (typeof TOUR_STATES)[number];
export type ObMenuActionIcon = 'skip_next' | 'redo' | 'chevron_right' | 'delete';
