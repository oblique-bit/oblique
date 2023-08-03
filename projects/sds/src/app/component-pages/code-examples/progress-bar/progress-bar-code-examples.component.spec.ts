import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ProgressBarCodeExamplesComponent} from './progress-bar-code-examples.component';

describe(ProgressBarCodeExamplesComponent.name, () => {
	let component: ProgressBarCodeExamplesComponent;
	let fixture: ComponentFixture<ProgressBarCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ProgressBarCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ProgressBarCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});
});
