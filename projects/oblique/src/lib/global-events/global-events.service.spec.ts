import {TestBed} from '@angular/core/testing';
import {WINDOW} from '../utilities';
import {ObGlobalEventsService} from './global-events.service';

describe('ObGlobalEventsService', () => {
	let service: ObGlobalEventsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: WINDOW, useValue: window}]
		});
		service = TestBed.inject(ObGlobalEventsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('beforeUnload$', () => {
		it('should be defined', () => {
			expect(service.beforeUnload$).toBeTruthy();
		});
		it('should emit a BeforeUnloadEvent', done => {
			service.beforeUnload$.subscribe(event => {
				expect(event.type).toBe('beforeunload');
				done();
			});
			window.dispatchEvent(new Event('beforeunload'));
		});
	});

	describe('click$', () => {
		it('should be defined', () => {
			expect(service.click$).toBeTruthy();
		});
		it('should emit a MouseEvent', done => {
			service.click$.subscribe(event => {
				expect(event instanceof MouseEvent).toBe(true);
				done();
			});
			document.querySelector('body').click();
		});
	});

	describe('mouseDown$', () => {
		it('should be defined', () => {
			expect(service.mouseDown$).toBeTruthy();
		});
		it('should emit a MouseEvent', done => {
			service.mouseDown$.subscribe(event => {
				expect(event instanceof MouseEvent).toBe(true);
				done();
			});
			document.dispatchEvent(new MouseEvent('mousedown'));
		});
	});

	describe('mouseMove$', () => {
		it('should be defined', () => {
			expect(service.mouseMove$).toBeTruthy();
		});
		it('should emit a MouseEvent', done => {
			service.mouseMove$.subscribe(event => {
				expect(event instanceof MouseEvent).toBe(true);
				done();
			});
			document.dispatchEvent(new MouseEvent('mousemove'));
		});
	});

	describe('keyDown$', () => {
		it('should be defined', () => {
			expect(service.keyDown$).toBeTruthy();
		});
		it('should emit a KeyboardEvent', done => {
			service.keyDown$.subscribe(event => {
				expect(event instanceof KeyboardEvent).toBe(true);
				done();
			});
			document.dispatchEvent(new KeyboardEvent('keydown'));
		});
	});

	describe('keyUp$', () => {
		it('should be defined', () => {
			expect(service.keyUp$).toBeTruthy();
		});
		it('should emit a KeyboardEvent', done => {
			service.keyUp$.subscribe(event => {
				expect(event instanceof KeyboardEvent).toBe(true);
				done();
			});
			document.dispatchEvent(new KeyboardEvent('keyup'));
		});
	});

	describe('scroll$', () => {
		it('should be defined', () => {
			expect(service.scroll$).toBeTruthy();
		});
		it('should emit an Event', done => {
			service.scroll$.subscribe(event => {
				expect(event instanceof Event).toBe(true);
				done();
			});
			window.dispatchEvent(new Event('scroll'));
		});
	});

	describe('resize$', () => {
		it('should be defined', () => {
			expect(service.resize$).toBeTruthy();
		});
		it('should emit an UIEvent', done => {
			service.resize$.subscribe(event => {
				expect(event instanceof UIEvent).toBe(true);
				done();
			});
			window.dispatchEvent(new UIEvent('resize'));
		});
	});
});
