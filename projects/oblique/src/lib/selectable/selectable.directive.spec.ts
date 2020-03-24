import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ObSelectableDirective} from 'oblique';

@Component({
	template: '<div class="test-card-0" obSelectable [value]="\'test-card-0\'"></div>'
})
class TestValueComponent {
}

@Component({
	template: '<div class="test-card-1" obSelectable [collection]="\'A\'"></div>'
})
class TestCollectionAComponent {
}

@Component({
	template: '<div class="test-card-2" obSelectable [selected]="true"></div>'
})
class TesttSelectedComponent {
}

describe('SelectableDirective', () => {
	let directive: ObSelectableDirective;
	let component: TestValueComponent | TestCollectionAComponent | TesttSelectedComponent;
	let fixture: ComponentFixture<TestValueComponent> | ComponentFixture<TestCollectionAComponent> | ComponentFixture<TestCollectionAComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestValueComponent,
				TestCollectionAComponent,
				TesttSelectedComponent,
				ObSelectableDirective
			]
		});
	}));

	describe('with [value] = test-card-0', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestValueComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObSelectableDirective));
			directive = element.injector.get(ObSelectableDirective);
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should not be selected', () => {
			expect(directive.selected).toBeFalsy();
		});

		it('should not have `.ob-selected` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.ob-selected'));
			expect(selectableElement).toBeNull();
		});

		it('should have value `test-card-0`', () => {
			expect(directive.value).toBe('test-card-0');
		});

		it('should use default collection', () => {
			expect(directive.collection).toBe('unnamed');
		});

		it('should toggle selectable onClick', () => {
			const spy = spyOn(directive['selectableService'], 'toggleValue').and.callThrough();
			expect(spy).not.toHaveBeenCalled();
			directive.onClick();
			expect(spy).toHaveBeenCalled();
			expect(directive.selected).toBeTruthy();
			directive.onClick();
			expect(directive.selected).toBeFalsy();
		});
	});

	describe('with [collection] = A', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestCollectionAComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObSelectableDirective));
			directive = element.injector.get(ObSelectableDirective);
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should not be selected', () => {
			expect(directive.selected).toBeFalsy();
		});

		it('should not have `.ob-selected` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.ob-selected'));
			expect(selectableElement).toBeNull();
		});

		it('should not have a value', () => {
			expect(directive.value).toBeUndefined();
		});

		it('should use `A` collection', () => {
			expect(directive.collection).not.toBe('unnamed');
			expect(directive.collection).toBe('A');
		});

		it('should toggle selectable onClick', () => {
			const spy = spyOn(directive['selectableService'], 'toggleValue').and.callThrough();
			expect(spy).not.toHaveBeenCalled();
			directive.onClick();
			expect(spy).toHaveBeenCalled();
			expect(directive.selected).toBeTruthy();
			directive.onClick();
			expect(directive.selected).toBeFalsy();
		});
	});

	describe('with [selected] = true', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TesttSelectedComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObSelectableDirective));
			directive = element.injector.get(ObSelectableDirective);
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be selected', () => {
			expect(directive.selected).toBeTruthy();
		});

		it('should have `.ob-selected` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.ob-selected'));
			expect(selectableElement).not.toBeNull();
		});

		it('should not have a value', () => {
			expect(directive.value).toBeUndefined();
		});

		it('should use default collection', () => {
			expect(directive.collection).toBe('unnamed');
		});

		it('should toggle selectable onClick', () => {
			const spy = spyOn(directive['selectableService'], 'toggleValue').and.callThrough();
			expect(spy).not.toHaveBeenCalled();
			directive.onClick();
			expect(spy).toHaveBeenCalled();
			expect(directive.selected).toBeFalsy();
			directive.onClick();
			expect(directive.selected).toBeTruthy();
		});
	});
});
