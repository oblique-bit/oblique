import {Rule} from '@angular-devkit/schematics';

export type versionFunc = (version: number) => number | number[];

export interface ObIDependencies {
	[key: string]: number | number[] | versionFunc;
}
export interface ObIMigrations {
	dependencies: ObIDependencies;
	applyMigrations: (_options: {[key: string]: any}) => Rule;
}

export interface ObITask {
	from: string;
	to: string;
}

export interface ObIConfigureTestingModuleCall {
	content: string;
	oldContent: string;
	oldProperties: string;
	oldOptions: string;
	isEmptyOptions: boolean;
	needsMigration: boolean;
}
