import {AsyncPipe} from '@angular/common';
import {Component, type OnDestroy, type OnInit, inject} from '@angular/core';
import {ObGlobalEventsService, WINDOW} from '@oblique/oblique';
import {type Observable, Subject, map, startWith, takeUntil, tap} from 'rxjs';

@Component({
	selector: 'app-global-events-example-properties-preview',
	imports: [AsyncPipe],
	templateUrl: './global-events-example-properties-preview.component.html',
	styleUrls: ['../global-events-example-preview.component.scss', '../../../../code-example-flex-layout.scss'],
})
export class GlobalEventsExamplePropertiesPreviewComponent implements OnInit, OnDestroy {
	click$: Observable<number>;
	mouseDown$: Observable<number>;
	mouseMove$: Observable<{xCoordinate: number; yCoordinate: number}>;
	keyDown$: Observable<string>;
	keyUp$: Observable<string>;
	scroll$: Observable<number>;
	resize$: Observable<{height: number; width: number}>;
	beforeUnload$: Observable<number>;
	private readonly events = inject(ObGlobalEventsService);
	private readonly window = inject<Window>(WINDOW);
	private readonly unsubscribe = new Subject<void>();
	private readonly counter = {
		beforeUnload: 0,
		click: 0,
		mouseDown: 0,
	};

	ngOnInit(): void {
		this.setupClick();
		this.setupMouseDown();
		this.setupMouseMove();
		this.setupKeyDown();
		this.setupKeyUp();
		this.setupScroll();
		this.setupResize();
		this.setupBeforeUnload();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private setupClick(): void {
		this.click$ = this.events.click$.pipe(
			map(() => ++this.counter.click),
			startWith(this.counter.click),
			takeUntil(this.unsubscribe)
		);
	}

	private setupMouseDown(): void {
		this.mouseDown$ = this.events.mouseDown$.pipe(
			map(() => ++this.counter.mouseDown),
			startWith(this.counter.mouseDown),
			takeUntil(this.unsubscribe)
		);
	}

	private setupMouseMove(): void {
		this.mouseMove$ = this.events.mouseMove$.pipe(
			map(event => ({xCoordinate: event.clientX, yCoordinate: event.clientY})),
			takeUntil(this.unsubscribe)
		);
	}

	private setupKeyDown(): void {
		this.keyDown$ = this.events.keyDown$.pipe(
			map(event => event.key),
			takeUntil(this.unsubscribe)
		);
	}

	private setupKeyUp(): void {
		this.keyUp$ = this.events.keyUp$.pipe(
			map(event => event.key),
			takeUntil(this.unsubscribe)
		);
	}

	private setupScroll(): void {
		this.scroll$ = this.events.scroll$.pipe(
			map(() => this.window.scrollY),
			startWith(0),
			takeUntil(this.unsubscribe)
		);
	}

	private setupResize(): void {
		this.resize$ = this.events.resize$.pipe(
			map(() => ({height: this.window.innerHeight, width: this.window.innerWidth})),
			startWith({height: this.window.innerHeight, width: this.window.innerWidth}),
			takeUntil(this.unsubscribe)
		);
	}

	private setupBeforeUnload(): void {
		this.beforeUnload$ = this.events.beforeUnload$.pipe(
			tap(event => {
				event.returnValue = 'Oblique';
			}),
			map(() => ++this.counter.beforeUnload),
			startWith(this.counter.beforeUnload),
			takeUntil(this.unsubscribe)
		);
	}
}
