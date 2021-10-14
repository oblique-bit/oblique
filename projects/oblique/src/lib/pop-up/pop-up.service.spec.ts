import {TestBed} from '@angular/core/testing';
import {ObPopUpService} from './pop-up.service';
import {WINDOW} from '../utilities';

describe('PopUpService', () => {
	let service: ObPopUpService;

	beforeEach(() => {
		TestBed.configureTestingModule({providers: [{provide: WINDOW, useValue: window}]});
		service = TestBed.inject(ObPopUpService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call window.alert', function () {
		jest.spyOn(window, 'alert');
		service.alert();
		expect(window.alert).toHaveBeenCalled();
	});

	it('should call window.confirm', function () {
		jest.spyOn(window, 'confirm');
		service.confirm();
		expect(window.confirm).toHaveBeenCalled();
	});

	it('should call window.prompt', function () {
		jest.spyOn(window, 'prompt');
		service.prompt();
		expect(window.prompt).toHaveBeenCalled();
	});
});
