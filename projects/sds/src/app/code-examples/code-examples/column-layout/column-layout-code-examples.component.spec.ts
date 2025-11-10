import {CommonModule} from '@angular/common';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {ObButtonDirective, provideObliqueTestingConfiguration} from '@oblique/oblique';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ColumnLayoutCodeExamplesComponent} from './column-layout-code-examples.component';
import {By} from '@angular/platform-browser';

describe(ColumnLayoutCodeExamplesComponent.name, () => {
	let component: ColumnLayoutCodeExamplesComponent;
	let fixture: ComponentFixture<ColumnLayoutCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ColumnLayoutCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(ColumnLayoutCodeExamplesComponent);
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
});
