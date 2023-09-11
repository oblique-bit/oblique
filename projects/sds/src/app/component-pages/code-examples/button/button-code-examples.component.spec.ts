import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ButtonCodeExamplesComponent} from './button-code-examples.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ObButtonDirective} from '@oblique/oblique';

describe(`${ButtonCodeExamplesComponent.name}`, () => {
	let fixture: ComponentFixture<ButtonCodeExamplesComponent>;
	let component: ButtonCodeExamplesComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ButtonCodeExamplesComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ButtonCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there are 7 ${ObButtonDirective.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObButtonDirective)).length).toBe(7);
	});
});
