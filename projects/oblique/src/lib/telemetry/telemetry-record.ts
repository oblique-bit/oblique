import {ObITelemetryRecord, ObIModuleList} from './telemetry.model';
export class ObTelemetryRecord {
	readonly record: ObITelemetryRecord;
	private static readonly TELEMETRY_TOKEN = 'OBLIQUE_TELEMETRY';
	private static readonly ONE_DAY = 1000 * 60 * 60 * 24;

	constructor(theme: string) {
		const pkg = ObTelemetryRecord.readPackageJson();
		const realObliqueVersion = ObTelemetryRecord.readObliqueVersion();
		this.record = {
			applicationName: pkg?.name || 'Unknown project name',
			applicationTitle: pkg?.title,
			applicationVersion: pkg?.version || 'Unknown project version',
			applicationHomepage: pkg?.homepage,
			obliqueTheme: theme,
			obliqueVersion: realObliqueVersion || (pkg.dependencies['@oblique/oblique'] || '').replace(/[^~]/, ''),
			obliqueModuleNames: []
		};
	}

	addModule(module: string): void {
		if (this.record.obliqueModuleNames.indexOf(module) === -1) {
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

	storeRecord() {
		localStorage.setItem(
			ObTelemetryRecord.TELEMETRY_TOKEN,
			JSON.stringify({
				modules: this.record.obliqueModuleNames,
				timestamp: +new Date()
			})
		);
	}

	private static readPackageJson(): any {
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

	private static getModuleList(): ObIModuleList {
		try {
			return JSON.parse(localStorage.getItem(ObTelemetryRecord.TELEMETRY_TOKEN)) || ({} as ObIModuleList);
		} catch (e) {
			return {} as ObIModuleList;
		}
	}
}
