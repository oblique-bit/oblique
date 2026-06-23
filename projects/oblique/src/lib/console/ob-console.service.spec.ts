import {TestBed} from '@angular/core/testing';
import {ObConsoleService} from './ob-console.service';
import {OB_CONSOLE_CONFIGURATION} from './ob-console.provider';

describe(ObConsoleService.name, () => {
	let service: ObConsoleService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('with default config', () => {
		it('warn() should delegate to console.warn', () => {
			service = TestBed.inject(ObConsoleService);
			jest.spyOn(console, 'warn');
			service.warn('Foo', 'Bar', 123);

			expect(console.warn).toHaveBeenCalledWith('Foo', 'Bar', 123);
		});

		it('info() should delegate to console.info', () => {
			service = TestBed.inject(ObConsoleService);
			jest.spyOn(console, 'info');
			service.info('Foo', 'Bar', 123);

			expect(console.info).toHaveBeenCalledWith('Foo', 'Bar', 123);
		});

		it('error() should delegate to console.error', () => {
			service = TestBed.inject(ObConsoleService);
			jest.spyOn(console, 'error');
			service.error('Foo', 'Bar', 123);

			expect(console.error).toHaveBeenCalledWith('Foo', 'Bar', 123);
		});
	});

	describe('with silenced labels', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_CONSOLE_CONFIGURATION, {
				useValue: {
					silencedLabels: new Set(['Foo']),
				},
			});
		});

		it('warn() should not log silenced labels', () => {
			service = TestBed.inject(ObConsoleService);
			jest.spyOn(console, 'warn');
			service.warn('Foo', 'Bar');

			expect(console.warn).not.toHaveBeenCalled();
		});

		it('info() should not log silenced labels', () => {
			service = TestBed.inject(ObConsoleService);
			jest.spyOn(console, 'info');
			service.info('Foo', 'Bar');

			expect(console.info).not.toHaveBeenCalled();
		});

		it('error() should not log silenced labels', () => {
			service = TestBed.inject(ObConsoleService);
			jest.spyOn(console, 'error');
			service.error('Foo', 'Bar');

			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
