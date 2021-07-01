import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {takeUntil} from 'rxjs/operators';

import {ObSpinnerService} from './spinner.service';
import {ObISpinnerEvent} from './spinner.model';
import {Subject} from 'rxjs';

@Component({
	selector: 'ob-spinner',
	exportAs: 'obSpinner',
	template: `<div class="ob-overlay" [class.ob-overlay-fixed]="fixed" [@inOut]="$state">
		<div class="ob-spinner-viewport" #spinnerContainer>
			<ob-icon icon="refresh"></ob-icon>
		</div>
	</div>`,
	styleUrls: ['spinner.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('inOut', [
			state('in', style({opacity: 1, display: 'block'})),
			transition('* => in', [
				style({display: 'block'}), // As we can not animate the `display` property, we modify it before starting the next animation.
				animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 0}), style({offset: 1, opacity: 1})]))
			]),
			state('out', style({opacity: 0, display: 'none'})),
			transition('* => out', [animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 1}), style({offset: 1, opacity: 0})]))])
		])
	],
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-spinner'}
})
export class ObSpinnerComponent implements OnInit, OnDestroy {
	@Input() channel: string = ObSpinnerService.CHANNEL;
	@Input() fixed = false;
	@ViewChild('spinnerContainer') spinnerContainer: ElementRef;
	$state = 'out';
	private readonly unsubscribe = new Subject();
	private readonly window: Window;

	constructor(private readonly spinnerService: ObSpinnerService, private readonly element: ElementRef) {
		this.window = window; // because AoT don't accept interfaces as DI
		spinnerService.events$.pipe(takeUntil(this.unsubscribe)).subscribe((event: ObISpinnerEvent) => {
			if (event.channel === this.channel) {
				// TODO: Workaround until https://github.com/angular/angular/issues/28801 is solved
				this.window.setTimeout(() => (this.$state = event.active ? 'in' : 'out'));
			}
		});
	}

	ngOnInit() {
		this.element.nativeElement.parentElement.classList.add('ob-has-overlay');
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
