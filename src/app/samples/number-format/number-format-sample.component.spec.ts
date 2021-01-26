import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ObNumberFormatSampleComponent} from './number-format-sample.component';
import {ObliqueTestingModule} from 'projects/oblique/src/lib/oblique-testing.module';

describe('ObNumberFormatSampleComponent', () => {
	let component: ObNumberFormatSampleComponent;
	let fixture: ComponentFixture<ObNumberFormatSampleComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [FormsModule, ReactiveFormsModule, ObliqueTestingModule],
				declarations: [ObNumberFormatSampleComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ObNumberFormatSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
