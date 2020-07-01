import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectSampleComponent} from './multiselect-sample.component';
import {ObMultiselectModule} from 'projects/oblique/src/lib/multiselect/multiselect.module';

describe('MultiselectSampleComponent', () => {
	let component: MultiselectSampleComponent;
	let fixture: ComponentFixture<MultiselectSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MultiselectSampleComponent],
			imports: [FormsModule, TranslateModule.forRoot(), ObMultiselectModule]
		}).compileComponents();
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
