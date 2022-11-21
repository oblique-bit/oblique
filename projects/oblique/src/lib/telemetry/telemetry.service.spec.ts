import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Subject} from 'rxjs';
import {OB_PROJECT_INFO, ObTelemetryService} from './telemetry.service';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {appVersion} from '../version';

describe('ObTelemetryService', () => {
	let service: ObTelemetryService;
	let http: HttpClient;
	let globalEventsService: ObGlobalEventsService;
	jest.spyOn(console, 'info');
	const unload = new Subject();
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{provide: ObGlobalEventsService, useValue: {beforeUnload$: unload.asObservable()}}]
		});
	});

	describe('when disabled', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [HttpClientTestingModule]
			});
			service = TestBed.inject(ObTelemetryService);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should show info in the console', () => {
			expect(console.info).toHaveBeenCalledWith('Oblique Telemetry is disabled.');
		});

		it('should not have a telemetryRecord property', () => {
			// @ts-expect-error
			expect(service.telemetryRecord).toBeUndefined();
		});

		describe('record', () => {
			it('should be ignored', () => {
				service.record('test');
				// @ts-expect-error
				expect(service.telemetryRecord).toBeUndefined();
			});
		});
	});

	describe('when enabled', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [HttpClientTestingModule],
				providers: [{provide: OB_PROJECT_INFO, useValue: {name: 'test'}}]
			});
			service = TestBed.inject(ObTelemetryService);
			globalEventsService = TestBed.inject(ObGlobalEventsService);
			http = TestBed.inject(HttpClient);
		});

		it('should have called a http request', done => {
			globalEventsService.beforeUnload$.subscribe(() => {
				expect(http.post).toHaveBeenCalled();
				done();
			});
			// @ts-expect-error
			jest.spyOn(service.telemetryRecord, 'isRecordToBeSent').mockReturnValue(true);
			jest.spyOn(http, 'post').mockReturnValue(EMPTY);
			unload.next({});
		});
	});

	describe('when enabled with Material theme', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [HttpClientTestingModule],
				providers: [{provide: OB_PROJECT_INFO, useValue: {name: 'test'}}]
			});

			service = TestBed.inject(ObTelemetryService);
			http = TestBed.inject(HttpClient);
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should not show info in the console', () => {
			expect(console.info).not.toHaveBeenCalled();
		});

		describe('telemetryRecord', () => {
			it('should be defined', () => {
				// @ts-expect-error
				expect(service.telemetryRecord).toBeDefined();
			});
			it('should have Material theme', () => {
				// @ts-expect-error
				expect(service.telemetryRecord.record.obliqueTheme).toBe('Material');
			});
		});

		describe('record', () => {
			it('should add module', () => {
				// @ts-expect-error
				jest.spyOn(service.telemetryRecord, 'addModule');
				service.record('test');
				// @ts-expect-error
				expect(service.telemetryRecord.addModule).toHaveBeenCalledWith('test');
			});

			it('should add a module only once', () => {
				service.record('test');
				service.record('test');
				// @ts-expect-error
				expect(service.telemetryRecord.record.obliqueModuleNames.length).toBe(1);
			});
		});

		describe('sendRecord', () => {
			describe('with obsolete records', () => {
				beforeEach(() => {
					// @ts-expect-error
					jest.spyOn(service.telemetryRecord, 'isRecordToBeSent').mockReturnValue(true);
				});

				it('should send data to the backend', () => {
					jest.spyOn(http, 'post').mockReturnValue(EMPTY);
					// @ts-expect-error
					service.sendRecord();
					expect(http.post).toHaveBeenCalled();
				});

				it('should store the record', () => {
					// @ts-expect-error
					jest.spyOn(service.telemetryRecord, 'storeRecord');
					// @ts-expect-error
					service.sendRecord();
					// @ts-expect-error
					expect(service.telemetryRecord.storeRecord).toHaveBeenCalled();
				});

				it('should send recorded modules along with project data', () => {
					// @ts-expect-error
					jest.spyOn(service, 'sendData');
					service.record('test1');
					service.record('test1');
					service.record('test2');
					// @ts-expect-error
					service.sendRecord();
					// @ts-expect-error
					expect(service.sendData).toHaveBeenCalledWith({
						applicationName: 'test',
						applicationTitle: undefined,
						applicationVersion: 'Unknown project version',
						obliqueModuleNames: ['test1', 'test2'],
						obliqueTheme: 'Material',
						obliqueVersion: appVersion
					});
				});
			});
		});

		describe('with unchanged data', () => {
			beforeEach(() => {
				// @ts-expect-error
				jest.spyOn(service.telemetryRecord, 'isRecordToBeSent').mockReturnValue(false);
			});

			it('should not send data to the backend', () => {
				jest.spyOn(http, 'post').mockReturnValue(EMPTY);
				// @ts-expect-error
				service.sendRecord();
				expect(http.post).not.toHaveBeenCalled();
			});

			it('should not store the record', () => {
				// @ts-expect-error
				jest.spyOn(service.telemetryRecord, 'storeRecord');
				// @ts-expect-error
				service.sendRecord();
				// @ts-expect-error
				expect(service.telemetryRecord.storeRecord).not.toHaveBeenCalled();
			});
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
});
