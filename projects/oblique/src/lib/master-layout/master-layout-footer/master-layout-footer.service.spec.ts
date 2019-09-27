import {TestBed} from '@angular/core/testing';
import {MasterLayoutFooterService} from './master-layout-footer.service';
import {MasterLayoutEvent} from '../master-layout.utility';
import {Observable, Subject} from 'rxjs';


describe('MasterLayoutFooterService', () => {
	let masterLayoutFooterService: MasterLayoutFooterService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				MasterLayoutFooterService
			]
		});
		masterLayoutFooterService = TestBed.get(MasterLayoutFooterService);
	});

	it('should be created', () => {
		expect(masterLayoutFooterService).toBeTruthy();
	});

	describe('test configEvents', () => {

		it('should get configEvents  when true', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'configEvents', 'get');
			let newValue: Observable<MasterLayoutEvent> = new Subject<MasterLayoutEvent>();
			newValue = masterLayoutFooterService.configEvents;
			const mockResult = masterLayoutFooterService.configEvents;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

	});

	describe('test isCustom', () => {

		it('should set custom to true', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'isCustom', 'set');
			const newValue = true;
			masterLayoutFooterService.isCustom = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutFooterService.isCustom).toBeTruthy();
			spy.mockRestore();
		});

		it('should set custom to false', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'isCustom', 'set');
			const newValue = false;
			masterLayoutFooterService.isCustom = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutFooterService.isCustom).toBeFalsy();
			spy.mockRestore();
		});

		it('should get custom  when true', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'isCustom', 'get');
			const newValue = true;
			masterLayoutFooterService.isCustom = newValue;
			const mockResult = masterLayoutFooterService.isCustom;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});


		it('should get custom  when false', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'isCustom', 'get');
			const newValue = false;
			masterLayoutFooterService.isCustom = newValue;
			const mockResult = masterLayoutFooterService.isCustom;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

	});

	describe('test isSmall', () => {

		it('should set isSmall to true', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'isSmall', 'set');
			const newValue = true;
			masterLayoutFooterService.isSmall = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutFooterService.isSmall).toBeTruthy();
			spy.mockRestore();
		});

		it('should set isSmall to false', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'isSmall', 'set');
			const newValue = false;
			masterLayoutFooterService.isSmall = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutFooterService.isSmall).toBeFalsy();
			spy.mockRestore();
		});

		it('should get isSmall  when true', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'isSmall', 'get');
			const newValue = true;
			masterLayoutFooterService.isSmall = newValue;
			const mockResult = masterLayoutFooterService.isSmall;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});


		it('should get isSmall  when false', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'isSmall', 'get');
			const newValue = false;
			masterLayoutFooterService.isSmall = newValue;
			const mockResult = masterLayoutFooterService.isSmall;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

	});

	describe('test hasScrollTransition', () => {

		it('should set hasScrollTransition to true', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'hasScrollTransition', 'set');
			const newValue = true;
			masterLayoutFooterService.hasScrollTransition = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutFooterService.hasScrollTransition).toBeTruthy();
			spy.mockRestore();
		});

		it('should set hasScrollTransition to false', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'hasScrollTransition', 'set');
			const newValue = false;
			masterLayoutFooterService.hasScrollTransition = newValue;
			expect(spy).toHaveBeenCalled();
			expect(masterLayoutFooterService.hasScrollTransition).toBeFalsy();
			spy.mockRestore();
		});

		it('should get hasScrollTransition  when true', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'hasScrollTransition', 'get');
			const newValue = true;
			masterLayoutFooterService.hasScrollTransition = newValue;
			const mockResult = masterLayoutFooterService.hasScrollTransition;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

		it('should get hasScrollTransition  when false', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'hasScrollTransition', 'get');
			const newValue = false;
			masterLayoutFooterService.hasScrollTransition = newValue;
			const mockResult = masterLayoutFooterService.hasScrollTransition;
			expect(spy).toHaveBeenCalled();
			expect(mockResult).toEqual(newValue);
			spy.mockRestore();
		});

	});
});

