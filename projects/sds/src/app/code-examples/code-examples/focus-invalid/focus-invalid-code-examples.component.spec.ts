import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FocusInvalidCodeExamplesComponent} from './focus-invalid-code-examples.component';

describe(FocusInvalidCodeExamplesComponent.name, () => {
	let component: FocusInvalidCodeExamplesComponent;
	let fixture: ComponentFixture<FocusInvalidCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FocusInvalidCodeExamplesComponent, NoopAnimationsModule, TranslateModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(FocusInvalidCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test(`should have 1 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});
});
