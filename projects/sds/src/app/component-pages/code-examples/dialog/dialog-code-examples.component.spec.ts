import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DialogCodeExamplesComponent} from './dialog-code-examples.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {By} from '@angular/platform-browser';
import {DialogExampleSpinnerComponent} from './previews/spinner/dialog-example-spinner.component';
import {DialogExampleDefaultComponent} from './previews/default/dialog-example-default.component';
import {ObButtonDirective} from '@oblique/oblique';

describe(DialogCodeExamplesComponent.name, () => {
	let component: DialogCodeExamplesComponent;
	let fixture: ComponentFixture<DialogCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogCodeExamplesComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(DialogCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${DialogExampleDefaultComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(DialogExampleDefaultComponent)).length).toBe(1);
	});

	test(`that there is 1 ${DialogExampleSpinnerComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(DialogExampleSpinnerComponent)).length).toBe(1);
	});

	test(`that there are 2 ${ObButtonDirective.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObButtonDirective)).length).toBe(2);
	});

	test.each<{index: number}>([{index: 0}, {index: 1}])(`that all ${ObButtonDirective.name}s contain text "Open dialog"`, ({index}) => {
		expect(
			(fixture.debugElement.queryAll(By.directive(ObButtonDirective))[index].nativeElement as {textContent: string}).textContent
		).toContain('Open dialog');
	});
});
