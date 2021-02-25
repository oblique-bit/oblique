import {Rule} from '@angular-devkit/schematics';

export type versionFunc = (version: number) => number | number[];

export interface IDependencies {
	[key: string]: number | number[] | versionFunc;
}
export interface IMigrations {
	dependencies: IDependencies;
	applyMigrations(_options: {[key: string]: any}): Rule;
}

export interface Task {
	from: string;
	to: string;
}

export interface IConfigureTestingModuleCall {
	content: string;
	oldContent: string;
	oldProperties: string;
	oldOptions: string;
	isEmptyOptions: boolean;
	needsMigration: boolean;
}
