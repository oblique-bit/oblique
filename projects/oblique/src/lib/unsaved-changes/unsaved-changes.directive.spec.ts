import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {Component, Type} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {ObUnsavedChangesDirective} from './unsaved-changes.directive';
import {ObUnsavedChangesService} from './unsaved-changes.service';
import {ObMockUnsavedChangesService} from './_mocks/mock-unsaved-changes.service';
import {By} from '@angular/platform-browser';

@Component({
	template: ` <form obUnsavedChanges></form>`,
	standalone: false
})
class FaultyTestComponent {}

@Component({
	template: ` <form id="test" [isActive]="true" obUnsavedChanges></form>`,
	standalone: false
})
class TestComponent {}

describe(ObUnsavedChangesDirective.name, () => {
	let fixture: ComponentFixture<FaultyTestComponent | TestComponent>;
	let directive: ObUnsavedChangesDirective;
	let unsavedChangesServiceMock: ObMockUnsavedChangesService;
	const initFixture = (component: Type<FaultyTestComponent | TestComponent>): void => {
		fixture = TestBed.createComponent(component);
		fixture.detectChanges();
		directive = fixture.debugElement.query(By.directive(ObUnsavedChangesDirective)).injector.get(ObUnsavedChangesDirective);
	};

	beforeEach(waitForAsync(() => {
		unsavedChangesServiceMock = {
			isActive: true,
			watch: jest.fn(),
			unWatch: jest.fn(),
			canDeactivate: jest.fn(),
			ignoreChanges: jest.fn()
		};

		TestBed.configureTestingModule({
			declarations: [FaultyTestComponent, TestComponent],
			providers: [ControlContainer, {provide: ObUnsavedChangesService, useValue: unsavedChangesServiceMock}],
			imports: [ObUnsavedChangesDirective, CommonModule]
		}).compileComponents();
	}));

	it('with neither id nor ngbTab should throw an error', () => {
		expect(() => initFixture(FaultyTestComponent)).toThrow();
	});

	describe('with id', () => {
		beforeEach(() => {
			initFixture(TestComponent);
		});

		it('should be created', () => {
			expect(directive).toBeTruthy();
		});

		it('should call watch on init', () => {
			directive.ngOnInit();
			expect(unsavedChangesServiceMock.watch).toHaveBeenCalled();
		});

		it('should have isActive true on init', () => {
			directive.ngOnInit();
			expect(unsavedChangesServiceMock.isActive).toBeTruthy();
		});

		it('should call unwatch on destroy', () => {
			directive.ngOnDestroy();
			expect(unsavedChangesServiceMock.unWatch).toHaveBeenCalled();
		});

		it('component should have a new  isActive value', () => {
			directive.isActive = false;
			directive.ngOnChanges();
			expect(directive.isActive).toBeFalsy();
		});
		it(' should default have truthy  isActive value', () => {
			expect(directive.isActive).toBeTruthy();
		});
	});
});
