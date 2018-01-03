import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NavigableGroupComponent, NavigableDirective} from '../../../../lib';
import {MockTranslatePipe} from '../../../../../testhelpers';
import {NavigableSampleComponent} from './navigable-sample.component';

describe('NavigableSampleComponent', () => {
	let component: NavigableSampleComponent;
	let navigableGroup: NavigableGroupComponent;
	let navigables: NavigableDirective[];
	let fixture: ComponentFixture<NavigableSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MockTranslatePipe,
				NavigableSampleComponent,
				NavigableDirective,
				NavigableGroupComponent
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			]
		}).compileComponents();
	}));

	//The async ensures that the bindings are completely done (waits till fixture is stable)
	beforeEach(async(() => {
		fixture = TestBed.createComponent(NavigableSampleComponent);
		fixture.detectChanges();
		component = fixture.componentInstance;
		navigableGroup = fixture.debugElement.query(By.directive(NavigableGroupComponent)).injector.get(NavigableGroupComponent);
		navigables = fixture.debugElement.queryAll(By.directive(NavigableDirective)).map(child => {
			return child.injector.get(NavigableDirective);
		});
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('first navigable item should be active by default', () => {
		expect(navigables[0].active).toBeTruthy();
		expect(component.scientistsSelection.length).toBe(1);
	});

	it('should add another item to selection when using activation toggle', () => {
		fixture.detectChanges();
		component.toggleActivation(component.scientists[1], navigableGroup);
		expect(navigables[1].selected).toBeTruthy();
		expect(component.scientistsSelection.length).toBe(2);
	});

	it('should highlight navigable item when using highlight toggle', () => {
		component.toggleHighlighting(component.scientists[1]);
		fixture.detectChanges();
		expect(navigables[0].active).toBeTruthy();
		expect(component.scientistsSelection.length).toBe(1);
		expect(navigables[1].active).toBeFalsy();
		expect(navigables[1].highlight).toBeTruthy();
	});
});
