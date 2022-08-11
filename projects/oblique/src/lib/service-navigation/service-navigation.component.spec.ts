import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TestElement} from '@angular/cdk/testing';
import {Observable, of} from 'rxjs';
import {ObServiceNavigationAuthenticationHarness} from './authentication/service-navigation-authentication.harness';
import {ObServiceNavigationComponent} from './service-navigation.component';
import {ObServiceNavigationHarness} from './service-navigation.harness';
import {ObServiceNavigationService} from './service-navigation.service';
import {ObEPamsEnvironment} from './service-navigation.model';

describe('ObServiceNavigationComponent', () => {
	let component: ObServiceNavigationComponent;
	let fixture: ComponentFixture<ObServiceNavigationComponent>;
	let service: ObServiceNavigationService;
	let harness: ObServiceNavigationHarness;
	const mockService = {
		setUpRootUrls: jest.fn(),
		getLoginUrl$: jest.fn().mockReturnValue(of('loginUrl'))
	};

	beforeEach(() => {
		TestBed.overrideProvider(ObServiceNavigationService, {useValue: mockService});
		TestBed.configureTestingModule({
			declarations: [ObServiceNavigationComponent]
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

	describe('loginUrl$', () => {
		it('should be an observable', () => {
			expect(component.loginUrl$ instanceof Observable).toBe(true);
		});

		it(`should call "ObServiceNavigationUrlsService.getLoginUrl$" once"`, () => {
			expect(service.getLoginUrl$).toHaveBeenCalledTimes(1);
		});

		it(`should call "ObServiceNavigationUrlsService.getLoginUrl$" without parameters"`, () => {
			expect(service.getLoginUrl$).toHaveBeenCalledWith();
		});

		it('should receive "loginUrl"', done => {
			component.loginUrl$.subscribe(data => {
				expect(data).toBe('loginUrl');
				done();
			});
		});
	});

	describe('list', () => {
		let list: TestElement;
		let children: TestElement[];
		beforeEach(async () => {
			list = await harness.getListElement();
			children = await harness.getListItemElements();
		});

		it('should be present', () => {
			expect(list).toBeTruthy();
		});

		it('should have "ob-service-navigation-list" class', async () => {
			expect(await list.hasClass('ob-service-navigation-list')).toBe(true);
		});

		it('should have 1 children', () => {
			expect(children.length).toBe(1);
		});

		it('should have authentication widget as first child', async () => {
			expect(await children[0].matchesSelector(ObServiceNavigationAuthenticationHarness.hostSelector)).toEqual(true);
		});
	});
});
