import {ChangeDetectionStrategy, Component, signal} from '@angular/core';

/*
 * This component exists to make incremental hydration observable. It is referenced only from a
 * `@defer (hydrate on viewport)` block in `text.html`, so on the initial load the server renders its
 * markup and Angular hydrates it only once it enters the viewport. The counter proves the difference:
 * before hydration the button is inert, after hydration it increments.
 */
@Component({
	selector: 'ssr-text-demo',
	templateUrl: './text-sample.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class TextSample {
	readonly clicks = signal(0);

	increment(): void {
		this.clicks.update(count => count + 1);
	}
}
