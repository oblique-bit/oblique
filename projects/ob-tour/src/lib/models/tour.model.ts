import {ElementRef, Signal} from '@angular/core';

/**
 * Represents the configuration of a single tour.
 */
export interface ObtTour {
	/** Title of the tour. Accepts plain text or an i18n translation key. */
	tourTitle: string;

	/** General description of the tour. Accepts plain text or an i18n translation key. */
	tourDescription: string;

	/** Ordered list of steps that make up the tour. The array index defines the sequence.
	 * @see ObtTourStep*/
	steps: ObtTourStep[];

	/** Unique key for persisting the tour state. Must be distinct within a set of tours. */
	storageKey: string;

	/** Date when the tour was last updated, for example on initialization or state change. */
	lastUpdated?: Date | string;

	/** Defines how the tour is triggered. Defaults to 'manual' if omitted. */
	trigger?: ObtTourTrigger;

	/** Current state of the tour: 'new', 'done', 'inProgress', or 'skipped'. */
	state?: ObtTourState;
}

/**
 * Wrapper configuration that allows registering multiple tours within an application.
 * @example
 * // in your.component.ts :
 * readonly chooseTour = viewChild<ElementRef<HTMLElement>>('chooseTour');
 * toursConfig: {
 * 		tours:[{
 * 			tourTitle: 'i18n.rainbow-tour.title',
 * 			tourDescription: 'i18n.rainbow-tour.description',
 * 			storageKey: 'rainbowTour', // storageKey has to be unique within the tour-set
 * 			steps: [{
 * 				target: {elementRef: this.chooseTour}, // target can be defined as ElementRef
 * 				stepTitle: 'i18n.rainbow-tour.step1.title',
 * 				stepDescription: 'i18n.onboarding-tour.step1.description'
 * 		},
 * 		{
 * 			target: {elementSelector: 'buttonLogin'}, // or can be defined as selector
 * 			stepTitle: 'i18n.rainbow-tour.step2.title',
 * 			stepDescription: 'i18n.rainbow-tour.step2.description'
 * 		}]
 * 	}]
 * 	}
 *
 * 	// in your.component.html
 * 		<obt-tour tourMenuKey="rainbow-sample-key" [toursConfig]="toursConfig"/>
 */
export interface ObtToursConfig {
	tours: ObtTour[];
}

export type ObtBadgePosition = 'left' | 'right';

export enum ObtMenuPositionsY {
	AUTO = 'auto',
	ABOVE = 'above',
	BELOW = 'below'
}
export type ObtTMenuPositionsY = 'auto' | 'above' | 'below';
export type ObtTMenuPositionsX = 'auto' | 'start' | 'end';

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
 * Data stored in localStorage for each tour.
 */
export interface ObtStoredTourData {
	state: ObtTourState;
	currentStepIndex: number;
	timestamp: number;
}

/**
 * Defines the possible trigger mechanisms for a tour.
 */
export type ObtTourTrigger = 'manual';

export interface ObtTourChange {
	obtTourAction: ObtTourAction;
	obtTourKey: string;
}

export interface ObtActionButton {
	name: ObtTourAction;
	icon: ObtMenuActionIcon;
}

export const TOUR_STATES = ['new', 'done', 'inProgress', 'skipped'] as const;
export const TOUR_ACTION_ICON = ['skip_next', 'redo', 'chevron_right', 'delete'] as const;
export const OVERLAY_ARROW_CLASS_STYLES = ['arrow-top', 'arrow-bottom', 'arrow-left', 'arrow-right', 'arrow-none'] as const;
export const TOUR_ACTION = ['start', 'skip', 'restart', 'resume'] as const;
export const CLOSE_POPOVER_TOUR_ACTIONS: Omit<ObtTourAction, 'done'> = 'start | restart | resume';
export const BADGE_TYPES = ['new', 'inProgress'] as const;
export const keyPrefix = 'obt-tour';

export type ObtBadgeState = (typeof BADGE_TYPES)[number];
export type ObtTourState = (typeof TOUR_STATES)[number];
export type ObtTourAction = (typeof TOUR_ACTION)[number];
export type ObtMenuActionIcon = (typeof TOUR_ACTION_ICON)[number];
export type ObtArrowDirection = (typeof OVERLAY_ARROW_CLASS_STYLES)[number];

/**
 * Defines how a target element is identified.
 */
export interface ObtTargetElement {
	/**
	 * Optional element selector to locate the element in the DOM.
	 * Used if no direct HTMLElement reference is provided.
	 * If neither elementSelector nor elementRef is set,
	 * the step is displayed in the middle of the screen without an arrow with anchor.
	 *
	 */
	elementSelector?: string;
	/** Direct DOM reference; preferred over elementSelector when present. */
	elementRef?: Signal<ElementRef<HTMLElement>>;
	/**
	 * The z-index where it should highlight
	 */
	zIndex?: 10 | number;
}

/**
 * Step with a target element.
 */
export interface ObtTourStep {
	/** Title of the step (recommended: i18n key). */
	stepTitle: string;
	/** Description of the step (recommended: i18n key). */
	stepDescription: string;
	/** Preferred placement of the step content relative to the target element.
	 * @see ObtTargetElement*/
	target?: ObtTargetElement;
}
