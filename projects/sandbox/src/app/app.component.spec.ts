import {TestBed} from '@angular/core/testing';
import {NavigationEnd, Router} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AppComponent} from './app.component';
import {provideNativeDateAdapter} from '@angular/material/core';
import {
	type ObINavigationLink,
	ObMasterLayoutHeaderService,
	WINDOW,
	provideObliqueTestingConfiguration,
} from '@oblique/oblique';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

describe('AppComponent', () => {
	let routerEvents: Subject<NavigationEnd>;
	let router: {config: unknown[]; events: Subject<NavigationEnd>; navigateByUrl: jest.Mock};

	beforeEach(async () => {
		routerEvents = new Subject<NavigationEnd>();
		router = {
			config: [],
			events: routerEvents,
			navigateByUrl: jest.fn().mockResolvedValue(true),
		};
		await TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [TranslatePipe],
			providers: [
				provideNativeDateAdapter(),
				provideObliqueTestingConfiguration(),
				{provide: Router, useValue: router},
				{provide: WINDOW, useValue: window},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});

	it('should update navigation from the dynamic navigation service', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance as AppComponent;
		const navigation: ObINavigationLink[] = [{label: 'Additional link'}];

		app.nav.addLink(navigation[0]);

		expect(app.navigation).toContainEqual({label: 'Additional link', removable: true});
	});

	it('should delegate navigation updates to the dynamic navigation service', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance as AppComponent;
		const navigation: ObINavigationLink[] = [{label: 'Updated link'}];
		jest.spyOn(app.nav, 'setNavigation');

		app.updateNavigation(navigation);

		expect(app.nav.setNavigation).toHaveBeenCalledWith(navigation);
	});

	it('should update the service navigation return url after navigation ends', () => {
		TestBed.createComponent(AppComponent);
		const header = TestBed.inject(ObMasterLayoutHeaderService);

		routerEvents.next(new NavigationEnd(1, '/current', '/current'));

		expect(header.serviceNavigationConfiguration.returnUrl).toBe(window.location.href);
	});

	it('should expose translated autocomplete items', done => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance as AppComponent;

		app.autocompleteItems$.subscribe(items => {
			expect(items).toContainEqual({label: 'Autocomplete', disabled: false});
			done();
		});
	});

	it('should navigate to the selected autocomplete item', () => {
		jest.useFakeTimers();
		const translate = TestBed.inject(TranslateService);
		jest.spyOn(translate, 'getCurrentLang').mockReturnValue('en');
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance as AppComponent;

		app.search.setValue('Autocomplete');
		jest.advanceTimersByTime(1);

		expect(router.navigateByUrl).toHaveBeenCalledWith('/en/samples/autocomplete');
		jest.useRealTimers();
	});

	it('should stop reacting to search changes after destruction', () => {
		jest.useFakeTimers();
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance as AppComponent;

		app.ngOnDestroy();
		app.search.setValue('Autocomplete');
		jest.advanceTimersByTime(1);

		expect(router.navigateByUrl).not.toHaveBeenCalled();
		jest.useRealTimers();
	});
});
