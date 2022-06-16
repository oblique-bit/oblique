import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ObMultiselectModule} from '@oblique/oblique';
import {MultiselectSampleComponent} from './multiselect-sample.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('ObMultiselectSampleComponent', () => {
	let component: MultiselectSampleComponent;
	let fixture: ComponentFixture<MultiselectSampleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [MultiselectSampleComponent],
			imports: [FormsModule, TranslateModule.forRoot(), ObMultiselectModule, HttpClientTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
