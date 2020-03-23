import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ObNavigableDirective, ObNavigableGroupComponent} from 'oblique';
import {NavigableSampleComponent} from './navigable-sample.component';
import {ObliqueTestingModule} from 'oblique';

describe('NavigableSampleComponent', () => {
	let component: NavigableSampleComponent;
	let navigableGroup: ObNavigableGroupComponent;
	let navigables: ObNavigableDirective[];
	let fixture: ComponentFixture<NavigableSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ObliqueTestingModule],
			declarations: [
				NavigableSampleComponent,
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
		navigableGroup = fixture.debugElement.query(By.directive(ObNavigableGroupComponent)).injector.get(ObNavigableGroupComponent);
		navigables = fixture.debugElement.queryAll(By.directive(ObNavigableDirective)).map(child => child.injector.get(ObNavigableDirective));
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
