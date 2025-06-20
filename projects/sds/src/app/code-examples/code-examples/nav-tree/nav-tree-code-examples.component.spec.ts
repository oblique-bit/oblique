import {RouterTestingModule} from '@angular/router/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService, WINDOW} from '@oblique/oblique';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NavTreeExampleDataFromServicePreviewComponent} from './previews/data-from-service/nav-tree-example-data-from-service-preview.component';
import {NavTreeExampleFilterPreviewComponent} from './previews/filter/nav-tree-example-filter-preview.component';
import {NavTreeExampleExpandCollapsePreviewComponent} from './previews/expand-collapse/nav-tree-example-expand-collapse-preview.component';
import {NavTreeExampleDefaultPreviewComponent} from './previews/default/nav-tree-example-default-preview.component';
import {NavTreeCodeExamplesComponent} from './nav-tree-code-examples.component';

describe(NavTreeCodeExamplesComponent.name, () => {
	let component: NavTreeCodeExamplesComponent;
	let fixture: ComponentFixture<NavTreeCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NavTreeCodeExamplesComponent, RouterTestingModule, NoopAnimationsModule],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: WINDOW, useValue: window}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(NavTreeCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 5 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(5);
	});

	test(`that there is 1 ${NavTreeExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NavTreeExampleDefaultPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NavTreeExampleExpandCollapsePreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NavTreeExampleExpandCollapsePreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NavTreeExampleFilterPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NavTreeExampleFilterPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NavTreeExampleDataFromServicePreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NavTreeExampleDataFromServicePreviewComponent)).length).toBe(1);
	});
});
