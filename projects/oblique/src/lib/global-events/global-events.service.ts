import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Observable, fromEvent} from 'rxjs';
import {share} from 'rxjs/operators';
import {WINDOW} from '../utilities';

@Injectable({
	providedIn: 'root'
})
export class ObGlobalEventsService {
	public readonly beforeUnload$: Observable<BeforeUnloadEvent>;
	public readonly click$: Observable<MouseEvent>;
	public readonly mouseDown$: Observable<MouseEvent>;
	public readonly mouseMove$: Observable<MouseEvent>;
	public readonly keyDown$: Observable<KeyboardEvent>;
	public readonly keyUp$: Observable<KeyboardEvent>;
	public readonly scroll$: Observable<Event>;
	public readonly wheel$: Observable<Event>;
	public readonly resize$: Observable<UIEvent>;

	constructor(@Inject(DOCUMENT) document: Document, @Inject(WINDOW) window: Window) {
		this.beforeUnload$ = this.buildObservable<BeforeUnloadEvent>(window, 'beforeunload');
		this.click$ = this.buildObservable<MouseEvent>(document, 'click');
		this.mouseDown$ = this.buildObservable<MouseEvent>(document, 'mousedown');
		this.mouseMove$ = this.buildObservable<MouseEvent>(document, 'mousemove');
		this.keyDown$ = this.buildObservable<KeyboardEvent>(document, 'keydown');
		this.keyUp$ = this.buildObservable<KeyboardEvent>(document, 'keyup');
		this.scroll$ = this.buildObservable<Event>(window, 'scroll');
		this.wheel$ = this.buildObservable<Event>(window, 'wheel');
		this.resize$ = this.buildObservable<UIEvent>(window, 'resize');
	}

	private buildObservable<T>(target: Window | Document, event: string): Observable<T> {
		return fromEvent<T>(target, event).pipe(share());
	}
}
