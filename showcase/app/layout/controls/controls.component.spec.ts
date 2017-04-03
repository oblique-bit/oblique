/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutControlsComponent} from './controls.component';
import {MockTranslatePipe} from '../../../../testhelpers';

describe('LayoutControls', () => {
	let component: LayoutControlsComponent;
	let fixture: ComponentFixture<LayoutControlsComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [LayoutControlsComponent, MockTranslatePipe]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LayoutControlsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
