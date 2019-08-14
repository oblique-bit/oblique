import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {takeUntil} from 'rxjs/operators';

import {SpinnerService} from './spinner.service';
import {SpinnerEvent} from './spinner-event';
import {Unsubscribable} from '../unsubscribe.class';

@Component({
	selector: 'or-spinner',
	exportAs: 'orSpinner',
	template: `
		<div class="overlay" [class.overlay-fixed]="fixed" [@inOut]="$state">
			<div class="spinner-viewport">
				<span class="fa fa-spinner fa-spin fa-4x"></span>
			</div>
		</div>`,
	styleUrls: ['spinner.component.scss'],
	animations: [
		trigger('inOut', [
			state('in', style({opacity: 1, display: 'block'})),
			transition('* => in', [
				style({ display: 'block' }), // As we can not animate the `display` property, we modify it before starting the next animation.
				animate('250ms ease-in-out', keyframes([
					style({offset: 0, opacity: 0, display: 'block'}),
					style({offset: 1, opacity: 1, display: 'block'})
				]))
			]),
			state('out',
				style({opacity: 0, display: 'none'})
			),
			transition('* => out', [
				animate('250ms ease-in-out', keyframes([
					style({offset: 0, opacity: 1, display: 'block'}),
					style({offset: 1, opacity: 0, display: 'block'}),
				]))
			])
		])
	]
})
export class SpinnerComponent extends Unsubscribable implements OnInit {

	@Input()
	channel: string = SpinnerService.CHANNEL;

	@Input()
	fixed = false;

	// Animation state:
	$state = 'out';

	constructor(private readonly spinnerService: SpinnerService, private readonly element: ElementRef) {
		super();
		spinnerService.events.pipe(takeUntil(this.unsubscribe))
			.subscribe((event: SpinnerEvent) => {
				if (event.channel === this.channel) {
					// TODO: Workaround until https://github.com/angular/angular/issues/28801 is solved
					setTimeout(() => this.$state = event.active ? 'in' : 'out');
				}
			});
	}

	ngOnInit() {
		// if (!this.fixed) {
			this.element.nativeElement.parentElement.classList.add('has-overlay');
		// }
	}
}
