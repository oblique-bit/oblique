import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateService} from '@ngx-translate/core';
import {ObButtonDirective, ObMockTranslateService, WINDOW} from '@oblique/oblique';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {UnsavedChangesCodeExamplesComponent} from './unsaved-changes-code-examples.component';

describe(UnsavedChangesCodeExamplesComponent.name, () => {
	let component: UnsavedChangesCodeExamplesComponent;
	let fixture: ComponentFixture<UnsavedChangesCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UnsavedChangesCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent, NoopAnimationsModule],
			providers: [
				{provide: WINDOW, useValue: window},
				{provide: TranslateService, useClass: ObMockTranslateService}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(UnsavedChangesCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there is 1 ${CodeExampleComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});

	test(`that there is 1 ${ObButtonDirective.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObButtonDirective)).length).toBe(1);
	});

	test(`that there is 1 link to stackblitz`, () => {
		expect(fixture.debugElement.queryAll(By.css('a[href*="stackblitz"]')).length).toBe(1);
	});
});
