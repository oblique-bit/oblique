import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AlertCodeExamplesComponent} from './alert-code-examples.component';
import {TranslateService} from '@ngx-translate/core';
import {ObAlertComponent, ObMockTranslateService} from '@oblique/oblique';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {By} from '@angular/platform-browser';

describe(AlertCodeExamplesComponent.name, () => {
	let component: AlertCodeExamplesComponent;
	let fixture: ComponentFixture<AlertCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AlertCodeExamplesComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(AlertCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there are 8 ${ObAlertComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObAlertComponent)).length).toBe(8);
	});
});
