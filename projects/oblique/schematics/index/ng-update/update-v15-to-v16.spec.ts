import {removeMasterLayoutConfigLocaleReferences, removeObIconModuleReferences} from './update-v15-to-v16';

describe('UpdateV15toV16', () => {
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
});
