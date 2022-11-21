import {Inject, Injectable, InjectionToken, Optional, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ObTelemetryRecord} from './telemetry-record';
import {ObIPackage, ObITelemetryRecord} from './telemetry.model';
import {ObGlobalEventsService} from '../global-events/global-events.service';

// @deprecated since version 8.1.0. It will be removed with version 9.0.0 where the telemetry could be disabled by not providing an OB_PROJECT_INFO
export const OB_PROJECT_INFO = new InjectionToken<ObIPackage>('PROJECT_INFO');

@Injectable({
	providedIn: 'root'
})
export class ObTelemetryService {
	private static readonly TELEMETRY_URL = 'https://oblique-telemetry.bit.admin.ch/api/v2/telemetry';
	private readonly isDisabled: boolean;
	private readonly telemetryRecord: ObTelemetryRecord;
	private readonly headers = new HttpHeaders().set('telemetry-api-key', '4E28E649-C2B2-4985-9409-CFC905A34E92');

	constructor(
		private readonly http: HttpClient,
		obGlobalEventsService: ObGlobalEventsService,
		@Optional() @Inject(OB_PROJECT_INFO) projectInfo: ObIPackage
	) {
		this.isDisabled = !isDevMode() || !projectInfo;
		if (this.isDisabled) {
			console.info('Oblique Telemetry is disabled.');
		} else {
			this.telemetryRecord = new ObTelemetryRecord(projectInfo);
			obGlobalEventsService.beforeUnload$.subscribe(() => this.sendRecord());
		}
	}

	record(module: string): void {
		if (!this.isDisabled) {
			this.telemetryRecord.addModule(module);
		}
	}

	private sendRecord(): void {
		if (this.telemetryRecord.isRecordToBeSent()) {
			this.sendData(this.telemetryRecord.record);
			this.telemetryRecord.storeRecord();
		}
	}

	private sendData(record: ObITelemetryRecord): void {
		this.http
			.post(ObTelemetryService.TELEMETRY_URL, record, {headers: this.headers})
			.pipe(catchError(() => EMPTY))
			.subscribe();
	}
}
