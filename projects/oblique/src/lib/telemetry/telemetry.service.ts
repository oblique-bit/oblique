import {Inject, Injectable, InjectionToken, isDevMode, Optional} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, fromEvent, race} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ObITelemetryMessage} from './telemetry-message';
import {WINDOW} from '../utilities';
import {ObThemeService} from '../theme/theme.service';

export const TELEMETRY_DISABLE = new InjectionToken<boolean>('TELEMETRY_DISABLE');

interface ObIModuleList {
	timestamp: number;
	modules: string[];
}

@Injectable({
	providedIn: 'root'
})
export class ObTelemetryService {
	private static readonly telemetryToken = 'OBLIQUE_TELEMETRY';
	private static readonly oneDay = 60 * 60 * 24 * 1000;
	private readonly TELEMETRY_URL = 'https://oblique-telemetry.bit.admin.ch/api/v2/telemetry';
	private readonly telemetryRecords: Array<ObITelemetryMessage> = new Array<ObITelemetryMessage>();
	private readonly disableTokenValue: boolean;
	private readonly window: Window;
	private readonly headers = new HttpHeaders().set('telemetry-api-key', '4E28E649-C2B2-4985-9409-CFC905A34E92');

	constructor(
		private readonly http: HttpClient,
		@Optional() @Inject(TELEMETRY_DISABLE) private readonly isDisabled: boolean,
		@Inject(WINDOW) window,
		private readonly theme: ObThemeService
	) {
		this.window = window; // because AoT don't accept interfaces as DI // because AoT don't accept interfaces as DI
		if (isDisabled) {
			console.info('Oblique Telemetry is disabled by injection token.');
		}
		this.disableTokenValue = isDisabled;
		race(fromEvent(window, 'beforeunload'), fromEvent(window, 'unload')).subscribe(() => this.sendMessages());
	}

	record(mod: any): void {
		// only run telemetry in development mode
		if (this.isTelemetryDisabled()) {
			return;
		}

		this.storeMessage(ObTelemetryService.createMessage(mod, ObTelemetryService.readPackageJson(), this.theme.isMaterial()));
	}

	private static readPackageJson(): Object {
		try {
			return require('package.json');
		} catch (e) {
			if (e.code !== 'MODULE_NOT_FOUND') {
				throw e;
			}
			return {dependencies: {}};
		}
	}

	private static readObliqueVersion(): any {
		try {
			return require('package-lock.json').dependencies['@oblique/oblique'].version;
		} catch (e) {
			return undefined;
		}
	}

	private static areEqual(msg1: ObITelemetryMessage, msg2: ObITelemetryMessage): boolean {
		return (
			msg1.applicationName === msg2.applicationName &&
			msg1.applicationTitle === msg2.applicationTitle &&
			msg1.applicationVersion === msg2.applicationVersion &&
			msg1.applicationHomepage === msg2.applicationHomepage &&
			msg1.obliqueModuleName === msg2.obliqueModuleName &&
			msg1.obliqueVersion === msg2.obliqueVersion &&
			msg1.obliqueTheme === msg2.obliqueTheme
		);
	}

	private static createMessage(mod: any, pkg: any, material: boolean): ObITelemetryMessage {
		const obliqueModuleName = mod ? mod.name : 'Unknown Module';
		const obliqueVersion = (pkg.dependencies['@oblique/oblique'] || '').replace(/[^~]/, '');
		const name = pkg ? pkg.name : 'Unknown package name';
		const title = pkg && pkg.title ? pkg.title : null;
		const version = pkg ? pkg.version : 'Unknown package version';
		const homepage = pkg && pkg.homepage ? pkg.homepage : null;
		const realObliqueVersion = ObTelemetryService.readObliqueVersion();

		return {
			obliqueModuleName: obliqueModuleName,
			obliqueVersion: realObliqueVersion || obliqueVersion,
			obliqueTheme: material ? 'Material' : 'Bootstrap',
			applicationName: name,
			applicationTitle: title,
			applicationVersion: version,
			applicationHomepage: homepage
		};
	}

	private static isTooOld(timestamp): boolean {
		return +new Date() - timestamp > ObTelemetryService.oneDay;
	}

	private static getModuleList(): ObIModuleList {
		try {
			return JSON.parse(localStorage.getItem(ObTelemetryService.telemetryToken)) || ({} as ObIModuleList);
		} catch (e) {
			return {} as ObIModuleList;
		}
	}

	private storeMessage(msg: ObITelemetryMessage): void {
		const existing = this.telemetryRecords.find(r => ObTelemetryService.areEqual(r, msg));

		if (!existing) {
			//only add the message if there is no equal message in the list already
			this.telemetryRecords.push(msg);
		}
	}

	private sendMessages(): void {
		if (this.isTelemetryDisabled()) {
			return;
		}
		const moduleList = ObTelemetryService.getModuleList();
		if (!moduleList.timestamp || !moduleList.modules || this.hasMissingModule(moduleList)) {
			this.sendAndStoreData();
		} else if (ObTelemetryService.isTooOld(moduleList.timestamp)) {
			this.sendAndStoreData(moduleList.modules);
		}
	}

	private isTelemetryDisabled(): boolean {
		return !isDevMode() || this.disableTokenValue;
	}

	private hasMissingModule(modules: ObIModuleList): boolean {
		return this.telemetryRecords.reduce((missing, name) => missing && modules.modules.includes(name.obliqueModuleName), false);
	}

	private sendAndStoreData(modules?: string[]) {
		this.http
			.post(this.TELEMETRY_URL, this.telemetryRecords, {headers: this.headers})
			.pipe(catchError(() => EMPTY))
			.subscribe();

		localStorage.setItem(
			ObTelemetryService.telemetryToken,
			JSON.stringify({
				modules: modules || this.telemetryRecords.map(value => value.obliqueModuleName),
				timestamp: +new Date()
			})
		);
	}
}
