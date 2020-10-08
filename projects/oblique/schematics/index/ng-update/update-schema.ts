import {Rule} from '@angular-devkit/schematics';

export interface IUpdateSchema {
	targetVersion: string;
}

export interface IMigratable {
	applyMigrations(_options: any): Rule;
}
