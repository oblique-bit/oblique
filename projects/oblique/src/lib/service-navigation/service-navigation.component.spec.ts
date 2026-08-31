import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TestElement} from '@angular/cdk/testing';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
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
import {RouterModule} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';

@Component({
	standalone: false,
	template: `<ob-service-navigation
		[displayApplications]="displayApplications"
		[displayInfo]="displayInfo"
		[displayProfile]="displayProfile"
		[displayMessage]="displayMessage"
		[displayAuthentication]="displayAuthentication"
		[displayLanguages]="displayLanguages"
	>
		<ng-template #customWidgetTemplate>
			<button type="button">first button</button>
		</ng-template>
		<ng-template #customWidgetTemplate>
			<button type="button">second button</button>
		</ng-template>
	</ob-service-navigation>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class CustomControlsTestComponent {
	displayApplications = true;
	displayInfo = true;
	displayProfile = true;
	displayMessage = true;
	displayAuthentication = true;
	displayLanguages = true;
}

describe('ObServiceNavigationComponent', () => {
	let component: ObServiceNavigationComponent;
	let fixture: ComponentFixture<ObServiceNavigationComponent>;
	let service: ObServiceNavigationService;
	let harness: ObServiceNavigationHarness;
	const mockServiceNavigationService = {
		setUpRootUrls: jest.fn(),
		connectReturnUrl: jest.fn(),
		loginUrl: signal('loginUrl'),
		profileUrls: signal([{url: 'profileUrl', label: 'profile', isInternalLink: true}]),
		inboxMailUrl: signal('inboxMailUrl'),
		userName: signal('John Doe'),
		loginState: signal<ObLoginState>('SA'),
		messageCount: signal(42),
		applicationsUrl: signal('applicationsUrl'),
		lastUsedApplications: signal([{test: true}]),
		favoriteApplications: signal([{test: true}]),
		language: signal('en'),
		infoBackend: signal({
			description: 'backend description text',
			helpText: 'backend help text',
			links: [{url: 'backend url link1', label: 'backend label link1'}],
			contactText: 'backend contact text',
			contact: {tel: 'backend phone', email: 'backend email', contactUrl: 'backend contactUrl'},
		}),
		languages: signal([{code: 'en', label: 'English'}]),
		setLanguage: jest.fn(),
		setPamsAppId: jest.fn(),
		setFavoriteApplicationsCount: jest.fn(),
		logout: jest.fn(),
		getLogoutTrigger$: jest.fn(),
		setEportalLanguageSynchronization: jest.fn(),
		setHandleLogout: jest.fn(),
	};

	const selectors = {
		auth: ObServiceNavigationAuthenticationHarness.hostSelector,
		profile: ObServiceNavigationProfileHarness.hostSelector,
		message: ObServiceNavigationMessageHarness.hostSelector,
		info: ObServiceNavigationInfoHarness.hostSelector,
		applications: ObServiceNavigationApplicationsHarness.hostSelector,
		languages: ObServiceNavigationLanguagesHarness.hostSelector,
	};

	beforeEach(async () => {
		TestBed.overrideProvider(ObServiceNavigationService, {useValue: mockServiceNavigationService});
		await TestBed.configureTestingModule({
			declarations: [ObServiceNavigationComponent, ObIsUserLoggedInPipe, CustomControlsTestComponent],
			imports: [RouterModule, HttpClientTestingModule],
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
				expect(component.rootUrl()).toBeUndefined();
			});

			describe('with "http://root-url/"', () => {
				beforeEach(() => {
					fixture.componentRef.setInput('rootUrl', 'http://root-url/');
					fixture.componentRef.changeDetectorRef.detectChanges();
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
				expect(component.environment()).toBeUndefined();
			});

			describe('with "ObEPamsEnvironment.TEST"', () => {
				beforeEach(() => {
					fixture.componentRef.setInput('environment', ObEPamsEnvironment.TEST);
					fixture.componentRef.changeDetectorRef.detectChanges();
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
				expect(component.returnUrl()).toBeUndefined();
			});

			describe('with "http://localhost/"', () => {
				beforeEach(() => {
					fixture.componentRef.setInput('returnUrl', 'http://localhost/');
					fixture.componentRef.changeDetectorRef.detectChanges();
				});

				it('should call "connectReturnUrl" with the returnUrl signal', () => {
					expect(service.connectReturnUrl).toHaveBeenCalledWith(component.returnUrl);
				});
			});
		});

		describe('profileLinks', () => {
			it('should be initialized to an empty array', () => {
				expect(component.profileLinks()).toEqual([]);
			});
		});

		describe('infoLinks', () => {
			it('should be initialized to an empty array', () => {
				expect(component.infoLinks()).toEqual([]);
			});
		});

		describe('useInfoBackend', () => {
			it('should be initialized to false', () => {
				expect(component.useInfoBackend()).toEqual(false);
			});
		});

		describe('infoContact', () => {
			it('should be initialized to undefined', () => {
				expect(component.infoContact()).toBeUndefined();
			});
		});

		describe('eportalLanguageSynchronization setter', () => {
			it('should set the value correctly ', () => {
				const expectedResult = true;
				fixture.componentRef.setInput('eportalLanguageSynchronization', expectedResult);
				fixture.componentRef.changeDetectorRef.detectChanges();
				expect(mockServiceNavigationService.setEportalLanguageSynchronization).toHaveBeenCalledWith(expectedResult);
			});
		});

		describe('handleLogout setter', () => {
			it('should set the value correctly ', () => {
				const expectedResult = false;
				fixture.componentRef.setInput('handleLogout', expectedResult);
				fixture.componentRef.changeDetectorRef.detectChanges();
				expect(mockServiceNavigationService.setHandleLogout).toHaveBeenCalledWith(expectedResult);
			});
		});

		describe('setPamsAppId setter', () => {
			it('should set the value correctly ', () => {
				const expectedResult = 'randomAppId';
				fixture.componentRef.setInput('pamsAppId', expectedResult);
				fixture.componentRef.changeDetectorRef.detectChanges();
				component.ngOnInit();
				expect(mockServiceNavigationService.setPamsAppId).toHaveBeenCalledWith(expectedResult);
			});
		});

		describe('setFavoriteApplicationsCount setter', () => {
			it('should set the value correctly ', () => {
				const expectedResult = 7;
				fixture.componentRef.setInput('maxFavoriteApplications', expectedResult);
				fixture.componentRef.changeDetectorRef.detectChanges();
				component.ngOnInit();
				expect(mockServiceNavigationService.setFavoriteApplicationsCount).toHaveBeenCalledWith(expectedResult);
			});
		});

		describe('maxFavoriteApplications', () => {
			it('should be initialized to 8', () => {
				expect(component.maxFavoriteApplications()).toBe(8);
			});
		});

		describe('loginState', () => {
			it('should be a signal', () => {
				// eslint-disable-next-line @angular-eslint/no-uncalled-signals -- checking the signal reference type
				expect(typeof component.loginState).toBe('function');
			});

			it(`should receive "SA"`, () => {
				expect(component.loginState()).toEqual('SA');
			});
		});

		describe('loginStateChange', () => {
			it('should be an output', () => {
				expect(typeof component.loginStateChange.subscribe).toBe('function');
			});

			it(`should emit "SA"`, () => {
				const emitted: ObLoginState[] = [];
				component.loginStateChange.subscribe(value => emitted.push(value));
				expect(emitted).toEqual(['SA']);
			});

			it('should emit undefined when loginState is undefined', () => {
				const emitted: (ObLoginState | undefined)[] = [];
				component.loginStateChange.subscribe(value => emitted.push(value));
				mockServiceNavigationService.loginState.set(undefined as unknown as ObLoginState);
				TestBed.flushEffects();
				expect(emitted).toEqual(['SA', undefined]);
			});
		});

		describe.each([
			{property: 'loginUrl', emit: 'loginUrl'},
			{
				property: 'profileUrls',
				emit: [{url: 'profileUrl', label: 'profile', isInternalLink: true}],
			},
			{property: 'userName', emit: 'John Doe'},
			{property: 'inboxMailUrl', emit: 'inboxMailUrl'},
			{property: 'messageCount', emit: 42},
			{property: 'applicationsUrl', emit: 'applicationsUrl'},
			{property: 'lastUsedApplications', emit: [{test: true}]},
			{property: 'favoriteApplications', emit: [{test: true}]},
		])('$property', ({property, emit}) => {
			it('should be a signal', () => {
				expect(typeof component[property]).toBe('function');
			});

			it(`should receive "${JSON.stringify(emit)}"`, () => {
				expect(component[property]()).toEqual(emit);
			});
		});

		describe('language', () => {
			it('should be a signal', () => {
				// eslint-disable-next-line @angular-eslint/no-uncalled-signals -- checking the signal reference type
				expect(typeof component.language).toBe('function');
			});

			it(`should receive "en"`, () => {
				expect(component.language()).toBe('en');
			});
		});

		describe('languages', () => {
			it('should be a signal', () => {
				// eslint-disable-next-line @angular-eslint/no-uncalled-signals -- checking the signal reference type
				expect(typeof component.languages).toBe('function');
			});

			it('should receive formatted languages', () => {
				expect(component.languages()).toEqual([{code: 'en', label: 'English'}]);
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
				{property: 'displayLanguages', value: true},
			])('$property', ({property, value}) => {
				it(`should be initialized to "${value}"`, () => {
					expect(component[property]()).toEqual(value);
				});
			});

			describe.each([
				{loginState: 'SA', widgets: [selectors.info, selectors.applications, selectors.auth]},
				{loginState: 'S1', widgets: [selectors.info, selectors.applications, selectors.auth]},
				{loginState: 'S2OK', widgets: allWidgets},
				{loginState: 'S2+OK', widgets: allWidgets},
				{loginState: 'S3OK', widgets: allWidgets},
				{loginState: 'S3+OK', widgets: allWidgets},
			])('loginState "$loginState" and all widgets', ({loginState, widgets}) => {
				let children: TestElement[];
				beforeEach(async () => {
					fixture.componentRef.setInput('displayMessage', true);
					fixture.componentRef.setInput('displayProfile', true);
					fixture.componentRef.setInput('displayInfo', true);
					fixture.componentRef.setInput('displayApplications', true);
					fixture.componentRef.setInput('displayAuthentication', true);
					fixture.componentRef.setInput('displayLanguages', true);
					mockServiceNavigationService.loginState.set(loginState as ObLoginState);
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
			const allWidgets = [
				'button',
				'button',
				selectors.message,
				selectors.info,
				selectors.applications,
				selectors.profile,
				selectors.auth,
			];
			beforeEach(async () => {
				customControlFixture = TestBed.createComponent(CustomControlsTestComponent);
				customControlFixture.detectChanges();
				const loader = TestbedHarnessEnvironment.loader(customControlFixture);
				harness = await loader.getHarness(ObServiceNavigationHarness);
			});

			describe.each([
				{loginState: 'SA', widgets: ['button', 'button', selectors.info, selectors.applications, selectors.auth]},
				{loginState: 'S1', widgets: ['button', 'button', selectors.info, selectors.applications, selectors.auth]},
				{loginState: 'S2OK', widgets: allWidgets},
				{loginState: 'S2+OK', widgets: allWidgets},
				{loginState: 'S3OK', widgets: allWidgets},
				{loginState: 'S3+OK', widgets: allWidgets},
			])('loginState "$loginState" and all widgets', ({loginState, widgets}) => {
				let children: TestElement[];
				beforeEach(async () => {
					mockServiceNavigationService.loginState.set(loginState as ObLoginState);
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
					{description: 'second widget', index: 1, content: 'second button'},
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
					fixture.componentRef.setInput('useInfoBackend', true);
					fixture.componentRef.setInput('displayInfo', true);
					fixture.componentRef.changeDetectorRef.detectChanges();
					infoElement = await harness.getInfoElement();
				});

				it.each([
					{inputExpectedResult: 'backend description text', input: 'description'},
					{inputExpectedResult: 'backend contact text', input: 'contactText'},
					{inputExpectedResult: 'backend help text', input: 'helpText'},
					{
						inputExpectedResult: [{url: 'backend url link1', label: 'backend label link1'}],
						input: 'links',
					},
					{
						inputExpectedResult: {contactUrl: 'backend contactUrl', email: 'backend email', tel: 'backend phone'},
						input: 'contact',
					},
				])(
					'should add infoBackend.$input to ob-service-navigation-info $input input',
					async ({input, inputExpectedResult}) => {
						const expectedResult = inputExpectedResult;
						const property = await infoElement.getProperty(input);

						expect(property).toEqual(expectedResult);
					}
				);
			});

			describe('when is false', () => {
				let infoElement: TestElement;

				beforeEach(async () => {
					fixture.componentRef.setInput('useInfoBackend', false);
					fixture.componentRef.setInput('displayInfo', true);
					fixture.componentRef.setInput('infoDescription', 'input description text');
					fixture.componentRef.setInput('infoContactText', 'input contact text');
					fixture.componentRef.setInput('infoHelpText', 'input help text');
					fixture.componentRef.setInput('infoLinks', [{url: 'input url link1', label: 'input label link1'}]);
					fixture.componentRef.setInput('infoContact', {
						formUrl: 'input contactUrl',
						email: 'input email',
						phone: 'input phone',
					});
					fixture.componentRef.changeDetectorRef.detectChanges();
					infoElement = await harness.getInfoElement();
				});

				it.each([
					{inputExpectedResult: 'input description text', input: 'description'},
					{inputExpectedResult: 'input contact text', input: 'contactText'},
					{inputExpectedResult: 'input help text', input: 'helpText'},
					{
						inputExpectedResult: [{url: 'input url link1', label: 'input label link1'}],
						input: 'links',
					},
					{
						inputExpectedResult: {formUrl: 'input contactUrl', email: 'input email', phone: 'input phone'},
						input: 'contact',
					},
				])(
					'should add infoBackend.$input to ob-service-navigation-info $input input',
					async ({input, inputExpectedResult}) => {
						const expectedResult = inputExpectedResult;
						const property = await infoElement.getProperty(input);

						expect(property).toEqual(expectedResult);
					}
				);
			});

			describe('when the backend has not loaded yet', () => {
				beforeEach(() => {
					mockServiceNavigationService.infoBackend.set({});
					fixture.componentRef.setInput('useInfoBackend', true);
					fixture.componentRef.setInput('infoDescription', 'input description text');
					fixture.componentRef.setInput('infoContactText', 'input contact text');
					fixture.componentRef.setInput('infoHelpText', 'input help text');
					fixture.componentRef.setInput('infoLinks', [{url: 'input url link1', label: 'input label link1'}]);
					fixture.componentRef.setInput('infoContact', {
						formUrl: 'input contactUrl',
						email: 'input email',
						phone: 'input phone',
					});
					fixture.componentRef.changeDetectorRef.detectChanges();
				});

				it('should fall back to the configured inputs for every field', () => {
					expect(component.effectiveInfo()).toEqual({
						description: 'input description text',
						contactText: 'input contact text',
						helpText: 'input help text',
						links: [{url: 'input url link1', label: 'input label link1'}],
						contact: {formUrl: 'input contactUrl', email: 'input email', phone: 'input phone'},
					});
				});
			});

			describe('when the backend is partially loaded', () => {
				beforeEach(() => {
					mockServiceNavigationService.infoBackend.set({description: 'backend description text'});
					fixture.componentRef.setInput('useInfoBackend', true);
					fixture.componentRef.setInput('infoDescription', 'input description text');
					fixture.componentRef.setInput('infoContactText', 'input contact text');
					fixture.componentRef.setInput('infoHelpText', 'input help text');
					fixture.componentRef.setInput('infoLinks', [{url: 'input url link1', label: 'input label link1'}]);
					fixture.componentRef.setInput('infoContact', {
						formUrl: 'input contactUrl',
						email: 'input email',
						phone: 'input phone',
					});
					fixture.componentRef.changeDetectorRef.detectChanges();
				});

				it('should use the backend field where defined and fall back to the input otherwise', () => {
					expect(component.effectiveInfo()).toEqual({
						description: 'backend description text',
						contactText: 'input contact text',
						helpText: 'input help text',
						links: [{url: 'input url link1', label: 'input label link1'}],
						contact: {formUrl: 'input contactUrl', email: 'input email', phone: 'input phone'},
					});
				});
			});
		});
	});

	describe('with two languages', () => {
		beforeEach(() => {
			mockServiceNavigationService.languages.set([
				{code: 'en', label: ''},
				{code: 'fr', label: ''},
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
				selectors.languages,
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
				{loginState: 'S1', widgets: [selectors.info, selectors.applications, selectors.auth, selectors.languages]},
				{loginState: 'S2OK', widgets: allWidgets},
				{loginState: 'S2+OK', widgets: allWidgets},
				{loginState: 'S3OK', widgets: allWidgets},
				{loginState: 'S3+OK', widgets: allWidgets},
			])('loginState "$loginState"', ({loginState, widgets}) => {
				let children: TestElement[];
				beforeEach(async () => {
					fixture.componentRef.setInput('displayApplications', true);
					fixture.componentRef.setInput('displayInfo', true);
					fixture.componentRef.setInput('displayProfile', true);
					fixture.componentRef.setInput('displayMessage', true);
					fixture.componentRef.setInput('displayAuthentication', true);
					fixture.componentRef.setInput('displayLanguages', true);
					mockServiceNavigationService.loginState.set(loginState as ObLoginState);
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
