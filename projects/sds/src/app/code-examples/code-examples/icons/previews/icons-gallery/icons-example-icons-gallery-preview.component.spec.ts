import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {OverlayContainer} from '@angular/cdk/overlay';
import {By} from '@angular/platform-browser';
import {MatSelect} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {IdPipe} from '../../../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../../../code-example/code-example.component';
import {IconsExampleIconsGalleryPreviewComponent} from './icons-example-icons-gallery-preview.component';
import type {DebugElement} from '@angular/core';

describe(IconsExampleIconsGalleryPreviewComponent.name, () => {
	let component: IconsExampleIconsGalleryPreviewComponent;
	let fixture: ComponentFixture<IconsExampleIconsGalleryPreviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CodeExampleComponent, CommonModule, IconsExampleIconsGalleryPreviewComponent, IdPipe],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(IconsExampleIconsGalleryPreviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	describe('icons example icons gallery', () => {
		let byCategoryFilterSelect: MatSelect;
		let input: DebugElement;
		let overlayContainer: OverlayContainer;
		let overlayContainerElement: HTMLElement;
		beforeEach(() => {
			overlayContainer = TestBed.inject(OverlayContainer);
			overlayContainerElement = overlayContainer.getContainerElement();
			const selects = fixture.debugElement.queryAll(By.directive(MatSelect));
			byCategoryFilterSelect = selects.find(control => control.componentInstance.panelClass === 'by-category-filter')
				?.componentInstance as MatSelect;
			input = fixture.debugElement.query(By.css('input'));
		});

		test(`that there are 284 ${MatIcon.name}s`, () => {
			expect(fixture.debugElement.query(By.css('div.gallery')).queryAll(By.directive(MatIcon)).length).toBe(284);
		});

		test(`that there is a byCategoryFilter dropdown`, () => {
			expect(byCategoryFilterSelect).toBeTruthy();
		});

		test(`that there is a iconsFilter input`, () => {
			expect(input).toBeTruthy();
		});

		test(`that there is 104 ${MatIcon.name}s when the iconsFilter input has the value "ri"`, () => {
			input.nativeElement.value = 'ri';
			input.nativeElement.dispatchEvent(new Event('input'));
			fixture.detectChanges();
			expect(fixture.debugElement.query(By.css('div.gallery')).queryAll(By.directive(MatIcon)).length).toBe(104);
		});

		test(`that there is 10 ${MatIcon.name}s when the byCategoryFilter dropdown has the value "ACCESSIBILITY"`, () => {
			byCategoryFilterSelect.open();
			fixture.detectChanges();
			const options = overlayContainerElement.querySelectorAll<HTMLElement>('mat-option');
			options[1].click();
			fixture.detectChanges();
			expect(fixture.debugElement.query(By.css('div.gallery')).queryAll(By.directive(MatIcon)).length).toBe(10);
		});

		test(`that there is 2 ${MatIcon.name}s when the byCategoryFilter dropdown has the value "ACCESSIBILITY" and the iconsFilter input has the value "ri"`, () => {
			input.nativeElement.value = 'ri';
			input.nativeElement.dispatchEvent(new Event('input'));
			byCategoryFilterSelect.open();
			fixture.detectChanges();
			const options = overlayContainerElement.querySelectorAll<HTMLElement>('mat-option');
			options[1].click();
			fixture.detectChanges();
			expect(fixture.debugElement.query(By.css('div.gallery')).queryAll(By.directive(MatIcon)).length).toBe(8);
		});
	});
});
