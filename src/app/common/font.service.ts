import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Observable, ReplaySubject} from 'rxjs';
import {map, tap} from 'rxjs/operators';

export enum FONTS {
	FRUTIGER = 'frutiger',
	ROBOTO = 'roboto',
	NONE = 'none'
}

@Injectable({
	providedIn: 'root'
})
export class FontService {
	font$: Observable<FONTS>;
	private readonly mainFont = new ReplaySubject<FONTS>(1);
	private readonly renderer: Renderer2;
	private readonly head: HTMLElement;
	private fontLink: HTMLElement;

	constructor(rendererFactory: RendererFactory2, @Inject(DOCUMENT) document: Document) {
		this.head = document.head;
		this.renderer = rendererFactory.createRenderer(null, null);
		this.font$ = this.mainFont.asObservable();
	}

	setFont(font: FONTS): void {
		if (!this.fontLink && font !== FONTS.NONE) {
			this.initFont();
		}
		this.mainFont.next(font);
	}

	private createAndAddEmptyLink(): HTMLElement {
		const el = this.renderer.createElement('link');
		this.renderer.setAttribute(el, 'rel', 'stylesheet');
		this.renderer.setAttribute(el, 'type', 'text/css');
		const style = this.head.querySelector('head link[rel="stylesheet"] ~ *');
		this.renderer.insertBefore(this.head, el, style);
		return el;
	}

	private initFont(): void {
		this.fontLink = this.createAndAddEmptyLink();
		this.font$
			.pipe(
				tap(font => this.addWarning(font === FONTS.FRUTIGER)),
				map(font => ([FONTS.FRUTIGER, FONTS.ROBOTO].includes(font) ? `${font}.css` : ''))
			)
			.subscribe(path => this.renderer.setAttribute(this.fontLink, 'href', path));
	}

	private addWarning(addWarning: boolean): void {
		if (addWarning) {
			this.renderer.setAttribute(
				this.fontLink,
				'onError',
				"console.warn('Please consult http://oblique.bit.admin.ch for instructions on how to install Frutiger')"
			);
		}
	}
}
