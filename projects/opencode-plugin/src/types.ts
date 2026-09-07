export interface ObliqueProjectContext {
	readonly isObliqueProject: boolean;
	readonly projectName?: string;
	readonly projectRoot?: string;
	readonly obliqueVersion?: string;
	readonly angularVersion?: string;
}

export interface ObliquePluginStatus {
	readonly ready: boolean;
	readonly projectDetected: boolean;
	readonly message: string;
}

export interface ObliquePluginRuntimeState {
	readonly project: ObliqueProjectContext;
	readonly status: ObliquePluginStatus;
}
