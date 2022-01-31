import {Component, Inject, Input, OnInit, Optional} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Observable, merge, of} from 'rxjs';
import {distinctUntilChanged, filter, map, switchMap} from 'rxjs/operators';
import {ObBreadcrumbConfig, ObIBreadcrumb, ObTBreadcrumbConfig} from './breadcrumb.model';

@Component({
	selector: 'ob-breadcrumb',
	exportAs: 'obBreadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss']
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

	constructor(
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly translateService: TranslateService,
		@Optional() @Inject(ObTBreadcrumbConfig) private readonly config: ObBreadcrumbConfig
	) {}

	ngOnInit(): void {
		const navigationEndEvents = this.router.events.pipe(
			filter(e => e instanceof NavigationEnd),
			distinctUntilChanged()
		);

		this.breadcrumbs$ = merge(of({}), navigationEndEvents, this.translateService.onLangChange).pipe(switchMap(() => this.getCrumbs(this.route.root)));
	}

	showTooltip(e: HTMLElement): boolean {
		return e.offsetWidth < e.scrollWidth;
	}

	getCrumbs(route: ActivatedRoute, crumbs: ObIBreadcrumb[] = [], currentUrl = ''): Observable<ObIBreadcrumb[]> {
		if (!route) {
			return of(crumbs);
		}

		const {path, label} = this.getBreadcrumbData(route);

		if (!path) {
			return this.getCrumbs(route.firstChild, crumbs, currentUrl);
		}

		const next = ({label, url}: ObIBreadcrumb): Observable<ObIBreadcrumb[]> =>
			this.getCrumbs(route.firstChild, label ? [...crumbs, {label, url}] : crumbs, url);
		const url = `${currentUrl}/${path}`;

		return this.createNextBreadcrumb(route, next, url, label, path.split('/'));
	}

	private createNextBreadcrumb(
		route: ActivatedRoute,
		next: ({label, url}: ObIBreadcrumb) => Observable<ObIBreadcrumb[]>,
		url: string,
		label: string,
		pathSplitter: string[]
	): Observable<ObIBreadcrumb[]> {
		if (!pathSplitter.some(s => s.startsWith(':'))) {
			const labelFromUrl = pathSplitter.map(s => this.beautify(s)).join(this.separator);
			return next({label: label ?? labelFromUrl, url});
		}

		const params = pathSplitter.filter(s => s.startsWith(':')).map(s => ({key: s, val: route.snapshot.params[s.substring(1)]}));
		const urlWithParamValues = this.applyParams(url, params);

		if (label) {
			if (label.startsWith('i18n')) {
				const beautifiedParams = params.map(({key, val}) => ({key, val: this.beautify(val)}));
				return this.translateService.get(label).pipe(
					map(l => this.applyParams(l, beautifiedParams)),
					switchMap(l => next({label: l, url: urlWithParamValues}))
				);
			}

			const labelWithParamValues = this.beautify(this.applyParams(label, params));
			return next({label: labelWithParamValues, url: urlWithParamValues});
		}

		const labelFromUrlWithParamValues = pathSplitter.map(s => this.beautify(this.applyParams(s, params))).join(this.separator);
		return next({label: labelFromUrlWithParamValues, url: urlWithParamValues});
	}

	private applyParams(source: string, params: {key: string; val: string}[]): string {
		return params.reduce((s, {key, val}) => s.replace(key, val), source);
	}

	private beautify(path: string): string {
		return this.beautifyUrls
			? path
					.split('-')
					.map(s => s.substring(0, 1).toUpperCase() + s.substring(1))
					.join(' ')
			: path;
	}

	private getBreadcrumbData(route: ActivatedRoute): {path: string; label: string} {
		const routeConfig = route?.routeConfig;
		return {
			path: routeConfig?.path,
			label: routeConfig?.data?.breadcrumb
		};
	}
}
