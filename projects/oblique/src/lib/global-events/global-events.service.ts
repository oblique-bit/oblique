import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {fromEvent, Observable} from 'rxjs';
import {WINDOW} from '../utilities';

@Injectable({
	providedIn: 'root'
})
export class ObGlobalEventsService {
	public readonly click$: Observable<MouseEvent>;
	public readonly mouseDown$: Observable<MouseEvent>;
	public readonly mouseMove$: Observable<MouseEvent>;
	public readonly keyDown$: Observable<KeyboardEvent>;
	public readonly keyUp$: Observable<KeyboardEvent>;
	public readonly scroll$: Observable<Event>;
	public readonly resize$: Observable<UIEvent>;

	constructor(@Inject(DOCUMENT) document: any, @Inject(WINDOW) window: any) {
		this.click$ = fromEvent(document, 'click');
		this.mouseDown$ = fromEvent(document, 'mousedown');
		this.mouseMove$ = fromEvent(document, 'mousemove');
		this.keyDown$ = fromEvent(document, 'keydown');
		this.keyUp$ = fromEvent(document, 'keyup');
		this.scroll$ = fromEvent(window, 'scroll');
		this.resize$ = fromEvent(window, 'resize');
	}
}
