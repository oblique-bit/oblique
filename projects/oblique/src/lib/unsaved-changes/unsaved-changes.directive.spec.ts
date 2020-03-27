import {async, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {ObUnsavedChangesDirective, ObUnsavedChangesService} from 'oblique';

@Component({
	template: ` <form obUnsavedChanges></form>`
})
class FaultyTestComponent {
	@ViewChild(ObUnsavedChangesDirective, {static: false}) unsavedChangesDirective;
}

@Component({
	template: ` <form id="test" obUnsavedChanges></form>`
})
class TestComponent {
	//noinspection JSUnusedGlobalSymbols
	@ViewChild(ObUnsavedChangesDirective, {static: false}) unsavedChangesDirective;
}

describe('UnsavedChangesDirective', () => {
	let fixture;
	let testComponent: FaultyTestComponent | TestComponent;
	let directive: ObUnsavedChangesDirective;
	let unsavedChangesServiceMock;
	const initFixture = (component: any): void => {
		fixture = TestBed.createComponent(component);
		fixture.detectChanges();
		testComponent = fixture.componentInstance;
		directive = testComponent.unsavedChangesDirective;
	};

	beforeEach(async(() => {
		unsavedChangesServiceMock = {
			watch: jest.fn(),
			listenTo: jest.fn(),
			unWatch: jest.fn(),
			unListenTo: jest.fn()
		};

		//noinspection JSIgnoredPromiseFromCall
		TestBed.configureTestingModule({
			declarations: [FaultyTestComponent, TestComponent, ObUnsavedChangesDirective],
			providers: [ControlContainer, {provide: ObUnsavedChangesService, useValue: unsavedChangesServiceMock}],
			imports: [CommonModule]
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

		it('should call unwatch on destroy', () => {
			directive.ngOnDestroy();
			expect(unsavedChangesServiceMock.unWatch).toHaveBeenCalled();
		});
	});
});
