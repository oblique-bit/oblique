import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ObSpinnerComponent} from './spinner.component';
import {ObSpinnerRegistry} from './spinner.registry';
import {provideObliqueTestingConfiguration} from '../utilities';

describe(ObSpinnerRegistry.name, () => {
	let fixture: ComponentFixture<ObSpinnerComponent>;
	let spinner: ObSpinnerComponent;
	let service: ObSpinnerRegistry;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ObSpinnerComponent],
			providers: [ObSpinnerRegistry, provideObliqueTestingConfiguration()],
		});
		fixture = TestBed.createComponent(ObSpinnerComponent);
		spinner = fixture.componentInstance;
		service = TestBed.inject(ObSpinnerRegistry);
		service.register(spinner);
		fixture.detectChanges();
	});

	test('unregister non existent channel', () => {
		expect(() => service.unregister({} as ObSpinnerComponent)).not.toThrow();
	});

	describe(ObSpinnerRegistry.prototype.hasChannel.name, () => {
		test('registered channel', () => {
			fixture.componentRef.setInput('channel', 'test');
			expect(service.hasChannel('test')).toBe(true);
		});

		test('unregistered channel', () => {
			service.unregister(spinner);
			expect(service.hasChannel('test')).toBe(false);
		});
	});
});
