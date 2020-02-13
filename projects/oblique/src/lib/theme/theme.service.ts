import {Inject, Injectable, InjectionToken, Optional, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';

export enum THEMES {
	MATERIAL = 'oblique-material',
	BOOTSTRAP = 'oblique-bootstrap'
}

export enum FONTS {
	FRUTIGER = 'frutiger',
	ROBOTO = 'roboto',
	ARIAL = 'arial'
}

export const OBLIQUE_FONT = new InjectionToken<THEMES>('OBLIQUE_FONT');

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	theme$: Observable<THEMES | string>;
	font$: Observable<FONTS>;
	private readonly mainTheme = new ReplaySubject<THEMES | string>(1);
	private readonly mainFont = new ReplaySubject<FONTS>(1);
	private readonly renderer: Renderer2;
	private readonly head: HTMLElement;
	private themeLink: HTMLElement;
	private fontLink: HTMLElement;
	private currentTheme: THEMES | string;

	constructor(
		rendererFactory: RendererFactory2,
		@Inject(DOCUMENT) document: any, // NOTE: do not set type, it will break AOT
		@Optional() @Inject(OBLIQUE_FONT) private readonly font: any
	) {
		this.head = document.head;
		this.renderer = rendererFactory.createRenderer(null, null);
	}

	setTheme(theme: THEMES | string): void {
		if (!this.themeLink) {
			this.initTheme();
		}
		this.currentTheme = theme;
		this.mainTheme.next(theme);
	}

	setFont(font: FONTS): void {
		if (!this.fontLink) {
			this.initFont();
		}
		this.mainFont.next(font);
	}

	isMaterial(): boolean {
		return this.currentTheme === THEMES.MATERIAL;
	}

	deprecated(component: string, target: string): void {
		if (this.isMaterial()) {
			console.warn(`Oblique's "${component}" should not be used with Material Design, prefer the Angular implementation:
			https://material.angular.io/components/${target}.`);
		}
	}

	setDefaultFont(): void {
		this.setFont(this.font || FONTS.FRUTIGER);
	}

	private static isInEnum(value, enumName): boolean {
		return Object.values(enumName).includes(value);
	}

	private createAndAddEmptyLink(): HTMLElement {
		const el = this.renderer.createElement('link');
		this.renderer.setAttribute(el, 'rel', 'stylesheet');
		this.renderer.setAttribute(el, 'type', 'text/css');
		const style = this.head.querySelector('style');
		this.renderer.insertBefore(this.head, el, style);
		return el;
	}

	private initTheme(): void {
		this.themeLink = this.createAndAddEmptyLink();
		this.theme$ = this.mainTheme.asObservable();
		this.theme$
			.pipe(map(theme => ThemeService.isInEnum(theme, THEMES) ? `assets/styles/css/${theme}.css` : theme))
			.subscribe(path => this.renderer.setAttribute(this.themeLink, 'href', path));
	}

	private initFont(): void {
		this.fontLink = this.createAndAddEmptyLink();
		this.font$ = this.mainFont.asObservable();
		this.font$
			.pipe(map(font => ThemeService.isInEnum(font, FONTS) ? `assets/styles/css/${font}.css` : ''))
			.subscribe((path) => this.renderer.setAttribute(this.fontLink, 'href', path));
	}
}
