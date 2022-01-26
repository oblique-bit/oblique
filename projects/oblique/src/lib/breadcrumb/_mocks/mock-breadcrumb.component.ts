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

	/* eslint-disable @angular-eslint/no-input-rename	*/
	@Input('maxWidth') maxWidthInput?: string;
	@Input('parameterSeparator') separatorInput?: string;
	@Input('beautifyUrls') beautifyUrlsInput?: boolean;
	/* eslint-enable @angular-eslint/no-input-rename	*/

	get maxWidth(): string {
		return this.maxWidthInput ?? ObMockBreadcrumbComponent.DEFAULTS.maxWidth;
	}

	showTooltip(e: HTMLElement): boolean {
		return true;
	}

	getCrumbs(route: ActivatedRoute, crumbs: ObIBreadcrumb[] = [], currentUrl = ''): Observable<ObIBreadcrumb[]> {
		return of([]);
	}
}
