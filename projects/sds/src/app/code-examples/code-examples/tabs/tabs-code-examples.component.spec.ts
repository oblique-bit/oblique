import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {TabsCodeExamplesComponent} from './tabs-code-examples.component';
import {By} from '@angular/platform-browser';

describe(TabsCodeExamplesComponent.name, () => {
	let component: TabsCodeExamplesComponent;
	let fixture: ComponentFixture<TabsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TabsCodeExamplesComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TabsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have 3 CodeExampleComponent', () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(3);
	});
});
