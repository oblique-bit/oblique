import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NumberFormatSampleComponent} from './number-format-sample.component';
import {ObliqueTestingModule} from 'projects/oblique/src/lib/oblique-testing.module';

describe('ObNumberFormatSampleComponent', () => {
	let component: NumberFormatSampleComponent;
	let fixture: ComponentFixture<NumberFormatSampleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule, ReactiveFormsModule, ObliqueTestingModule],
			declarations: [NumberFormatSampleComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NumberFormatSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
