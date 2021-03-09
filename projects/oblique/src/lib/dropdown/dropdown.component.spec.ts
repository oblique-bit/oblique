import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ObDropdownComponent} from './dropdown.component';

import {ObMockGlobalEventsService} from '../global-events/mock/mock-global-events.service';
import {ObGlobalEventsService} from '../global-events/global-events.service';
describe('DropdownComponent', () => {
	let component: ObDropdownComponent;
	let fixture: ComponentFixture<ObDropdownComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObDropdownComponent],
			providers: [{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService}]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObDropdownComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('id', () => {
		it('should set it if undefined', () => {
			expect(component.id).toBe('dropdown-2');
		});

		describe('with given id', () => {
			beforeEach(() => {
				component.id = 'test';
				component.ngOnInit();
			});
			it('should not be changed', () => {
				expect(component.id).toBe('test');
			});

			it('should define idContent', () => {
				expect(component.idContent).toBe('test-content');
			});

			it('should add it to the div', () => {
				fixture.detectChanges();
				const el = fixture.debugElement.query(By.css('#test-content'));
				expect(el).toBeTruthy();
			});
		});
	});

	describe('toggle', () => {
		beforeEach(() => {
			component.isOpen = false;
		});
		it('should toggle if click on self', () => {
			component.toggle({target: fixture.nativeElement} as MouseEvent);
			expect(component.isOpen).toBe(true);
		});
		it('should toggle if event undefined', () => {
			component.toggle(undefined);
			expect(component.isOpen).toBe(true);
		});
		it('should not toggle if not click on self', () => {
			component.toggle({target: undefined} as MouseEvent);
			expect(component.isOpen).toBe(false);
		});
	});

	describe('accessibility', () => {
		beforeEach(() => {
			component.isOpen = false;
		});

		it('shuold have no aria-expanded when closed', () => {
			expect(component.expandedOrUndefined).toBeUndefined();
		});

		it('should have aria-expanded=true when opened', () => {
			component.toggle(undefined);
			expect(component.expandedOrUndefined).toBeTruthy();
		});

		it('should have popup = true', () => {
			expect(component.popup).toBeTruthy();
		});
	});
});
