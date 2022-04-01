import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {CollapseSampleComponent} from './collapse-sample.component';

describe('ObCollapseSampleComponent', () => {
	let component: CollapseSampleComponent;
	let fixture: ComponentFixture<CollapseSampleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [CollapseSampleComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CollapseSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
