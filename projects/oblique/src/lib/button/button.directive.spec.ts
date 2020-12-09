import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonDirective} from './button.directive';

@Component({
	template: '<button mat-button obButton="primary">Primary</button>'
})
class TestPrimaryComponent {}

@Component({
	template: '<button mat-button obButton="secondary">Secondary</button>'
})
class TestSecondaryComponent {}

@Component({
	template: '<button mat-button obButton="tertiary">Tertiary</button>'
})
class TestTertiaryComponent {}

@Component({
	template: '<button mat-button obButton>Undefined</button>'
})
class TestDefaultComponent {}

@Component({
	template: '<button mat-button obButton="illegal">Illegal</button>'
})
class TestIllegalComponent {}

describe('ButtonDirective', () => {
	let directive: ObButtonDirective;
	let component: TestPrimaryComponent | TestSecondaryComponent | TestTertiaryComponent;
	let fixture:
		| ComponentFixture<TestPrimaryComponent>
		| ComponentFixture<TestSecondaryComponent>
		| ComponentFixture<TestTertiaryComponent>
		| ComponentFixture<TestDefaultComponent>
		| ComponentFixture<TestIllegalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestPrimaryComponent, TestSecondaryComponent, TestTertiaryComponent, TestDefaultComponent, TestIllegalComponent, ObButtonDirective],
			imports: [MatButtonModule]
		});
	}));

	describe('primary button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestPrimaryComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be default obButton', () => {
			expect(directive.obButton).toBe('primary');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should have `.mat-flat-button` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeNull();
		});
	});

	describe('secondary button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestSecondaryComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be secondary obButton', () => {
			expect(directive.obButton).toBe('secondary');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-flat-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeNull();
		});
	});

	describe('tertiary button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestTertiaryComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be tertiary obButton', () => {
			expect(directive.obButton).toBe('tertiary');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-flat-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeNull();
		});

		it('should not have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeNull();
		});
	});

	describe('default button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestDefaultComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be default obButton', () => {
			expect(directive.obButton).toBe('primary');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should have `.mat-flat-button` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeNull();
		});
	});

	describe('illegal button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestIllegalComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be illegal obButton', () => {
			expect(directive.obButton).toBe('illegal');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-flat-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeNull();
		});

		it('should not have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeNull();
		});
	});
});
