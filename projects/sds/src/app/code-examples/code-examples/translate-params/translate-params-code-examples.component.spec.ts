import {CommonModule} from '@angular/common';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {TranslateParamsCodeExamplesComponent} from './translate-params-code-examples.component';

describe(TranslateParamsCodeExamplesComponent.name, () => {
	let component: TranslateParamsCodeExamplesComponent;
	let fixture: ComponentFixture<TranslateParamsCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TranslateParamsCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [provideObliqueTestingConfiguration()]
		}).compileComponents();

		fixture = TestBed.createComponent(TranslateParamsCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});
});
