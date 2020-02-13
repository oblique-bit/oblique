import {Inject, Injectable, InjectionToken, Optional, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';

export enum THEMES {
	MATERIAL = 'oblique-material',
	BOOTSTRAP = 'oblique-bootstrap'
}

export enum FONTS {
	FRUTIGER = 'oblique-material',
	ROBOTO = 'oblique-bootstrap',
	ARIAL = 'oblique-bootstrap'
}

export const OBLIQUE_FONT = new InjectionToken<THEMES>('OBLIQUE_FONT');
export const FRUTIGER = new InjectionToken<boolean>('FRUTIGER');

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	theme$: Observable<THEMES>;
	font$: Observable<FONTS>;
	private readonly mainTheme = new ReplaySubject<THEMES>(1);
	private readonly mainFont$ = new BehaviorSubject<FONTS>(FONTS.FRUTIGER);
	private readonly renderer: Renderer2;
	private readonly head: HTMLElement;
	private themeLink: HTMLElement;
	private readonly fontLink: HTMLElement;
	private currentTheme: THEMES;
	private currentFont: FONTS;

	constructor(
		rendererFactory: RendererFactory2,
		@Inject(DOCUMENT) document: any, // NOTE: do not set type, it will break AOT
		@Optional() @Inject(OBLIQUE_FONT) private readonly font: any,
		@Optional() @Inject(FRUTIGER) private readonly frutiger
	) {
		this.head = document.head;
		this.renderer = rendererFactory.createRenderer(null, null);
		this.font$ = this.mainFont$.asObservable();
		this.fontLink = this.createAndAddEmptyLink();
		this.frutiger = this.frutiger != null ? this.frutiger : true;
	}

	setTheme(theme: THEMES): void {
		if (!this.themeLink) {
			this.initTheme();
		}
		this.currentTheme = theme;
		this.mainTheme.next(theme);
	}

	setFont(font: FONTS): void {
		this.currentFont = font;
		this.mainFont$.next(font);
	}

	// @deprecated
	setFrutiger(enabled: boolean) {
		this.setFont(enabled ? FONTS.FRUTIGER : FONTS.ROBOTO);
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

	setDefaultTheme(): void {
		this.setFont(this.font || (this.frutiger ? FONTS.FRUTIGER : FONTS.ROBOTO));
		this.font$.subscribe((newFont) => {
			switch (newFont) {
				case FONTS.FRUTIGER:
					this.renderer.setAttribute(this.fontLink, 'href', 'assets/styles/css/frutiger.css');
					break;
				case FONTS.ROBOTO:
					this.renderer.setAttribute(this.fontLink, 'href', 'assets/styles/css/roboto.css');
					break;
				default:
					this.renderer.removeAttribute(this.fontLink, 'href');
					break;
			}
		});
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
		this.theme$.subscribe(newTheme => {
			this.renderer.setAttribute(this.themeLink, 'href', `assets/styles/css/${newTheme}.css`);
		});
	}
}
