import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DebugElement, Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {UnsavedChangesDirective} from './unsaved-changes.directive';
import {UnsavedChangesService} from './unsaved-changes.service';
import {ControlContainer} from '@angular/forms';
import {NgbTabContent, NgbTabset, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
	template: `<form orUnsavedChanges></form>`,
})
class TestComponent {
}

@Component({
	template: `<form id="test" orUnsavedChanges></form>`,

})
class TestComponentWithId {
}

@Component({
	template: `
		<ngb-tabset>
			<ngb-tab id="tab" title="tab1">
				<ng-template ngbTabContent>
					<form orUnsavedChanges></form>
				</ng-template>
			</ngb-tab>
		</ngb-tabset>`
})
class TestComponentWithTabs {
}

fdescribe('UnsavedChangesDirective', () => {
	let fixture: ComponentFixture<TestComponent | TestComponentWithId | TestComponentWithTabs>;
	let testComponent: TestComponent | TestComponentWithId | TestComponentWithTabs;
	let element: DebugElement;
	let directive: UnsavedChangesDirective;
	let unsavedChangesServiceMock;
	let initFixture = (component): void => {
		fixture = TestBed.createComponent(component);
		testComponent = fixture.componentInstance;
		element = fixture.debugElement.query(By.directive(UnsavedChangesDirective));
		directive = element.injector.get(UnsavedChangesDirective);

		fixture.detectChanges();
	};

	beforeEach(async(() => {
		unsavedChangesServiceMock = jasmine.createSpyObj('UnsavedChangesService', ['watch', 'listenTo', 'unWatch', 'unListenTo']);

		TestBed.configureTestingModule({
			declarations: [TestComponent, TestComponentWithId, TestComponentWithTabs, UnsavedChangesDirective],
			providers: [
				ControlContainer,
				{provide: UnsavedChangesService, useValue: unsavedChangesServiceMock}
			],
			imports: [CommonModule, NgbTabsetModule.forRoot()]
		}).compileComponents();
	}));

	describe('with neither id nor ngbTab', () => {
		beforeEach(() => {
			initFixture(TestComponent);
		});

		it('should throw an error', () => {
			expect(() => directive.ngOnInit()).toThrow(new Error('orUnsavedChanges directive needs either to be within a NgbTab directive or to have an "id" attribute.'));
		});

		it('should not call watch on init', () => {
			try {
				directive.ngOnInit();
			} catch (e) {}
			expect(unsavedChangesServiceMock.watch).not.toHaveBeenCalled();
		});

		it('should not call listenTo after content init', () => {
			directive.ngAfterContentInit();
			expect(unsavedChangesServiceMock.listenTo).not.toHaveBeenCalled();
		});
	});

	describe('with id', () => {
		beforeEach(() => {
			initFixture(TestComponentWithId);
		});

		it('should be created', () => {
			expect(directive).toBeTruthy();
		});

		it('should call watch on init', () => {
			directive.ngOnInit();
			expect(unsavedChangesServiceMock.watch).toHaveBeenCalled();
		});

		it('should not call listenTo after content init', () => {
			directive.ngAfterContentInit();
			expect(unsavedChangesServiceMock.listenTo).not.toHaveBeenCalled();
		});

		it('should call unwatch and unListenTo on destroy', () => {
			directive.ngOnDestroy();
			expect(unsavedChangesServiceMock.unWatch).toHaveBeenCalled();
			expect(unsavedChangesServiceMock.unListenTo).toHaveBeenCalled();
		});
	});

	describe('with nbg-tabs', () => {
		beforeEach(() => {
			//initFixture(TestComponentWithTabs);
			fixture = TestBed.createComponent(TestComponentWithTabs);
			testComponent = fixture.componentInstance;
			element = fixture.debugElement.query(By.directive(UnsavedChangesDirective));
			console.log(fixture.debugElement.query(By.directive(NgbTabContent)));
			directive = element.injector.get(UnsavedChangesDirective);
		});

		it('should be created', () => {
			expect(directive).toBeTruthy();
		});

		it('should call watch on init', () => {
			// TODO
			directive.ngOnInit();
			expect(unsavedChangesServiceMock.watch).toHaveBeenCalled();
		});

		it('should call listenTo after content init', () => {
			directive.ngAfterContentInit();
			expect(unsavedChangesServiceMock.listenTo).toHaveBeenCalled();
		});

		it('should call unwatch and unListenTo on destroy', () => {
			directive.ngOnDestroy();
			expect(unsavedChangesServiceMock.unWatch).toHaveBeenCalled();
			expect(unsavedChangesServiceMock.unListenTo).toHaveBeenCalled();
		});
	});
});
