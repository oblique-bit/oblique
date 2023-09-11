import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ButtonCodeExamplesComponent} from './button-code-examples.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';

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

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have 2 CodeExampleComponent', () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});
});
