import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ObBreadcrumbConfig, ObIBreadcrumb} from '../breadcrumb.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-breadcrumb',
	exportAs: 'obBreadcrumb',
	template: '',
	standalone: false
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

	showTooltip(event: HTMLElement): boolean {
		return true;
	}

	getCrumbs(route: ActivatedRoute, crumbs: ObIBreadcrumb[] = [], currentUrl = ''): Observable<ObIBreadcrumb[]> {
		return of([]);
	}
}
