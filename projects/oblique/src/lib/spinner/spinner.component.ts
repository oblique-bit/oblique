import {AsyncPipe} from '@angular/common';
import {Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {delay, filter, map, startWith, tap} from 'rxjs/operators';
import {ObSpinnerService} from './spinner.service';

@Component({
	selector: 'ob-spinner',
	imports: [AsyncPipe, MatIconModule],
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss', './spinner-animations.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-spinner', '[attr.aria-hidden]': 'true'},
	exportAs: 'obSpinner',
})
export class ObSpinnerComponent implements OnInit {
	@Input() channel: string = ObSpinnerService.CHANNEL;
	@Input() fixed = false;
	state$: Observable<string>;

	private readonly renderer = inject(Renderer2);
	private readonly spinnerService = inject(ObSpinnerService);
	private readonly element = inject(ElementRef);
	private readonly parentElement = this.element.nativeElement.parentElement;

	ngOnInit(): void {
		this.element.nativeElement.parentElement.classList.add('ob-has-overlay');
		this.state$ = this.spinnerService.events$.pipe(
			filter(event => event.channel === this.channel),
			map(event => (event.active ? 'in' : 'out')),
			startWith('out'),
			delay(0), // avoid ExpressionChangedAfterItHasBeenCheckedError when the spinner is activated during a component's initialisation process
			tap(state => {
				this.setInert(state);
			})
		);
	}

	private setInert(state: string): void {
		if (state === 'in') {
			this.renderer.setAttribute(this.parentElement, 'inert', '');
		} else {
			this.renderer.removeAttribute(this.parentElement, 'inert');
		}
	}
}
