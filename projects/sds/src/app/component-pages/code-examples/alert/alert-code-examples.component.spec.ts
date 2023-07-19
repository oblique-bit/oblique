import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AlertCodeExamplesComponent} from './alert-code-examples.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from '@oblique/oblique';
import {CommonModule} from '@angular/common';

describe(`${AlertCodeExamplesComponent.name}`, () => {
	let component: AlertCodeExamplesComponent;
	let fixture: ComponentFixture<AlertCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IdPipe, AlertCodeExamplesComponent, CommonModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(AlertCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
