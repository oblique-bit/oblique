import {type Rule, type Tree, chain, move, template} from '@angular-devkit/schematics';
import {addImportToModule, insertImport} from '@schematics/angular/utility/ast-utils';
import {type Change, InsertChange, NoopChange} from '@schematics/angular/utility/change';
import {type ObjectLiteralExpression, type SourceFile, type Statement, isObjectLiteralExpression} from 'typescript';
import type {ObGroupLogger} from '../../../logger';
import {createFromTemplate} from '../../shared/template/template';
import {
	applyChanges,
	createSrcFile,
	findCallExpression,
	insertClassProperty,
	insertIntoObjectLiteralArray,
	removeClassProperty,
	removeStatement,
} from '../../shared/ast/ts';
const obliquePackage = '@oblique/oblique';
const masterLayoutModule = 'ObMasterLayoutModule';
const testingConfiguration = 'provideObliqueTestingConfiguration';
const appModulePath = 'src/app/app-module.ts';
const appComponentPath = 'src/app/app.ts';
const appSpecPath = 'src/app/app.spec.ts';
const appTemplatePath = 'src/app/app.html';

export default function rootLayout(logger: ObGroupLogger, title: string, applicationOperator: string): Rule {
	return chain([
		(tree: Tree) => {
			logger.step('Embed Oblique master layout');
			return tree;
		},
		importMasterLayoutModule(),
		applyMasterLayout(title, applicationOperator),
		replaceTitleWithYearSignal(),
		removeTitleTest(),
		addMasterLayoutToSpecTestBed(logger),
	]);
}

function importMasterLayoutModule(): Rule {
	return (tree: Tree) => {
		if (!tree.exists(appModulePath)) {
			return tree;
		}
		const sourceFile = createSrcFile(tree, appModulePath);
		applyChanges(tree, appModulePath, addImportToModule(sourceFile, appModulePath, masterLayoutModule, obliquePackage));
		return tree;
	};
}

function applyMasterLayout(title: string, applicationOperator: string): Rule {
	return (tree: Tree) => {
		if (!tree.exists(appTemplatePath)) {
			return tree;
		}
		tree.delete(appTemplatePath);
		return createFromTemplate('./templates/root-layout', [
			template({title, applicationOperator}),
			move('master-layout.html', appTemplatePath),
		]);
	};
}

function replaceTitleWithYearSignal(): Rule {
	return (tree: Tree) => {
		if (!tree.exists(appComponentPath)) {
			return tree;
		}
		const sourceFile = createSrcFile(tree, appComponentPath);
		const changes = [
			removeClassProperty(sourceFile, 'App', 'title'),
			insertClassProperty(sourceFile, 'App', 'readonly year = signal(new Date().getFullYear());'),
		];
		applyChanges(tree, appComponentPath, changes);
		return tree;
	};
}

function removeTitleTest(): Rule {
	return (tree: Tree) => {
		if (!tree.exists(appSpecPath)) {
			return tree;
		}
		const sourceFile = createSrcFile(tree, appSpecPath);
		const isTitleTest = (statement: Statement): boolean =>
			statement.getText(sourceFile).includes('should render title');
		applyChanges(tree, appSpecPath, [removeStatement(sourceFile, appSpecPath, isTitleTest)]);
		return tree;
	};
}

function addMasterLayoutToSpecTestBed(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		if (!tree.exists(appSpecPath)) {
			return tree;
		}
		const specContent = tree.readText(appSpecPath);
		if (specContent.includes(obliquePackage)) {
			return tree;
		}
		const sourceFile = createSrcFile(tree, appSpecPath);
		const changes = buildSpecTestBedChanges(sourceFile, logger);
		if (!changes) {
			return tree;
		}
		applyChanges(tree, appSpecPath, changes);
		return tree;
	};
}

/**
 * Builds the changes that add the master layout module and testing configuration to the generated
 * app spec's TestBed, or returns nothing when the spec does not match the expected shapes.
 *
 * The edit is lenient: when the spec cannot be adapted (no TestBed call, a non-object-literal
 * argument, or a non-array `imports`/`providers` property), a warning is logged and the spec is
 * left untouched instead of failing the generation.
 *
 * @param sourceFile - The parsed app spec.
 * @param logger - The logger group of the rule, used to warn about skipped edits.
 * @returns The changes to apply, or `undefined` when the edit must be skipped.
 */
function buildSpecTestBedChanges(sourceFile: SourceFile, logger: ObGroupLogger): Change[] | undefined {
	const testBedCall = findCallExpression(sourceFile, 'TestBed.configureTestingModule');
	if (!testBedCall) {
		logger.warn(`Could not add the master layout to ${appSpecPath}: TestBed.configureTestingModule not found.`);
		return undefined;
	}
	const configObject = testBedCall.arguments[0];
	if (!configObject || !isObjectLiteralExpression(configObject)) {
		logger.warn(`Could not add the master layout to ${appSpecPath}: TestBed argument is not an object literal.`);
		return undefined;
	}
	const configChanges = buildConfigChanges(sourceFile, configObject, logger);
	if (!configChanges) {
		return undefined;
	}
	return [
		insertImport(sourceFile, appSpecPath, `${masterLayoutModule}, ${testingConfiguration}`, obliquePackage),
		...configChanges,
	];
}

/**
 * Builds the changes that add the master layout module and testing configuration to the TestBed
 * config object, or returns nothing when the config cannot be adapted.
 *
 * When the config object is empty, both properties are new and would be inserted at the same
 * position, so they are emitted together in a single change with a comma between them.
 *
 * @param sourceFile - The parsed app spec.
 * @param configObject - The TestBed configuration object literal.
 * @param logger - The logger group of the rule, used to warn about skipped edits.
 * @returns The changes to apply, or `undefined` when the edit must be skipped.
 */
function buildConfigChanges(
	sourceFile: SourceFile,
	configObject: ObjectLiteralExpression,
	logger: ObGroupLogger
): Change[] | undefined {
	if (configObject.properties.length === 0) {
		return [
			new InsertChange(
				sourceFile.fileName,
				configObject.getStart(sourceFile) + 1,
				`\n\t\timports: [${masterLayoutModule}],\n\t\tproviders: [${testingConfiguration}()]`
			),
		];
	}
	const importsChange = insertIntoObjectLiteralArray(sourceFile, configObject, {
		propertyName: 'imports',
		value: masterLayoutModule,
	});
	const providersChange = insertIntoObjectLiteralArray(sourceFile, configObject, {
		propertyName: 'providers',
		value: `${testingConfiguration}()`,
	});
	if (isNoopChange(importsChange) || isNoopChange(providersChange)) {
		logger.warn(`Could not add the master layout to ${appSpecPath}: the TestBed imports and providers must be arrays.`);
		return undefined;
	}
	return [importsChange, providersChange];
}

function isNoopChange(change: Change): boolean {
	return change instanceof NoopChange;
}
