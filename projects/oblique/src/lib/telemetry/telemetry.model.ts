export interface ObITelemetryRecord {
	applicationName: string;
	applicationTitle: string;
	applicationVersion: string;
	applicationHomepage: string;
	obliqueTheme: string;
	obliqueVersion: string;
	obliqueModuleNames: string[];
}

export interface ObIModuleList {
	timestamp: number;
	modules: string[];
}
