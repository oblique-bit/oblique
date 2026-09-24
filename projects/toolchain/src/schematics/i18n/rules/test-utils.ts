export const basicAppModule = (): string => `
import { NgModule } from '@angular/core';
import { provideObliqueConfiguration } from '@oblique/oblique';
@NgModule({providers: [provideObliqueConfiguration({accessibilityStatement: {
	applicationName: 'Test application',
	conformity: 'none',
	createdOn: new Date('2025-01-01'),
	applicationOperator: 'Test operator',
	contact: [{email: 'test@example.com'}]
}})]})
export class AppModule {}
`;

const jsonIndent = 2;

export const basicPackageJson = (): string =>
	JSON.stringify(
		{
			name: 'test-app',
			version: '0.0.0',
			dependencies: {
				'@angular/core': '^18.0.0',
				'@angular/common': '^18.0.0',
				'@oblique/oblique': '^16.0.0',
			},
		},
		null,
		jsonIndent
	);

export const appModuleWithLocaleId = (): string => `
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
@NgModule({providers: [{provide: LOCALE_ID, useValue: 'en-US'}]})
export class AppModule {}
`;

export const appModuleWithRegisteredLocales = (): string => `
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDECH from '@angular/common/locales/de-CH';
registerLocaleData(localeDECH);
@NgModule({})
export class AppModule {}
`;

export const appModuleWithObliqueConfig = (): string => `
import { NgModule } from '@angular/core';
import { provideObliqueConfiguration } from '@oblique/oblique';
@NgModule({providers: [provideObliqueConfiguration({accessibilityStatement: {
	applicationName: 'Test application',
	conformity: 'none',
	createdOn: new Date('2025-01-01'),
	applicationOperator: 'Test operator',
	contact: [{email: 'test@example.com'}]
}})]})
export class AppModule {}
`;

export const appModuleWithExistingTranslations = (): string => `
import { NgModule } from '@angular/core';
@NgModule({})
export class AppModule {}
`;
