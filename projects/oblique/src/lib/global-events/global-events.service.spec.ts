import {TestBed} from '@angular/core/testing';
import {firstValueFrom} from 'rxjs';
import {provideObliqueTestingConfiguration} from '../utilities';
import {ObGlobalEventsService} from './global-events.service';

describe('ObGlobalEventsService', () => {
	let service: ObGlobalEventsService;
	let mockNavigation: EventTarget;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideObliqueTestingConfiguration()],
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
		it('should emit a BeforeUnloadEvent', async () => {
			const event = firstValueFrom(service.beforeUnload$);
			window.dispatchEvent(new Event('beforeunload'));
			expect((await event).type).toBe('beforeunload');
		});
	});

	describe('click$', () => {
		it('should be defined', () => {
			expect(service.click$).toBeTruthy();
		});
		it('should emit a MouseEvent', async () => {
			const event = firstValueFrom(service.click$);
			document.querySelector('body').click();
			expect((await event) instanceof MouseEvent).toBe(true);
		});
	});

	describe('mouseDown$', () => {
		it('should be defined', () => {
			expect(service.mouseDown$).toBeTruthy();
		});
		it('should emit a MouseEvent', async () => {
			const event = firstValueFrom(service.mouseDown$);
			document.dispatchEvent(new MouseEvent('mousedown'));
			expect((await event) instanceof MouseEvent).toBe(true);
		});
	});

	describe('mouseMove$', () => {
		it('should be defined', () => {
			expect(service.mouseMove$).toBeTruthy();
		});
		it('should emit a MouseEvent', async () => {
			const event = firstValueFrom(service.mouseMove$);
			document.dispatchEvent(new MouseEvent('mousemove'));
			expect((await event) instanceof MouseEvent).toBe(true);
		});
	});

	describe('keyDown$', () => {
		it('should be defined', () => {
			expect(service.keyDown$).toBeTruthy();
		});
		it('should emit a KeyboardEvent', async () => {
			const event = firstValueFrom(service.keyDown$);
			document.dispatchEvent(new KeyboardEvent('keydown'));
			expect((await event) instanceof KeyboardEvent).toBe(true);
		});
	});

	describe('keyUp$', () => {
		it('should be defined', () => {
			expect(service.keyUp$).toBeTruthy();
		});
		it('should emit a KeyboardEvent', async () => {
			const event = firstValueFrom(service.keyUp$);
			document.dispatchEvent(new KeyboardEvent('keyup'));
			expect((await event) instanceof KeyboardEvent).toBe(true);
		});
	});

	describe('scroll$', () => {
		it('should be defined', () => {
			expect(service.scroll$).toBeTruthy();
		});
		it('should emit an Event', async () => {
			const event = firstValueFrom(service.scroll$);
			window.dispatchEvent(new Event('scroll'));
			expect((await event) instanceof Event).toBe(true);
		});
	});

	describe('wheel$', () => {
		it('should be defined', () => {
			expect(service.wheel$).toBeTruthy();
		});
		it('should emit an Event', async () => {
			const event = firstValueFrom(service.wheel$);
			window.dispatchEvent(new Event('wheel'));
			expect((await event) instanceof Event).toBe(true);
		});
	});

	describe('resize$', () => {
		it('should be defined', () => {
			expect(service.resize$).toBeTruthy();
		});
		it('should emit an UIEvent', async () => {
			const event = firstValueFrom(service.resize$);
			window.dispatchEvent(new UIEvent('resize'));
			expect((await event) instanceof UIEvent).toBe(true);
		});
	});

	describe('navigate$', () => {
		describe('when window.navigation is available', () => {
			beforeAll(() => {
				mockNavigation = new EventTarget();
				Object.defineProperty(window, 'navigation', {value: mockNavigation, configurable: true});
			});

			it('should be defined', () => {
				expect(service.navigate$).toBeTruthy();
			});

			it('should emit a NavigateEvent', async () => {
				const event = firstValueFrom(service.navigate$);
				mockNavigation.dispatchEvent(Object.assign(new Event('navigate'), {destination: {url: 'https://example.com'}}));
				expect((await event).destination.url).toBe('https://example.com');
			});
		});

		describe('when window.navigation is not available', () => {
			it('should be defined', () => {
				expect(service.navigate$).toBeTruthy();
			});

			it('should not emit', async () => {
				let emitted = false;
				service.navigate$.subscribe(() => {
					emitted = true;
				});
				await new Promise(resolve => {
					setTimeout(resolve, 0);
				});
				expect(emitted).toBe(false);
			});
		});
	});
});
