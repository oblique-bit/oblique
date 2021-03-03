import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {WINDOW, windowProvider} from '../utilities';
import {ObGlobalEventsService} from 'oblique';
import {tap} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs';

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

	describe('outsideClick$', () => {
		let div1: HTMLDivElement;
		let div2: HTMLDivElement;
		let span: HTMLSpanElement;
		beforeEach(() => {
			div1 = document.createElement('div');
			div2 = document.createElement('div');
			span = document.createElement('span');
			div1.appendChild(span);
			document.querySelector('body').appendChild(div1);
			document.querySelector('body').appendChild(div2);
		});
		it('should return an observable', () => {
			expect(service.outsideClick$() instanceof Observable).toBe(true);
		});

		it('should emit on document click', done => {
			service.outsideClick$(div1, div2).subscribe(event => {
				expect(event instanceof MouseEvent).toBe(true);
				done();
			});
			document.querySelector('body').click();
		});

		it('should not emit on excluded element click', fakeAsync(() => {
			let emitted = false;
			service.outsideClick$(div1, div2).subscribe(event => {
				emitted = true;
			});
			div1.click();
			tick(1000);
			expect(emitted).toBe(false);
		}));

		it("should not emit on excluded element's child click", fakeAsync(() => {
			let emitted = false;
			service.outsideClick$(div1, div2).subscribe(event => {
				emitted = true;
			});
			span.click();
			tick(1000);
			expect(emitted).toBe(false);
		}));
	});
});
