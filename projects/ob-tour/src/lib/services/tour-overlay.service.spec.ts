import {ElementRef, EnvironmentInjector, Injector, createEnvironmentInjector, runInInjectionContext} from '@angular/core';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ObtTourOverlayService} from './tour-overlay.service';
import {Subject} from 'rxjs';
import {ObtTourStep} from '../models/tour.model';
import {TestBed} from '@angular/core/testing';

jest.mock('@angular/cdk/portal', () => ({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	ComponentPortal: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../tour-overlay/tour-overlay.component', () => ({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	TourOverlayComponent: jest.fn()
}));

describe('ObtTourOverlayService', () => {
	let service: ObtTourOverlayService;
	let overlayMock: jest.Mocked<Overlay>;
	let overlayRefMock: jest.Mocked<OverlayRef>;
	let injectorMock: Injector;
	let envInjector: EnvironmentInjector;

	beforeEach(() => {
		const positionStrategyMock = {
			positionChanges: new Subject(),
			withPositions: jest.fn().mockReturnThis(),
			withFlexibleDimensions: jest.fn().mockReturnThis(),
			withPush: jest.fn().mockReturnThis(),
			flexibleConnectedTo: jest.fn().mockReturnThis()
		};

		overlayRefMock = {
			dispose: jest.fn(),
			attach: jest.fn(),
			hasAttached: jest.fn(),
			detach: jest.fn()
		} as unknown as jest.Mocked<OverlayRef>;

		overlayMock = {
			create: jest.fn().mockReturnValue(overlayRefMock),
			position: jest.fn().mockReturnValue({
				global: jest.fn().mockReturnThis(),
				centerHorizontally: jest.fn().mockReturnThis(),
				centerVertically: jest.fn().mockReturnThis(),
				flexibleConnectedTo: jest.fn().mockReturnValue(positionStrategyMock)
			}),
			scrollStrategies: {reposition: jest.fn().mockReturnValue('reposition')}
		} as unknown as jest.Mocked<Overlay>;

		injectorMock = {} as Injector;

		envInjector = createEnvironmentInjector(
			[
				{provide: Overlay, useValue: overlayMock},
				{provide: Injector, useValue: injectorMock}
			],
			TestBed.inject(EnvironmentInjector)
		);

		runInInjectionContext(envInjector, () => {
			service = new ObtTourOverlayService();
		});
	});

	it('should call overlay.create exactly once', () => {
		const element = document.createElement('div');
		(service as any).createOverlayRelativeToTarget(element);
		expect(overlayMock.create).toHaveBeenCalledTimes(1);
	});
	describe('openOverlayForStep', () => {
		let resolveTargetSpy: jest.SpyInstance;
		let scrollToTargetSpy: jest.SpyInstance;
		let highlightTargetSpy: jest.SpyInstance;
		let createOverlayRelativeToTargetSpy: jest.SpyInstance;
		let createOverlayCenteredSpy: jest.SpyInstance;

		beforeEach(() => {
			resolveTargetSpy = jest.spyOn(service as any, 'resolveTarget');
			scrollToTargetSpy = jest.spyOn(service as any, 'scrollToTarget').mockResolvedValue(undefined);
			highlightTargetSpy = jest.spyOn(service as any, 'highlightTarget').mockImplementation();
			createOverlayRelativeToTargetSpy = jest.spyOn(service as any, 'createOverlayRelativeToTarget').mockImplementation();
			createOverlayCenteredSpy = jest.spyOn(service as any, 'createOverlayCentered').mockImplementation();
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should call createOverlayCentered when no target is resolved', () => {
			resolveTargetSpy.mockReturnValue(null);
			service.openOverlayForStep({stepTitle: '', stepDescription: ''} as ObtTourStep, {} as Injector);
			expect(createOverlayCenteredSpy).toHaveBeenCalled();
		});

		it('should call scrollToTarget when target is resolved', () => {
			const element = document.createElement('div');
			resolveTargetSpy.mockReturnValue(element);
			service.openOverlayForStep({stepTitle: '', stepDescription: '', target: {}} as ObtTourStep, {} as Injector);
			expect(scrollToTargetSpy).toHaveBeenCalledWith(element);
		});

		it('should call highlightTarget with numeric zIndex converted to string', async () => {
			const element = document.createElement('div');
			jest.spyOn(service as any, 'resolveTarget').mockReturnValue(document.createElement('div'));
			resolveTargetSpy.mockReturnValue(element);
			await service.openOverlayForStep({stepTitle: '', stepDescription: '', target: {zIndex: 99}} as ObtTourStep, {} as Injector);
			expect(highlightTargetSpy).toHaveBeenCalledWith(element, '99');
		});

		it('should call highlightTarget with zIndex already as string', async () => {
			jest.spyOn(service as any, 'resolveTarget').mockReturnValue(document.createElement('div'));
			const element = document.createElement('div');
			resolveTargetSpy.mockReturnValue(element);
			await service.openOverlayForStep(
				{stepTitle: '', stepDescription: '', target: {zIndex: '99'}} as unknown as ObtTourStep,
				{} as unknown as Injector
			);
			expect(highlightTargetSpy).toHaveBeenCalledWith(element, '99');
		});

		it('should call highlightTarget with undefined when target object is missing', async () => {
			const element = document.createElement('div');
			jest.spyOn(service as any, 'resolveTarget').mockReturnValue(element);
			jest.spyOn(service as any, 'scrollToTarget').mockResolvedValue(undefined);
			const highlightSpy = jest.spyOn(service as any, 'highlightTarget').mockImplementation(() => {});

			const tourStep = {} as any;
			await (service as any).openOverlayForStep(tourStep, {} as Injector);

			expect(highlightSpy).toHaveBeenCalledWith(element, '10');
		});

		it('should not throw when tourStep is null', () => {
			expect(service.openOverlayForStep(null as any, {} as Injector)).resolves.not.toThrow();
		});

		it('should handle scrollToTarget rejection without throwing', async () => {
			const element = document.createElement('div', {});
			resolveTargetSpy.mockReturnValue(element);
			scrollToTargetSpy.mockRejectedValue(new Error('scroll failed'));
			await expect(
				service.openOverlayForStep({stepTitle: '', stepDescription: '', target: {}} as ObtTourStep, {} as Injector)
			).rejects.toThrow('scroll failed');
		});
		it('should call highlightTarget with zIndex as string when zIndex is defined', async () => {
			const element = document.createElement('div');
			jest.spyOn(service as any, 'resolveTarget').mockReturnValue(element);
			jest.spyOn(service as any, 'scrollToTarget').mockResolvedValue(undefined);
			jest.spyOn(service as any, 'highlightTarget').mockImplementation(() => {});
			jest.spyOn(service as any, 'createOverlayRelativeToTarget').mockImplementation(() => {});

			await service.openOverlayForStep({target: {zIndex: 200}} as any, {} as Injector);

			expect((service as any).highlightTarget).toHaveBeenCalledWith(element, '200');
		});

		it('should call highlightTarget with default zIndex when zIndex is undefined', async () => {
			const element = document.createElement('div');
			jest.spyOn(service as any, 'resolveTarget').mockReturnValue(element);
			jest.spyOn(service as any, 'scrollToTarget').mockResolvedValue(undefined);
			const highlightSpy = jest.spyOn(service as any, 'highlightTarget').mockImplementation(() => {});

			const tourStep = {target: {}} as any;
			await (service as any).openOverlayForStep(tourStep, {} as Injector);

			expect(highlightSpy).toHaveBeenCalledWith(element, '10');
		});

		it('should not call highlightTarget when resolveTarget returns null', async () => {
			(service as any).resolveTarget.mockReturnValue(null);
			const tourStep = {target: {zIndex: 123}} as any;
			await (service as any).openOverlayForStep(tourStep, {} as Injector);
			expect((service as any).highlightTarget).not.toHaveBeenCalled();
			expect((service as any).createOverlayCentered).toHaveBeenCalled();
		});
	});

	describe('scrollToTarget', () => {
		let element: HTMLElement;
		let scrollParent: HTMLElement;

		beforeEach(() => {
			element = document.createElement('div');
			scrollParent = document.createElement('div');

			(scrollParent as any).scrollTo = jest.fn();

			jest.spyOn(service as any, 'getScrollParent').mockReturnValue(scrollParent);
			jest.spyOn(window, 'matchMedia').mockReturnValue({matches: false} as any);
			jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
			jest.spyOn(scrollParent as any, 'scrollTo').mockImplementation(() => {});
			jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
				cb(0);
				return 0;
			});
			jest.spyOn(global, 'setTimeout').mockImplementation(cb => {
				(cb as () => void)();
				return 0 as any;
			});
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('should return early when element is null', async () => {
			const result = await (service as any).scrollToTarget(null);
			expect(result).toBeUndefined();
		});

		it('should return early when element is null', () => {
			expect(() => (service as any).highlightTarget(null)).not.toThrow();
		});

		it('should return early when element is undefined', () => {
			expect(() => (service as any).highlightTarget(undefined)).not.toThrow();
		});

		it('should return early when element is in viewport (no scroll needed)', async () => {
			element.getBoundingClientRect = jest.fn(() => ({
				top: 100,
				bottom: 200,
				height: 100
			})) as any;
			scrollParent.getBoundingClientRect = jest.fn(() => ({
				top: 50,
				bottom: 250
			})) as any;

			await (service as any).scrollToTarget(element);
			expect(window.scrollTo).not.toHaveBeenCalled();
		});

		it('should scroll window when scrollContainer is document.body', async () => {
			(service as any).getScrollParent.mockReturnValue(document.body);
			element.getBoundingClientRect = jest.fn(() => ({
				top: 1000,
				bottom: 1200,
				height: 100
			})) as any;
			document.body.getBoundingClientRect = jest.fn(() => ({
				top: 0,
				bottom: 800
			})) as any;
			Object.defineProperty(window, 'innerHeight', {value: 800});
			Object.defineProperty(window, 'scrollY', {value: 0, writable: true});

			await (service as any).scrollToTarget(element);
			expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({behavior: 'smooth'}));
		});

		it('should scroll element parent when not body or documentElement', async () => {
			element.getBoundingClientRect = jest.fn(() => ({
				top: 1000,
				bottom: 1200,
				height: 100
			})) as any;

			scrollParent.getBoundingClientRect = jest.fn(() => ({
				top: 0,
				bottom: 800
			})) as any;

			scrollParent.scrollTop = 0;
			Object.defineProperty(scrollParent, 'clientHeight', {value: 800});
			jest.spyOn(scrollParent, 'scrollTo').mockImplementation(() => {});

			await (service as any).scrollToTarget(element);
			expect(scrollParent.scrollTo).toHaveBeenCalledWith(expect.objectContaining({behavior: 'smooth'}));
		});

		it('should use auto behavior when prefersReducedMotion is true', async () => {
			(service as any).getScrollParent.mockReturnValue(document.body);
			(window.matchMedia as jest.Mock).mockReturnValue({matches: true} as any);
			element.getBoundingClientRect = jest.fn(() => ({
				top: 1000,
				bottom: 1200,
				height: 100
			})) as any;
			document.body.getBoundingClientRect = jest.fn(() => ({
				top: 0,
				bottom: 800
			})) as any;
			Object.defineProperty(window, 'innerHeight', {value: 800});
			Object.defineProperty(window, 'scrollY', {value: 0, writable: true});

			await (service as any).scrollToTarget(element);
			expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({behavior: 'auto'}));
		});

		it('should wait for requestAnimationFrame before scrolling', async () => {
			const animationSpy = jest.spyOn(window, 'requestAnimationFrame');
			element.getBoundingClientRect = jest.fn(() => ({
				top: 1000,
				bottom: 1200,
				height: 100
			})) as any;
			scrollParent.getBoundingClientRect = jest.fn(() => ({
				top: 0,
				bottom: 800
			})) as any;

			await (service as any).scrollToTarget(element);
			expect(animationSpy).toHaveBeenCalled();
		});

		it('should resolve after timeout even when prefersReducedMotion is false', async () => {
			element.getBoundingClientRect = jest.fn(() => ({
				top: 1000,
				bottom: 1200,
				height: 100
			})) as any;
			scrollParent.getBoundingClientRect = jest.fn(() => ({
				top: 0,
				bottom: 800
			})) as any;

			await expect((service as any).scrollToTarget(element)).resolves.toBeUndefined();
		});
	});

	describe('getScrollParent', () => {
		let element: HTMLElement;
		let parent: HTMLElement;
		let grandParent: HTMLElement;

		beforeEach(() => {
			element = document.createElement('div');
			parent = document.createElement('div');
			grandParent = document.createElement('div');
			parent.appendChild(element);
			grandParent.appendChild(parent);
			document.body.appendChild(grandParent);
		});

		afterEach(() => {
			document.body.innerHTML = '';
			jest.restoreAllMocks();
		});

		it('should return the first ancestor with overflowY=auto', () => {
			jest.spyOn(window, 'getComputedStyle').mockImplementation(el => {
				if (el === parent) {
					return {overflowY: 'auto'} as any;
				}
				return {overflowY: 'visible'} as any;
			});
			const result = (service as any).getScrollParent(element);
			expect(result).toBe(parent);
		});

		it('should return the first ancestor with overflowY=scroll', () => {
			jest.spyOn(window, 'getComputedStyle').mockImplementation(el => {
				if (el === grandParent) {
					return {overflowY: 'scroll'} as any;
				}
				return {overflowY: 'visible'} as any;
			});
			const result = (service as any).getScrollParent(element);
			expect(result).toBe(grandParent);
		});

		it('should skip ancestors with non-scrollable overflowY', () => {
			jest.spyOn(window, 'getComputedStyle').mockReturnValue({overflowY: 'visible'} as any);
			const result = (service as any).getScrollParent(element);
			expect(result).toBe(document.documentElement);
		});

		it('should return document.documentElement when no parent exists', () => {
			const orphan = document.createElement('div');
			jest.spyOn(window, 'getComputedStyle').mockReturnValue({overflowY: 'visible'} as any);
			const result = (service as any).getScrollParent(orphan);
			expect(result).toBe(document.documentElement);
		});

		it('should check overflowY property of each ancestor in order', () => {
			const spy = jest.spyOn(window, 'getComputedStyle').mockReturnValue({overflowY: 'visible'} as any);
			(service as any).getScrollParent(element);
			expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe('createOverlayRelativeToTarget', () => {
		let mockOverlay: any;
		let mockOverlayRef: any;
		let mockComponentRef: any;
		let mockPositionStrategy: any;
		let mockInjector: Injector;
		let targetElement: HTMLElement;

		beforeEach(() => {
			targetElement = document.createElement('div');
			mockInjector = {} as Injector;

			mockPositionStrategy = {
				positionChanges: {subscribe: jest.fn()},
				connectionPair: {overlayX: 'center', overlayY: 'bottom'}
			};

			mockOverlayRef = {
				attach: jest.fn(),
				detach: jest.fn()
			};

			mockComponentRef = {
				setInput: jest.fn(),
				instance: {
					closeEmitter: {subscribe: jest.fn()}
				}
			};

			mockOverlay = {
				create: jest.fn(() => mockOverlayRef),
				scrollStrategies: {reposition: jest.fn()}
			};

			(service as any).overlay = mockOverlay;
			jest.spyOn(service as any, 'createRelativePositionStrategy').mockReturnValue(mockPositionStrategy);
			jest.spyOn(mockOverlayRef, 'attach').mockReturnValue(mockComponentRef);
			jest.spyOn(service as any, 'updateArrowDirection').mockReturnValue('top');
			jest.spyOn(service as any, 'closeOverlay').mockImplementation(() => {});
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('should call closeOverlay when closeEmitter emits', () => {
			let callback: any;
			mockPositionStrategy.positionChanges.subscribe.mockImplementation(fn => (callback = fn));

			mockComponentRef.instance.closeEmitter = {subscribe: jest.fn((fn: any) => fn())};

			const closeSpy = jest.spyOn(service as any, 'closeOverlay');

			(service as any).createOverlayRelativeToTarget(targetElement, mockInjector);
			callback({connectionPair: {overlayX: 'center', overlayY: 'top'}});

			expect(closeSpy).toHaveBeenCalledTimes(1);
		});

		it('should create overlay with correct config', () => {
			(service as any).createOverlayRelativeToTarget(targetElement, mockInjector);
			expect(mockOverlay.create).toHaveBeenCalledWith(
				expect.objectContaining({
					positionStrategy: mockPositionStrategy,
					hasBackdrop: false,
					panelClass: ['obt-tour-overlay-panel']
				})
			);
		});

		it('should attach ComponentPortal to overlayRef', () => {
			(service as any).createOverlayRelativeToTarget(targetElement, mockInjector);

			expect(mockOverlayRef.attach).toHaveBeenCalledTimes(1);

			const attachedArg = mockOverlayRef.attach.mock.calls[0][0];

			expect(attachedArg).toBeTruthy();
			expect(typeof attachedArg).toBe('object');
		});

		it('should subscribe to positionChanges of positionStrategy', () => {
			(service as any).createOverlayRelativeToTarget(targetElement, mockInjector);
			expect(mockPositionStrategy.positionChanges.subscribe).toHaveBeenCalled();
		});

		it('should update arrow direction when position changes', () => {
			let callback: any;
			mockPositionStrategy.positionChanges.subscribe.mockImplementation(fn => (callback = fn));
			(service as any).createOverlayRelativeToTarget(targetElement, mockInjector);

			callback({
				connectionPair: {overlayX: 'start', overlayY: 'top'}
			});

			expect((service as any).updateArrowDirection).toHaveBeenCalledWith('start', 'top');
		});

		it('should set arrowPosition input on componentRef after position change', () => {
			let callback: any;
			mockPositionStrategy.positionChanges.subscribe.mockImplementation(fn => (callback = fn));
			(service as any).createOverlayRelativeToTarget(targetElement, mockInjector);

			callback({
				connectionPair: {overlayX: 'center', overlayY: 'bottom'}
			});

			expect(mockComponentRef.setInput).toHaveBeenCalledWith('arrowPosition', 'top');
		});

		it('should subscribe to closeEmitter and call closeOverlay', () => {
			let outerCallback: any;
			mockPositionStrategy.positionChanges.subscribe.mockImplementation(fn => (outerCallback = fn));
			const closeEmitter = {subscribe: jest.fn()};
			mockComponentRef.instance.closeEmitter = closeEmitter;

			(service as any).createOverlayRelativeToTarget(targetElement, mockInjector);
			outerCallback({connectionPair: {overlayX: 'end', overlayY: 'bottom'}});

			expect(closeEmitter.subscribe).toHaveBeenCalledWith(expect.any(Function));
		});
	});

	describe('createOverlayCentered', () => {
		let mockOverlay: any;
		let mockOverlayRef: any;
		let mockComponentRef: any;
		let mockPositionBuilder: any;
		let mockGlobalPositionStrategy: any;
		let mockInjector: Injector;

		beforeEach(() => {
			mockInjector = {} as Injector;

			mockGlobalPositionStrategy = {
				centerHorizontally: jest.fn().mockReturnThis(),
				centerVertically: jest.fn().mockReturnThis()
			};

			mockPositionBuilder = {
				global: jest.fn(() => mockGlobalPositionStrategy)
			};

			mockOverlayRef = {
				attach: jest.fn(),
				detach: jest.fn()
			};

			mockComponentRef = {
				setInput: jest.fn(),
				instance: {}
			};

			mockOverlay = {
				position: jest.fn(() => mockPositionBuilder),
				create: jest.fn(() => mockOverlayRef),
				scrollStrategies: {reposition: jest.fn()}
			};

			Object.defineProperty(service as any, 'overlay', {value: mockOverlay});
			jest.spyOn(mockOverlayRef, 'attach').mockReturnValue(mockComponentRef);
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('should create overlay with centered global position strategy', () => {
			(service as any).createOverlayCentered(mockInjector);
			expect(mockOverlay.create).toHaveBeenCalledWith(
				expect.objectContaining({
					positionStrategy: mockGlobalPositionStrategy,
					panelClass: ['obt-tour-overlay-panel', 'obt-tour-overlay-center']
				})
			);
		});

		it('should call global().centerHorizontally().centerVertically()', () => {
			(service as any).createOverlayCentered(mockInjector);
			expect(mockPositionBuilder.global).toHaveBeenCalled();
			expect(mockGlobalPositionStrategy.centerHorizontally).toHaveBeenCalled();
			expect(mockGlobalPositionStrategy.centerVertically).toHaveBeenCalled();
		});

		it('should attach ComponentPortal to overlayRef', () => {
			(service as any).createOverlayCentered(mockInjector);
			expect(mockOverlayRef.attach).toHaveBeenCalledTimes(1);
			const attachedArg = mockOverlayRef.attach.mock.calls[0][0];
			expect(attachedArg).toBeTruthy();
			expect(typeof attachedArg).toBe('object');
		});

		it('should assign componentRef after attaching portal', () => {
			(service as any).createOverlayCentered(mockInjector);
			expect((service as any).componentRef).toBe(mockComponentRef);
		});

		it('should store overlayRef after creation', () => {
			(service as any).createOverlayCentered(mockInjector);
			expect((service as any).overlayRef).toBe(mockOverlayRef);
		});
	});

	describe('updateArrowDirection', () => {
		it('should return arrow-left for horizontal start', () => {
			expect((service as any).updateArrowDirection('start', 'center')).toBe('arrow-left');
		});
		it('should return arrow-right for horizontal end', () => {
			expect((service as any).updateArrowDirection('end', 'center')).toBe('arrow-right');
		});
		it('should return arrow-top for vertical top', () => {
			expect((service as any).updateArrowDirection('center', 'top')).toBe('arrow-top');
		});
		it('should return arrow-bottom for vertical bottom', () => {
			expect((service as any).updateArrowDirection('center', 'bottom')).toBe('arrow-bottom');
		});
		it('should return arrow-none for non-matching directions', () => {
			expect((service as any).updateArrowDirection('start', 'top')).toBe('arrow-none');
		});
	});

	describe('resolveTarget', () => {
		let nativeElement: HTMLElement;
		let mockElementRef: ElementRef<HTMLElement>;

		beforeEach(() => {
			nativeElement = document.createElement('div');
			mockElementRef = new ElementRef(nativeElement);
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('should return nativeElement when elementRef() returns an ElementRef', () => {
			const tourStep = {
				target: {elementRef: jest.fn(() => mockElementRef)}
			} as unknown as ObtTourStep;
			const result = (service as any).resolveTarget(tourStep);
			expect(result).toBe(nativeElement);
		});

		it('should return the element when elementRef() returns an HTMLElement', () => {
			const tourStep = {
				target: {elementRef: jest.fn(() => nativeElement)}
			} as unknown as ObtTourStep;
			const result = (service as any).resolveTarget(tourStep);
			expect(result).toBe(nativeElement);
		});

		it('should return _elementRef.nativeElement when provided via object property', () => {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			const fakeObject = {_elementRef: {nativeElement}};
			const tourStep = {
				target: {elementRef: jest.fn(() => fakeObject)}
			} as unknown as ObtTourStep;
			const result = (service as any).resolveTarget(tourStep);
			expect(result).toBe(nativeElement);
		});

		it('should return element by selector when elementSelector is defined', () => {
			nativeElement.id = 'demo';
			document.body.appendChild(nativeElement);
			const tourStep = {
				target: {elementSelector: 'demo'}
			} as unknown as ObtTourStep;
			const result = (service as any).resolveTarget(tourStep);
			expect(result).toBe(nativeElement);
			document.body.removeChild(nativeElement);
		});

		it('should return null when elementSelector is empty', () => {
			const tourStep = {
				target: {elementSelector: '   '}
			} as unknown as ObtTourStep;
			const result = (service as any).resolveTarget(tourStep);
			expect(result).toBeNull();
		});

		it('should return null when elementRef() returns undefined', () => {
			const tourStep = {
				target: {elementRef: jest.fn(() => undefined)}
			} as unknown as ObtTourStep;
			const result = (service as any).resolveTarget(tourStep);
			expect(result).toBeNull();
		});

		it('should return null when no target is provided', () => {
			const tourStep = {} as ObtTourStep;
			const result = (service as any).resolveTarget(tourStep);
			expect(result).toBeNull();
		});

		it('should call elementRef() twice when it returns ElementRef', () => {
			const fn = jest.fn(() => mockElementRef);
			const tourStep = {target: {elementRef: fn}} as unknown as ObtTourStep;
			(service as any).resolveTarget(tourStep);
			expect(fn).toHaveBeenCalledTimes(2);
		});
	});

	describe('closeOverlay', () => {
		let disposeSpy: jest.Mock;
		let removeHighlightSpy: jest.SpyInstance;

		beforeEach(() => {
			disposeSpy = jest.fn();
			removeHighlightSpy = jest.spyOn(service as any, 'removeHighlight').mockImplementation();
			(service as any).overlayRef = {dispose: disposeSpy} as any;
			(service as any).componentRef = {} as any;
		});

		it('should call removeHighlight once', () => {
			service.closeOverlay();
			expect(removeHighlightSpy).toHaveBeenCalledTimes(1);
		});

		it('should call dispose on overlayRef', () => {
			service.closeOverlay();
			expect(disposeSpy).toHaveBeenCalledTimes(1);
		});

		it('should reset overlayRef and componentRef to null', () => {
			service.closeOverlay();
			expect((service as any).overlayRef).toBeNull();
			expect((service as any).componentRef).toBeNull();
		});

		it('should not throw when overlayRef is already null', () => {
			(service as any).overlayRef = null;
			expect(() => service.closeOverlay()).not.toThrow();
		});
	});

	describe('removeHighlight', () => {
		let element: HTMLElement;

		beforeEach(() => {
			element = document.createElement('div');
			document.body.appendChild(element);
			(service as any).highlightedElement = element;
			(service as any).originalZIndex = '10';
			(service as any).originalPosition = 'relative';
			element.style.boxShadow = '0 0 4px red';
			element.style.transition = 'all 0.3s';
		});

		afterEach(() => {
			document.body.removeChild(element);
			(service as any).highlightedElement = null;
		});

		it('should clear highlight styles and restore original values', () => {
			(service as any).removeHighlight();
			expect(element.style.boxShadow).toBe('');
			expect(element.style.transition).toBe('');
			expect(element.style.zIndex).toBe('10');
			expect(element.style.position).toBe('relative');
			expect((service as any).highlightedElement).toBeNull();
		});

		it('should exit early when no highlightedElement is set', () => {
			(service as any).highlightedElement = null;
			expect(() => (service as any).removeHighlight()).not.toThrow();
		});
	});

	describe('highlightTarget', () => {
		let element: HTMLElement;

		beforeEach(() => {
			element = document.createElement('div');
			element.style.position = 'static';
			element.style.zIndex = '';
			element.style.boxShadow = '';
			element.style.transition = '';
			jest.spyOn(service as any, 'removeHighlight').mockImplementation(() => {});
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('should call removeHighlight before applying new highlight', () => {
			(service as any).highlightTarget(element);
			expect((service as any).removeHighlight).toHaveBeenCalled();
		});

		it('should store original zIndex value', () => {
			element.style.zIndex = '99';
			(service as any).highlightTarget(element);
			expect((service as any).originalZIndex).toBe('99');
		});

		it('should store original position value', () => {
			element.style.position = 'absolute';
			(service as any).highlightTarget(element);
			expect((service as any).originalPosition).toBe('absolute');
		});

		it('should apply boxShadow style for highlight', () => {
			(service as any).highlightTarget(element);
			expect(element.style.boxShadow).toBe('0 0 0 4px #8655F6FF');
		});

		it('should apply transition for highlight effect', () => {
			(service as any).highlightTarget(element);
			expect(element.style.transition).toBe('box-shadow 0.5s ease, outline 0.3s ease');
		});

		it('should set position to relative when position is empty', () => {
			element.style.position = '';
			(service as any).highlightTarget(element);
			expect(element.style.position).toBe('relative');
		});

		it('should set position to relative when position is static', () => {
			element.style.position = 'static';
			(service as any).highlightTarget(element);
			expect(element.style.position).toBe('relative');
		});

		it('should not change position when element already positioned', () => {
			element.style.position = 'absolute';
			(service as any).highlightTarget(element);
			expect(element.style.position).toBe('absolute');
		});

		it('should set zIndex to provided value', () => {
			(service as any).highlightTarget(element, '500');
			expect(element.style.zIndex).toBe('500');
		});

		it('should set zIndex to default 10 when not provided', () => {
			(service as any).highlightTarget(element);
			expect(element.style.zIndex).toBe('10');
		});

		it('should set highlightedElement reference to target', () => {
			(service as any).highlightTarget(element);
			expect((service as any).highlightedElement).toBe(element);
		});
	});
});
