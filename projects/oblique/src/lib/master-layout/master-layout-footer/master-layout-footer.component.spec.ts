import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';

import {MasterLayoutConfig, MasterLayoutService} from 'oblique';
import {MasterLayoutFooterComponent} from './master-layout-footer.component';
import {MockTranslatePipe, MockTranslateService} from 'tests';
import {of} from 'rxjs';

describe('MasterLayoutFooterComponent', () => {
	let component: MasterLayoutFooterComponent;
	let fixture: ComponentFixture<MasterLayoutFooterComponent>;

	const mockConfig = {footer: {}};
	const mockService = {
		footer: {
			configEvents: of({})
		}
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [MasterLayoutFooterComponent, MockTranslatePipe],
			providers: [
				{provide: MasterLayoutService, useValue: mockService},
				{ provide: TranslateService, useClass: MockTranslateService },
				{provide: MasterLayoutConfig, useValue: mockConfig}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterLayoutFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
