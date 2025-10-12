import {ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TourOverlayComponent} from './tour-overlay.component';
import {ObTourService} from '../services/tour.service';
import {ObTourServiceMock} from '../services/_mock/tour-mock.service';
import {ObTourStep} from '../models/tour-step.model';
import {axe} from 'jest-axe';

describe('TourOverlayComponent', () => {
	let component: TourOverlayComponent;
	let fixture: ComponentFixture<TourOverlayComponent>;
	let tourServiceMock: ObTourServiceMock;

	beforeEach(async () => {
		tourServiceMock = new ObTourServiceMock();

		await TestBed.configureTestingModule({
			imports: [
				TourOverlayComponent,
				TranslateModule.forRoot({
					defaultLanguage: 'en',
					loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
				})
			],
			providers: [{provide: ObTourService, useValue: tourServiceMock}]
		}).compileComponents();

		fixture = TestBed.createComponent(TourOverlayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('onNext()', () => {
		it('should call tourService.nextStep()', () => {
			component.onNext();
			expect(tourServiceMock.nextStep).toHaveBeenCalledTimes(1);
		});
	});

	describe('onPrev()', () => {
		it('should call tourService.prevStep()', () => {
			component.onPrev();
			expect(tourServiceMock.prevStep).toHaveBeenCalledTimes(1);
		});
	});

	describe('onClose()', () => {
		it('should call tourService.finishTour()', () => {
			component.onClose();
			expect(tourServiceMock.finishTour).toHaveBeenCalledTimes(1);
		});
	});

	describe.each([true, false])('computed signals', value => {
		describe('hasNext()', () => {
			it('should return %value when hasNextSignal is %value', fakeAsync(() => {
				tourServiceMock.hasNextStep.mockReturnValue(value);
				TestBed.tick();
				expect(component.hasNext()).toBe(value);
			}));
		});

		describe('hasPrev()', () => {
			it('should return %value when hasNextSignal is %value', fakeAsync(() => {
				tourServiceMock.hasPreviousStep.mockReturnValue(value);
				TestBed.tick();
				expect(component.hasPrev()).toBe(value);
			}));
		});

		it('should reflect currentStep signal from tourService', () => {
			const step: ObTourStep = {stepTitle: 'Test Step', stepDescription: 'Description'};
			tourServiceMock.setCurrentStep(step);
			fixture = TestBed.createComponent(TourOverlayComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			expect(component.currentStep()).toEqual(step);
		});
	});

	describe('Accessibility', () => {
		it('should have no basic accessibility violations (WCAG 2.1 AA)', async () => {
			const results = await axe(fixture.nativeElement);
			expect(results).toHaveNoViolations();
		});

		it('should have no violations after navigating to next step', async () => {
			component.onNext();
			fixture.detectChanges();
			await fixture.whenStable();
			const results = await axe(fixture.nativeElement);
			expect(results).toHaveNoViolations();
		});

		it('should have no violations when no step is active (alert state)', async () => {
			tourServiceMock.finishTour();
			fixture.detectChanges();
			await fixture.whenStable();
			const results = await axe(fixture.nativeElement);
			expect(results).toHaveNoViolations();
		});
	});
});
