import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {IconsCodeExamplesComponent} from './icons-code-examples.component';
import {By} from '@angular/platform-browser';
import {IconsExampleFontSizePreviewComponent} from './previews/font-size/icons-example-font-size-preview.component';
import {IconsExampleDefaultPreviewComponent} from './previews/default/icons-example-default-preview.component';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';

describe(IconsCodeExamplesComponent.name, () => {
	let component: IconsCodeExamplesComponent;
	let fixture: ComponentFixture<IconsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CodeExampleComponent, CommonModule, IconsCodeExamplesComponent, IdPipe],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(IconsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 3 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(3);
	});

	test(`that there is 1 ${IconsExampleFontSizePreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(IconsExampleFontSizePreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${IconsExampleDefaultPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(IconsExampleDefaultPreviewComponent)).length).toBe(1);
	});
});
