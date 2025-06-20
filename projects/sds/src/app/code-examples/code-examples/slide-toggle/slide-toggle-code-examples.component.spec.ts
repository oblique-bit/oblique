import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {SlideToggleCodeExamplesComponent} from './slide-toggle-code-examples.component';
import {By} from '@angular/platform-browser';
import {MatSlideToggle} from '@angular/material/slide-toggle';

describe(SlideToggleCodeExamplesComponent.name, () => {
	let component: SlideToggleCodeExamplesComponent;
	let fixture: ComponentFixture<SlideToggleCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SlideToggleCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(SlideToggleCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there are 12 ${MatSlideToggle.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatSlideToggle)).length).toBe(12);
	});
});
