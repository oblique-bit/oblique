import {TestBed, fakeAsync} from '@angular/core/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {Overlay} from '@angular/cdk/overlay';
import {ObtTourOverlayService} from './tour-overlay.service';
import {ObTourServiceMock} from './_mock/tour-mock.service';
import {ObtTourService} from '../services/tour.service';
import {ObTourStep} from '../models/tour-step.model';
import {ComponentPortal} from '@angular/cdk/portal';

describe('TourOverlayService', () => {
	let tourServiceMock: ObTourServiceMock;
	let mockOverlay: Partial<Overlay>;
	let openSpy: jest.SpyInstance;
	let closeSpy: jest.SpyInstance;
	let tourOverlayService: ObtTourOverlayService;

	beforeEach(() => {
		tourServiceMock = new ObTourServiceMock();

		mockOverlay = {
			position: jest.fn(() => ({
				global: jest.fn(() => ({
					centerHorizontally: jest.fn().mockReturnThis(),
					centerVertically: jest.fn().mockReturnThis()
				})),
				flexibleConnectedTo: jest.fn(() => ({
					withPositions: jest.fn().mockReturnThis(),
					withFlexibleDimensions: jest.fn().mockReturnThis(),
					withPush: jest.fn().mockReturnThis()
				}))
			})),
			create: jest.fn(() => ({
				attach: jest.fn(),
				dispose: jest.fn()
			})),
			scrollStrategies: {
				block: jest.fn(() => ({})),
				reposition: jest.fn(() => ({
					enable: jest.fn(),
					disable: jest.fn()
				}))
			}
		} as unknown as Overlay;

		TestBed.configureTestingModule({
			imports: [
				TranslateModule.forRoot({
					defaultLanguage: 'en',
					loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
				})
			],
			providers: [
				{provide: ObtTourService, useValue: tourServiceMock},
				{provide: Overlay, useValue: mockOverlay}
			]
		});
		tourOverlayService = TestBed.inject(ObtTourOverlayService);
		tourServiceMock.init([{tourTitle: 'testTourTitle', steps: [], tourDescription: 'description', state: 'new'}]);
		openSpy = jest.spyOn(tourOverlayService as any, 'open');
		closeSpy = jest.spyOn(tourOverlayService as any, 'close');
		openSpy.mockClear();
		closeSpy.mockClear();
	});

	afterEach(() => {
		tourServiceMock.setCurrentStep(null);
		tourServiceMock.setActiveTour(null);
		document.body.innerHTML = '';
		openSpy.mockClear();
		closeSpy.mockClear();
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	describe('constructor', () => {
		const tourStepMock: ObTourStep = {
			id: 'step1',
			stepDescription: 'Description A',
			stepTitle: 'Title A',
			position: 'auto'
		} as unknown as ObTourStep;

		interface EffectTestCase {
			title: string;
			configureSignal: (tourService: ObTourServiceMock) => void;
			verify: (openSpy: jest.SpyInstance, closeSpy: jest.SpyInstance) => void;
		}

		const effectTestCases: EffectTestCase[] = [
			{
				title: 'should call open() when currentStep() returns a step',
				configureSignal: (obTourServiceMock: ObTourServiceMock): void => {
					obTourServiceMock.setCurrentStep(tourStepMock);
				},
				verify: (openSpyInstance: jest.SpyInstance, closeSpyInstance: jest.SpyInstance): void => {
					expect(openSpyInstance).toHaveBeenCalledWith(tourStepMock);
					void closeSpyInstance;
				}
			},
			{
				title: 'should call close() when currentStep() returns null',
				configureSignal: (obTourServiceMock: ObTourServiceMock): void => {
					obTourServiceMock.setCurrentStep(null);
				},
				verify: (openSpyInstance: jest.SpyInstance, closeSpyInstance: jest.SpyInstance): void => {
					expect(closeSpyInstance).toHaveBeenCalled();
					void openSpyInstance;
				}
			},
			{
				title: 'should only call close() initially when currentStep() returns a step',
				configureSignal: (obTourServiceMock: ObTourServiceMock): void => {
					obTourServiceMock.setCurrentStep(tourStepMock);
				},
				verify: (openSpyInstance: jest.SpyInstance, closeSpyInstance: jest.SpyInstance): void => {
					expect(closeSpyInstance).toHaveBeenCalledTimes(1);
					void openSpyInstance;
				}
			},
			{
				title: 'should not call open() when currentStep() returns null',
				configureSignal: (obTourServiceMock: ObTourServiceMock): void => {
					obTourServiceMock.setCurrentStep(null);
				},
				verify: (openSpyInstance: jest.SpyInstance, closeSpyInstance: jest.SpyInstance): void => {
					expect(openSpyInstance).not.toHaveBeenCalled();
					void closeSpyInstance;
				}
			}
		];

		it.each(effectTestCases)(
			'$title',
			fakeAsync((effectCase: EffectTestCase) => {
				effectCase.configureSignal(tourServiceMock);
				TestBed.tick();
				effectCase.verify(openSpy, closeSpy);
			})
		);
	});
	describe('hasTarget', () => {
		const stepWithoutTarget: ObTourStep = {
			position: 'center',
			stepTitle: 'No Target',
			stepDescription: 'Step without target'
		};

		const stepWithTarget: ObTourStep = {
			position: 'auto',
			stepTitle: 'With Target',
			stepDescription: 'Step with target',
			target: {elementSelector: '#target'}
		};

		describe.each([
			{
				title: 'should return true when step has target property',
				step: stepWithTarget,
				expected: true
			},
			{
				title: 'should return false when step has no target property',
				step: stepWithoutTarget,
				expected: false
			}
		])('$title', ({step, expected}) => {
			it(`returns ${expected}`, () => {
				const result = (tourOverlayService as any).hasTarget(step);
				expect(result).toBe(expected);
			});
		});
	});

	describe('open()', () => {
		it('should call createCenteredOverlay() when step has no target', () => {
			const centeredSpy = jest.spyOn(tourOverlayService as any, 'createCenteredOverlay');
			const stepWithoutTarget: ObTourStep = {
				stepTitle: 'No Target',
				stepDescription: 'desc',
				position: 'auto'
			};
			(tourOverlayService as any).open(stepWithoutTarget);
			expect(centeredSpy).toHaveBeenCalled();
		});

		it('should call createCenteredOverlay() when target element is missing', () => {
			const centeredSpy = jest.spyOn(tourOverlayService as any, 'createCenteredOverlay');
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
			const stepWithInvalidTarget: ObTourStep = {
				stepTitle: 'Invalid Target',
				stepDescription: 'desc',
				position: 'auto',
				target: {elementSelector: '#does-not-exist'}
			};
			(tourOverlayService as any).open(stepWithInvalidTarget);
			expect(centeredSpy).toHaveBeenCalled();
			warnSpy.mockRestore();
		});

		it('should create overlay with valid target element', () => {
			const element = document.createElement('div');
			element.id = 'valid-target';
			document.body.appendChild(element);

			const createSpy = jest.spyOn(mockOverlay, 'create');

			const stepWithValidTarget: ObTourStep = {
				stepTitle: 'Valid Target',
				stepDescription: 'desc',
				position: 'auto',
				target: {elementSelector: '#valid-target'}
			};
			(tourOverlayService as any).open(stepWithValidTarget);

			expect(createSpy).toHaveBeenCalled();
			document.body.removeChild(element);
		});

		it('should attach ComponentPortal when overlayRef is created', () => {
			const attachSpy = jest.fn();
			(tourOverlayService as any).overlay = {
				position: jest.fn(() => ({
					flexibleConnectedTo: jest.fn(() => ({
						withPositions: jest.fn().mockReturnThis(),
						withFlexibleDimensions: jest.fn().mockReturnThis(),
						withPush: jest.fn().mockReturnThis()
					}))
				})),
				create: jest.fn(() => ({
					attach: attachSpy,
					dispose: jest.fn()
				})),
				scrollStrategies: {
					reposition: jest.fn(() => ({
						enable: jest.fn(),
						disable: jest.fn()
					}))
				}
			};
			const step: ObTourStep = {
				stepTitle: 'Attach Test',
				stepDescription: 'desc',
				position: 'auto',
				target: {elementRef: document.createElement('div')}
			};
			(tourOverlayService as any).open(step);
			expect(attachSpy).toHaveBeenCalledWith(expect.any(ComponentPortal));
		});

		it('should use elementRef when provided', () => {
			const elementRef = document.createElement('div');
			const step: ObTourStep = {
				stepTitle: 'ElementRef Test',
				stepDescription: 'desc',
				position: 'auto',
				target: {elementRef}
			};
			const flexibleConnectedSpy = jest.fn(() => ({
				withPositions: jest.fn().mockReturnThis(),
				withFlexibleDimensions: jest.fn().mockReturnThis(),
				withPush: jest.fn().mockReturnThis()
			}));

			mockOverlay.position = jest.fn(() => ({
				flexibleConnectedTo: flexibleConnectedSpy
			})) as any;

			mockOverlay.position = jest.fn(() => ({
				flexibleConnectedTo: flexibleConnectedSpy
			})) as any;

			(tourOverlayService as any).open(step);

			expect(flexibleConnectedSpy).toHaveBeenCalledWith(elementRef);
		});

		it('should use querySelector result when elementRef is undefined but selector exists and matches element', () => {
			const element = document.createElement('div');
			element.id = 'valid';
			document.body.appendChild(element);

			const step: ObTourStep = {
				stepTitle: 'Selector Test',
				stepDescription: 'desc',
				position: 'auto',
				target: {elementSelector: '#valid'}
			};

			const flexibleConnectedSpy = jest.fn(() => ({
				withPositions: jest.fn().mockReturnThis(),
				withFlexibleDimensions: jest.fn().mockReturnThis(),
				withPush: jest.fn().mockReturnThis()
			}));
			mockOverlay.position = jest.fn(() => ({
				flexibleConnectedTo: flexibleConnectedSpy
			})) as any;

			(tourOverlayService as any).open(step);

			expect(flexibleConnectedSpy).toHaveBeenCalledWith(element);

			document.body.removeChild(element);
		});

		it('should call createCenteredOverlay() when selector exists but matches no element', () => {
			const step: ObTourStep = {
				stepTitle: 'Invalid Selector Test',
				stepDescription: 'desc',
				position: 'auto',
				target: {elementSelector: '#not-found'}
			};

			const createCenteredSpy = jest.spyOn(tourOverlayService as any, 'createCenteredOverlay');
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

			(tourOverlayService as any).open(step);

			expect(createCenteredSpy).toHaveBeenCalled();

			warnSpy.mockRestore();
		});

		it('should call createCenteredOverlay() when both elementRef and selector are undefined', () => {
			const step: ObTourStep = {
				stepTitle: 'No Ref No Selector',
				stepDescription: 'desc',
				position: 'auto',
				target: {}
			};

			const createCenteredSpy = jest.spyOn(tourOverlayService as any, 'createCenteredOverlay');
			(tourOverlayService as any).open(step);
			expect(createCenteredSpy).toHaveBeenCalled();
		});
	});

	describe('createCenteredOverlay()', () => {
		let createOverlayMocks: (componentRef?: any) => void;

		beforeEach(() => {
			createOverlayMocks = (componentRef?: any): void => {
				const fakeComponentRef = componentRef ?? {
					instance: {closeEmitter: {subscribe: jest.fn()}}
				};
				const fakeOverlayRef = {
					attach: jest.fn(() => fakeComponentRef),
					dispose: jest.fn()
				};

				(tourOverlayService as any).overlay = {
					position: jest.fn(() => ({
						global: jest.fn(() => ({
							centerHorizontally: jest.fn().mockReturnThis(),
							centerVertically: jest.fn().mockReturnThis()
						}))
					})),
					create: jest.fn(() => fakeOverlayRef),
					scrollStrategies: {
						reposition: jest.fn(() => ({}))
					}
				};
			};
		});

		it('should call overlay.position() to configure global strategy', () => {
			(tourOverlayService as any).createCenteredOverlay();
			expect(mockOverlay.position).toHaveBeenCalled();
		});

		it('should call overlay.create() with correct options', () => {
			const createSpy = jest.spyOn(mockOverlay, 'create');
			(tourOverlayService as any).createCenteredOverlay();
			expect(createSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					scrollStrategy: expect.any(Object),
					hasBackdrop: false,
					disposeOnNavigation: true,
					panelClass: ['obt-tour-overlay-panel', 'obt-tour-overlay-center']
				})
			);
		});

		it('should store overlayRef after creation', () => {
			(tourOverlayService as any).createCenteredOverlay();
			expect((tourOverlayService as any).overlayRef).toBeTruthy();
		});

		it('should attach a ComponentPortal of TourOverlayComponent', () => {
			const attachSpy = jest.fn(() => ({
				instance: {closeEmitter: {subscribe: jest.fn()}}
			}));
			(tourOverlayService as any).overlay = {
				position: jest.fn(() => ({
					global: jest.fn(() => ({
						centerHorizontally: jest.fn().mockReturnThis(),
						centerVertically: jest.fn().mockReturnThis()
					}))
				})),
				create: jest.fn(() => ({
					attach: attachSpy,
					dispose: jest.fn()
				})),
				scrollStrategies: {reposition: jest.fn(() => ({}))}
			};

			(tourOverlayService as any).createCenteredOverlay();
			expect(attachSpy).toHaveBeenCalledWith(expect.any(ComponentPortal));
		});

		it('should store componentRef after attach', () => {
			const fakeComponentRef = {instance: {closeEmitter: {subscribe: jest.fn()}}};
			createOverlayMocks(fakeComponentRef);

			(tourOverlayService as any).createCenteredOverlay();

			expect((tourOverlayService as any).componentRef).toBe(fakeComponentRef);
		});

		it('should subscribe to closeEmitter and call close()', () => {
			closeSpy = jest.spyOn(tourOverlayService as any, 'close');
			const fakeEmitter = {subscribe: jest.fn(cb => cb())}; // sofort triggern
			const fakeComponentRef = {instance: {closeEmitter: fakeEmitter}};
			createOverlayMocks(fakeComponentRef);

			(tourOverlayService as any).createCenteredOverlay();
			expect(closeSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('close()', () => {
		it('should do nothing when overlayRef is null', () => {
			(tourOverlayService as any).overlayRef = null;
			const disposeSpy = jest.fn();
			(tourOverlayService as any).overlayRef = {dispose: disposeSpy};
			(tourOverlayService as any).overlayRef = null;
			(tourOverlayService as any).close();
			expect(disposeSpy).not.toHaveBeenCalled();
		});

		it('should call dispose() on overlayRef when defined', () => {
			const disposeSpy = jest.fn();
			(tourOverlayService as any).overlayRef = {dispose: disposeSpy};
			(tourOverlayService as any).close();
			expect(disposeSpy).toHaveBeenCalled();
		});

		it('should set overlayRef to null after disposing', () => {
			const disposeSpy = jest.fn();
			(tourOverlayService as any).overlayRef = {dispose: disposeSpy};
			(tourOverlayService as any).close();
			const result = (tourOverlayService as any).overlayRef;
			expect(result).toBeNull();
		});
	});
});
