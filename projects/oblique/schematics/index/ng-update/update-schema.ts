import { Rule } from '@angular-devkit/schematics';

export interface IUpdateSchema {
	targetVersion: string;
}

export interface IMigratable {
	updateToLatest(_options: any, latestVersion: string): Rule;
	updatePeerDependencies(_options: any): Rule;
	applyMigrations(_options: any): Rule;
}
