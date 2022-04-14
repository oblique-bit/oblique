import {Inject, Injectable, Optional} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ObIconConfig, ObTIconConfig} from './icon.model';
import {iconSet as obliqueIconSet} from '../../assets/oblique-icons';

@Injectable({
	providedIn: 'root'
})
export class ObIconService {
	constructor(
		private readonly registry: MatIconRegistry,
		private readonly domSanitizer: DomSanitizer,
		@Optional() @Inject(ObTIconConfig) private readonly config: ObIconConfig
	) {}

	registerOnAppInit(): void {
		this.getIconSets(this.config).forEach(config => this.registerSvg(config));
		this.registerFontClass(this.config?.fontClass);
	}

	registerIconSetsAsync(...urls: string[]): void {
		urls.forEach(iconSet => this.registry.addSvgIconSet(this.domSanitizer.bypassSecurityTrustResourceUrl(iconSet)));
	}

	registerIconSets(...iconSets: string[]): void {
		iconSets.forEach(iconSet => this.registry.addSvgIconSetLiteral(this.domSanitizer.bypassSecurityTrustHtml(iconSet)));
	}

	registerIconsAsync(...icons: {name: string; url: string}[]): void {
		icons.forEach(icon => this.registry.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.url)));
	}

	registerIcons(...icons: {name: string; svg: string}[]): void {
		icons.forEach(icon => this.registry.addSvgIconLiteral(icon.name, this.domSanitizer.bypassSecurityTrustHtml(icon.svg)));
	}

	private getIconSets(config: ObIconConfig): string[] {
		const iconSets = config?.additionalIcons || [];
		if (config.registerObliqueIcons) {
			iconSets.unshift(obliqueIconSet);
		}

		return iconSets;
	}

	private registerSvg(iconSet: string): void {
		this.registry.addSvgIconSetLiteral(this.domSanitizer.bypassSecurityTrustHtml(iconSet));
	}

	private registerFontClass(fontClass: string): void {
		if (fontClass) {
			this.registry.setDefaultFontSetClass(fontClass);
		}
	}
}
