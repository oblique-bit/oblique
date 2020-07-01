import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMasterLayoutFooterComponent} from './master-layout-footer.component';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';

describe('MasterLayoutFooterComponent', () => {
	let component: ObMasterLayoutFooterComponent;
	let fixture: ComponentFixture<ObMasterLayoutFooterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [ObMasterLayoutFooterComponent, ObMockTranslatePipe],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMasterLayoutFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
