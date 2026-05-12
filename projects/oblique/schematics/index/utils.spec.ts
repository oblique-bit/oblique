import {Tree} from '@angular-devkit/schematics';
import {addImport, createObjectPropertyRegex, createPropertyAssignmentRegex, removeImport} from './utils';

describe('utils', () => {
	describe('addImport and removeImport', () => {
		const filePath = '/test.ts';

		it('moves aliased type imports without losing the original specifier', () => {
			const tree = Tree.empty();
			tree.create(filePath, `import type {ObSchemaValidatorInstance as Validator} from '@oblique/oblique';\n`);

			const removedImports = removeImport(tree, filePath, 'ObSchemaValidatorInstance', '@oblique/oblique');
			removedImports.forEach(specifier => addImport(tree, filePath, specifier, '@oblique/oblique/schema-validation'));

			expect(removedImports).toEqual(['type ObSchemaValidatorInstance as Validator']);
			expect(tree.readText(filePath)).toBe(
				`import {type ObSchemaValidatorInstance as Validator} from '@oblique/oblique/schema-validation';\n`
			);
		});

		it('removes multiple named imports without leaving trailing commas', () => {
			const tree = Tree.empty();
			tree.create(
				filePath,
				`import {ObSchemaValidationModule, ObButtonModule, ObSchemaValidateDirective} from '@oblique/oblique';\n`
			);

			removeImport(tree, filePath, 'ObSchemaValidationModule', '@oblique/oblique');
			removeImport(tree, filePath, 'ObSchemaValidateDirective', '@oblique/oblique');

			expect(tree.readText(filePath)).toBe(`import {ObButtonModule} from '@oblique/oblique';\n`);
		});

		it('merges added imports into an existing declaration', () => {
			const tree = Tree.empty();
			tree.create(
				filePath,
				`import {ObSchemaValidationModule} from '@oblique/oblique/schema-validation';\nimport {ObButtonModule} from '@oblique/oblique';\n`
			);

			addImport(tree, filePath, 'ObSchemaValidateDirective', '@oblique/oblique/schema-validation');

			expect(tree.readText(filePath)).toBe(
				`import {ObSchemaValidationModule, ObSchemaValidateDirective} from '@oblique/oblique/schema-validation';\nimport {ObButtonModule} from '@oblique/oblique';\n`
			);
		});
	});

	describe('createPropertyAssignmentRegex', () => {
		it.each([
			'locale.maxLastUsedApplications = 8;',
			`locale['maxLastUsedApplications'] = 10;`,
			'locale["maxLastUsedApplications"] = 12;',
			'locale[`maxLastUsedApplications`] = 6;',
		])('matches single-line assignments (%s)', line => {
			const regex = createPropertyAssignmentRegex('locale', 'maxLastUsedApplications');
			expect(regex.test(line)).toBe(true);
		});

		it('should hit multiline 3 times', () => {
			const inputString = `locale.maxLastUsedApplications = 8;
				locale.maxLastUsedApplications = 12;
				locale.maxLastUsedApplications = 32;
			`;

			const regex = createPropertyAssignmentRegex('locale', 'maxLastUsedApplications');
			const matches = [...inputString.matchAll(regex)];
			expect(matches).toHaveLength(3);
		});

		it('does not match assignments for another property', () => {
			const regex = createPropertyAssignmentRegex('locale', 'maxLastUsedApplications');
			expect(regex.test('locale.display = "full";')).toBe(false);
		});
	});

	describe('createObjectPropertyRegex', () => {
		it('captures prefix and suffix when property is in the middle', () => {
			const regex = createObjectPropertyRegex('locale', 'maxLastUsedApplications');
			const match = regex.exec('this.locale = { display: "full", maxLastUsedApplications: 8, fallback: "de" };');

			expect(match?.groups?.prefix).toBe('this.locale = { display: "full"');
			expect(match?.groups?.suffix).toBe(', fallback: "de" };');
		});

		it('supports removing the first property segment with replace', () => {
			const regex = createObjectPropertyRegex('locale', 'maxLastUsedApplications');
			const line = 'locale = { maxLastUsedApplications: 8, display: "full" };';

			expect(line.replace(regex, '$<prefix>$<suffix>')).toBe('locale = { display: "full" };');
		});

		it('does not match object assignments when the property is missing', () => {
			const regex = createObjectPropertyRegex('locale', 'maxLastUsedApplications');
			expect(regex.test('locale = { display: "full", fallback: "de" };')).toBe(false);
		});
	});
});
