import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
import {ObMasterLayoutComponentService} from './master-layout/master-layout.component.service';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObMasterLayoutService} from './master-layout.service';
import {ObMasterLayoutConfig} from './master-layout.config';
import {ObMasterLayoutNavigationService} from './master-layout-navigation/master-layout-navigation.service';
import {ObMockMasterLayoutHeaderService} from './_mocks/mock-master-layout-header.service';
import {ObMockMasterLayoutFooterService} from './_mocks/mock-master-layout-footer.service';
import {ObMockMasterLayoutNavigationService} from './_mocks/mock-master-layout-navigation.service';
import {ObMockMasterLayoutComponentService} from './_mocks/mock-master-layout.component.service';
import {ActivatedRoute, NavigationEnd, Router, RouterModule} from '@angular/router';

describe('ObMasterLayoutService', () => {
	let masterLayoutService: ObMasterLayoutService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([])],
			providers: [
				ObMasterLayoutService,
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObMasterLayoutConfig, useValue: {homePageRoute: '/home'}},
				{provide: ObMasterLayoutHeaderService, useClass: ObMockMasterLayoutHeaderService},
				{provide: ObMasterLayoutFooterService, useClass: ObMockMasterLayoutFooterService},
				{provide: ObMasterLayoutNavigationService, useClass: ObMockMasterLayoutNavigationService},
				{provide: ObMasterLayoutComponentService, useClass: ObMockMasterLayoutComponentService},
			],
		});
		masterLayoutService = TestBed.inject(ObMasterLayoutService);
	});

	it('should be created', () => {
		expect(masterLayoutService).toBeTruthy();
	});

	it('should have an homePageRoute set to "home"', () => {
		expect(masterLayoutService.homePageRoute).toBe('/home');
	});

	describe('homePageRouteChange$', () => {
		it('should be an Observable', () => {
			expect(masterLayoutService.homePageRouteChange$ instanceof Observable).toBe(true);
		});

		it('should emit the new homePageRoute when homePageRoute is set', done => {
			masterLayoutService.homePageRoute = 'test';
			masterLayoutService.homePageRouteChange$.subscribe(home => {
				expect(home).toBe('test');
				done();
			});
		});
	});

	describe('route data', () => {
		let routerEvents: Subject<NavigationEnd>;
		let routeData: Subject<Record<string, unknown>>;

		beforeEach(() => {
			TestBed.resetTestingModule();
			routerEvents = new Subject<NavigationEnd>();
			routeData = new Subject<Record<string, unknown>>();
			TestBed.configureTestingModule({
				providers: [
					ObMasterLayoutService,
					{provide: TranslateService, useClass: ObMockTranslateService},
					{provide: ObMasterLayoutConfig, useValue: {homePageRoute: '/home'}},
					{provide: ObMasterLayoutHeaderService, useClass: ObMockMasterLayoutHeaderService},
					{provide: ObMasterLayoutFooterService, useClass: ObMockMasterLayoutFooterService},
					{provide: ObMasterLayoutNavigationService, useClass: ObMockMasterLayoutNavigationService},
					{provide: ObMasterLayoutComponentService, useClass: ObMockMasterLayoutComponentService},
					{provide: Router, useValue: {events: routerEvents}},
					{provide: ActivatedRoute, useValue: {data: routeData, firstChild: undefined, outlet: 'primary'}},
				],
			});
			masterLayoutService = TestBed.inject(ObMasterLayoutService);
		});

		it('should update a changed property from route data', () => {
			routerEvents.next(new NavigationEnd(1, '/route', '/route'));
			routeData.next({masterLayout: {homePageRoute: '/route-home'}});

			expect(masterLayoutService.homePageRoute).toBe('/route-home');
		});

		it('should ignore unchanged route data properties', () => {
			const observer = jest.fn();
			masterLayoutService.homePageRouteChange$.subscribe(observer);

			routerEvents.next(new NavigationEnd(1, '/route', '/route'));
			routeData.next({masterLayout: {homePageRoute: '/home'}});

			expect(observer).toHaveBeenCalledTimes(1);
			expect(masterLayoutService.homePageRoute).toBe('/home');
		});

		it('should accept route data without master layout configuration', () => {
			routerEvents.next(new NavigationEnd(1, '/route', '/route'));

			expect(() => routeData.next({})).not.toThrow();
		});
	});
});
