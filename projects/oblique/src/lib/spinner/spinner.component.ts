import {AsyncPipe} from '@angular/common';
import {Component, ElementRef, Input, OnInit, ViewEncapsulation, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {delay, filter, map, startWith} from 'rxjs/operators';
import {ObSpinnerService} from './spinner.service';

@Component({
	selector: 'ob-spinner',
	imports: [AsyncPipe, MatIconModule],
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss', './spinner-animations.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-spinner'},
	exportAs: 'obSpinner',
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
