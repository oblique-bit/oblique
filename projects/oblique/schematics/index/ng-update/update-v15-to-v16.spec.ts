import {removeMasterLayoutConfigLocaleReferences, removeObIconModuleReferences} from './update-v15-to-v16';
import {UpdateV15toV16} from './update-v15-to-v16';

describe('UpdateV15toV16', () => {
	const migration = new UpdateV15toV16();
	const rewriteSchemaValidationImports = (content: string): string =>
		(
			migration as unknown as {
				rewriteSchemaValidationImports: (fileContent: string) => string;
			}
		).rewriteSchemaValidationImports(content);

	describe('removeObIconModuleReferences', () => {
		it('should remove ObIconModule from imports and providers', () => {
			const content = `@NgModule({
	imports: [ObIconModule, FooModule],
	providers: [importProvidersFrom(ObIconModule), provideFoo()],
})
export class AppModule {}`;

			const result = removeObIconModuleReferences(content);

			expect(result).not.toContain('ObIconModule');
			expect(result).toContain('imports: [FooModule]');
			expect(result).toContain('providers: [provideFoo()]');
		});

		it('should remove ObIconModule.forRoot() usages', () => {
			const content = `@NgModule({
	imports: [FooModule, ObIconModule.forRoot({registerObliqueIcons: true}), BarModule],
})
export class AppModule {}`;

			const result = removeObIconModuleReferences(content);

			expect(result).not.toContain('ObIconModule');
			expect(result).toContain('imports: [FooModule, BarModule]');
		});
	});

	describe('removeMasterLayoutConfigLocaleReferences', () => {
		it('should remove locale property assignments', () => {
			const content = `constructor(obMasterLayoutConfig: ObMasterLayoutConfig) {
	obMasterLayoutConfig.locale.defaultLanguage = 'de';
	obMasterLayoutConfig.header.isSmall = true;
}`;

			const result = removeMasterLayoutConfigLocaleReferences(content);

			expect(result).not.toContain('locale.defaultLanguage');
			expect(result).toContain('obMasterLayoutConfig.header.isSmall = true;');
		});

		it('should remove locale object assignments', () => {
			const content = `configure(obMasterLayoutConfig: ObMasterLayoutConfig): void {
	this.obMasterLayoutConfig.locale = {
		defaultLanguage: 'de',
		locales: ['de-CH'],
	};
	this.obMasterLayoutConfig.homePageRoute = '/home';
}`;

			const result = removeMasterLayoutConfigLocaleReferences(content);

			expect(result).not.toContain('defaultLanguage');
			expect(result).toContain("this.obMasterLayoutConfig.homePageRoute = '/home';");
		});

		it('should remove single-line locale object assignments', () => {
			const content = `configure(obMasterLayoutConfig: ObMasterLayoutConfig): void {
	obMasterLayoutConfig.locale = {defaultLanguage: 'de', locales: ['de-CH'], languages: {de: 'Deutsch'}} as ObILocale;
	obMasterLayoutConfig.homePageRoute = '/home';
}`;

			const result = removeMasterLayoutConfigLocaleReferences(content);

			expect(result).not.toContain('obMasterLayoutConfig.locale');
			expect(result).toContain("obMasterLayoutConfig.homePageRoute = '/home';");
		});

		it('should remove typed multiline locale object assignments', () => {
			const content = `configure(obMasterLayoutConfig: ObMasterLayoutConfig): void {
	obMasterLayoutConfig.locale = {
		defaultLanguage: 'de',
		locales: ['de-CH'],
		languages: {de: 'Deutsch'},
	} satisfies ObILocale;
	obMasterLayoutConfig.homePageRoute = '/home';
}`;

			const result = removeMasterLayoutConfigLocaleReferences(content);

			expect(result).not.toContain('obMasterLayoutConfig.locale');
			expect(result).toContain("obMasterLayoutConfig.homePageRoute = '/home';");
		});

		it('should remove locale object properties', () => {
			const content = `const config: ObMasterLayoutConfig = {
	homePageRoute: '/home',
	locale: {
		defaultLanguage: 'de',
		locales: ['de-CH'],
	},
	header: {isSmall: true},
};`;

			const result = removeMasterLayoutConfigLocaleReferences(content);

			expect(result).not.toContain('locale');
			expect(result).toContain("homePageRoute: '/home'");
			expect(result).toContain('header: {isSmall: true}');
		});
	});

	test('should move schema validation imports to the secondary entry point', () => {
		const content = `import {ObSchemaValidationModule, ObButtonModule} from '@oblique/oblique';\n`;

		expect(rewriteSchemaValidationImports(content)).toBe(
			`import {ObButtonModule} from '@oblique/oblique';\nimport {ObSchemaValidationModule} from '@oblique/oblique/schema-validation';\n\n`
		);
	});

	test('should not overmatch previous named imports when moving schema validation imports', () => {
		const content = `import {\n  NgModule,\n  provideBrowserGlobalErrorListeners,\n  provideZoneChangeDetection,\n} from '@angular/core';\nimport { ReactiveFormsModule } from '@angular/forms';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { ObSchemaValidationModule } from '@oblique/oblique';\nimport { AppRoutingModule } from './app-routing-module';\nimport { App } from './app';\n`;

		expect(rewriteSchemaValidationImports(content)).toBe(
			`import {\n  NgModule,\n  provideBrowserGlobalErrorListeners,\n  provideZoneChangeDetection,\n} from '@angular/core';\nimport { ReactiveFormsModule } from '@angular/forms';\nimport { BrowserModule } from '@angular/platform-browser';\n\nimport { AppRoutingModule } from './app-routing-module';\nimport { App } from './app';\nimport {ObSchemaValidationModule} from '@oblique/oblique/schema-validation';\n\n`
		);
	});

	test('should merge schema validation imports with an existing secondary entry point import', () => {
		const content = `import {ObSchemaValidationModule} from '@oblique/oblique/schema-validation';\nimport {ObButtonModule, ObSchemaValidateDirective} from '@oblique/oblique';\n`;

		expect(rewriteSchemaValidationImports(content)).toBe(
			`import {ObSchemaValidationModule, ObSchemaValidateDirective} from '@oblique/oblique/schema-validation';\nimport {ObButtonModule} from '@oblique/oblique';\n`
		);
	});

	test('should preserve type and aliased schema validation imports', () => {
		const content = `import type {ObSchemaValidatorInstance as Validator} from '@oblique/oblique';\nimport {type ObSchemaValidationService, ObButtonModule} from '@oblique/oblique';\n`;

		expect(rewriteSchemaValidationImports(content)).toBe(
			`import {ObButtonModule} from '@oblique/oblique';\nimport {type ObSchemaValidationService, type ObSchemaValidatorInstance as Validator} from '@oblique/oblique/schema-validation';\n\n`
		);
	});
});
