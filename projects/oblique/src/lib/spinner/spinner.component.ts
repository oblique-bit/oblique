import {Component, ElementRef, Input, OnInit, ViewEncapsulation, HostListener, ViewChild, AfterViewInit} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {takeUntil} from 'rxjs/operators';

import {ObSpinnerService} from './spinner.service';
import {ObISpinnerEvent} from './spinner-event';
import {ObUnsubscribable} from '../unsubscribe.class';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout/master-layout.component.service';

@Component({
	selector: 'ob-spinner',
	exportAs: 'obSpinner',
	template: `
		<div class="overlay" [class.overlay-fixed]="fixed" [@inOut]="$state">
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
export class ObSpinnerComponent extends ObUnsubscribable implements OnInit, AfterViewInit {

	@Input()
	channel: string = ObSpinnerService.CHANNEL;

	@Input()
	fixed = false;

	@ViewChild('spinnerContainer') spinnerContainer: ElementRef;

	// Animation state:
	$state = 'out';

	constructor(private readonly spinnerService: ObSpinnerService,
				private readonly element: ElementRef,
				private readonly masterLayoutComponentService: ObMasterLayoutComponentService) {
		super();
		spinnerService.events.pipe(takeUntil(this.unsubscribe))
			.subscribe((event: ObISpinnerEvent) => {
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

	ngAfterViewInit(): void {
		this.calculateSpinnerPosition();
	}

	@HostListener('window:scroll', ['$event'])
	@HostListener('window:resize', ['$event'])
	onEvent(): void {
		this.calculateSpinnerPosition();
	}

	private calculateSpinnerPosition(): void {
		if ( !this.masterLayoutComponentService.isFixed ) { // no fixed layout, calculate manually
			this.spinnerContainer.nativeElement.style.top = `${+(window.innerHeight / 2 + window.scrollY)}px`;
		}
	}
}
