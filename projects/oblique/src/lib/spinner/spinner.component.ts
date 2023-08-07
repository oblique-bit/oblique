import {Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {delay, filter, map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ObSpinnerService} from './spinner.service';

@Component({
	selector: 'ob-spinner',
	exportAs: 'obSpinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss'],
	encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('inOut', [
			state('in', style({opacity: 1, display: 'block'})),
			transition('out => in', [
				style({display: 'block'}), // As we can not animate the `display` property, we modify it before starting the next animation.
				animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 0}), style({offset: 1, opacity: 1})]))
			]),
			state('out', style({opacity: 0, display: 'none'})),
			transition('in => out', [animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 1}), style({offset: 1, opacity: 0})]))])
		])
	],
	host: {class: 'ob-spinner'}
})
export class ObSpinnerComponent implements OnInit {
	@Input() channel: string = ObSpinnerService.CHANNEL;
	@Input() fixed = false;
	state$: Observable<string>;

	constructor(private readonly spinnerService: ObSpinnerService, private readonly element: ElementRef) {}

	ngOnInit(): void {
		this.element.nativeElement.parentElement.classList.add('ob-has-overlay');
		this.state$ = this.spinnerService.events$.pipe(
			filter(event => event.channel === this.channel),
			map(event => (event.active ? 'in' : 'out')),
			startWith('out'),
			delay(0) // avoid ExpressionChangedAfterItHasBeenCheckedError when the spinner is activated during a component's initialisation process
		);
	}
}
