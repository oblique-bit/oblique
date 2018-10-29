import {EventEmitter, Injectable} from '@angular/core';

/**
 * Configuration service for the Scroll Detection directive.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for the scroll detection used in the application.
 */
@Injectable()
export class ScrollingConfig {
	onScroll: EventEmitter<boolean> = new EventEmitter<boolean>();
	scrollDuration = 200;
}
