import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ObBreadcrumbConfig, ObIBreadcrumb} from '../breadcrumb.model';

@Component({
	selector: 'ob-breadcrumb',
	exportAs: 'obBreadcrumb',
	template: ''
})
export class ObMockBreadcrumbComponent {
	static DEFAULTS: ObBreadcrumbConfig = {
		maxWidth: '32ch'
	};

	@Input('maxWidth') maxWidthInput?: string;
	@Input('parameterSeparator') separatorInput?: string;
	@Input('beautifyUrls') beautifyUrlsInput?: boolean;

	get maxWidth() {
		return this.maxWidthInput ?? ObMockBreadcrumbComponent.DEFAULTS.maxWidth;
	}

	showTooltip(e: HTMLElement) {
		return true;
	}

	getCrumbs(route: ActivatedRoute, crumbs: ObIBreadcrumb[] = [], currentUrl: string = ''): Observable<ObIBreadcrumb[]> {
		return of([]);
	}
}
