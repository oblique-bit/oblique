import {Component, input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ObBreadcrumbConfig, ObIBreadcrumb} from '../breadcrumb.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-breadcrumb',
	template: '',
	exportAs: 'obBreadcrumb',
})
export class ObMockBreadcrumbComponent {
	static DEFAULTS: ObBreadcrumbConfig = {
		maxWidth: '32ch',
	};

	/* eslint-disable @angular-eslint/no-input-rename	*/
	readonly maxWidthInput = input<string>(undefined, {alias: 'maxWidth'});
	readonly separatorInput = input<string>(undefined, {alias: 'parameterSeparator'});
	readonly beautifyUrlsInput = input<boolean>(undefined, {alias: 'beautifyUrls'});
	/* eslint-enable @angular-eslint/no-input-rename	*/

	get maxWidth(): string {
		return this.maxWidthInput() ?? ObMockBreadcrumbComponent.DEFAULTS.maxWidth;
	}

	showTooltip(event: HTMLElement): boolean {
		return true;
	}

	getCrumbs(route: ActivatedRoute, crumbs: ObIBreadcrumb[] = [], currentUrl = ''): Observable<ObIBreadcrumb[]> {
		return of([]);
	}
}
