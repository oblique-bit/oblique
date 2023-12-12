import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ShadowCodeExamplesComponent} from './shadow-code-examples.component';
import {By} from '@angular/platform-browser';
import {ShadowExampleShadowPreviewComponent} from './previews/shadow/shadow-example-shadow-preview.component';

describe(ShadowCodeExamplesComponent.name, () => {
	let component: ShadowCodeExamplesComponent;
	let fixture: ComponentFixture<ShadowCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ShadowCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ShadowCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there is 1 ${CodeExampleComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});

	test(`that there is 1 ${ShadowExampleShadowPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ShadowExampleShadowPreviewComponent)).length).toBe(1);
	});
});
