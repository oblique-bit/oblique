/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {LayoutNavigationComponent} from './navigation.component';
import {MockTranslatePipe} from '../../../../testhelpers';
import {RouterTestingModule} from '@angular/router/testing';

//TODO: naming
describe('LayoutNavigationComponent', () => {
	let component: LayoutNavigationComponent;
	let fixture: ComponentFixture<LayoutNavigationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [LayoutNavigationComponent, MockTranslatePipe]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LayoutNavigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
