import {TestBed} from '@angular/core/testing';

import {PopUpService} from './pop-up.service';

describe('PopUpService', () => {
	let service: PopUpService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.get(PopUpService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call window.alert', function () {
		spyOn(window, 'alert');
		service.alert();
		expect(window.alert).toHaveBeenCalled();
	});

	it('should call window.confirm', function () {
		spyOn(window, 'confirm');
		service.confirm();
		expect(window.confirm).toHaveBeenCalled();
	});

	it('should call window.prompt', function () {
		spyOn(window, 'prompt');
		service.prompt();
		expect(window.prompt).toHaveBeenCalled();
	});
});
