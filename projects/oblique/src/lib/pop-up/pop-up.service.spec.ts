import {TestBed} from '@angular/core/testing';
import {ObPopUpService} from './pop-up.service';
import {windowProvider, WINDOW} from '../utilities';

describe('PopUpService', () => {
	let service: ObPopUpService;

	beforeEach(() => {
		TestBed.configureTestingModule({providers: [{provide: WINDOW, useFactory: windowProvider}]});
		service = TestBed.inject(ObPopUpService);
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
