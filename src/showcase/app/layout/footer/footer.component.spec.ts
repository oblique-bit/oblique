/* tslint:disable:no-unused-variable */
import {RouterModule} from '@angular/router';

import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {LayoutFooterComponent} from './footer.component';
import {MockTranslatePipe} from '../../../../testhelpers';

describe('LayoutFooter', () => {

	let component: LayoutFooterComponent;
	let fixture: ComponentFixture<LayoutFooterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterModule
			],
			providers: [],
			declarations: [LayoutFooterComponent, MockTranslatePipe]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LayoutFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
