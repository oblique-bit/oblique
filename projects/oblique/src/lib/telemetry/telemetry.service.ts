import {Inject, Injectable, InjectionToken, isDevMode, Optional} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, fromEvent, race} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {TelemetryMessage} from './telemetry-message';
import {WINDOW} from '../utilities';

export const TELEMETRY_DISABLE = new InjectionToken<boolean>('TELEMETRY_DISABLE');

@Injectable({
	providedIn: 'root'
})
export class TelemetryService {
	private readonly TELEMETRY_URL = 'https://oblique-telemetry.bit.admin.ch/api/v1/telemetry';
	private readonly telemetryRecords: Array<TelemetryMessage> = new Array<TelemetryMessage>();
	private readonly disableTokenValue: boolean;
	private readonly window: Window;

	constructor(
		private readonly http: HttpClient, @Optional() @Inject(TELEMETRY_DISABLE) private readonly isDisabled: boolean, @Inject(WINDOW) window
	) {
		this.window = window; // because AoT don't accept interfaces as DI // because AoT don't accept interfaces as DI
		if (isDisabled) {
			console.log('Oblique Telemetry is disabled by injection token.');
		}

		this.disableTokenValue = isDisabled;
		race(
			fromEvent(window, 'beforeunload'),
			fromEvent(window, 'unload')
		).subscribe(() => this.sendMessages());
	}

	record(mod: any): void {
		// only run telemetry in development mode
		if (this.isTelemetryDisabled()) {
			return;
		}

		const pkg = require('package.json');
		const msg = TelemetryService.createMessage(mod, pkg);

		this.storeMessage(msg);
	}

	private static areEqual(msg1: TelemetryMessage, msg2: TelemetryMessage): boolean {
		return msg1.applicationName === msg2.applicationName &&
			msg1.applicationVersion === msg2.applicationVersion &&
			msg1.obliqueModuleName === msg2.obliqueModuleName &&
			msg1.obliqueVersion === msg2.obliqueVersion;
	}

	private static createMessage(mod: any, pkg: any): TelemetryMessage {
		const obliqueModuleName = mod ? mod.name : 'Unknown Module';
		const obliqueVersion = pkg.dependencies['@oblique/oblique'];
		const name = pkg ? pkg.name : 'Unknown package name';
		const version = pkg ? pkg.version : 'Unknown package version';

		return {
			obliqueModuleName: obliqueModuleName,
			obliqueVersion: obliqueVersion,
			applicationName: name,
			applicationVersion: version
		};
	}

	private storeMessage(msg: TelemetryMessage): void {
		const existing = this.telemetryRecords.find(r => TelemetryService.areEqual(r, msg));

		if (!existing) {
			//only add the message if there is no equal message in the list already
			this.telemetryRecords.push(msg);
		}
	}

	private sendMessages(): void {
		if (this.isTelemetryDisabled()) {
			return;
		}

		const headers = new HttpHeaders().set('telemetry-api-key', '4E28E649-C2B2-4985-9409-CFC905A34E92');

		this.http.post(this.TELEMETRY_URL, this.telemetryRecords, {headers: headers})
			.pipe(catchError(() => EMPTY))
			.subscribe();
	}

	private isTelemetryDisabled(): boolean {
		return !isDevMode() || this.disableTokenValue;
	}
}
