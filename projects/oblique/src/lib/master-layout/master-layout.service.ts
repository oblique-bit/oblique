import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, takeUntil} from 'rxjs/operators';

import {ObUnsubscribable} from '../unsubscribe.class';
import {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
import {ObMasterLayoutNavigationService} from './master-layout-navigation/master-layout-navigation.service';
import {ObMasterLayoutComponentService} from './master-layout/master-layout.component.service';
import {ObLanguageService} from '../language/language.service';

@Injectable({providedIn: 'root'})
export class ObMasterLayoutService extends ObUnsubscribable {
	constructor(
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
		public readonly header: ObMasterLayoutHeaderService,
		public readonly footer: ObMasterLayoutFooterService,
		public readonly navigation: ObMasterLayoutNavigationService,
		public readonly layout: ObMasterLayoutComponentService,
		language: ObLanguageService // ObLanguageService needs to be there to be instantiated
	) {
		super();
		this.routeChange();
	}

	private routeChange(): void {
		this.router.events
			.pipe(
				takeUntil(this.unsubscribe),
				filter(event => event instanceof NavigationEnd),
				map(() => this.activatedRoute),
				map(route => {
					while (route.firstChild) {
						route = route.firstChild;
					}
					return route;
				}),
				filter(route => route.outlet === 'primary'),
				mergeMap(route => route.data)
			)
			.subscribe(data => {
				const masterLayout = data.masterLayout || {};
				Object.keys(masterLayout).forEach((property: string) => {
					if (masterLayout[property] !== this[property]) {
						this[property] = masterLayout[property];
					}
				});
			});
	}
}
