import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TopControlComponent} from 'oblique';
import {TranslateService} from '@ngx-translate/core';
import {MockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {MockTranslateService} from '../_mocks/mock-translate.service';

describe('TopControlComponent', () => {
	let fixture: ComponentFixture<TopControlComponent>;
	let topControlComponent: TopControlComponent;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				TopControlComponent,
				MockTranslatePipe
			],
			providers: [
				{provide: TranslateService, useClass: MockTranslateService},
			]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(TopControlComponent);
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
