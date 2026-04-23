import {CommonModule} from '@angular/common';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {TooltipCodeExamplesComponent} from './tooltip-code-examples.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {By} from '@angular/platform-browser';
import {TooltipExamplePositionPreviewComponent} from './previews/position/tooltip-example-position-preview.component';
import {TooltipExampleBasicPreviewComponent} from './previews/basic/tooltip-example-basic-preview.component';

describe(TooltipCodeExamplesComponent.name, () => {
	let component: TooltipCodeExamplesComponent;
	let fixture: ComponentFixture<TooltipCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TooltipCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(TooltipCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${TooltipExampleBasicPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(TooltipExampleBasicPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${TooltipExamplePositionPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(TooltipExamplePositionPreviewComponent)).length).toBe(1);
	});
});
