import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {takeUntil} from 'rxjs/operators';

import {ObSpinnerService} from './spinner.service';
import {ObISpinnerEvent} from './spinner-event';
import {Subject} from 'rxjs';

@Component({
	selector: 'ob-spinner',
	exportAs: 'obSpinner',
	template: `<div class="overlay" [class.overlay-fixed]="fixed" [@inOut]="$state">
		<div class="spinner-viewport" #spinnerContainer>
			<span class="fa fa-spinner fa-spin fa-4x"></span>
		</div>
	</div>`,
	styleUrls: ['spinner.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('inOut', [
			state('in', style({opacity: 1, display: 'block'})),
			transition('* => in', [
				style({display: 'block'}), // As we can not animate the `display` property, we modify it before starting the next animation.
				animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 0, display: 'block'}), style({offset: 1, opacity: 1, display: 'block'})]))
			]),
			state('out', style({opacity: 0, display: 'none'})),
			transition('* => out', [
				animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 1, display: 'block'}), style({offset: 1, opacity: 0, display: 'block'})]))
			])
		])
	]
})
export class ObSpinnerComponent implements OnInit, OnDestroy {
	@Input() channel: string = ObSpinnerService.CHANNEL;
	@Input() fixed = false;
	@ViewChild('spinnerContainer') spinnerContainer: ElementRef;
	$state = 'out';
	private readonly unsubscribe = new Subject();

	constructor(private readonly spinnerService: ObSpinnerService, private readonly element: ElementRef) {
		spinnerService.events$.pipe(takeUntil(this.unsubscribe)).subscribe((event: ObISpinnerEvent) => {
			if (event.channel === this.channel) {
				// TODO: Workaround until https://github.com/angular/angular/issues/28801 is solved
				setTimeout(() => (this.$state = event.active ? 'in' : 'out'));
			}
		});
	}

	ngOnInit() {
		this.element.nativeElement.parentElement.classList.add('has-overlay');
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
