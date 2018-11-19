import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * Configuration service for the Scroll Detection directive.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for the scroll detection used in the application.
 */
@Injectable({providedIn: 'root'})
export class ScrollingConfig {
	onScroll: Subject<boolean> = new Subject<boolean>();
	scrollDuration = 200;
}
