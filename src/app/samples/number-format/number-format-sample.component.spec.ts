import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NumberFormatSampleComponent} from './number-format-sample.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ObliqueTestingModule} from 'oblique';

describe('NumberFormatSampleComponent', () => {
	let component: NumberFormatSampleComponent;
	let fixture: ComponentFixture<NumberFormatSampleComponent>;

	beforeEach(async(() => {
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
