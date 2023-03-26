import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TestElement} from '@angular/cdk/testing';
import {BehaviorSubject, Observable, firstValueFrom, of} from 'rxjs';
import {ObIsUserLoggedInPipe} from './shared/is-user-logged-in.pipe';
import {ObServiceNavigationProfileHarness} from './profile/service-navigation-profile.harness';
import {ObServiceNavigationAuthenticationHarness} from './authentication/service-navigation-authentication.harness';
import {ObServiceNavigationMessageHarness} from './message/service-navigation-message.harness';
import {ObServiceNavigationInfoHarness} from './info/service-navigation-info.harness';
import {ObServiceNavigationApplicationsHarness} from './applications/service-navigation-applications.harness';
import {ObServiceNavigationComponent} from './service-navigation.component';
import {ObServiceNavigationHarness} from './service-navigation.harness';
import {ObServiceNavigationService} from './service-navigation.service';
import {ObEPamsEnvironment} from './service-navigation.model';
import {ObLoginState} from './service-navigation.model';

describe('ObServiceNavigationComponent', () => {
	let component: ObServiceNavigationComponent;
	let fixture: ComponentFixture<ObServiceNavigationComponent>;
	let service: ObServiceNavigationService;
	let harness: ObServiceNavigationHarness;
	const mockLoginState = new BehaviorSubject<ObLoginState>('SA');
	const mockService = {
		setUpRootUrls: jest.fn(),
		setReturnUrl: jest.fn(),
		getLoginUrl$: jest.fn().mockReturnValue(of('loginUrl')),
		getLogoutUrl$: jest.fn().mockReturnValue(of('logoutUrl')),
		getSettingsUrl$: jest.fn().mockReturnValue(of('settingsUrl')),
		getInboxMailUrl$: jest.fn().mockReturnValue(of('inboxMailUrl')),
		getUserName$: jest.fn().mockReturnValue(of('John Doe')),
		getAvatarUrl$: jest.fn().mockReturnValue(of('http://avatar-url')),
		getLoginState$: jest.fn().mockReturnValue(mockLoginState.asObservable()),
		getMessageCount$: jest.fn().mockReturnValue(of(42)),
		getApplicationsUrl$: jest.fn().mockReturnValue(of('applicationsUrl')),
		getLastUsedApplications$: jest.fn().mockReturnValue(of([{test: true}])),
		getFavoriteApplications$: jest.fn().mockReturnValue(of([{test: true}]))
	};
	const selectors = {
		auth: ObServiceNavigationAuthenticationHarness.hostSelector,
		profile: ObServiceNavigationProfileHarness.hostSelector,
		message: ObServiceNavigationMessageHarness.hostSelector,
		info: ObServiceNavigationInfoHarness.hostSelector,
		applications: ObServiceNavigationApplicationsHarness.hostSelector
	};

	beforeEach(() => {
		TestBed.overrideProvider(ObServiceNavigationService, {useValue: mockService});
		TestBed.configureTestingModule({
			declarations: [ObServiceNavigationComponent, ObIsUserLoggedInPipe]
		}).compileComponents();
	});

	beforeEach(async () => {
		fixture = TestBed.createComponent(ObServiceNavigationComponent);
		service = TestBed.inject(ObServiceNavigationService);
		component = fixture.componentInstance;
		harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationHarness);
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have "ob-service-navigation" class', async () => {
		const host = await harness.host();
		expect(await host.hasClass('ob-service-navigation')).toBe(true);
	});

	it('should call setUpRootUrls with undefined', () => {
		expect(service.setUpRootUrls).toHaveBeenCalledWith(undefined, undefined);
	});

	describe('rootUrl', () => {
		it('should be initialized to undefined', () => {
			expect(component.rootUrl).toBeUndefined();
		});

		describe('with "http://root-url/"', () => {
			beforeEach(() => {
				component.rootUrl = 'http://root-url/';
				component.ngOnInit();
			});

			it('should call "setUpRootUrls" twice', () => {
				expect(service.setUpRootUrls).toHaveBeenCalledTimes(2);
			});

			it('should call "setUpRootUrls" with "http://root-url"', () => {
				expect(service.setUpRootUrls).toHaveBeenCalledWith(undefined, 'http://root-url/');
			});
		});
	});

	describe('environment', () => {
		it('should be initialized to undefined', () => {
			expect(component.environment).toBeUndefined();
		});

		describe('with "ObEPamsEnvironment.TEST"', () => {
			beforeEach(() => {
				component.environment = ObEPamsEnvironment.TEST;
				component.ngOnInit();
			});

			it('should call "setUpRootUrls" twice', () => {
				expect(service.setUpRootUrls).toHaveBeenCalledTimes(2);
			});

			it('should call "setUpRootUrls" with "http://root-url"', () => {
				expect(service.setUpRootUrls).toHaveBeenCalledWith(ObEPamsEnvironment.TEST, undefined);
			});
		});
	});

	describe('returnUrl', () => {
		it('should be initialized to undefined', () => {
			expect(component.returnUrl).toBeUndefined();
		});

		describe('with "http://localhost/"', () => {
			beforeEach(() => {
				component.returnUrl = 'http://localhost/';
				component.ngOnChanges();
			});

			it('should call "setReturnUrl" once', () => {
				expect(service.setReturnUrl).toHaveBeenCalledTimes(1);
			});

			it('should call "setReturnUrl" with "http://localhost"', () => {
				expect(service.setReturnUrl).toHaveBeenCalledWith('http://localhost/');
			});
		});
	});

	describe('profileLinks', () => {
		it('should be initialized to an empty array', () => {
			expect(component.profileLinks).toEqual([]);
		});
	});

	describe('infoLinks', () => {
		it('should be initialized to an empty array', () => {
			expect(component.infoLinks).toEqual([]);
		});
	});

	describe('infoContact', () => {
		it('should be initialized to undefined', () => {
			expect(component.infoContact).toBeUndefined();
		});
	});

	describe('maxLastUsedApplications', () => {
		it('should be initialized to 3', () => {
			expect(component.maxLastUsedApplications).toBe(3);
		});
	});

	describe('maxFavoriteApplications', () => {
		it('should be initialized to 3', () => {
			expect(component.maxFavoriteApplications).toBe(3);
		});
	});

	describe.each([
		{property: 'loginUrl$', method: 'getLoginUrl$', emit: 'loginUrl'},
		{property: 'logoutUrl$', method: 'getLogoutUrl$', emit: 'logoutUrl'},
		{property: 'settingsUrl$', method: 'getSettingsUrl$', emit: 'settingsUrl'},
		{property: 'loginState$', method: 'getLoginState$', emit: 'SA'},
		{property: 'userName$', method: 'getUserName$', emit: 'John Doe'},
		{property: 'avatarUrl$', method: 'getAvatarUrl$', emit: 'http://avatar-url'},
		{property: 'inboxMailUrl$', method: 'getInboxMailUrl$', emit: 'inboxMailUrl'},
		{property: 'messageCount$', method: 'getMessageCount$', emit: 42},
		{property: 'applicationsUrl$', method: 'getApplicationsUrl$', emit: 'applicationsUrl'},
		{property: 'lastUsedApplications$', method: 'getLastUsedApplications$', emit: [{test: true}]},
		{property: 'favoriteApplications$', method: 'getFavoriteApplications$', emit: [{test: true}]}
	])('$method', ({property, method, emit}) => {
		it('should be an observable', () => {
			expect(component[property] instanceof Observable).toBe(true);
		});

		it(`should call "ObServiceNavigationUrlsService.${method}" once`, () => {
			expect(service[method]).toHaveBeenCalledTimes(1);
		});

		it(`should call "ObServiceNavigationUrlsService.${method}" without parameters`, () => {
			expect(service[method]).toHaveBeenCalledWith();
		});

		it(`should receive "${emit.toString()}"`, () => {
			expect(firstValueFrom(component[property])).resolves.toEqual(emit);
		});
	});

	describe('list', () => {
		let list: TestElement;
		beforeEach(async () => {
			list = await harness.getListElement();
		});

		it('should be present', () => {
			expect(list).toBeTruthy();
		});

		it('should have "ob-service-navigation-list" class', async () => {
			expect(await list.hasClass('ob-service-navigation-list')).toBe(true);
		});

		describe.each([
			{loginState: 'SA', widgets: [selectors.info, selectors.applications, selectors.auth]},
			{loginState: 'S1', widgets: [selectors.info, selectors.applications, selectors.auth]},
			{loginState: 'S2OK', widgets: [selectors.message, selectors.info, selectors.applications, selectors.profile, selectors.auth]},
			{loginState: 'S2+OK', widgets: [selectors.message, selectors.info, selectors.applications, selectors.profile, selectors.auth]},
			{loginState: 'S3OK', widgets: [selectors.message, selectors.info, selectors.applications, selectors.profile, selectors.auth]},
			{loginState: 'S3+OK', widgets: [selectors.message, selectors.info, selectors.applications, selectors.profile, selectors.auth]}
		])('loginState "$loginState"', ({loginState, widgets}) => {
			let children: TestElement[];
			beforeEach(async () => {
				mockLoginState.next(loginState as ObLoginState);
				fixture.detectChanges();
				children = await harness.getListItemElements();
			});

			it(`should have ${widgets.length} children`, () => {
				expect(children.length).toBe(widgets.length);
			});

			it.each(widgets)('"%s" should be present', async selector => {
				const index = widgets.findIndex(widget => widget === selector);
				expect(await children[index].matchesSelector(selector)).toEqual(true);
			});
		});
	});
});
