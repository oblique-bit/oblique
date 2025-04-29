import type {ExecSyncOptions} from 'child_process';
import type {currentVersions} from './cli-utils';

export interface ObCliSchema<Type> {
	properties: Type;
}
export type ObOptions = Record<string, string | boolean>;

export type ObCommandConfig =
	| ObNgNewCommandConfig
	| ObNgAddCommandConfig
	| ObNpmInstallCommandConfig
	| ObNpmUpdateCommandConfig
	| ObNgUpdateCommandConfig
	| ObNpmOutdatedCommandConfig
	| ObNpmDedupeCommandConfig
	| ObNpmPruneCommandConfig;

export interface ObBaseCommandConfig {
	execSyncOptions?: ExecSyncOptions;
}

export interface ObOptionsCommandConfig {
	options?: ObOptions;
}

export interface ObNgNewCommandConfig extends ObBaseCommandConfig, ObOptionsCommandConfig {
	name: 'ngNew';
	projectName: string;
}

export interface ObNgAddCommandConfig extends ObBaseCommandConfig, ObOptionsCommandConfig {
	name: 'ngAdd';
	dependency: keyof typeof currentVersions;
}

export interface ObNpmInstallCommandConfig extends ObBaseCommandConfig {
	name: 'npmInstall';
	dependencies: (keyof typeof currentVersions)[];
}

export interface ObNgUpdateCommandConfig extends ObBaseCommandConfig {
	name: 'ngUpdate';
	dependencies: (keyof typeof currentVersions)[];
}

export interface ObNpmUpdateCommandConfig extends ObBaseCommandConfig {
	name: 'npmUpdate';
}

export interface ObNpmOutdatedCommandConfig extends ObBaseCommandConfig {
	name: 'npmOutdated';
}

export interface ObNpmDedupeCommandConfig extends ObBaseCommandConfig {
	name: 'npmDedupe';
}

export interface ObNpmPruneCommandConfig extends ObBaseCommandConfig {
	name: 'npmPrune';
}
