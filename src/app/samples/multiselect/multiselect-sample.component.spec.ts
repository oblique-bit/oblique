import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ObMultiselectSampleComponent} from './multiselect-sample.component';
import {ObMultiselectModule} from 'projects/oblique/src/lib/multiselect/multiselect.module';

describe('ObMultiselectSampleComponent', () => {
	let component: ObMultiselectSampleComponent;
	let fixture: ComponentFixture<ObMultiselectSampleComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ObMultiselectSampleComponent],
				imports: [FormsModule, TranslateModule.forRoot(), ObMultiselectModule]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMultiselectSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
