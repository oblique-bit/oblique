/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {NavigableSampleComponent} from './navigable-sample.component';
import {MockTranslatePipe} from '../../../../testhelpers';
import {NavigableModule} from '../../../../src/navigable/navigable.module';

describe('NavigableComponent', () => {
	let component: NavigableSampleComponent;
	let fixture: ComponentFixture<NavigableSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NavigableSampleComponent, MockTranslatePipe],
			imports: [NavigableModule],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavigableSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	//TODO: fix the sample, then fix the test
	/*it('should activate one item', async() => {
		component.activate(component.scientists[0]);
		setTimeout(() => {
			expect(component.scientistsSelection.length).toBe(1);
		});
	});*/
});
