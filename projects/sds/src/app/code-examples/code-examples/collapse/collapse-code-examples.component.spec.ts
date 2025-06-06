import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {CollapseCodeExamplesComponent} from './collapse-code-examples.component';
import {ObCollapseComponent} from '@oblique/oblique';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe(CollapseCodeExamplesComponent.name, () => {
	let component: CollapseCodeExamplesComponent;
	let fixture: ComponentFixture<CollapseCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CollapseCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent, NoopAnimationsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(CollapseCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 4 ${CodeExampleComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(4);
	});

	test(`that there are 10 ${ObCollapseComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObCollapseComponent)).length).toBe(10);
	});
});
