import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SearchBoxSampleComponent} from './search-box.component';

describe('SearchBoxSampleComponent', () => {
	let component: SearchBoxSampleComponent;
	let fixture: ComponentFixture<SearchBoxSampleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [SearchBoxSampleComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchBoxSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
