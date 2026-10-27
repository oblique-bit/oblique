import {ComponentFixture, TestBed} from '@angular/core/testing';
import {firstValueFrom} from 'rxjs';
import {ObSpinnerService} from './spinner.service';
import {ObSpinnerComponent} from './spinner.component';
import {ObSpinnerRegistry} from './spinner.registry';
import {provideObliqueTestingConfiguration} from '../utilities';
import {ObConsoleService} from '../console/ob-console.service';

describe(ObSpinnerService.name, () => {
	let fixture: ComponentFixture<ObSpinnerComponent>;
	let spinner: ObSpinnerComponent;
	let service: ObSpinnerService;
	let registry: ObSpinnerRegistry;
	let obConsoleService: ObConsoleService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ObSpinnerComponent],
			providers: [ObSpinnerService, ObSpinnerRegistry, provideObliqueTestingConfiguration()],
		});
		service = TestBed.inject(ObSpinnerService);
		registry = TestBed.inject(ObSpinnerRegistry);

		fixture = TestBed.createComponent(ObSpinnerComponent);
		spinner = fixture.componentInstance;
		obConsoleService = TestBed.inject(ObConsoleService);
		jest.spyOn(obConsoleService, 'warn');
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should emit a SpinnerEvent if activated', async () => {
		const event = firstValueFrom(service.events$);
		service.activate();
		expect(await event).toEqual({active: true, channel: ObSpinnerService.CHANNEL});
	});

	it('should log a warning if activated with a non-registered channel', () => {
		service.activate('foobarbaz');
		expect(obConsoleService.warn).toHaveBeenCalledWith(
			'ObSpinnerService activate()',
			'Attempt to activate a channel that does not exist:',
			'foobarbaz'
		);
	});

	it('should log a warning if deactivated with a non-registered channel', () => {
		service.deactivate('foobarbaz');
		expect(obConsoleService.warn).toHaveBeenCalledWith(
			'ObSpinnerService deactivate()',
			'Attempt to deactivate a channel that does not exist:',
			'foobarbaz'
		);
	});

	it('should not log a warning if activated with a registered channel', () => {
		fixture.componentRef.setInput('channel', 'registered');
		spinner = {channel: 'registered'} as unknown as ObSpinnerComponent;
		registry.register(spinner);
		service.activate('registered');
		expect(obConsoleService.warn).not.toHaveBeenCalled();
	});

	it('should not log a warning if deactivated with a registered channel', () => {
		fixture.componentRef.setInput('channel', 'registered');
		spinner = {channel: 'registered'} as unknown as ObSpinnerComponent;
		registry.register(spinner);
		service.deactivate('registered');
		expect(obConsoleService.warn).not.toHaveBeenCalled();
	});

	it('should emit a SpinnerEvent on a custom channel if activated', async () => {
		const channel = 'CUSTOM';
		const event = firstValueFrom(service.events$);
		service.activate(channel);
		expect(await event).toEqual({active: true, channel});
	});

	it('should emit a SpinnerEvent if deactivated', async () => {
		const event = firstValueFrom(service.events$);
		service.deactivate();
		expect(await event).toEqual({active: false, channel: ObSpinnerService.CHANNEL});
	});

	it('should emit a SpinnerEvent on a custom channel if deactivated', async () => {
		const channel = 'CUSTOM';
		const event = firstValueFrom(service.events$);
		service.deactivate(channel);
		expect(await event).toEqual({active: false, channel});
	});

	it('should not emit if there more activations than deactivation', () => {
		service.activate();
		service.activate();
		let emitted = false;
		service.events$.subscribe(() => {
			emitted = true;
		});
		service.deactivate();
		expect(emitted).toBe(false);
	});

	it('should emit deactivate event when activate and deactivate are called equally', async () => {
		service.activate();
		service.activate();

		const event = firstValueFrom(service.events$);

		service.deactivate();
		service.deactivate(); // Only now, deactivate event is emitted.

		expect(await event).toEqual({active: false, channel: ObSpinnerService.CHANNEL});
	});

	it('should deactivate immediately, when forceDeactivate is called.', async () => {
		service.activate();
		service.activate();

		const event = firstValueFrom(service.events$);

		service.forceDeactivate();

		expect(await event).toEqual({active: false, channel: ObSpinnerService.CHANNEL});
	});
});
