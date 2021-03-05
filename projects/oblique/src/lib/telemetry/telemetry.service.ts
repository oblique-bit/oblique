import {Inject, Injectable, InjectionToken, isDevMode, Optional} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, fromEvent, race} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ObTelemetryRecord} from './telemetry-record';
import {ObITelemetryRecord} from './telemetry.model';
import {WINDOW} from '../utilities';
import {ObThemeService} from '../theme/theme.service';

export const TELEMETRY_DISABLE = new InjectionToken<boolean>('TELEMETRY_DISABLE');

@Injectable({
	providedIn: 'root'
})
export class ObTelemetryService {
	private static readonly TELEMETRY_URL = 'https://oblique-telemetry.bit.admin.ch/api/v2/telemetry';
	private readonly isDisabled: boolean;
	private readonly telemetryRecord: ObTelemetryRecord;
	private readonly headers = new HttpHeaders().set('telemetry-api-key', '4E28E649-C2B2-4985-9409-CFC905A34E92');

	constructor(private readonly http: HttpClient, @Optional() @Inject(TELEMETRY_DISABLE) isDisabled: boolean, @Inject(WINDOW) window, theme: ObThemeService) {
		if (isDisabled) {
			console.info('Oblique Telemetry is disabled by injection token.');
		}
		this.isDisabled = !isDevMode() || isDisabled;
		if (!this.isDisabled) {
			this.telemetryRecord = new ObTelemetryRecord(theme.isMaterial() ? 'Material' : 'Bootstrap');
			race(fromEvent(window, 'beforeunload'), fromEvent(window, 'unload')).subscribe(() => this.sendRecord());
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
