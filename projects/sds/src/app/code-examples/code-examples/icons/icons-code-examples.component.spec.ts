import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {IconsCodeExamplesComponent} from './icons-code-examples.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {IconsExampleIconsGalleryPreviewComponent} from './previews/icons-gallery/icons-example-icons-gallery-preview.component';
import {IconsExampleFontSizePreviewComponent} from './previews/font-size/icons-example-font-size-preview.component';
import {IconsExampleDefaultPreviewComponent} from './previews/default/icons-example-default-preview.component';
import {MatIcon} from '@angular/material/icon';
import {ObMockTranslateService, WINDOW} from '@oblique/oblique';
import {TranslateService} from '@ngx-translate/core';

describe(IconsCodeExamplesComponent.name, () => {
	let component: IconsCodeExamplesComponent;
	let fixture: ComponentFixture<IconsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CodeExampleComponent, CommonModule, IconsCodeExamplesComponent, IdPipe, NoopAnimationsModule],
			providers: [
				{provide: WINDOW, useValue: window},
				{provide: TranslateService, useClass: ObMockTranslateService}
			]
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

	test(`that there is 1 ${IconsExampleIconsGalleryPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(IconsExampleIconsGalleryPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${IconsExampleFontSizePreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(IconsExampleFontSizePreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${IconsExampleDefaultPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(IconsExampleDefaultPreviewComponent)).length).toBe(1);
	});

	test(`that there are 702 ${MatIcon.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatIcon)).length).toBe(702);
	});
});
