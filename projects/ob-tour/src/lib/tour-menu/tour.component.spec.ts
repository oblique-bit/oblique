import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ObtTourComponent} from './tour.component';
import {ObtTourService} from '../services/tour.service';
import {ObtTourOverlayService} from '../services/tour-overlay.service';
import {ObtTourMenuVisibility} from '../services/tour-menu-visibility.service';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ObtMenuPositionsX, ObtMenuPositionsY, ObtTour, ObtTourChange, ObtTourStep, ObtToursConfig} from '../models/tour.model';
import {ObtTourServiceMock, createObtTourServiceMock} from '../services/_mock/tour-mock.service';
import {dasherize} from '@angular-devkit/core/src/utils/strings';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

describe('ObtTourComponent', () => {
	let fixture: ComponentFixture<ObtTourComponent>;
	let component: ObtTourComponent;
	let overlayServiceMock: jest.Mocked<ObtTourOverlayService>;
	let visibilityMock: jest.Mocked<ObtTourMenuVisibility>;
	let tourServiceMock: ObtTourServiceMock;

	const mockTour: ObtTour = {
		storageKey: 'tour-1',
		tourTitle: 'Test tour',
		tourDescription: 'Description',
		steps: [
			{stepTitle: 'Step 1', stepDescription: 'Step description 1'},
			{stepTitle: 'Step 2', stepDescription: 'Step description 2'}
		] as ObtTourStep[]
	};

	beforeEach(async () => {
		tourServiceMock = createObtTourServiceMock();

		overlayServiceMock = {
			openOverlayForStep: jest.fn(),
			closeOverlay: jest.fn()
		} as unknown as jest.Mocked<ObtTourOverlayService>;

		visibilityMock = {
			createMenuVisibilityKey: jest.fn(),
			isVisible: jest.fn().mockReturnValue(true),
			changeVisibility: jest.fn()
		} as unknown as jest.Mocked<ObtTourMenuVisibility>;

		await TestBed.configureTestingModule({
			imports: [
				ObtTourComponent,
				TranslateModule.forRoot({
					defaultLanguage: 'en',
					loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
				})
			],
			providers: [
				{provide: ObtTourService, useValue: tourServiceMock},
				{provide: ObtTourOverlayService, useValue: overlayServiceMock},
				{provide: ObtTourMenuVisibility, useValue: visibilityMock}
			]
		})
			.overrideComponent(ObtTourComponent, {
				set: {
					providers: [
						{provide: ObtTourService, useValue: tourServiceMock},
						{provide: ObtTourOverlayService, useValue: overlayServiceMock},
						{provide: ObtTourMenuVisibility, useValue: visibilityMock}
					]
				}
			})
			.compileComponents();

		fixture = TestBed.createComponent(ObtTourComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('tourMenuKey', 'test-key');
		fixture.componentRef.setInput('toursConfig', {tours: [mockTour]});
		fixture.detectChanges();
		await fixture.whenStable();
	});

	afterEach(() => jest.clearAllMocks());

	describe('Setup & Initialisation', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should create component instance', () => {
			expect(component).toBeTruthy();
		});

		it('should call tourService.update when toursConfig has items', async () => {
			const config = {tours: [mockTour]} as any;

			// Inputs setzen
			fixture.componentRef.setInput('tourMenuKey', 'key-setup');
			fixture.componentRef.setInput('toursConfig', {...config}); // neue Referenz für Signaländerung

			fixture.detectChanges();
			await fixture.whenStable();
			await fixture.whenRenderingDone();

			// Effekte ausführen lassen
			await new Promise(resolve => setTimeout(resolve, 50));

			expect(tourServiceMock.update).toHaveBeenCalledWith([mockTour]);
		});

		it('should not call tourService.update when toursConfig.tours is empty', async () => {
			jest.clearAllMocks(); // sicherstellen, dass keine alten Calls gezählt werden

			fixture = TestBed.createComponent(ObtTourComponent);
			component = fixture.componentInstance;

			fixture.componentRef.setInput('tourMenuKey', 'test-key');
			fixture.componentRef.setInput('toursConfig', {tours: []});

			fixture.detectChanges();
			await fixture.whenStable();
			await fixture.whenRenderingDone();

			expect(tourServiceMock.update).not.toHaveBeenCalled();
		});
	});

	describe('Overlay logic', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should call openOverlayForStep when activeStep is defined', async () => {
			const step = {stepTitle: 'Step 1', stepDescription: 'Some description'} as ObtTourStep;

			// richtige Signale setzen
			tourServiceMock.activeStep.set(step);
			tourServiceMock.activeTourKey.set('tour-1');

			fixture = TestBed.createComponent(ObtTourComponent);
			component = fixture.componentInstance;

			fixture.componentRef.setInput('tourMenuKey', 'tour-key');
			fixture.componentRef.setInput('toursConfig', {tours: [mockTour]});

			fixture.detectChanges();
			await fixture.whenStable();
			await fixture.whenRenderingDone();

			// kurzen Delay, damit Angular-Effekte greifen
			await new Promise(resolve => setTimeout(resolve, 50));

			expect(overlayServiceMock.openOverlayForStep).toHaveBeenCalledTimes(1);
			expect(overlayServiceMock.openOverlayForStep).toHaveBeenCalledWith(step, expect.anything());
		});

		it.each([
			{description: 'when activeStep is null', step: null},
			{description: 'when activeStep is undefined', step: undefined}
		])('should not call openOverlayForStep $description', async ({step}) => {
			// Signale bewusst leer setzen
			tourServiceMock.activeStep.set(step);
			tourServiceMock.activeTourKey.set(null);

			fixture = TestBed.createComponent(ObtTourComponent);
			component = fixture.componentInstance;

			fixture.componentRef.setInput('tourMenuKey', 'tour-key');
			fixture.componentRef.setInput('toursConfig', {tours: []});

			fixture.detectChanges();
			await fixture.whenStable();
			await fixture.whenRenderingDone();

			await new Promise(resolve => setTimeout(resolve, 50));

			expect(overlayServiceMock.openOverlayForStep).not.toHaveBeenCalled();
		});
	});

	describe.each([
		{
			description: 'when tourAction is in CLOSE_POPOVER_TOUR_ACTIONS',
			action: {obtTourAction: 'skip', obtTourKey: 'key1'} as ObtTourChange,
			shouldClosePopover: true
		},
		{
			description: 'when tourAction is not in CLOSE_POPOVER_TOUR_ACTIONS (e.g. "resume")',
			action: {obtTourAction: 'resume', obtTourKey: 'key2'} as ObtTourChange,
			shouldClosePopover: false
		}
	])('tourStatusChanged: $description', ({action, shouldClosePopover}) => {
		let handleTourActionsSpy: jest.SpyInstance;

		beforeEach(async () => {
			jest.clearAllMocks();

			fixture = TestBed.createComponent(ObtTourComponent);
			component = fixture.componentInstance;

			handleTourActionsSpy = jest.spyOn(component as any, 'handleTourActions').mockImplementation();

			component.isOpen.set(true);

			fixture.componentRef.setInput('tourMenuKey', 'test-key');
			fixture.componentRef.setInput('toursConfig', {tours: []});

			fixture.detectChanges();

			component.tourStatusChanged.emit(action);

			await fixture.whenStable();
			await new Promise(resolve => setTimeout(resolve, 50)); // warten, bis Subscription läuft
		});

		it('should call handleTourActions() with the correct parameters', () => {
			expect(handleTourActionsSpy).toHaveBeenCalledWith(action.obtTourAction, action.obtTourKey);
		});

		it(`should ${shouldClosePopover ? '' : 'not '}set isOpen to false`, async () => {
			await new Promise(resolve => setTimeout(resolve, 0));

			const expected = !!shouldClosePopover;
			expect(component.isOpen()).toBe(expected);
		});
	});

	describe('updateTours', () => {
		let tours: any[];

		beforeEach(() => {
			// Prepare a set of mock tours with different states
			tours = [
				{storageKey: '1', state: 'new'},
				{storageKey: '2', state: 'done'},
				{storageKey: '3', state: 'inProgress'},
				{storageKey: '4', state: 'skipped'},
				{storageKey: '5', state: null},
				{storageKey: '6'} // missing state
			];
		});

		it('should populate newTours with items having state "new"', () => {
			(component as any).updateTours(tours);
			const result = component.newTours().map(tour => tour.storageKey);
			expect(result).toEqual(['1']);
		});

		it('should populate doneTours with items having state "done"', () => {
			(component as any).updateTours(tours);
			const result = component.doneTours().map(tour => tour.storageKey);
			expect(result).toEqual(['2']);
		});

		it('should populate inProgressTours with items having state "inProgress"', () => {
			(component as any).updateTours(tours);
			const result = component.inProgressTours().map(tour => tour.storageKey);
			expect(result).toEqual(['3']);
		});

		it('should populate skippedTours with items having state "skipped"', () => {
			(component as any).updateTours(tours);
			const result = component.skippedTours().map(tour => tour.storageKey);
			expect(result).toEqual(['4']);
		});

		it('should exclude tours with null or undefined state from all lists', () => {
			(component as any).updateTours(tours);
			const allStates = [
				...component.newTours(),
				...component.doneTours(),
				...component.inProgressTours(),
				...component.skippedTours()
			].map(tour => tour.storageKey);
			expect(allStates).not.toContain('5');
			expect(allStates).not.toContain('6');
		});
	});

	describe('getBadgeCounter', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should return newTours length when state is "new"', () => {
			const newTours: ObtTour[] = [
				{storageKey: '1', tourTitle: 'A', tourDescription: 'D', steps: []},
				{storageKey: '2', tourTitle: 'B', tourDescription: 'E', steps: []}
			];
			component.newTours.set(newTours);
			component.inProgressTours.set([]);

			const result = component.getBadgeCounter('new');

			expect(result).toBe(2);
		});

		it('should return 0 when newTours is empty and state is "new"', () => {
			component.newTours.set([]);

			const result = component.getBadgeCounter('new');

			expect(result).toBe(0);
		});

		it('should return 0 when newTours is undefined and state is "new"', () => {
			component.newTours.set(undefined as unknown as ObtTour[]);

			const result = component.getBadgeCounter('new');

			expect(result).toBe(0);
		});

		it('should return inProgressTours length when state is not "new"', () => {
			const inProgressTours: ObtTour[] = [
				{storageKey: '10', tourTitle: 'X', tourDescription: 'Desc', steps: []},
				{storageKey: '11', tourTitle: 'Y', tourDescription: 'Desc', steps: []},
				{storageKey: '12', tourTitle: 'Z', tourDescription: 'Desc', steps: []}
			];
			component.inProgressTours.set(inProgressTours);

			const result = component.getBadgeCounter('inProgress');

			expect(result).toBe(3);
		});

		it('should return 0 when inProgressTours is empty and state is not "new"', () => {
			component.inProgressTours.set([]);

			const result = component.getBadgeCounter('inProgress');

			expect(result).toBe(0);
		});

		it('should return 0 when inProgressTours is undefined and state is not "new"', () => {
			component.inProgressTours.set(undefined as unknown as ObtTour[]);

			const result = component.getBadgeCounter('inProgress');

			expect(result).toBe(0);
		});
	});

	describe('getTooltipKey', () => {
		it.each([
			{state: 'new', newTours: [{}], inProgressTours: [], expectedSuffix: 'one'},
			{state: 'inProgress', newTours: [], inProgressTours: [{}, {}], expectedSuffix: 'other'}
		])('should return key with correct suffix for $state', ({state, newTours, inProgressTours, expectedSuffix}) => {
			component.newTours.set(newTours as any);
			component.inProgressTours.set(inProgressTours as any);
			const key = component.getTooltipKey(state as 'new' | 'inProgress');
			expect(key).toBe(`i18n.ob-tour.tour-menu.button.badge.screen-reader.${dasherize(state)}.${expectedSuffix}`);
		});
	});

	describe('Popover controls & utility', () => {
		it('should toggle popover open state', () => {
			const event = {stopPropagation: jest.fn()} as any;
			component.isOpen.set(false);
			component.togglePopover(event);
			expect(component.isOpen()).toBe(true);
		});

		it('should close popover and call overlayService', () => {
			component.isOpen.set(true);
			component.closePopover();
			expect(overlayServiceMock.closeOverlay).toHaveBeenCalled();
		});

		it('should call closePopover on Escape', () => {
			const spy = jest.spyOn(component, 'closePopover');
			component.onEscape(new KeyboardEvent('keyup'));
			expect(spy).toHaveBeenCalled();
		});

		it('should dasherize "inProgress" correctly', () => {
			expect(component.dasherizeBadgeState('inProgress')).toBe('in-progress');
		});
	});

	describe('Tour actions handling', () => {
		it('should skipTour when action="skip"', () => {
			(component as any).handleTourActions('skip', 'x');
			expect(tourServiceMock.skipTour).toHaveBeenCalledWith('x');
		});

		it('should restartTour when action="restart"', () => {
			(component as any).handleTourActions('restart', 'k');
			expect(tourServiceMock.restartTour).toHaveBeenCalledWith('k');
		});

		it('should resumeIfPossible when action="resume"', () => {
			(component as any).handleTourActions('resume', 'r');
			expect(tourServiceMock.resumeIfPossible).toHaveBeenCalledWith('r');
		});

		it('should startTour when action="start"', () => {
			(component as any).handleTourActions('start', 'r');
			expect(tourServiceMock.startTour).toHaveBeenCalledWith('r');
		});

		it('should ignore unknown actions', () => {
			expect((component as any).handleTourActions('unknown' as any, 'r')).toBeUndefined();
		});
	});

	describe('onToggleChange', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should set showTourMenu to true when toggle is checked', () => {
			const event = {checked: true} as MatSlideToggleChange;
			visibilityMock.changeVisibility.mockReturnValue(true);

			component.onToggleChange(event);

			expect(component.showTourMenu).toBe(true);
		});

		it('should call changeVisibility with correct arguments when toggle is checked', () => {
			const event = {checked: true} as MatSlideToggleChange;
			visibilityMock.changeVisibility.mockReturnValue(true);

			component.onToggleChange(event);

			expect(visibilityMock.changeVisibility).toHaveBeenCalledWith('test-key', true);
		});

		it('should call toursService.update when toggle is checked', () => {
			const event = {checked: true} as MatSlideToggleChange;
			const mockConfig = [{id: 'a'}];
			tourServiceMock.config.mockReturnValue(mockConfig as any);
			visibilityMock.changeVisibility.mockReturnValue(true);

			component.onToggleChange(event);

			expect(tourServiceMock.update).toHaveBeenCalledWith(mockConfig);
		});

		it('should set showTourMenu to false when toggle is unchecked', () => {
			const event = {checked: false} as MatSlideToggleChange;
			visibilityMock.changeVisibility.mockReturnValue(false);

			component.onToggleChange(event);

			expect(component.showTourMenu).toBe(false);
		});

		it('should call changeVisibility with correct arguments when toggle is unchecked', () => {
			const event = {checked: false} as MatSlideToggleChange;
			visibilityMock.changeVisibility.mockReturnValue(false);

			component.onToggleChange(event);

			expect(visibilityMock.changeVisibility).toHaveBeenCalledWith('test-key', false);
		});

		it('should not call toursService.update when toggle is unchecked', () => {
			const event = {checked: false} as MatSlideToggleChange;
			visibilityMock.changeVisibility.mockReturnValue(false);

			component.onToggleChange(event);

			expect(tourServiceMock.update).not.toHaveBeenCalled();
		});

		it('should assign the result of changeVisibility back to showTourMenu', () => {
			const event = {checked: true} as MatSlideToggleChange;
			visibilityMock.changeVisibility.mockReturnValue(false);

			component.onToggleChange(event);

			expect(component.showTourMenu).toBe(false);
		});
	});

	describe('getScreenReaderBadgeKey', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should return key with suffix "one" when count is 1', () => {
			jest.spyOn(component, 'getBadgeCounter').mockReturnValue(1);

			const result = component.getScreenReaderBadgeKey('new');

			expect(result).toBe('i18n.ob-tour.tour-menu.button.badge.screen-reader.new.one');
		});

		it('should return key with suffix "one" when count is 0', () => {
			jest.spyOn(component, 'getBadgeCounter').mockReturnValue(0);

			const result = component.getScreenReaderBadgeKey('inProgress');

			expect(result).toBe('i18n.ob-tour.tour-menu.button.badge.screen-reader.in-progress.one');
		});

		it('should return key with suffix "other" when count is greater than 1', () => {
			jest.spyOn(component, 'getBadgeCounter').mockReturnValue(3);

			const result = component.getScreenReaderBadgeKey('new');

			expect(result).toBe('i18n.ob-tour.tour-menu.button.badge.screen-reader.new.other');
		});

		it('should call getBadgeCounter with provided state', () => {
			const counterSpy = jest.spyOn(component, 'getBadgeCounter').mockReturnValue(1);

			component.getScreenReaderBadgeKey('inProgress');

			expect(counterSpy).toHaveBeenCalledWith('inProgress');
		});

		it('should use dasherizeBadgeState for the state part of the key', () => {
			jest.spyOn(component, 'getBadgeCounter').mockReturnValue(1);
			const dashSpy = jest.spyOn(component, 'dasherizeBadgeState');

			component.getScreenReaderBadgeKey('inProgress');

			expect(dashSpy).toHaveBeenCalledWith('inProgress');
		});
	});
	describe('clear', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should call toursService.clearLocalStorage', () => {
			component.clear();
			expect(tourServiceMock.clearLocalStorage).toHaveBeenCalled();
		});

		it('should emit resetLists event', () => {
			const emitSpy = jest.spyOn(component.resetLists, 'emit');
			component.clear();
			expect(emitSpy).toHaveBeenCalled();
		});
	});
	describe('resolveVerticalPosition', () => {
		let rect: DOMRect;

		beforeEach(() => {
			jest.clearAllMocks();
			rect = {
				top: 100,
				bottom: 200,
				left: 0,
				right: 0,
				width: 0,
				height: 0,
				// eslint-disable-next-line id-length
				x: 0,
				// eslint-disable-next-line id-length
				y: 0,
				toJSON: () => ''
			} as unknown as DOMRect;
		});

		it('should return true when positionY is ABOVE', () => {
			jest.spyOn(component, 'positionY').mockReturnValue(ObtMenuPositionsY.ABOVE as any);

			const result = (component as any).resolveVerticalPosition(rect);

			expect(result).toBe(true);
		});

		it('should return false when positionY is BELOW', () => {
			jest.spyOn(component, 'positionY').mockReturnValue(ObtMenuPositionsY.BELOW as any);

			const result = (component as any).resolveVerticalPosition(rect);

			expect(result).toBe(false);
		});

		it('should return true when rect.top is greater than half of window.innerHeight', () => {
			jest.spyOn(component, 'positionY').mockReturnValue(ObtMenuPositionsY.AUTO as any);
			Object.defineProperty(window, 'innerHeight', {writable: true, configurable: true, value: 200});
			(rect as any).top = 150; // Mock-Property beliebig änderbar

			const result = (component as any).resolveVerticalPosition(rect);

			expect(result).toBe(true);
		});

		it('should return false when rect.top is less than or equal to half of window.innerHeight', () => {
			jest.spyOn(component, 'positionY').mockReturnValue(ObtMenuPositionsY.AUTO as any);
			Object.defineProperty(window, 'innerHeight', {writable: true, configurable: true, value: 400});
			(rect as any).top = 100;

			const result = (component as any).resolveVerticalPosition(rect);

			expect(result).toBe(false);
		});
	});

	describe('resolveHorizontalMenuPosition', () => {
		let rect: DOMRect;

		beforeEach(() => {
			jest.clearAllMocks();
			rect = {
				left: 0,
				width: 100,
				top: 0,
				bottom: 0,
				right: 0,
				height: 0,
				// eslint-disable-next-line id-length
				x: 0,
				// eslint-disable-next-line id-length
				y: 0,
				toJSON: () => ''
			} as unknown as DOMRect;
		});

		it('should return "start" when positionX is START', () => {
			jest.spyOn(component, 'positionX').mockReturnValue(ObtMenuPositionsX.START as any);

			const result = (component as any).resolveHorizontalMenuPosition(rect);

			expect(result).toBe('start');
		});

		it('should return "end" when positionX is END', () => {
			jest.spyOn(component, 'positionX').mockReturnValue(ObtMenuPositionsX.END as any);

			const result = (component as any).resolveHorizontalMenuPosition(rect);

			expect(result).toBe('end');
		});

		it('should return "start" when originCenterX is less than or equal to half of window.innerWidth', () => {
			jest.spyOn(component, 'positionX').mockReturnValue(ObtMenuPositionsX.AUTO as any);
			Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 400});
			(rect as any).left = 50;
			(rect as any).width = 100; // originCenterX = 100, half window = 200

			const result = (component as any).resolveHorizontalMenuPosition(rect);

			expect(result).toBe('start');
		});

		it('should return "end" when originCenterX is greater than half of window.innerWidth', () => {
			jest.spyOn(component, 'positionX').mockReturnValue(ObtMenuPositionsX.AUTO as any);
			Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 400});
			(rect as any).left = 300;
			(rect as any).width = 100; // originCenterX = 350, half window = 200

			const result = (component as any).resolveHorizontalMenuPosition(rect);

			expect(result).toBe('end');
		});
	});

	describe('updateOverlayPosition', () => {
		let rectMock: DOMRect;

		beforeEach(() => {
			jest.clearAllMocks();

			rectMock = {
				top: 100,
				bottom: 200,
				left: 50,
				right: 150,
				width: 100,
				height: 100,
				// eslint-disable-next-line id-length
				x: 0,
				// eslint-disable-next-line id-length
				y: 0,
				toJSON: () => ''
			} as unknown as DOMRect;

			component.overlayOrigin = {
				elementRef: {
					nativeElement: {
						getBoundingClientRect: jest.fn().mockReturnValue(rectMock)
					}
				}
			} as any;

			jest.spyOn(component as any, 'resolveVerticalPosition');
			jest.spyOn(component as any, 'resolveHorizontalMenuPosition');
			jest.spyOn(component as any, 'createBaseMenuPosition');
			jest.spyOn(component as any, 'createFlippedStepOverlayPosition');
			jest.spyOn(component as any, 'createCenteredStepOverlayPosition');
		});

		it('should return early when overlayOrigin is not defined', () => {
			component.overlayOrigin = undefined as any;

			const spy = jest.spyOn(component.menuPositions, 'set');

			(component as any).updateOverlayPosition();

			expect(spy).not.toHaveBeenCalled();
		});

		it('should set offsetY to -1 when placeAbove is true', () => {
			(component as any).resolveVerticalPosition.mockReturnValue(true);
			(component as any).resolveHorizontalMenuPosition.mockReturnValue('start');
			(component as any).createBaseMenuPosition.mockReturnValue({} as any);
			jest.spyOn(component.menuPositions, 'set');

			(component as any).updateOverlayPosition();

			const callArgs = (component as any).createBaseMenuPosition.mock.calls[0];
			expect(callArgs[2]).toBe(-1);
		});

		it('should set offsetY to 1 when placeAbove is false', () => {
			(component as any).resolveVerticalPosition.mockReturnValue(false);
			(component as any).resolveHorizontalMenuPosition.mockReturnValue('end');
			(component as any).createBaseMenuPosition.mockReturnValue({} as any);
			jest.spyOn(component.menuPositions, 'set');

			(component as any).updateOverlayPosition();

			const callArgs = (component as any).createBaseMenuPosition.mock.calls[0];
			expect(callArgs[2]).toBe(1);
		});

		it('should call resolveVerticalPosition with bounding rect', () => {
			(component as any).updateOverlayPosition();
			expect((component as any).resolveVerticalPosition).toHaveBeenCalledWith(rectMock);
		});

		it('should call resolveHorizontalMenuPosition with bounding rect', () => {
			(component as any).updateOverlayPosition();
			expect((component as any).resolveHorizontalMenuPosition).toHaveBeenCalledWith(rectMock);
		});

		it('should call createBaseMenuPosition with correct parameters', () => {
			(component as any).resolveVerticalPosition.mockReturnValue(true);
			(component as any).resolveHorizontalMenuPosition.mockReturnValue('start');

			(component as any).updateOverlayPosition();

			expect((component as any).createBaseMenuPosition).toHaveBeenCalledWith(true, 'start', -1);
		});

		it('should set menuPositions with base, flipped and centered positions', () => {
			const baseMock = {originX: 'start'};
			const flippedMock = {originX: 'end'};
			const centeredMock = {originX: 'center'};

			(component as any).resolveVerticalPosition.mockReturnValue(true);
			(component as any).resolveHorizontalMenuPosition.mockReturnValue('start');
			(component as any).createBaseMenuPosition.mockReturnValue(baseMock);
			(component as any).createFlippedStepOverlayPosition.mockReturnValue(flippedMock);
			(component as any).createCenteredStepOverlayPosition.mockReturnValue(centeredMock);

			const setSpy = jest.spyOn(component.menuPositions, 'set');

			(component as any).updateOverlayPosition();

			expect(setSpy).toHaveBeenCalledWith([baseMock, flippedMock, centeredMock]);
		});
	});

	describe('setupStores', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should set showTourMenu to the value returned by isVisible when it is true', () => {
			visibilityMock.isVisible.mockReturnValue(true);

			(component as any).setupStores('key-1');

			expect(component.showTourMenu).toBe(true);
		});

		it('should set showTourMenu to the value returned by isVisible when it is false', () => {
			visibilityMock.isVisible.mockReturnValue(false);

			(component as any).setupStores('key-2');

			expect(component.showTourMenu).toBe(false);
		});

		it('should set showTourMenu to true when isVisible returns null', () => {
			visibilityMock.isVisible.mockReturnValue(null as unknown as boolean);

			(component as any).setupStores('key-3');

			expect(component.showTourMenu).toBe(true);
		});

		it('should call isVisible with the provided key', () => {
			visibilityMock.isVisible.mockReturnValue(true);

			(component as any).setupStores('tour-key');

			expect(visibilityMock.isVisible).toHaveBeenCalledWith('tour-key');
		});
	});

	describe('setupToursConfig', () => {
		let configWithTours: ObtToursConfig;
		let configEmpty: ObtToursConfig;
		const mockTours: ObtTour[] = [{storageKey: '1', tourTitle: 'A', tourDescription: 'Desc', steps: []}];

		beforeEach(() => {
			jest.clearAllMocks();

			configWithTours = {tours: mockTours};
			configEmpty = {tours: []};

			jest.spyOn(component as any, 'updateOverlayPosition').mockImplementation();
			jest.spyOn(component as any, 'updateTours').mockImplementation();
			tourServiceMock.update.mockImplementation();
			tourServiceMock.config.mockReturnValue(mockTours);
		});

		it('should call updateOverlayPosition always', () => {
			(component as any).setupToursConfig(configWithTours);
			expect((component as any).updateOverlayPosition).toHaveBeenCalled();
		});

		it('should call tourService.update when config.tours has items', () => {
			(component as any).setupToursConfig(configWithTours);
			expect(tourServiceMock.update).toHaveBeenCalledWith(mockTours);
		});

		it('should not call tourService.update when config.tours is empty', () => {
			(component as any).setupToursConfig(configEmpty);
			expect(tourServiceMock.update).not.toHaveBeenCalled();
		});

		it('should not call tourService.update when config is undefined', () => {
			(component as any).setupToursConfig(undefined as unknown as ObtToursConfig);
			expect(tourServiceMock.update).not.toHaveBeenCalled();
		});

		it('should always call tourService.config', () => {
			(component as any).setupToursConfig(configWithTours);
			expect(tourServiceMock.config).toHaveBeenCalled();
		});

		it('should set allTours with tours returned from config', () => {
			const setSpy = jest.spyOn(component.allTours, 'set');
			(component as any).setupToursConfig(configWithTours);
			expect(setSpy).toHaveBeenCalledWith(mockTours);
		});

		it('should call updateTours with tours returned from config', () => {
			(component as any).setupToursConfig(configWithTours);
			expect((component as any).updateTours).toHaveBeenCalledWith(mockTours);
		});
	});
});
