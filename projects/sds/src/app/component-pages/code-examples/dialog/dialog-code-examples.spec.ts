import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DialogCodeExamplesComponent} from './dialog-code-examples.component';
import {IdModule} from '../../../shared/id/id.module';

describe(`${DialogCodeExamplesComponent.name}`, () => {
	let component: DialogCodeExamplesComponent;
	let fixture: ComponentFixture<DialogCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DialogCodeExamplesComponent],
			imports: [IdModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(DialogCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});
});
