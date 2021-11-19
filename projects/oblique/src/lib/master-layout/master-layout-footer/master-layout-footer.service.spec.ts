import {TestBed} from '@angular/core/testing';
import {Observable, Subject} from 'rxjs';
import {ObMasterLayoutFooterService} from './master-layout-footer.service';
import {ObIMasterLayoutEvent} from '../master-layout.model';

describe('MasterLayoutFooterService', () => {
	let masterLayoutFooterService: ObMasterLayoutFooterService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObMasterLayoutFooterService]
		});
		masterLayoutFooterService = TestBed.inject(ObMasterLayoutFooterService);
	});

	it('should be created', () => {
		expect(masterLayoutFooterService).toBeTruthy();
	});

	describe('test configEvents', () => {
		it('should get configEvents  when true', () => {
			const spy = jest.spyOn(masterLayoutFooterService, 'configEvents', 'get');
			let newValue: Observable<ObIMasterLayoutEvent> = new Subject<ObIMasterLayoutEvent>();
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
