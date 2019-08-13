import {Inject, Injectable, InjectionToken, Optional, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {BehaviorSubject, Observable} from 'rxjs';

export enum THEMES {
	MATERIAL = 'oblique-material',
	BOOTSTRAP = 'oblique-bootstrap'
}

export const OBLIQUE_THEME = new InjectionToken<THEMES>('OBLIQUE_THEME');
export const FRUTIGER = new InjectionToken<boolean>('FRUTIGER');

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	theme$: Observable<string>;
	private readonly mainTheme$ = new BehaviorSubject<string>(THEMES.MATERIAL);
	private readonly renderer: Renderer2;
	private readonly head: HTMLElement;
	private themeLink: HTMLElement;
	private fontLink: HTMLElement;
	private currentTheme: string;

	constructor(
		rendererFactory: RendererFactory2,
		@Inject(DOCUMENT) document: any, // NOTE: do not set type, it will break AOT
		@Optional() @Inject(OBLIQUE_THEME) private readonly theme: any, // NOTE: do not set type, it will break AOT
		@Optional() @Inject(FRUTIGER) frutiger: boolean
	) {
		this.head = document.head;
		this.renderer = rendererFactory.createRenderer(null, null);
		this.theme$ = this.mainTheme$.asObservable();
		this.addFrutiger(frutiger || true);
		this.addBlankTheme();
	}

	setTheme(theme: THEMES): void {
		this.currentTheme = theme;
		this.mainTheme$.next(theme);
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
		this.setTheme(this.theme || THEMES.MATERIAL);
		this.theme$.subscribe((newTheme) => {
			this.renderer.setAttribute(this.themeLink, 'href', `assets/styles/css/${newTheme}.css`);
		});
	}

	setFrutiger(enabled: boolean) {
		if (enabled) {
			this.renderer.setAttribute(this.fontLink, 'href', 'assets/styles/css/frutiger.css');
		} else {
			this.renderer.removeAttribute(this.fontLink, 'href');
		}
	}

	private addFrutiger(enabled: boolean): void {
		this.fontLink = this.createAndAddEmptyLink();
		this.setFrutiger(enabled);
	}

	private addBlankTheme(): void {
		this.themeLink = this.createAndAddEmptyLink();
	}

	private createAndAddEmptyLink(): HTMLElement {
		const el = this.renderer.createElement('link');
		this.renderer.setAttribute(el, 'rel', 'stylesheet');
		this.renderer.setAttribute(el, 'type', 'text/css');
		const style = this.head.querySelector('style');
		this.renderer.insertBefore(this.head, el, style);
		return el;
	}
}
