import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {OffCanvasCodeExamplesComponent} from './off-canvas-code-examples.component';
import {By} from '@angular/platform-browser';
import {ObButtonDirective, ObMockTranslateService} from '@oblique/oblique';
import {TranslateService} from '@ngx-translate/core';

describe(OffCanvasCodeExamplesComponent.name, () => {
	let component: OffCanvasCodeExamplesComponent;
	let fixture: ComponentFixture<OffCanvasCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OffCanvasCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(OffCanvasCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there is 1 ${ObButtonDirective.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObButtonDirective)).length).toBe(1);
	});

	test(`that there is 1 link to stackblitz`, () => {
		expect(fixture.debugElement.queryAll(By.css('a[href*="stackblitz"]')).length).toBe(1);
	});

	test(`that there is 1 link to off-canvas`, () => {
		expect(fixture.debugElement.queryAll(By.css('a[href*="off-canvas"]')).length).toBe(1);
	});
});
