import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {CmsDataService} from './cms/cms-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateService} from '@ngx-translate/core';
import {delay, of} from 'rxjs';
import {WINDOW} from '@oblique/oblique';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let cmsDataService: CmsDataService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent, NoopAnimationsModule, RouterTestingModule, HttpClientTestingModule],
			providers: [
				CmsDataService,
				{
					provide: TranslateService,
					useValue: {addLangs: jest.fn(), setDefaultLang: jest.fn(), use: jest.fn(), stream: jest.fn().mockReturnValue(of(''))}
				},
				{provide: WINDOW, useValue: window}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	describe('With no banner data', () => {
		beforeEach(() => {
			cmsDataService = TestBed.inject(CmsDataService);
			jest.spyOn(cmsDataService, 'getBanner').mockReturnValue(of({data: {content: null}}));
			fixture = TestBed.createComponent(AppComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create the app', () => {
			expect(component).toBeTruthy();
		});

		it('should have one side-navigation', () => {
			expect(fixture.debugElement.queryAll(By.css('app-side-navigation')).length).toBe(1);
		});

		it('should have one router-outlet', () => {
			expect(fixture.debugElement.queryAll(By.css('router-outlet')).length).toBe(1);
		});

		describe('Translate service', () => {
			let translateService: TranslateService;

			beforeEach(() => {
				translateService = TestBed.inject(TranslateService);
			});

			it('should have english added', () => {
				expect(translateService.addLangs).toHaveBeenCalledWith(['en']);
			});

			it('should have english as default language', () => {
				expect(translateService.setDefaultLang).toHaveBeenCalledWith('en');
			});

			it('should use english', () => {
				expect(translateService.use).toHaveBeenCalledWith('en');
			});
		});

		describe('Banner', () => {
			it('should call getBanner() once', () => {
				expect(cmsDataService.getBanner).toHaveBeenCalledTimes(1);
			});

			it('should turn hasBanner to false', () => {
				expect(component.hasBanner).toEqual(false);
			});

			it('should not emit bannerData$', fakeAsync(() => {
				let emitted = false;
				component.bannerData$.subscribe(() => {
					emitted = true;
				});
				tick();
				expect(emitted).toEqual(false);
			}));
		});
	});

	describe('With banner data', () => {
		describe('Banner', () => {
			let bannerContent;
			beforeEach(done => {
				cmsDataService = TestBed.inject(CmsDataService);
				jest.spyOn(cmsDataService, 'getBanner').mockReturnValue(of({data: {content: 'anything'}}).pipe(delay(0)));
				fixture = TestBed.createComponent(AppComponent);
				component = fixture.componentInstance;
				fixture.detectChanges();
				component.bannerData$.subscribe(content => {
					bannerContent = content;
					done();
				});
			});

			it('should call getBanner() once', () => {
				expect(cmsDataService.getBanner).toHaveBeenCalledTimes(1);
			});

			it('should turn hasBanner to true', () => {
				expect(component.hasBanner).toEqual(true);
			});

			it('should emit bannerData$', () => {
				expect(bannerContent).toEqual('anything');
			});
		});
	});
});
