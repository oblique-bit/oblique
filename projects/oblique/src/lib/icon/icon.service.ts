import {Injectable} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ObIconConfig} from './icon.model';
import {iconSet as obliqueIconSet} from '../../assets/oblique-icons';

@Injectable({
	providedIn: 'root',
})
export class ObIconService {
	constructor(
		private readonly registry: MatIconRegistry,
		private readonly domSanitizer: DomSanitizer
	) {}

	registerOnAppInit(iconConfig: ObIconConfig = {registerObliqueIcons: true}): void {
		this.getIconSets(iconConfig).forEach(config => {
			this.registerSvg(config);
		});
		this.registerFontClass(iconConfig?.fontClass);
	}

	registerIconSetsAsync(...urls: string[]): void {
		//bypassSecurityTrustHtml is not safe. Projects are responsible to ensure the SVGs they are providing are safe.
		urls.forEach(iconSet => {
			this.registry.addSvgIconSet(this.domSanitizer.bypassSecurityTrustResourceUrl(iconSet));
		});
	}

	registerIconSets(...iconSets: string[]): void {
		//bypassSecurityTrustHtml is not safe. Projects are responsible to ensure the SVGs they are providing are safe.
		iconSets.forEach(iconSet => {
			this.registry.addSvgIconSetLiteral(this.domSanitizer.bypassSecurityTrustHtml(iconSet));
		});
	}

	registerIconsAsync(...icons: {name: string; url: string}[]): void {
		//bypassSecurityTrustHtml is not safe. Projects are responsible to ensure the SVGs they are providing are safe.
		icons.forEach(icon => {
			this.registry.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.url));
		});
	}

	registerIcons(...icons: {name: string; svg: string}[]): void {
		//bypassSecurityTrustHtml is not safe. Projects are responsible to ensure the SVGs they are providing are safe.
		icons.forEach(icon => {
			this.registry.addSvgIconLiteral(icon.name, this.domSanitizer.bypassSecurityTrustHtml(icon.svg));
		});
	}

	private getIconSets(config: ObIconConfig): string[] {
		const iconSets = config?.additionalIcons || [];
		if (config.registerObliqueIcons) {
			iconSets.unshift(obliqueIconSet);
		}

		return iconSets;
	}

	private registerSvg(iconSet: string): void {
		//bypassSecurityTrustHtml is not safe. Projects are responsible to ensure the SVGs they are providing are safe.
		this.registry.addSvgIconSetLiteral(this.domSanitizer.bypassSecurityTrustHtml(iconSet));
	}

	private registerFontClass(fontClass: string): void {
		if (fontClass) {
			this.registry.setDefaultFontSetClass(fontClass);
		}
	}
}
