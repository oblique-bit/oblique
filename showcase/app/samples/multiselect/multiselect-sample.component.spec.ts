import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiselectSampleComponent} from './multiselect-sample.component';
import {MultiselectModule} from '../../../../src';
import {FormsModule} from '@angular/forms';
import {MockTranslatePipe} from '../../../../testhelpers';

describe('MultiselectSampleComponent', () => {
	let component: MultiselectSampleComponent;
	let fixture: ComponentFixture<MultiselectSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MultiselectSampleComponent,
				MockTranslatePipe
			],
			imports: [
				FormsModule,
				MultiselectModule.forRoot()
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MultiselectSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
