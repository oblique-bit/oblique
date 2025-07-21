import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TestElement} from '@angular/cdk/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {BehaviorSubject, Observable, firstValueFrom, of} from 'rxjs';
import {ObIsUserLoggedInPipe} from './shared/is-user-logged-in.pipe';
import {ObServiceNavigationProfileHarness} from './profile/service-navigation-profile.harness';
import {ObServiceNavigationAuthenticationHarness} from './authentication/service-navigation-authentication.harness';
import {ObServiceNavigationMessageHarness} from './message/service-navigation-message.harness';
import {ObServiceNavigationInfoHarness} from './info/service-navigation-info.harness';
import {ObServiceNavigationApplicationsHarness} from './applications/service-navigation-applications.harness';
import {ObServiceNavigationLanguagesHarness} from './languages/service-navigation-languages.harness';
import {ObServiceNavigationComponent} from './service-navigation.component';
import {ObServiceNavigationHarness} from './service-navigation.harness';
import {ObServiceNavigationService} from './service-navigation.service';
import {ObEPamsEnvironment, ObLoginState} from './service-navigation.model';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

@Component({
	template: `<ob-service-navigation>
		<ng-template #customWidgetTemplate>
			<button type="button">first button</button>
		</ng-template>
		<ng-template #customWidgetTemplate>
			<button type="button">second button</button>
		</ng-template>
	</ob-service-navigation>`,
	standalone: false
})
class CustomControlsTestComponent {}

