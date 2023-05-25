import {IdModule} from './../../../shared/id/id.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DatepickerCodeExamplesComponent} from './datepicker-code-examples.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {HighlightedCodeComponent} from '../../code-example/highlighted-code/highlighted-code.component';
import {TabComponent} from '../../tabs/tab/tab.component';
import {TabsComponent} from '../../tabs//tabs.component';

describe(DatepickerCodeExamplesComponent.name, () => {
	let component: DatepickerCodeExamplesComponent;
	let fixture: ComponentFixture<DatepickerCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DatepickerCodeExamplesComponent, CodeExampleComponent, HighlightedCodeComponent, TabsComponent, TabComponent],
			imports: [IdModule]
		}).compileComponents();

		fixture = TestBed.createComponent(DatepickerCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test('should have 1 CodeExampleComponent', () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(1);
	});
});