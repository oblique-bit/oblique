import {ObIModuleList, ObIPackage, ObITelemetryRecord} from './telemetry.model';
import {appVersion} from '../version';

export class ObTelemetryRecord {
	readonly record: ObITelemetryRecord;
	private static readonly TELEMETRY_TOKEN = 'OBLIQUE_TELEMETRY';
	private static readonly ONE_DAY = 1000 * 60 * 60 * 24;

	constructor(pkg: ObIPackage) {
		this.record = {
			applicationName: pkg.name || 'Unknown project name',
			applicationTitle: pkg.title,
			applicationVersion: pkg.version || 'Unknown project version',
			obliqueTheme: 'Material',
			obliqueVersion: appVersion,
			obliqueModuleNames: []
		};
	}

	addModule(module: string): void {
		if (!this.record.obliqueModuleNames.includes(module)) {
			this.record.obliqueModuleNames.push(module);
		}
	}

	isRecordToBeSent(): boolean {
		const moduleList = ObTelemetryRecord.getModuleList();
		// prettier-ignore
		return !moduleList.timestamp
			|| !moduleList.modules
			|| +new Date() - moduleList.timestamp > ObTelemetryRecord.ONE_DAY
			|| this.record.obliqueModuleNames.reduce((missing, name) => missing || !moduleList.modules.includes(name), false);
	}

	storeRecord(): void {
		localStorage.setItem(
			ObTelemetryRecord.TELEMETRY_TOKEN,
			JSON.stringify({
				modules: this.record.obliqueModuleNames,
				timestamp: +new Date()
			})
		);
	}

	private static getModuleList(): ObIModuleList {
		try {
			return JSON.parse(localStorage.getItem(ObTelemetryRecord.TELEMETRY_TOKEN)) || ({} as ObIModuleList);
		} catch (error) {
			return {} as ObIModuleList;
		}
	}
}
