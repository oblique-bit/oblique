import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {IconsCodeExamplesComponent} from './icons-code-examples.component';
import {By} from '@angular/platform-browser';
import {IconsExampleIconsGalleryPreviewComponent} from './previews/icons-gallery/icons-example-icons-gallery-preview.component';
import {IconsExampleFontSizePreviewComponent} from './previews/font-size/icons-example-font-size-preview.component';
import {IconsExampleDefaultPreviewComponent} from './previews/default/icons-example-default-preview.component';
import {MatIcon} from '@angular/material/icon';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {MatSelect} from '@angular/material/select';
import {OverlayContainer} from '@angular/cdk/overlay';

describe(IconsCodeExamplesComponent.name, () => {
	let component: IconsCodeExamplesComponent;
	let fixture: ComponentFixture<IconsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CodeExampleComponent, CommonModule, IconsCodeExamplesComponent, IdPipe],
			providers: [provideObliqueTestingConfiguration()]
		}).compileComponents();

		fixture = TestBed.createComponent(IconsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 3 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(4);
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

	describe('icons example icons gallery', () => {
		let byCategoryFilterSelect;
		let input;
		let overlayContainer: OverlayContainer;
		let overlayContainerElement: HTMLElement;
		beforeEach(() => {
			overlayContainer = TestBed.inject(OverlayContainer);
			overlayContainerElement = overlayContainer.getContainerElement();
			const selects = fixture.debugElement.queryAll(By.directive(MatSelect));
			byCategoryFilterSelect = selects.find(control => control.componentInstance.panelClass === 'by-category-filter')
				?.componentInstance as MatSelect;
			input = fixture.debugElement.query(By.css('app-icons-example-icons-gallery-preview input'));
		});

		test(`that there are 279 ${MatIcon.name}s`, () => {
			expect(
				fixture.debugElement.query(By.css('app-icons-example-icons-gallery-preview div.gallery')).queryAll(By.directive(MatIcon)).length
			).toBe(279);
		});

		test(`that there is a byCategoryFilter dropdown`, () => {
			expect(byCategoryFilterSelect).toBeTruthy();
		});

		test(`that there is a iconsFilter input`, () => {
			expect(input).toBeTruthy();
		});

		test(`that there is 12 ${MatIcon.name}s when the iconsFilter input has the value "ri"`, () => {
			input.nativeElement.value = 'ri';
			input.nativeElement.dispatchEvent(new Event('input'));
			fixture.detectChanges();
			expect(
				fixture.debugElement.query(By.css('app-icons-example-icons-gallery-preview div.gallery')).queryAll(By.directive(MatIcon)).length
			).toBe(99);
		});

		test(`that there is 10 ${MatIcon.name}s when the byCategoryFilter dropdown has the value "ACCESSIBILITY"`, () => {
			byCategoryFilterSelect.open();
			fixture.detectChanges();
			const options = overlayContainerElement.querySelectorAll<HTMLElement>('mat-option');
			options[1].click();
			fixture.detectChanges();
			expect(
				fixture.debugElement.query(By.css('app-icons-example-icons-gallery-preview div.gallery')).queryAll(By.directive(MatIcon)).length
			).toBe(10);
		});

		test(`that there is 2 ${MatIcon.name}s when the byCategoryFilter dropdown has the value "ACCESSIBILITY" and the iconsFilter input has the value "ri"`, () => {
			input.nativeElement.value = 'ri';
			input.nativeElement.dispatchEvent(new Event('input'));
			byCategoryFilterSelect.open();
			fixture.detectChanges();
			const options = overlayContainerElement.querySelectorAll<HTMLElement>('mat-option');
			options[1].click();
			fixture.detectChanges();
			expect(
				fixture.debugElement.query(By.css('app-icons-example-icons-gallery-preview div.gallery')).queryAll(By.directive(MatIcon)).length
			).toBe(8);
		});
	});
});
