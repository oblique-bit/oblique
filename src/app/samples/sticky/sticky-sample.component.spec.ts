import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StickySampleComponent} from './sticky-sample.component';

describe('StickySampleComponent', () => {
	let component: StickySampleComponent;
	let fixture: ComponentFixture<StickySampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StickySampleComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StickySampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
