import {AsyncPipe} from '@angular/common';
import {Component, Input, OnInit, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ActivatedRoute, NavigationEnd, Router, RouterModule} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Observable, merge, of} from 'rxjs';
import {distinctUntilChanged, filter, map, switchMap} from 'rxjs/operators';
import {ObLocalizePipe} from '../router/ob-localize.pipe';
import {ObEllipsisTooltipDirective} from './ellipsis-tooltip.directive';
import {ObBreadcrumbConfig, ObIBreadcrumb, ObTBreadcrumbConfig} from './breadcrumb.model';

@Component({
	selector: 'ob-breadcrumb',
	imports: [
		AsyncPipe,
		MatIconModule,
		MatTooltipModule,
		ObEllipsisTooltipDirective,
		ObLocalizePipe,
		RouterModule,
		TranslateModule,
	],
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss'],
	exportAs: 'obBreadcrumb',
})
export class ObBreadcrumbComponent implements OnInit {
	/* eslint-disable @angular-eslint/no-input-rename */
	@Input('maxWidth') maxWidthInput?: string;
	@Input('parameterSeparator') separatorInput?: string;
	@Input('beautifyUrls') beautifyUrlsInput?: boolean;
	/* eslint-enable @angular-eslint/no-input-rename */

	breadcrumbs$: Observable<ObIBreadcrumb[]>;

	get maxWidth(): string | undefined {
		return this.maxWidthInput ?? this.config?.maxWidth;
	}

	private get separator(): string {
		return this.separatorInput ?? this.config?.parameterSeparator ?? '';
	}

	private get beautifyUrls(): boolean {
		return this.beautifyUrlsInput ?? this.config?.beautifyUrls ?? false;
	}
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly translateService = inject(TranslateService);
	private readonly config = inject<ObBreadcrumbConfig>(ObTBreadcrumbConfig, {optional: true});

	ngOnInit(): void {
		const navigationEndEvents = this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			distinctUntilChanged()
		);

		this.breadcrumbs$ = merge(of({}), navigationEndEvents, this.translateService.onLangChange).pipe(
			switchMap(() => this.getCrumbs(this.route.root))
		);
	}

	getCrumbs(route: ActivatedRoute, crumbs: ObIBreadcrumb[] = [], currentUrl = ''): Observable<ObIBreadcrumb[]> {
		if (!route) {
			return of(crumbs);
		}

		const {path, breadCrumbLabel} = this.getBreadcrumbData(route);

		if (!path) {
			return this.getCrumbs(route.firstChild, crumbs, currentUrl);
		}

		const next = ({label, url}: ObIBreadcrumb): Observable<ObIBreadcrumb[]> =>
			this.getCrumbs(route.firstChild, label ? [...crumbs, {label, url}] : crumbs, url);
		const url = `${currentUrl}/${path}`;

		return this.createNextBreadcrumb(route, next, url, breadCrumbLabel, path.split('/'));
	}

	private createNextBreadcrumb(
		route: ActivatedRoute,
		next: (parameters: ObIBreadcrumb) => Observable<ObIBreadcrumb[]>,
		url: string,
		label: string,
		pathSplitter: string[]
	): Observable<ObIBreadcrumb[]> {
		if (!pathSplitter.some(text => text.startsWith(':'))) {
			const labelFromUrl = pathSplitter.map(text => this.beautify(text)).join(this.separator);
			return next({label: label ?? labelFromUrl, url});
		}

		const params = pathSplitter
			.filter(text => text.startsWith(':'))
			.map(text => ({key: text, val: route.snapshot.params[text.substring(1)]}));
		const urlWithParamValues = this.applyParams(url, params, 'url');

		if (label) {
			const beautifiedParams = params.map(({key, val}) => ({key, val: this.beautify(val)}));
			return this.translateService.get(label).pipe(
				map(translatedLabel => this.applyParams(translatedLabel, beautifiedParams, 'i18n')),
				switchMap(translatedLabel => next({label: translatedLabel, url: urlWithParamValues}))
			);
		}

		const labelFromUrlWithParamValues = pathSplitter
			.map(text => this.beautify(this.applyParams(text, params, 'url')))
			.join(this.separator);
		return next({label: labelFromUrlWithParamValues, url: urlWithParamValues});
	}

	private replaceSyntax(pattern: 'url' | 'i18n', key: string): string {
		if (pattern === 'url') {
			return `:${key}`;
		}

		return `{{${key}}}`;
	}

	private applyParams(text: string, params: {key: string; val: string}[], pattern: 'url' | 'i18n'): string {
		return params.reduce((str, {key, val}) => str.replace(this.replaceSyntax(pattern, key.substring(1)), val), text);
	}

	private beautify(path: string): string {
		return this.beautifyUrls
			? path
					.split('-')
					.map(text => text.substring(0, 1).toUpperCase() + text.substring(1))
					.join(' ')
			: path;
	}

	private getBreadcrumbData(route: ActivatedRoute): {path: string; breadCrumbLabel: string} {
		const routeConfig = route?.routeConfig;
		return {
			path: routeConfig?.path,
			breadCrumbLabel: routeConfig?.data?.breadcrumb,
		};
	}
}
