import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {SearchBoxResultsComponent} from 'oblique';
import {MockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {MockTranslateService} from '../_mocks/mock-translate.service';

describe('SearchBoxResultsComponent', () => {
	let component: SearchBoxResultsComponent;
	let fixture: ComponentFixture<SearchBoxResultsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				SearchBoxResultsComponent,
				MockTranslatePipe
			],
			imports: [
				RouterTestingModule
			],
			providers: [
				{provide: TranslateService, useClass: MockTranslateService}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchBoxResultsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
