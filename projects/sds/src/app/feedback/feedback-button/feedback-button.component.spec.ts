import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CollectorService} from '../../shared/collector/collector.service';
import {FeedbackButtonComponent} from './feedback-button.component';

describe(FeedbackButtonComponent.name, () => {
	let component: FeedbackButtonComponent;
	let fixture: ComponentFixture<FeedbackButtonComponent>;
	const service = {initializeCollector: jest.fn(), collect: jest.fn()};

	beforeEach(async () => {
		TestBed.overrideProvider(CollectorService, {useValue: service});
		await TestBed.configureTestingModule({
			imports: [FeedbackButtonComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(FeedbackButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test('that the button is created', () => {
		expect(component).toBeTruthy();
	});

	describe('on init', () => {
		test('that initializeCollector is called once', () => {
			expect(service.initializeCollector).toHaveBeenCalledTimes(1);
		});

		test('that initializeCollector have been called with "6dfd32b3"', () => {
			expect(service.initializeCollector).toHaveBeenCalledWith('6dfd32b3');
		});
	});

	describe(`method ${FeedbackButtonComponent.prototype.collectFeedback.name}`, () => {
		beforeEach(() => {
			component.collectFeedback();
		});

		test('that collect is called once', () => {
			expect(service.collect).toHaveBeenCalledTimes(1);
		});

		test('that collectFeedback have been called with no parameters', () => {
			expect(service.collect).toHaveBeenCalledWith();
		});
	});
});
