import {Component, DebugElement, input} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ObEllipsisTooltipDirective} from './ellipsis-tooltip.directive';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from '../utilities';
import {By} from '@angular/platform-browser';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';

function setElementWidths(element: HTMLElement, offset: number, scroll: number): void {
	Object.defineProperty(element, 'offsetWidth', {value: offset});
	Object.defineProperty(element, 'scrollWidth', {value: scroll});
}

@Component({
	imports: [ObEllipsisTooltipDirective, MatTooltipModule],
	template: ` <span [matTooltip]="text()" [obEllipsisTooltip]="text()">{{ text() }}</span> `
})
class TestHostComponent {
	text = input('');
}

describe('ObEllipsisTooltipDirective', () => {
	let fixture: ComponentFixture<TestHostComponent>;
	let hostComponent: TestHostComponent;
	let hostElement: HTMLElement;
	let ellipsisDirective: DebugElement;
	let windowMock: EventTarget;
	let loader: HarnessLoader;

	async function triggerResize(): Promise<void> {
		windowMock.dispatchEvent(new UIEvent('resize'));
		fixture.detectChanges();
		await fixture.whenStable();
	}

	beforeEach(async () => {
		windowMock = new EventTarget();

		await TestBed.configureTestingModule({
			imports: [TestHostComponent],
			providers: [{provide: WINDOW, useValue: windowMock}, {provide: DOCUMENT, useValue: document}, ObGlobalEventsService]
		}).compileComponents();

		fixture = TestBed.createComponent(TestHostComponent);
		loader = TestbedHarnessEnvironment.loader(fixture);
		hostComponent = fixture.componentInstance;
		hostElement = fixture.nativeElement.querySelector('span') as HTMLElement;
		fixture.detectChanges();
		ellipsisDirective = fixture.debugElement.query(By.directive(ObEllipsisTooltipDirective));
	});

	describe('creation', () => {
		test('should create the host component', () => {
			expect(hostComponent).toBeTruthy();
		});

		test(`should have the directive ${ObEllipsisTooltipDirective.name}`, () => {
			expect(ellipsisDirective).toBeTruthy();
		});
	});

	describe('ellipsis detection', () => {
		test.each([
			{
				caseTitle: 'disables tooltip when offest is equal scroll',
				offset: 200,
				scroll: 200,
				expectedDisabled: true
			},
			{
				caseTitle: 'enables tooltip if offset smaller than scroll',
				offset: 80,
				scroll: 81,
				expectedDisabled: false
			},
			{
				caseTitle: 'disables tooltip after ellipsis disappears',
				offset: 121,
				scroll: 120,
				expectedDisabled: true
			}
		])('$caseTitle', async ({offset, scroll, expectedDisabled}) => {
			setElementWidths(hostElement, offset, scroll);

			await triggerResize();
			const tooltip = await loader.getHarness(MatTooltipHarness);

			expect(await tooltip.isDisabled()).toBe(expectedDisabled);
		});
	});
});
