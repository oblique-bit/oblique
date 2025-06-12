import {DateExampleDefaultPreviewComponent} from './previews/default/date-example-default-preview.component';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {DateCodeExamplesComponent} from './date-code-examples.component';

import {By} from '@angular/platform-browser';
import {ObMockTranslateService, WINDOW} from '@oblique/oblique';
import {TranslateService} from '@ngx-translate/core';

describe(DateCodeExamplesComponent.name, () => {
	let component: DateCodeExamplesComponent;
	let fixture: ComponentFixture<DateCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DateCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useValue: window}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(DateCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 1 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});

	test(`that there is 1 ${DateExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(DateExampleDefaultPreviewComponent)).length).toBe(1);
	});
});
