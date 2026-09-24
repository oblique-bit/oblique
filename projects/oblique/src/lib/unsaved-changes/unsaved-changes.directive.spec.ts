import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ControlContainer} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {ObMockUnsavedChangesService} from './_mocks/mock-unsaved-changes.service';
import {ObUnsavedChangesDirective} from './unsaved-changes.directive';
import {ObUnsavedChangesService} from './unsaved-changes.service';

@Component({
	standalone: false,
	template: `<form [isActive]="isActive()" [id]="formId()" obUnsavedChanges></form>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class TestComponent {
	isActive = signal(true);
	formId = signal('test-form');
}

@Component({
	standalone: false,
	template: `<form [isActive]="isActive()" [id]="emptyId()" obUnsavedChanges></form>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class TestComponentWithEmptyId {
	isActive = signal(true);
	emptyId = signal('');
}

describe(ObUnsavedChangesDirective.name, () => {
	let fixture: ComponentFixture<TestComponent>;
	let directive: ObUnsavedChangesDirective;
	let unsavedChangesServiceMock: ObMockUnsavedChangesService;
	const initFixture = (): void => {
		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		directive = fixture.debugElement
			.query(By.directive(ObUnsavedChangesDirective))
			.injector.get(ObUnsavedChangesDirective);
	};

	beforeEach(async () => {
		unsavedChangesServiceMock = {
			watch: jest.fn() as () => void,
			unWatch: jest.fn() as () => void,
			canDeactivate: jest.fn(),
			ignoreChanges: jest.fn(),
		};

		await TestBed.configureTestingModule({
			declarations: [TestComponent, TestComponentWithEmptyId],
			providers: [ControlContainer, {provide: ObUnsavedChangesService, useValue: unsavedChangesServiceMock}],
			imports: [ObUnsavedChangesDirective, CommonModule],
		}).compileComponents();
	});

	beforeEach(() => {
		initFixture();
	});

	it('should be created', () => {
		expect(directive).toBeTruthy();
	});

	it('should call watch on init', () => {
		expect(unsavedChangesServiceMock.watch).toHaveBeenCalled();
	});

	it('should have isActive true on init', () => {
		expect(directive.isActive()).toBeTruthy();
	});

	it('should call unwatch on destroy', () => {
		directive.ngOnDestroy();
		expect(unsavedChangesServiceMock.unWatch).toHaveBeenCalled();
	});

	it('should call unWatch on Angular destroy', () => {
		fixture.destroy();
		expect(unsavedChangesServiceMock.unWatch).toHaveBeenCalled();
	});

	it('should call unWatch when isActive becomes false', () => {
		fixture.componentInstance.isActive.set(false);
		fixture.detectChanges();
		directive.ngOnChanges();
		expect(unsavedChangesServiceMock.unWatch).toHaveBeenCalled();
	});

	it('component should have a new isActive value', () => {
		fixture.componentInstance.isActive.set(false);
		fixture.detectChanges();
		directive.ngOnChanges();
		expect(directive.isActive()).toBeFalsy();
	});

	it('should default have truthy isActive value', () => {
		expect(directive.isActive()).toBeTruthy();
	});

	describe('with empty id', () => {
		let fixtureWithEmptyId: ComponentFixture<TestComponentWithEmptyId>;
		let directiveWithEmptyId: ObUnsavedChangesDirective;

		beforeEach(() => {
			fixtureWithEmptyId = TestBed.createComponent(TestComponentWithEmptyId);
			fixtureWithEmptyId.detectChanges();
			directiveWithEmptyId = fixtureWithEmptyId.debugElement
				.query(By.directive(ObUnsavedChangesDirective))
				.injector.get(ObUnsavedChangesDirective);
			// Clear mock calls from previous tests
			unsavedChangesServiceMock.watch.mockClear();
			unsavedChangesServiceMock.unWatch.mockClear();
		});

		it('should not call watch or unWatch when id is empty', () => {
			directiveWithEmptyId.ngOnChanges();
			expect(unsavedChangesServiceMock.watch).not.toHaveBeenCalled();
			expect(unsavedChangesServiceMock.unWatch).not.toHaveBeenCalled();
		});

		it('should not call unWatch on destroy when id is empty', () => {
			directiveWithEmptyId.ngOnDestroy();
			expect(unsavedChangesServiceMock.unWatch).not.toHaveBeenCalled();
		});
	});
});
