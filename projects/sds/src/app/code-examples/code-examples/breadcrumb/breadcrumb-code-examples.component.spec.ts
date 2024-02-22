import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {By} from '@angular/platform-browser';
import {BreadcrumbCodeExamplesComponent} from './breadcrumb-code-examples.component';
import {ObMockTranslateService} from '@oblique/oblique';
import {TranslateService} from '@ngx-translate/core';
import {BreadcrumbExampleDefaultPreviewComponent} from './previews/default/breadcrumb-example-default-preview.component';

describe(BreadcrumbCodeExamplesComponent.name, () => {
	let component: BreadcrumbCodeExamplesComponent;
	let fixture: ComponentFixture<BreadcrumbCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BreadcrumbCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(BreadcrumbCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there is 1 ${BreadcrumbExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(BreadcrumbExampleDefaultPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 link to stackblitz`, () => {
		expect(fixture.debugElement.queryAll(By.css('a[href*="stackblitz"]')).length).toBe(1);
	});
});
