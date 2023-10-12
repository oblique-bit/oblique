import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {PublicScssVariablesAndMixinsCodeExamplesComponent} from './public-scss-variables-and-mixins-code-examples.component';

describe(PublicScssVariablesAndMixinsCodeExamplesComponent.name, () => {
	let component: PublicScssVariablesAndMixinsCodeExamplesComponent;
	let fixture: ComponentFixture<PublicScssVariablesAndMixinsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PublicScssVariablesAndMixinsCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(PublicScssVariablesAndMixinsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});
});
