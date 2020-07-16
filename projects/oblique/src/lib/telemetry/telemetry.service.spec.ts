import {ObITelemetryMessage} from './telemetry-message';
import {TestBed} from '@angular/core/testing';
import {ObTelemetryService} from './telemetry.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {windowProvider, WINDOW} from '../utilities';

describe('TelemetryService', () => {
	let service: ObTelemetryService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [{provide: WINDOW, useFactory: windowProvider}]
		});

		service = TestBed.inject(ObTelemetryService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should store telemetry messages', () => {
		const message: ObITelemetryMessage = {
			obliqueModuleName: 'testmodule',
			obliqueVersion: 'testversion',
			applicationName: 'testapplication',
			applicationVersion: 'testappversion'
		};

		// @ts-ignore
		service.storeMessage(message);

		// @ts-ignore
		expect(service.telemetryRecords.length).toBe(1);
	});

	it('should not store equal messages multiple times', () => {
		const message1: ObITelemetryMessage = {
			obliqueModuleName: 'testmodule',
			obliqueVersion: 'testversion',
			applicationName: 'testapplication',
			applicationVersion: 'testappversion'
		};

		const message2: ObITelemetryMessage = {
			obliqueModuleName: 'testmodule',
			obliqueVersion: 'testversion',
			applicationName: 'testapplication',
			applicationVersion: 'testappversion'
		};

		// @ts-ignore
		service.storeMessage(message1);
		// @ts-ignore
		service.storeMessage(message2);

		// @ts-ignore
		expect(service.telemetryRecords.length).toBe(1);
	});

	it('should send the stored messages correctly', () => {
		const message: ObITelemetryMessage = {
			obliqueModuleName: 'testmodule',
			obliqueVersion: 'testversion',
			applicationName: 'testapplication',
			applicationVersion: 'testappversion'
		};

		// @ts-ignore
		service.storeMessage(message);

		// @ts-ignore
		service.sendMessages();

		// @ts-ignore
		const mockReq = httpMock.expectOne(service.TELEMETRY_URL);

		expect(mockReq.cancelled).toBeFalsy();
		expect(mockReq.request.method).toEqual('POST');
	});
});
