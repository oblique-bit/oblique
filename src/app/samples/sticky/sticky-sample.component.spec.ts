import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ObStickySampleComponent} from './sticky-sample.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ObliqueTestingModule} from 'oblique';

describe('StickySampleComponent', () => {
	let component: ObStickySampleComponent;
	let fixture: ComponentFixture<ObStickySampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [ObStickySampleComponent],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObStickySampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
