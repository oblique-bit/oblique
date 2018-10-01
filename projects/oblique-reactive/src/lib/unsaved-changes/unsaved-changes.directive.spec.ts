import {async, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {UnsavedChangesDirective, UnsavedChangesService} from 'oblique-reactive';

@Component({
	template: `
		<form orUnsavedChanges></form>`
})
class FaultyTestComponent {
	@ViewChild(UnsavedChangesDirective) unsavedChangesDirective;
}

@Component({
	template: `
		<form id="test" orUnsavedChanges></form>`

})
class TestComponent {
	//noinspection JSUnusedGlobalSymbols
	@ViewChild(UnsavedChangesDirective) unsavedChangesDirective;
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
class TabsTestComponent {
	//noinspection JSUnusedGlobalSymbols
	@ViewChild(UnsavedChangesDirective) unsavedChangesDirective;
}

describe('UnsavedChangesDirective', () => {
	let fixture;
	let testComponent: FaultyTestComponent | TestComponent | TabsTestComponent;
	let directive: UnsavedChangesDirective;
	let unsavedChangesServiceMock;
	const initFixture = (component: any): void => {
		fixture = TestBed.createComponent(component);
		fixture.detectChanges();
		testComponent = fixture.componentInstance;
		directive = testComponent.unsavedChangesDirective;
	};

	beforeEach(async(() => {
		unsavedChangesServiceMock = jasmine.createSpyObj('UnsavedChangesService', ['watch', 'listenTo', 'unWatch', 'unListenTo']);

		//noinspection JSIgnoredPromiseFromCall
		TestBed.configureTestingModule({
			declarations: [FaultyTestComponent, TestComponent, TabsTestComponent, UnsavedChangesDirective],
			providers: [
				ControlContainer,
				{provide: UnsavedChangesService, useValue: unsavedChangesServiceMock}
			],
			imports: [CommonModule, NgbTabsetModule.forRoot()]
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
			initFixture(TabsTestComponent);
		});

		it('should be created', () => {
			expect(directive).toBeTruthy();
		});

		it('should call watch on init', () => {
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
