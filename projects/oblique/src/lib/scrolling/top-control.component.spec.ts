import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ObTopControlComponent} from 'oblique';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {windowProvider, WINDOW} from '../utilities';

describe('TopControlComponent', () => {
	let fixture: ComponentFixture<ObTopControlComponent>;
	let topControlComponent: ObTopControlComponent;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObTopControlComponent, ObMockTranslatePipe],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useValue: windowProvider}
			]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(ObTopControlComponent);
		topControlComponent = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', async(() => {
		expect(topControlComponent).toBeTruthy();
	}));

	it('should scrollTop', () => {
		const spy = jest.spyOn(topControlComponent, 'scrollTop');
		topControlComponent.scrollTop();
		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
	});
});