describe('ObServiceNavigationComponent', () => {
	let component: ObServiceNavigationComponent;
	let fixture: ComponentFixture<ObServiceNavigationComponent>;
	let service: ObServiceNavigationService;
	let harness: ObServiceNavigationHarness;
	const mockLoginState = new BehaviorSubject<ObLoginState>('SA');
	const mockServiceNavigationService = {
		setUpRootUrls: jest.fn(),
		setReturnUrl: jest.fn(),
		getLoginUrl$: jest.fn().mockReturnValue(of('loginUrl')),
		getProfileUrls$: jest.fn().mockReturnValue(of([{url: 'profileUrl', label: 'profile', isInternalLink: true}])),
		getInboxMailUrl$: jest.fn().mockReturnValue(of('inboxMailUrl')),
		getUserName$: jest.fn().mockReturnValue(of('John Doe')),
		getAvatarUrl$: jest.fn().mockReturnValue(of('http://avatar-url')),
		getLoginState$: jest.fn().mockReturnValue(mockLoginState.asObservable()),
		getMessageCount$: jest.fn().mockReturnValue(of(42)),
		getApplicationsUrl$: jest.fn().mockReturnValue(of('applicationsUrl')),
		getLastUsedApplications$: jest.fn().mockReturnValue(of([{test: true}])),
		getFavoriteApplications$: jest.fn().mockReturnValue(of([{test: true}])),
		getLanguage$: jest.fn().mockReturnValue(of('en')),
		getInfoBackend$: jest.fn().mockReturnValue(
			of({
				description: 'backend description text',
				helpText: 'backend help text',
				links: [{url: 'backend url link1', label: 'backend label link1'}],
				contactText: 'backend contact text',
				contact: {tel: 'backend phone', email: 'backend email', contactUrl: 'backend contactUrl'}
			})
		),
		getLanguages: jest.fn().mockReturnValue([{code: 'en', label: 'English'}]),
		setLanguage: jest.fn(),
		setPamsAppId: jest.fn(),
		logout: jest.fn(),
		getLogoutTrigger$: jest.fn(),
		setHandleLogout: jest.fn()
	};

	const selectors = {
		auth: ObServiceNavigationAuthenticationHarness.hostSelector,
		profile: ObServiceNavigationProfileHarness.hostSelector,
		message: ObServiceNavigationMessageHarness.hostSelector,
		info: ObServiceNavigationInfoHarness.hostSelector,
		applications: ObServiceNavigationApplicationsHarness.hostSelector,
		languages: ObServiceNavigationLanguagesHarness.hostSelector
	};

	beforeEach(() => {
		TestBed.overrideProvider(ObServiceNavigationService, {useValue: mockServiceNavigationService});
		TestBed.configureTestingModule({
			declarations: [ObServiceNavigationComponent, ObIsUserLoggedInPipe, CustomControlsTestComponent],
			imports: [RouterTestingModule, HttpClientTestingModule]
		}).compileComponents();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('with one language', () => {
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

		describe('useInfoBackend', () => {
			it('should be initialized to false', () => {
				expect(component.useInfoBackend).toEqual(false);
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

		describe('handleLogout setter', () => {
			it('should set the value correctly ', () => {
				const expectedResult = false;
				component.handleLogout = expectedResult;
				expect(mockServiceNavigationService.setHandleLogout).toBeCalledWith(expectedResult);
			});
		});

		describe('setPamsAppId setter', () => {
			it('should set the value correctly ', () => {
				const expectedResult = 'randomAppId';
				component.pamsAppId = expectedResult;
				component.ngOnInit();
				expect(mockServiceNavigationService.setPamsAppId).toBeCalledWith(expectedResult);
			});
		});

		describe('maxFavoriteApplications', () => {
			it('should be initialized to 3', () => {
				expect(component.maxFavoriteApplications).toBe(3);
			});
		});

		describe.each(['loginState', 'loginState$'])('%s', property => {
			it('should be an Observable', () => {
				expect(component[property] instanceof Observable).toBe(true);
			});

			it('should call "ObServiceNavigationUrlsService.getLoginState$" twice', () => {
				expect(service.getLoginState$).toHaveBeenCalledTimes(2);
			});

			it('should call "ObServiceNavigationUrlsService.getLoginState$" without parameters', () => {
				expect(service.getLoginState$).toHaveBeenCalledWith();
			});

			it(`should receive "SA"`, async () => {
				await expect(firstValueFrom(component[property])).resolves.toEqual('SA');
			});
		});

		describe.each([
			{property: 'loginUrl$', method: 'getLoginUrl$', emit: 'loginUrl'},
			{property: 'profileUrls$', method: 'getProfileUrls$', emit: [{url: 'profileUrl', label: 'profile', isInternalLink: true}]},
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

			it(`should receive "${JSON.stringify(emit)}"`, async () => {
				await expect(firstValueFrom(component[property])).resolves.toEqual(emit);
			});
		});

		describe('language$', () => {
			it('should be an observable', () => {
				expect(component.language$ instanceof Observable).toBe(true);
			});

			it('should call "ObServiceNavigationStateService.getLanguage$"', () => {
				expect(service.getLanguage$).toHaveBeenCalled();
			});

			it(`should receive "en"`, async () => {
				await expect(firstValueFrom(component.language$)).resolves.toBe('en');
			});
		});

		describe('languages', () => {
			it('should call "ObServiceNavigationStateService.getLanguages" once', () => {
				expect(service.getLanguages).toHaveBeenCalledTimes(1);
			});

			it('should receive formatted languages', () => {
				expect(component.languages).toEqual([{code: 'en', label: 'English'}]);
			});
		});

		describe('logoutClick', () => {
			beforeEach(() => {
				component.logoutClick();
			});

			it('should call "ObServiceNavigationTimeoutRedirectorService.logout" once', () => {
				expect(mockServiceNavigationService.logout).toHaveBeenCalledTimes(1);
			});
		});

		describe('changeLanguage', () => {
			beforeEach(() => {
				component.changeLanguage('fr');
			});

			it('should call setLanguage once', () => {
				expect(service.setLanguage).toHaveBeenCalledTimes(1);
			});

			it('should call setLanguage with "fr"', () => {
				expect(service.setLanguage).toHaveBeenCalledWith('fr');
			});
		});

		describe('widget visibility', () => {
			const allWidgets = [selectors.message, selectors.info, selectors.applications, selectors.profile, selectors.auth];

			describe.each([
				{property: 'displayMessage', value: false},
				{property: 'displayInfo', value: false},
				{property: 'displayApplications', value: false},
				{property: 'displayProfile', value: false},
				{property: 'displayAuthentication', value: false},
				{property: 'displayLanguages', value: true}
			])('$property', ({property, value}) => {
				it(`should be initialized to "${value}"`, () => {
					expect(component[property]).toEqual(value);
				});
			});

			describe.each([
				{loginState: 'SA', widgets: [selectors.info, selectors.applications, selectors.auth]},
				{loginState: 'S1', widgets: [selectors.info, selectors.applications, selectors.profile, selectors.auth]},
				{loginState: 'S2OK', widgets: allWidgets},
				{loginState: 'S2+OK', widgets: allWidgets},
				{loginState: 'S3OK', widgets: allWidgets},
				{loginState: 'S3+OK', widgets: allWidgets}
			])('loginState "$loginState" and all widgets', ({loginState, widgets}) => {
				let children: TestElement[];
				beforeEach(async () => {
					component.displayMessage = true;
					component.displayProfile = true;
					component.displayInfo = true;
					component.displayApplications = true;
					component.displayAuthentication = true;
					component.displayLanguages = true;
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

		describe('customControlTemplates', () => {
			let customControlFixture: ComponentFixture<CustomControlsTestComponent>;
			const allWidgets = ['button', 'button', selectors.message, selectors.info, selectors.applications, selectors.profile, selectors.auth];
			beforeEach(async () => {
				customControlFixture = TestBed.createComponent(CustomControlsTestComponent);
				customControlFixture.detectChanges();
				const loader = TestbedHarnessEnvironment.loader(customControlFixture);
				harness = await loader.getHarness(ObServiceNavigationHarness);
			});

			describe.each([
				{loginState: 'SA', widgets: ['button', 'button', selectors.info, selectors.applications, selectors.auth]},
				{loginState: 'S1', widgets: ['button', 'button', selectors.info, selectors.applications, selectors.profile, selectors.auth]},
				{loginState: 'S2OK', widgets: allWidgets},
				{loginState: 'S2+OK', widgets: allWidgets},
				{loginState: 'S3OK', widgets: allWidgets},
				{loginState: 'S3+OK', widgets: allWidgets}
			])('loginState "$loginState" and all widgets', ({loginState, widgets}) => {
				let children: TestElement[];
				beforeEach(async () => {
					const customComponent = customControlFixture.debugElement.query(By.directive(ObServiceNavigationComponent)).componentInstance;
					customComponent.displayApplications = true;
					customComponent.displayInfo = true;
					customComponent.displayProfile = true;
					customComponent.displayMessage = true;
					customComponent.displayAuthentication = true;
					customComponent.displayLanguages = true;
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

			describe('custom widgets', () => {
				let customElements: TestElement[];
				beforeEach(async () => {
					customElements = await harness.getCustomWidgets();
				});

				it('should have two custom elements', () => {
					expect(customElements.length).toBe(2);
				});

				describe.each([
					{description: 'first widget', index: 0, content: 'first button'},
					{description: 'second widget', index: 1, content: 'second button'}
				])('$description', ({index, content}) => {
					it('should be a button', async () => {
						expect(await customElements[index].matchesSelector('button')).toBe(true);
					});

					it('should be a button', async () => {
						expect(await customElements[index].text()).toBe(content);
					});
				});
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
		});

		describe('useInfoBackend', () => {
			describe('when is true', () => {
				let infoElement: TestElement;

				beforeEach(async () => {
					component.useInfoBackend = true;
					component.displayInfo = true;
					fixture.detectChanges();
					infoElement = await harness.getInfoElement();
				});

				it.each([
					{inputExpectedResult: 'backend description text', input: 'description'},
					{inputExpectedResult: 'backend contact text', input: 'contactText'},
					{inputExpectedResult: 'backend help text', input: 'helpText'},
					{
						inputExpectedResult: [{url: 'backend url link1', label: 'backend label link1'}],
						input: 'links'
					},
					{
						inputExpectedResult: {contactUrl: 'backend contactUrl', email: 'backend email', tel: 'backend phone'},
						input: 'contact'
					}
				])('should add infoBackend$.$input to ob-service-navigation-info $input input', async ({input, inputExpectedResult}) => {
					const expectedResult = inputExpectedResult;
					const property = await infoElement.getProperty(input);

					expect(property).toEqual(expectedResult);
				});
			});

			describe('when is false', () => {
				let infoElement: TestElement;

				beforeEach(async () => {
					component.useInfoBackend = false;
					component.displayInfo = true;
					component.infoDescription = 'input description text';
					component.infoContactText = 'input contact text';
					component.infoHelpText = 'input help text';
					component.infoLinks = [{url: 'input url link1', label: 'input label link1'}];
					component.infoContact = {formUrl: 'input contactUrl', email: 'input email', tel: 'input phone'};
					fixture.detectChanges();
					infoElement = await harness.getInfoElement();
				});

				it.each([
					{inputExpectedResult: 'input description text', input: 'description'},
					{inputExpectedResult: 'input contact text', input: 'contactText'},
					{inputExpectedResult: 'input help text', input: 'helpText'},
					{
						inputExpectedResult: [{url: 'input url link1', label: 'input label link1'}],
						input: 'links'
					},
					{
						inputExpectedResult: {formUrl: 'input contactUrl', email: 'input email', tel: 'input phone'},
						input: 'contact'
					}
				])('should add infoBackend$.$input to ob-service-navigation-info $input input', async ({input, inputExpectedResult}) => {
					const expectedResult = inputExpectedResult;
					const property = await infoElement.getProperty(input);

					expect(property).toEqual(expectedResult);
				});
			});
		});
	});

	describe('with two languages', () => {
		beforeEach(() => {
			mockServiceNavigationService.getLanguages = jest.fn().mockReturnValue([
				{code: 'en', label: ''},
				{code: 'fr', label: ''}
			]);
			TestBed.overrideProvider(ObServiceNavigationService, {useValue: mockServiceNavigationService});
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

		describe('list', () => {
			let list: TestElement;
			const allWidgets = [
				selectors.message,
				selectors.info,
				selectors.applications,
				selectors.profile,
				selectors.auth,
				selectors.languages
			];
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
				{loginState: 'SA', widgets: [selectors.info, selectors.applications, selectors.auth, selectors.languages]},
				{loginState: 'S1', widgets: [selectors.info, selectors.applications, selectors.profile, selectors.auth, selectors.languages]},
				{loginState: 'S2OK', widgets: allWidgets},
				{loginState: 'S2+OK', widgets: allWidgets},
				{loginState: 'S3OK', widgets: allWidgets},
				{loginState: 'S3+OK', widgets: allWidgets}
			])('loginState "$loginState"', ({loginState, widgets}) => {
				let children: TestElement[];
				beforeEach(async () => {
					component.displayApplications = true;
					component.displayInfo = true;
					component.displayProfile = true;
					component.displayMessage = true;
					component.displayAuthentication = true;
					component.displayLanguages = true;
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
});
