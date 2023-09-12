import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BadgeCodeExamplesComponent} from './badge-code-examples.component';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {By} from '@angular/platform-browser';
import {BadgeExampleColorsComponent} from './previews/colors/badge-example-colors.component';
import {BadgeExampleOtherOptionsComponent} from './previews/other-options/badge-example-other-options.component';
import {MatBadge} from '@angular/material/badge';

describe(BadgeCodeExamplesComponent.name, () => {
	let component: BadgeCodeExamplesComponent;
	let fixture: ComponentFixture<BadgeCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IdPipe, BadgeCodeExamplesComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(BadgeCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${BadgeExampleColorsComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(BadgeExampleColorsComponent)).length).toBe(1);
	});

	test(`that there is 1 ${BadgeExampleOtherOptionsComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(BadgeExampleOtherOptionsComponent)).length).toBe(1);
	});

	test(`that there are 11 ${MatBadge.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatBadge)).length).toBe(11);
	});
});
