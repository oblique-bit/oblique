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

	it('should activate one item', () => {
		component.activate(component.scientists[0]);
		expect(component.scientistsSelection.length).toBe(1);
	});
});
