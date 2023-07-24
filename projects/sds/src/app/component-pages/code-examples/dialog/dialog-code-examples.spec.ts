import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DialogCodeExamplesComponent} from './dialog-code-examples.component';

describe(`${DialogCodeExamplesComponent.name}`, () => {
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

	test('should create', () => {
		expect(component).toBeTruthy();
	});
});
