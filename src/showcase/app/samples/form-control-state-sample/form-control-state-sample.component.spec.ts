import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

import {FormControlStateSampleComponent} from './form-control-state-sample.component';
import {ObliqueModule} from '../../../../lib';
import {MockTranslatePipe} from '../../../../../testhelpers';

describe('FormControlStateSampleComponent', () => {
	let component: FormControlStateSampleComponent;
	let fixture: ComponentFixture<FormControlStateSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				FormControlStateSampleComponent,
				MockTranslatePipe
			],
			imports: [
				FormsModule,
				ObliqueModule.forRoot()
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FormControlStateSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
