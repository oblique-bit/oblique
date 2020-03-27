import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObSearchBoxResultsComponent} from 'oblique';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';

describe('SearchBoxResultsComponent', () => {
	let component: ObSearchBoxResultsComponent;
	let fixture: ComponentFixture<ObSearchBoxResultsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObSearchBoxResultsComponent, ObMockTranslatePipe],
			imports: [RouterTestingModule],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObSearchBoxResultsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
