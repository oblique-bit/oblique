/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {LayoutManagerSampleComponent} from './layout-manager-sample.component';
import {MockTranslatePipe} from '../../../../testhelpers/mock-translate.pipe';

describe('UILayoutSampleComponentComponent', () => {
	let component: LayoutManagerSampleComponent;
	let fixture: ComponentFixture<LayoutManagerSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LayoutManagerSampleComponent, MockTranslatePipe]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LayoutManagerSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
