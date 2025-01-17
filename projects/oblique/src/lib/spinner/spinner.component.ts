import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {AsyncPipe} from '@angular/common';
import {Component, ElementRef, Input, OnInit, ViewEncapsulation, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {delay, filter, map, startWith} from 'rxjs/operators';
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
				style({display: 'block'}),
				animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 0}), style({offset: 1, opacity: 1})]))
			]),
			state('out', style({opacity: 0, display: 'none'})),
			transition('in => out', [animate('250ms ease-in-out', keyframes([style({offset: 0, opacity: 1}), style({offset: 1, opacity: 0})]))])
		])
	],
	host: {class: 'ob-spinner'},
	imports: [AsyncPipe, MatIconModule]
})
export class ObSpinnerComponent implements OnInit {
	@Input() channel: string = ObSpinnerService.CHANNEL;
	@Input() fixed = false;
	state$: Observable<string>;

	private readonly spinnerService = inject(ObSpinnerService);
	private readonly element = inject(ElementRef);

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
