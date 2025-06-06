import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {CollectorService} from '../shared/collector/collector.service';
import {FeedbackTriggerDirective} from './feedback-trigger.directive';

@Component({
	template: `<button type="button" appFeedbackTrigger>btn</button>`,
	imports: [FeedbackTriggerDirective]
})
export class TestComponentComponent {}

describe(FeedbackTriggerDirective.name, () => {
	let directive: FeedbackTriggerDirective;
	let fixture: ComponentFixture<TestComponentComponent>;
	const service = {initializeCollector: jest.fn(), defaultValues: {}, collect: jest.fn(), fallbackDialog: undefined};

	beforeEach(async () => {
		TestBed.overrideProvider(CollectorService, {useValue: service});
		await TestBed.configureTestingModule({
			imports: [TestComponentComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponentComponent);
		directive = fixture.debugElement.query(By.directive(FeedbackTriggerDirective)).injector.get(FeedbackTriggerDirective);
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test('creation', () => {
		expect(directive).toBeTruthy();
	});

	describe('directive init', () => {
		test('initializeCollector is called once', () => {
			expect(service.initializeCollector).toHaveBeenCalledTimes(1);
		});

		test('initializeCollector is called with "6dfd32b3"', () => {
			expect(service.initializeCollector).toHaveBeenCalledWith('6dfd32b3');
		});

		test('fallbackDialog is FeedbackFormComponent', () => {
			expect(service.fallbackDialog.name).toBe('FeedbackFormComponent');
		});

		test('default values of the service', () => {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			expect(JSON.stringify(service.defaultValues)).toEqual(JSON.stringify({customfield_12505: () => window.location.href}));
		});
	});

	describe(`method ${FeedbackTriggerDirective.prototype.collectFeedback.name}`, () => {
		beforeEach(() => {
			directive.collectFeedback();
		});

		test('collect is called once', () => {
			expect(service.collect).toHaveBeenCalledTimes(1);
		});

		test('collectFeedback is called without parameter', () => {
			expect(service.collect).toHaveBeenCalledWith();
		});
	});
});
