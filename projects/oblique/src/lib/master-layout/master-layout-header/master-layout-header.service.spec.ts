import {TestBed} from '@angular/core/testing';
import {ObMasterLayoutHeaderService} from './master-layout-header.service';
import {ObIMasterLayoutEvent} from '../master-layout.model';
import {Observable, Subject} from 'rxjs';

describe('MasterLayoutHeaderService', () => {
	let masterLayoutHeaderService: ObMasterLayoutHeaderService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObMasterLayoutHeaderService]
		});
		masterLayoutHeaderService = TestBed.inject(ObMasterLayoutHeaderService);
	});

	it('should be created', () => {
		expect(masterLayoutHeaderService).toBeTruthy();
	});

	describe('test configEvents$', () => {
		it('should get configEvents  when true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'configEvents$', 'get');
			let newValue: Observable<ObIMasterLayoutEvent> = new Subject<ObIMasterLayoutEvent>();
			newValue = masterLayoutHeaderService.configEvents$;
			const mockResult = masterLayoutHeaderService.configEvents$;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});
	});

	describe('test isCustom', () => {
		it('should set custom to true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isCustom', 'set');
			const newValue = true;
			masterLayoutHeaderService.isCustom = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isCustom).toBeTruthy();
			spy.mockRestore();
		});

		it('should set custom to false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isCustom', 'set');
			const newValue = false;
			masterLayoutHeaderService.isCustom = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isCustom).toBeFalsy();
			spy.mockRestore();
		});

		it('should get custom  when true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isCustom', 'get');
			const newValue = true;
			masterLayoutHeaderService.isCustom = newValue;
			const mockResult = masterLayoutHeaderService.isCustom;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

		it('should get custom  when false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isCustom', 'get');
			const newValue = false;
			masterLayoutHeaderService.isCustom = newValue;
			const mockResult = masterLayoutHeaderService.isCustom;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});
	});

	describe('test isMedium', () => {
		it('should set isMedium to true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isSmall', 'set');
			const newValue = true;
			masterLayoutHeaderService.isSmall = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isSmall).toBeTruthy();
			spy.mockRestore();
		});

		it('should set isMedium to false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isSmall', 'set');
			const newValue = false;
			masterLayoutHeaderService.isSmall = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isSmall).toBeFalsy();
			spy.mockRestore();
		});

		it('should get isMedium  when true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isSmall', 'get');
			const newValue = true;
			masterLayoutHeaderService.isSmall = newValue;
			const mockResult = masterLayoutHeaderService.isSmall;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

		it('should get isMedium  when false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isSmall', 'get');
			const newValue = false;
			masterLayoutHeaderService.isSmall = newValue;
			const mockResult = masterLayoutHeaderService.isSmall;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});
	});

	describe('test isSticky', () => {
		it('should set isSticky to true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isSticky', 'set');
			const newValue = true;
			masterLayoutHeaderService.isSticky = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isSticky).toBeTruthy();
			spy.mockRestore();
		});

		it('should set isSticky to false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isSticky', 'set');
			const newValue = false;
			masterLayoutHeaderService.isSticky = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isSticky).toBeFalsy();
			spy.mockRestore();
		});

		it('should get isAnimated  when true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isSticky', 'get');
			const newValue = true;
			masterLayoutHeaderService.isSticky = newValue;
			const mockResult = masterLayoutHeaderService.isSticky;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

		it('should get isSticky  when false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isSticky', 'get');
			const newValue = false;
			masterLayoutHeaderService.isSticky = newValue;
			const mockResult = masterLayoutHeaderService.isSticky;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});
	});

	describe('test reduceOnScroll', () => {
		it('should set hasScrollTransition to true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'reduceOnScroll', 'set');
			masterLayoutHeaderService.reduceOnScroll = true;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.reduceOnScroll).toBeTruthy();
			spy.mockRestore();
		});

		it('should set hasScrollTransition to false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'reduceOnScroll', 'set');
			masterLayoutHeaderService.reduceOnScroll = false;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.reduceOnScroll).toBeFalsy();
			spy.mockRestore();
		});

		it('should get hasScrollTransition  when true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'reduceOnScroll', 'get');
			const newValue = true;
			masterLayoutHeaderService.reduceOnScroll = newValue;
			const mockResult = masterLayoutHeaderService.reduceOnScroll;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

		it('should get hasScrollTransition  when false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'reduceOnScroll', 'get');
			const newValue = false;
			masterLayoutHeaderService.reduceOnScroll = newValue;
			const mockResult = masterLayoutHeaderService.reduceOnScroll;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});
	});
});
