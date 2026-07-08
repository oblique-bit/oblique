import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {CmsDataService} from './cms/cms-data.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {delay, of} from 'rxjs';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let cmsDataService: CmsDataService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent, RouterModule.forRoot([{path: '**', component: AppComponent}])],
			providers: [CmsDataService, provideHttpClientTesting(), provideObliqueTestingConfiguration()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

		describe('Banner', () => {
			it('should call getBanner() once', () => {
				expect(cmsDataService.getBanner).toHaveBeenCalledTimes(1);
			});

			it('should turn hasBanner to false', () => {
				expect(component.hasBanner).toEqual(false);
			});

			it('should not emit bannerData$', () => {
				let emitted = false;
				component.bannerData$.subscribe(() => {
					emitted = true;
				});
				expect(emitted).toEqual(false);
			});
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
