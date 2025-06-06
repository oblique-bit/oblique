import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from './../../code-example/code-example.component';
import {RxjsOperatorsCodeExamplesComponent} from './rxjs-operators-code-examples.component';
import {RxjsOperatorsExampleDefaultPreviewComponent} from './previews/default/rxjs-operators-example-default-preview.component';

describe(RxjsOperatorsCodeExamplesComponent.name, () => {
	let component: RxjsOperatorsCodeExamplesComponent;
	let fixture: ComponentFixture<RxjsOperatorsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RxjsOperatorsCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(RxjsOperatorsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there is 1 ${CodeExampleComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});

	test(`that there is 1 ${RxjsOperatorsExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(RxjsOperatorsExampleDefaultPreviewComponent)).length).toBe(1);
	});
});
