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

	describe('test configEvents', () => {
		it('should get configEvents  when true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'configEvents', 'get');
			let newValue: Observable<ObIMasterLayoutEvent> = new Subject<ObIMasterLayoutEvent>();
			newValue = masterLayoutHeaderService.configEvents;
			const mockResult = masterLayoutHeaderService.configEvents;
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
			const spy = jest.spyOn(masterLayoutHeaderService, 'isMedium', 'set');
			const newValue = true;
			masterLayoutHeaderService.isMedium = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isMedium).toBeTruthy();
			spy.mockRestore();
		});

		it('should set isMedium to false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isMedium', 'set');
			const newValue = false;
			masterLayoutHeaderService.isMedium = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isMedium).toBeFalsy();
			spy.mockRestore();
		});

		it('should get isMedium  when true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isMedium', 'get');
			const newValue = true;
			masterLayoutHeaderService.isMedium = newValue;
			const mockResult = masterLayoutHeaderService.isMedium;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

		it('should get isMedium  when false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isMedium', 'get');
			const newValue = false;
			masterLayoutHeaderService.isMedium = newValue;
			const mockResult = masterLayoutHeaderService.isMedium;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});
	});

	describe('test isAnimated', () => {
		it('should set isAnimated to true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isAnimated', 'set');
			const newValue = true;
			masterLayoutHeaderService.isAnimated = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isAnimated).toBeTruthy();
			spy.mockRestore();
		});

		it('should set isAnimated to false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isAnimated', 'set');
			const newValue = false;
			masterLayoutHeaderService.isAnimated = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.isAnimated).toBeFalsy();
			spy.mockRestore();
		});

		it('should get isAnimated  when true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isAnimated', 'get');
			const newValue = true;
			masterLayoutHeaderService.isAnimated = newValue;
			const mockResult = masterLayoutHeaderService.isAnimated;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

		it('should get isAnimated  when false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'isAnimated', 'get');
			const newValue = false;
			masterLayoutHeaderService.isAnimated = newValue;
			const mockResult = masterLayoutHeaderService.isAnimated;
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

	describe('test hasScrollTransition', () => {
		it('should set hasScrollTransition to true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'hasScrollTransition', 'set');
			const newValue = true;
			masterLayoutHeaderService.hasScrollTransition = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.hasScrollTransition).toBeTruthy();
			spy.mockRestore();
		});

		it('should set hasScrollTransition to false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'hasScrollTransition', 'set');
			const newValue = false;
			masterLayoutHeaderService.hasScrollTransition = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutHeaderService.hasScrollTransition).toBeFalsy();
			spy.mockRestore();
		});

		it('should get hasScrollTransition  when true', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'hasScrollTransition', 'get');
			const newValue = true;
			masterLayoutHeaderService.hasScrollTransition = newValue;
			const mockResult = masterLayoutHeaderService.hasScrollTransition;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

		it('should get hasScrollTransition  when false', () => {
			const spy = jest.spyOn(masterLayoutHeaderService, 'hasScrollTransition', 'get');
			const newValue = false;
			masterLayoutHeaderService.hasScrollTransition = newValue;
			const mockResult = masterLayoutHeaderService.hasScrollTransition;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});
	});
});
