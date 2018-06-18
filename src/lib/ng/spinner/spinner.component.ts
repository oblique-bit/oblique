import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Unsubscribable} from '../unsubscribe';
import {takeUntil} from 'rxjs/operators';
import {SpinnerService} from './spinner.service';
import {SpinnerEvent} from './spinner-event';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

@Component({
	selector: 'or-spinner',
	exportAs: 'orSpinner',
	template: `
		<div class="overlay overlay-inverse" [class.overlay-fixed]="fixed" [@inOut]="$state">
			<div class="spinner-viewport">
				<span class="spinner fa fa-spinner fa-4x"></span>
			</div>
		</div>`,
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

	private $state = 'out';

	constructor(private spinnerService: SpinnerService, private element: ElementRef) {
		super();
		spinnerService.events.pipe(takeUntil(this.unsubscribe))
			.subscribe((event: SpinnerEvent) => {
				if (event.channel === this.channel) {
					this.$state = event.active ? 'in' : 'out';
				}
			});
	}

	ngOnInit() {
		if (!this.fixed) {
			this.element.nativeElement.parentElement.classList.add('has-overlay');
		}
	}
}
