import {ChangeDetectionStrategy, Component, DebugElement, Type} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ObNumberFormatDirective} from './number-format.directive';

@Component({
	standalone: false,
	template: '<input name="number" [(ngModel)]="number" obNumberFormat/>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestDefaultComponent {
	number: number;
}

@Component({
	standalone: false,
	template: '<input name="number" [(ngModel)]="number" obNumberFormat [persistent]="false" [decimals]="3"/>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestNonPersistentComponent {
	number: number;
}

describe(ObNumberFormatDirective.name, () => {
	let testComponent: TestDefaultComponent | TestNonPersistentComponent;
	let fixture: ComponentFixture<TestDefaultComponent>;
	let element: DebugElement;

	function createFixture(
		component: Type<TestDefaultComponent | TestNonPersistentComponent>,
		initialValue: number | null
	): void {
		fixture = TestBed.createComponent(component);
		testComponent = fixture.componentInstance;
		testComponent.number = initialValue;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(ObNumberFormatDirective));
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ObNumberFormatDirective, FormsModule],
			declarations: [TestDefaultComponent, TestNonPersistentComponent],
		});
	});

	describe('with default settings', () => {
		it('should have both model and display value rounded to 2 digits', async () => {
			createFixture(TestDefaultComponent, 5.235689);
			await fixture.whenStable();
			expect(testComponent.number).toEqual(5.24);
			expect(element.nativeElement.value).toEqual('5.24');
		});
		it('should have model to be null and display value an empty string', async () => {
			createFixture(TestDefaultComponent, null);
			await fixture.whenStable();
			expect(testComponent.number).toEqual(null);
			expect(element.nativeElement.value).toEqual('');
		});
		it('should have model to be 0 and display value "0"', async () => {
			createFixture(TestDefaultComponent, 0);
			await fixture.whenStable();
			expect(testComponent.number).toEqual(0);
			expect(element.nativeElement.value).toEqual('0');
		});
	});

	describe('with non persistent flag', () => {
		it('should have rounded model value and full display value', async () => {
			createFixture(TestNonPersistentComponent, 5.235689);
			await fixture.whenStable();
			expect(testComponent.number).toEqual(5.235689);
			expect(element.nativeElement.value).toEqual('5.236');
		});
		it('should have no model value and empty display value', async () => {
			createFixture(TestNonPersistentComponent, null);
			await fixture.whenStable();
			expect(testComponent.number).toEqual(null);
			expect(element.nativeElement.value).toEqual('');
		});
		it('should have 0 as model value and "0" as display value', async () => {
			createFixture(TestNonPersistentComponent, 0);
			await fixture.whenStable();
			expect(testComponent.number).toEqual(0);
			expect(element.nativeElement.value).toEqual('0');
		});
		it('should display full value on focus', async () => {
			createFixture(TestNonPersistentComponent, 5.235689);
			await fixture.whenStable();
			element.nativeElement.focus();
			expect(testComponent.number).toEqual(5.235689);
			expect(element.nativeElement.value).toEqual('5.235689');
		});
		it('should display no value on focus', async () => {
			createFixture(TestNonPersistentComponent, null);
			await fixture.whenStable();
			element.nativeElement.focus();
			expect(testComponent.number).toEqual(null);
			expect(element.nativeElement.value).toEqual('');
		});
		it('should display "0" value on focus', async () => {
			createFixture(TestNonPersistentComponent, 0);
			await fixture.whenStable();
			element.nativeElement.focus();
			expect(testComponent.number).toEqual(0);
			expect(element.nativeElement.value).toEqual('0');
		});
	});
});
