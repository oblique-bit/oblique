import {Injectable, inject} from '@angular/core';
import {NavigationEnd, Route, Router, Routes, UrlMatchResult, UrlSegment} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {filter} from 'rxjs';
import {AccessibilityStatementComponent} from '../accessibility-statement/accessibility-statement.component';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';
import {ObLanguageService} from '../language/language.service';
import {OB_HAS_LANGUAGE_IN_URL} from '../utilities';

@Injectable({
	providedIn: 'root',
})
export class ObRouterService {
	private readonly language = inject(ObLanguageService); // needs to be injected to ensure ObLanguageService is instantiated
	private readonly router = inject(Router);
	private readonly masterLayoutConfig = inject(ObMasterLayoutConfig);
	private readonly hasLanguageInUrl = inject(OB_HAS_LANGUAGE_IN_URL);
	private readonly translate = inject(TranslateService);

	initialize(): void {
		this.router.config.unshift(this.buildAccessibilityRoute());
		if (this.hasLanguageInUrl) {
			this.router.config = this.addLanguageRoute();
			this.updateRouteOnLanguageChange();
			this.updateLanguageOnRouteChange();
		}
	}

	private buildAccessibilityRoute(): Route {
		return {
			path: 'accessibility-statement',
			component: AccessibilityStatementComponent,
			data: this.masterLayoutConfig.showAccessibilityTitle
				? {title: 'i18n.oblique.accessibility-statement.statement.title'}
				: undefined,
		};
	}

	private addLanguageRoute(): Routes {
		return [
			{
				matcher: (url: UrlSegment[]): UrlMatchResult =>
					url.length && this.isLangSupported(url[0].path) ? {consumed: [url[0]], posParams: {lang: url[0]}} : null,
				children: this.router.config,
			},
			{path: '', redirectTo: () => ['', this.translate.getFallbackLang()].join('/')},
		];
	}

	private isLangSupported(lang: string): boolean {
		return this.translate.getLangs().includes(lang);
	}

	private updateRouteOnLanguageChange(): void {
		this.translate.onLangChange.subscribe(({lang}) => {
			const newUrl = this.router.url.split('/').filter(segment => segment);
			newUrl.splice(0, 1, lang);
			void this.router.navigate(newUrl);
		});
	}

	private updateLanguageOnRouteChange(): void {
		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(({url}) => {
			const lang = url.split('/')[1];
			if (this.isLangSupported(lang) && this.translate.getCurrentLang() !== lang) {
				this.translate.use(lang);
			}
		});
	}
}
