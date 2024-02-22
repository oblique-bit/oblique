import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {CmsDataService} from './cms/cms-data.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateService} from '@ngx-translate/core';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent, NoopAnimationsModule, RouterTestingModule, HttpClientTestingModule],
			providers: [CmsDataService, {provide: TranslateService, useValue: {addLangs: jest.fn(), setDefaultLang: jest.fn(), use: jest.fn()}}],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();

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
});
