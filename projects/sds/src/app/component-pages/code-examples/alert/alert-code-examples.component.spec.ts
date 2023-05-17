import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AlertCodeExamplesComponent} from './alert-code-examples.component';
import {IdModule} from '../../../shared/id/id.module';

describe(`${AlertCodeExamplesComponent.name}`, () => {
	let component: AlertCodeExamplesComponent;
	let fixture: ComponentFixture<AlertCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AlertCodeExamplesComponent],
			imports: [IdModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(AlertCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
