import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {TranslateModule} from '@ngx-translate/core';

import {MenuListComponent} from './menu-list.component';

describe('MenuListComponent', () => {
	let fixture: ComponentFixture<MenuListComponent>;
	let component: MenuListComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MenuListComponent, BrowserTestingModule, TranslateModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(MenuListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('Component creation and defaults', () => {
		it('should create component', () => {
			expect(component).toBeTruthy();
		});

		it('should initialize listTitle as empty string', () => {
			expect(component.listTitle()).toBe('');
		});

		it('should initialize listItems as null', () => {
			expect(component.listItems()).toBeNull();
		});

		it('should initialize actions as empty array', () => {
			expect(component.actions()).toEqual([]);
		});
	});

	describe('setupActions() logic for listType "new"', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('listType', 'new');
			fixture.detectChanges();
		});

		it('should have first action name "start"', () => {
			expect(component.actions()[0].name).toBe('start');
		});

		it('should have first action icon "chevron_right"', () => {
			expect(component.actions()[0].icon).toBe('chevron_right');
		});

		it('should have second action name "skip"', () => {
			expect(component.actions()[1].name).toBe('skip');
		});

		it('should have second action icon "delete"', () => {
			expect(component.actions()[1].icon).toBe('delete');
		});
	});

	describe('setupActions() logic for listType "done"', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('listType', 'done');
			fixture.detectChanges();
		});

		it('should have first action name "restart"', () => {
			expect(component.actions()[0].name).toBe('restart');
		});

		it('should have first action icon "redo"', () => {
			expect(component.actions()[0].icon).toBe('redo');
		});

		it('should have second action name "skip"', () => {
			expect(component.actions()[1].name).toBe('skip');
		});

		it('should have second action icon "delete"', () => {
			expect(component.actions()[1].icon).toBe('delete');
		});
	});

	describe('setupActions() logic for listType "inProgress"', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('listType', 'inProgress');
			fixture.detectChanges();
		});

		it('should have first action name "resume"', () => {
			expect(component.actions()[0].name).toBe('resume');
		});

		it('should have first action icon "skip_next"', () => {
			expect(component.actions()[0].icon).toBe('skip_next');
		});

		it('should have second action name "skip"', () => {
			expect(component.actions()[1].name).toBe('skip');
		});

		it('should have second action icon "delete"', () => {
			expect(component.actions()[1].icon).toBe('delete');
		});
	});

	describe('setupActions() logic for unknown listType', () => {
		beforeEach(() => {
			fixture.componentRef.setInput('listType', null);
			fixture.detectChanges();
		});

		it('should result in an empty actions array', () => {
			expect(component.actions()).toEqual([]);
		});

		it('should have actions length 0', () => {
			expect(component.actions().length).toBe(0);
		});
	});
});
