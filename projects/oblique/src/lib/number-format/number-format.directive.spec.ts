import {ObNumberFormatDirective} from 'oblique';
import {ChangeDetectionStrategy, Component, DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

@Component({
	template: '<input name="number" [(ngModel)]="number" obNumberFormat/>',
	changeDetection: ChangeDetectionStrategy.OnPush
})
class TestDefaultComponent {
	number = 5.235689;
}

@Component({
	template: '<input name="number" [(ngModel)]="number" obNumberFormat [persistent]="false" [decimals]="3"/>',
	changeDetection: ChangeDetectionStrategy.OnPush
})
class TestNonPersistentComponent {
	number = 5.235689;
}

describe('NumberFormatDirective', () => {
	let testComponent: TestDefaultComponent | TestNonPersistentComponent;
	let directive: ObNumberFormatDirective;
	let fixture: ComponentFixture<TestDefaultComponent>;
	let element: DebugElement;

	function createFixture(component) {
		fixture = TestBed.createComponent(component);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(ObNumberFormatDirective));
		directive = element.injector.get(ObNumberFormatDirective);
	}

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [TestDefaultComponent, TestNonPersistentComponent, ObNumberFormatDirective]
		});
	}));

	describe('with default settings', () => {
		beforeEach(() => {
			createFixture(TestDefaultComponent);
		});
		it('should have both model and display value rounded to 2 digits', async(() => {
			fixture.whenStable().then(() => {
				expect(testComponent.number).toEqual(5.24);
				expect(element.nativeElement.value).toEqual('5.24');
			});
		}));
	});

	describe('with non persistent flag', () => {
		beforeEach(() => {
			createFixture(TestNonPersistentComponent);
		});

		it('should have rounded model value and full display value', async(() => {
			fixture.whenStable().then(() => {
				expect(testComponent.number).toEqual(5.235689);
				expect(element.nativeElement.value).toEqual('5.236');
			});
		}));

		it('should display full value on focus', async(() => {
			fixture.whenStable().then(() => {
				element.nativeElement.focus();
				expect(testComponent.number).toEqual(5.235689);
				expect(element.nativeElement.value).toEqual('5.235689');
			});
		}));
	});
});
