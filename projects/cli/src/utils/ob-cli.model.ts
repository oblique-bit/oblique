import type {SpawnSyncOptions} from 'child_process';
import type {currentVersions} from './cli-utils';

export interface ObCliSchema<Type> {
	properties: Type;
}
export type ObOptions = Record<string, string | boolean>;

export interface ObSchemaOption {
	type: string;
	description: string;
	shortFlag?: string;
	defaultValue?: boolean | string;
	flagValuePlaceholder?: string;
	defaultValueDescription?: string;
	choices?: string[];
	mandatory?: boolean;
	resources?: string[];
}

export type ObCommandConfig =
	| ObNgNewCommandConfig
	| ObNgAddCommandConfig
	| ObNgGenerateCommandConfig
	| ObNpmInstallCommandConfig
	| ObNpmUpdateCommandConfig
	| ObNgUpdateCommandConfig
	| ObNpmOutdatedCommandConfig
	| ObNpmDedupeCommandConfig
	| ObNpmPruneCommandConfig
	| ObNpmFormatCommandConfig;

export interface ObBaseCommandConfig {
	spawnSyncOptions?: SpawnSyncOptions;
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

export interface ObNgGenerateCommandConfig extends ObBaseCommandConfig, ObOptionsCommandConfig {
	name: 'ngGenerate';
	schematic: string;
}

export interface ObNpmInstallCommandConfig extends ObBaseCommandConfig {
	name: 'npmInstall';
	dependencies: (keyof typeof currentVersions)[];
}

export interface ObNgUpdateCommandConfig extends ObBaseCommandConfig, ObOptionsCommandConfig {
	name: 'ngUpdate';
	dependencies: (keyof typeof currentVersions)[];
	angularDependencies: string[];
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

export interface ObNpmFormatCommandConfig extends ObBaseCommandConfig {
	name: 'npmFormat';
}
