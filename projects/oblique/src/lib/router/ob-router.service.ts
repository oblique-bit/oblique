import {Injectable, inject} from '@angular/core';
import {Route, Router} from '@angular/router';
import {AccessibilityStatementComponent} from '../accessibility-statement/accessibility-statement.component';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';
import {ObLanguageService} from '../language/language.service';

@Injectable({
	providedIn: 'root'
})
export class ObRouterService {
	private readonly language = inject(ObLanguageService); // needs to be injected to ensure ObLanguageService is instantiated
	private readonly router = inject(Router);
	private readonly masterLayoutConfig = inject(ObMasterLayoutConfig);

	initialize(): void {
		this.router.config.unshift(this.buildAccessibilityRoute());
	}

	private buildAccessibilityRoute(): Route {
		return {
			path: 'accessibility-statement',
			component: AccessibilityStatementComponent,
			data: this.masterLayoutConfig.showAccessibilityTitle ? {title: 'i18n.oblique.accessibility-statement.statement.title'} : undefined
		};
	}
}
