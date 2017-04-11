import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiselectSampleComponent} from './multiselect-sample.component';
import {MultiselectModule} from '../../../../src';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

describe('MultiselectSampleComponent', () => {
	let component: MultiselectSampleComponent;
	let fixture: ComponentFixture<MultiselectSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MultiselectSampleComponent
			],
			imports: [
				FormsModule,
				TranslateModule.forRoot(),
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
