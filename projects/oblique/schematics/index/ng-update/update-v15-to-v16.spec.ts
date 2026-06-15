import {removeObIconModuleReferences} from './update-v15-to-v16';

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
});
