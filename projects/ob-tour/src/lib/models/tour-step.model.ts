import {ElementRef, Signal} from '@angular/core';

/**
 * Defines how a target element is identified.
 */
export interface ObTargetElement {
	/**
	 * Optional element selector to locate the element in the DOM.
	 * Used if no direct HTMLElement reference is provided.
	 * If neither elementSelector nor elementRef is set,
	 * the step is displayed in the middle of the screen.
	 */
	elementSelector?: string;
	/** Direct DOM reference; preferred over elementSelector when present. */
	elementRef?: Signal<ElementRef<HTMLElement>>;
}

/**
 * Placement of the step content relative to the target element.
 */
type ObStepPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto' | 'center';

/**
 * Step with a target element.
 */
export interface ObTourStep {
	/** Title of the step (recommended: i18n key). */
	stepTitle: string;
	/** Description of the step (recommended: i18n key). */
	stepDescription: string;
	/** Preferred placement of the step content relative to the target element.*/
	position?: ObStepPlacement;
	target?: ObTargetElement;
}
