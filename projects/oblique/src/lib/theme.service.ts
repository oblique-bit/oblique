import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class ObThemeService {
	readonly theme: string;
	private readonly warned = [];

	constructor(@Inject(DOCUMENT) private readonly document: Document) {
		this.theme = this.getEmbeddedTheme(this.document);
	}

	deprecated(component: string, target: string): void {
		if (this.theme === 'Material' && !this.warned.includes(component)) {
			this.warned.push(component);
			console.warn(`Oblique's "${component}" should not be used with Material Design, prefer the Angular implementation:
			https://material.angular.io/components/${target}.`);
		}
	}

	private getEmbeddedTheme(document: Document): string {
		const styleSheet = Array.from(document.styleSheets).filter(sheet => /^styles\.[\w]{20}\.css$/.test(sheet.href))[0];
		const rules = Array.from(styleSheet?.cssRules || []) as CSSPageRule[];
		if (rules.some(rule => rule.selectorText === '.ob-material-telemetry')) {
			return 'Material';
		}
		if (rules.some(rule => rule.selectorText === '.ob-bootstrap-telemetry')) {
			return 'Bootstrap';
		}
		return 'Unknown';
	}
}
