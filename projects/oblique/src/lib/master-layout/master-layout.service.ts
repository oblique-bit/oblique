import {Injectable, inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {getRootRoute} from '../utilities';
import {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
import {ObMasterLayoutNavigationService} from './master-layout-navigation/master-layout-navigation.service';
import {ObMasterLayoutComponentService} from './master-layout/master-layout.component.service';
import {ObLanguageService} from '../language/language.service';
import {ObMasterLayoutConfig} from './master-layout.config';

@Injectable({providedIn: 'root'})
export class ObMasterLayoutService {
	public readonly homePageRouteChange$: Observable<string>;
	readonly header = inject(ObMasterLayoutHeaderService);
	readonly footer = inject(ObMasterLayoutFooterService);
	readonly navigation = inject(ObMasterLayoutNavigationService);
	readonly layout = inject(ObMasterLayoutComponentService);
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly config = inject(ObMasterLayoutConfig);
	private homePageRouteInternal = this.config.homePageRoute;
	private readonly homePageRouteChange = new BehaviorSubject<string>(this.config.homePageRoute);

	constructor(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		language: ObLanguageService // ObLanguageService needs to be there to be instantiated
	) {
		this.routeChange();
		this.homePageRouteChange$ = this.homePageRouteChange.asObservable();
	}

	public set homePageRoute(homePageRoute: string) {
		this.homePageRouteInternal = homePageRoute;
		this.homePageRouteChange.next(homePageRoute);
	}

	public get homePageRoute(): string {
		return this.homePageRouteInternal;
	}

	private routeChange(): void {
		this.router.events
			.pipe(
				filter(event => event instanceof NavigationEnd),
				map(() => this.activatedRoute),
				map(route => getRootRoute(route)),
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
