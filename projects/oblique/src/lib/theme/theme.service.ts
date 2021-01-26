import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Observable, ReplaySubject} from 'rxjs';
import {map, tap} from 'rxjs/operators';

export enum THEMES {
	MATERIAL = 'oblique-material',
	BOOTSTRAP = 'oblique-bootstrap'
}

export enum FONTS {
	FRUTIGER = 'frutiger',
	ROBOTO = 'roboto',
	NONE = 'none'
}

@Injectable({
	providedIn: 'root'
})
export class ObThemeService {
	theme$: Observable<THEMES | string>;
	font$: Observable<FONTS>;
	private readonly mainTheme = new ReplaySubject<THEMES | string>(1);
	private readonly mainFont = new ReplaySubject<FONTS>(1);
	private readonly renderer: Renderer2;
	private readonly head: HTMLElement;
	private readonly warned = [];
	private themeLink: HTMLElement;
	private fontLink: HTMLElement;
	private currentTheme: THEMES | string;

	constructor(
		rendererFactory: RendererFactory2,
		@Inject(DOCUMENT) document: any // NOTE: do not set type, it will break AOT
	) {
		this.head = document.head;
		this.renderer = rendererFactory.createRenderer(null, null);
		this.theme$ = this.mainTheme.asObservable();
		this.mainTheme.next(THEMES.MATERIAL);
		this.font$ = this.mainFont.asObservable();
	}

	setTheme(theme: THEMES | string): void {
		if (!this.themeLink) {
			this.initTheme();
		}
		this.currentTheme = theme;
		this.mainTheme.next(theme);
	}

	setFont(font: FONTS): void {
		if (!this.fontLink && font !== FONTS.NONE) {
			this.initFont();
		}
		this.mainFont.next(font);
	}

	isMaterial(): boolean {
		return this.currentTheme === THEMES.MATERIAL;
	}

	deprecated(component: string, target: string): void {
		if (this.isMaterial() && !this.warned.includes(component)) {
			this.warned.push(component);
			console.warn(`Oblique's "${component}" should not be used with Material Design, prefer the Angular implementation:
			https://material.angular.io/components/${target}.`);
		}
	}

	private static isInEnum(value, enumName): boolean {
		return Object.values(enumName).includes(value);
	}

	private createAndAddEmptyLink(): HTMLElement {
		const el = this.renderer.createElement('link');
		this.renderer.setAttribute(el, 'rel', 'stylesheet');
		this.renderer.setAttribute(el, 'type', 'text/css');
		const style = this.head.querySelector('head link[rel="stylesheet"] ~ *');
		this.renderer.insertBefore(this.head, el, style);
		return el;
	}

	private initTheme(): void {
		this.themeLink = this.createAndAddEmptyLink();
		this.theme$
			.pipe(map(theme => (ObThemeService.isInEnum(theme, THEMES) ? `assets/css/${theme}.css` : theme)))
			.subscribe(path => this.renderer.setAttribute(this.themeLink, 'href', path));
	}

	private initFont(): void {
		this.fontLink = this.createAndAddEmptyLink();
		this.font$
			.pipe(
				tap(font => this.addWarning(font === FONTS.FRUTIGER)),
				map(font => ([FONTS.FRUTIGER, FONTS.ROBOTO].includes(font) ? `assets/css/${font}.css` : ''))
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
