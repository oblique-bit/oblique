import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatSlideToggleHarness} from '@angular/material/slide-toggle/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {ObtTourMenuComponent} from './tour-menu.component';
import {ObtTourService} from '../services/tour.service';
import {ObTourServiceMock} from '../services/_mock/tour-mock.service';
import type {ObTourConfig, ObtToursConfig} from '../models/tour-config.model';

describe('TourMenuComponent', () => {
	let fixture: ComponentFixture<ObtTourMenuComponent>;
	let component: ObtTourMenuComponent;
	let loader: HarnessLoader;
	let tourServiceMock: ObTourServiceMock;

	beforeEach(async () => {
		tourServiceMock = new ObTourServiceMock();

		await TestBed.configureTestingModule({
			imports: [
				ObtTourMenuComponent,
				BrowserTestingModule,
				TranslateModule.forRoot({
					defaultLanguage: 'en',
					loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
				})
			],
			providers: [{provide: ObtTourService, useValue: tourServiceMock}]
		}).compileComponents();

		fixture = TestBed.createComponent(ObtTourMenuComponent);
		component = fixture.componentInstance;
		loader = TestbedHarnessEnvironment.loader(fixture);
		fixture.detectChanges();
	});

	afterEach(() => {
		tourServiceMock.setCurrentStep(null);
		tourServiceMock.init.mockReturnValue(null);
	});

	describe('Component creation and initialization', () => {
		it('should create component', () => {
			expect(component).toBeTruthy();
		});

		it('should call service.init during construction', () => {
			expect(tourServiceMock.init).toHaveBeenCalled();
		});

		it('should trigger updateTours when config changes from object to null', () => {
			const spy = jest.spyOn(component as any, 'updateTours');
			fixture.componentRef.setInput('toursConfig', {tours: []});
			fixture.detectChanges();
			fixture.componentRef.setInput('toursConfig', null);
			fixture.detectChanges();
			expect(spy).toHaveBeenCalledWith({tours: []});
		});

		it('should trigger updateTours when config is set to empty tours', () => {
			const spy = jest.spyOn(component as any, 'updateTours');
			fixture.componentRef.setInput('toursConfig', {tours: []});
			fixture.detectChanges();
			expect(spy).toHaveBeenCalledWith({tours: []});
		});
	});

	describe('Slide toggle behavior', () => {
		it('should toggle showTours off when slide toggle switched', async () => {
			const toggle = await loader.getHarness(MatSlideToggleHarness);
			await toggle.toggle();
			expect(component.showTours()).toBe(false);
		});

		it('should toggle showTours on when slide toggle switched twice', async () => {
			const toggle = await loader.getHarness(MatSlideToggleHarness);
			await toggle.toggle();
			await toggle.toggle();
			expect(component.showTours()).toBe(true);
		});

		it('should subscribe to updateConfig when toggled on', () => {
			const subscribeSpy = jest.spyOn(tourServiceMock.updateConfig, 'subscribe');
			component.onToggleChange({checked: true} as MatSlideToggleChange);
			expect(subscribeSpy).toHaveBeenCalledTimes(1);
		});

		it('should not subscribe to updateConfig when toggled off', () => {
			const subscribeSpy = jest.spyOn(tourServiceMock.updateConfig, 'subscribe');
			component.onToggleChange({checked: false} as MatSlideToggleChange);
			expect(subscribeSpy).not.toHaveBeenCalled();
		});

		it('should not set allTours when updateConfig emits empty array', fakeAsync(() => {
			component.onToggleChange({checked: true} as MatSlideToggleChange);
			tourServiceMock.updateConfig.next([]);
			tick();
			expect(component.allTours()).toEqual([]);
		}));

		it('should set allTours when updateConfig emits new tours', fakeAsync(() => {
			const updateTours: ObTourConfig[] = [
				{
					tourTitle: 'Rainbow',
					tourDescription: 'Description',
					storageKey: 'rainbowTourStorageKey',
					triggers: [{type: 'manual'}],
					state: 'new',
					steps: []
				}
			];
			component.onToggleChange({checked: true} as MatSlideToggleChange);
			tourServiceMock.updateConfig.next(updateTours);
			TestBed.tick();
			expect(component.allTours()).toEqual(updateTours);
		}));

		it('should update allTours after multiple emits', fakeAsync(() => {
			const allTours = [{tourTitle: 'First', state: 'new'} as ObTourConfig, {tourTitle: 'Second', state: 'done'} as ObTourConfig];
			component.onToggleChange({checked: true} as MatSlideToggleChange);
			tourServiceMock.updateConfig.next(allTours);
			tourServiceMock.updateConfig.next([]);
			expect(component.allTours()).toEqual([]);
		}));
	});

	describe('Popover interactions', () => {
		it('should open popover when button clicked', async () => {
			const button = await loader.getHarness(MatButtonHarness.with({selector: '.obt-notification-button'}));
			await button.click();
			expect(component.isOpen()).toBe(true);
		});

		it('should close popover when closePopover() called', () => {
			component.isOpen.set(true);
			component.closePopover();
			expect(component.isOpen()).toBe(false);
		});

		it('should not close popover if already closed', () => {
			component.isOpen.set(false);
			component.closePopover();
			expect(component.isOpen()).toBe(false);
		});

		it('should stop propagation on togglePopover', () => {
			const mockEvent = {stopPropagation: jest.fn()} as any;
			component.togglePopover(mockEvent);
			expect(mockEvent.stopPropagation).toHaveBeenCalled();
		});
	});

	describe('Tour configuration logic', () => {
		describe('updateTours()', () => {
			it('should set doneTours length to 1', () => {
				const steps = [
					{
						stepTitle: 'Step 1',
						stepDescription: 'i18n.ob-tour.rainbow.step1.description'
					},
					{
						stepTitle: 'Step 2',
						stepDescription: 'i18n.ob-tour.rainbow.step2.description'
					}
				];
				const config: ObtToursConfig = {
					tours: [
						{id: '1', state: 'done', tourTitle: 'Title done 1', steps, tourDescription: 'Description done 1'},
						{id: '2', state: 'inProgress', tourTitle: 'Title inProgress 1', steps, tourDescription: 'Description inProgress 1'},
						{id: '3', state: 'new', tourTitle: 'Title new 1', steps, tourDescription: 'Description new 1'}
					]
				} as any;
				(component as any).updateTours(config);
				expect(component.doneTours().length).toBe(1);
			});

			it('should set inProgressTours length to 1', () => {
				const config: ObtToursConfig = {
					tours: [
						{id: '1', state: 'done'},
						{id: '2', state: 'inProgress'},
						{id: '3', state: 'new'}
					]
				} as any;
				(component as any).updateTours(config);
				expect(component.inProgressTours().length).toBe(1);
			});

			it('should set newTours length to 1', () => {
				const config: ObtToursConfig = {
					tours: [
						{id: '1', state: 'done'},
						{id: '2', state: 'inProgress'},
						{id: '3', state: 'new'}
					]
				} as any;
				(component as any).updateTours(config);
				expect(component.newTours().length).toBe(1);
			});

			it('should handle empty tour states without errors - inProgressTours length', () => {
				const config: ObtToursConfig = {tours: [{state: ''} as any]};
				(component as any).updateTours(config);
				fixture.detectChanges();
				expect(component.inProgressTours().length).toBe(0);
			});

			it('should handle empty tour states without errors - newTours length', () => {
				const config: ObtToursConfig = {tours: [{state: ''} as any]};
				(component as any).updateTours(config);
				fixture.detectChanges();
				expect(component.newTours().length).toBe(0);
			});

			it('should handle empty tour states without errors - doneTours length', () => {
				const config: ObtToursConfig = {tours: [{state: ''} as any]};
				(component as any).updateTours('updateTours', config);
				fixture.detectChanges();
				expect(component.doneTours().length).toBe(0);
			});
		});

		describe('default values', () => {
			it('should define two overlay positions', () => {
				expect(component.menuPositions.length).toBe(2);
			});

			it('should define menuPositions[0].originX as start', () => {
				expect(component.menuPositions[0].originX).toBe('start');
			});
		});
	});
});
