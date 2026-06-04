import {TestBed} from '@angular/core/testing';
import {ObSpinnerComponent} from './spinner.component';
import {ObSpinnerRegistry} from './spinner.registry';

describe(ObSpinnerRegistry.name, () => {
	const spinner = {channel: 'test'} as ObSpinnerComponent;
	let service: ObSpinnerRegistry;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObSpinnerRegistry],
		});
		service = TestBed.inject(ObSpinnerRegistry);
		service.register(spinner);
	});

	test('unregister non existent channel', () => {
		expect(() => service.unregister({} as ObSpinnerComponent)).not.toThrow();
	});

	describe(ObSpinnerRegistry.prototype.hasChannel.name, () => {
		test('registered channel', () => {
			expect(service.hasChannel('test')).toBe(true);
		});

		test('unregistered channel', () => {
			service.unregister(spinner);
			expect(service.hasChannel('test')).toBe(false);
		});
	});
});
