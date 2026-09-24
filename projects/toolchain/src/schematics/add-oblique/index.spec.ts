import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import {runRule} from '../test-utils';
import {addOblique} from './index';
import * as addFaviconRules from './rules/add-favicon';
import {addFavicon} from './rules/add-favicon';

describe('addOblique schematics', () => {
	const testRunner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));
	const {logger, loggerGroups} = obMockLogger();

	function createInputTree(): UnitTestTree {
		const tree = new UnitTestTree(Tree.empty());
		tree.create(
			'package.json',
			JSON.stringify({
				name: 'test-app',
				version: '0.0.0',
				dependencies: {'@angular/core': '^18.0.0', '@angular/common': '^18.0.0', '@oblique/oblique': '^16.0.0'},
			})
		);
		tree.create(
			'src/app/app-module.ts',
			`import { NgModule } from '@angular/core';\n@NgModule({})\nexport class AppModule {}`
		);
		tree.create(
			'src/app/app.ts',
			`import {Component, signal} from '@angular/core';\n@Component({selector: 'app-root'})\nexport class App {\n\tprotected readonly title = signal('test');\n}`
		);
		tree.create(
			'src/app/app.spec.ts',
			`import {TestBed} from '@angular/core/testing';\nimport {RouterModule} from '@angular/router';\nimport {App} from './app';\ndescribe('App', () => {\n\tbeforeEach(async () => {\n\t\tawait TestBed.configureTestingModule({\n\t\t\timports: [RouterModule.forRoot([])],\n\t\t\tdeclarations: [App],\n\t\t}).compileComponents();\n\t});\n\tit('should create the app', () => {\n\t\tconst fixture = TestBed.createComponent(App);\n\t\texpect(fixture.componentInstance).toBeTruthy();\n\t});\n\tit('should render title', () => {});\n});`
		);
		tree.create('src/app/app.html', '<div>old</div>');
		return tree;
	}

	test('orchestration', async () => {
		const inputTree = createInputTree();
		vi.spyOn(addFaviconRules, 'addFavicon');

		await runRule(
			testRunner,
			addOblique({locale: 'de-CH fr-CH', title: 'Test App', applicationOperator: 'Test Operator', silent: false}),
			{
				tree: inputTree,
				path: __dirname,
			}
		);

		expect(logger.group).toHaveBeenCalledWith('Generate @oblique/toolchain:add-oblique');
		expect(addFavicon).toHaveBeenCalledTimes(1);
		expect(loggerGroups[0].end).toHaveBeenCalled();
	});

	test('calls i18n schematic with locales', async () => {
		const inputTree = createInputTree();

		const resultTree = await runRule(
			testRunner,
			addOblique({locale: 'de-CH fr-CH', title: 'Test App', applicationOperator: 'Test Operator', silent: false}),
			{
				tree: inputTree,
				path: __dirname,
			}
		);

		expect(resultTree.exists('src/assets/i18n/de.json')).toBe(true);
		expect(resultTree.exists('src/assets/i18n/fr.json')).toBe(true);
		expect(resultTree.readContent('src/assets/i18n/de.json')).toBe('{}');
		expect(resultTree.readContent('src/assets/i18n/fr.json')).toBe('{}');
	});

	test('applies root layout with master layout template', async () => {
		const inputTree = createInputTree();

		const resultTree = await runRule(
			testRunner,
			addOblique({locale: 'de-CH', title: 'My App', applicationOperator: 'My Operator', silent: false}),
			{
				tree: inputTree,
				path: __dirname,
			}
		);

		const html = resultTree.readText('src/app/app.html');
		expect(html).toContain('My App');
		expect(html).toContain('My Operator');
		expect(html).toContain('ob-master-layout');
	});

	test('imports ObMasterLayoutModule in app module', async () => {
		const inputTree = createInputTree();

		const resultTree = await runRule(
			testRunner,
			addOblique({locale: 'de-CH', title: 'My App', applicationOperator: 'My Operator', silent: false}),
			{
				tree: inputTree,
				path: __dirname,
			}
		);

		const module = resultTree.readText('src/app/app-module.ts');
		expect(module).toContain('ObMasterLayoutModule');
		expect(module).toContain('@oblique/oblique');
	});

	test('replaces title signal with year signal in app component', async () => {
		const inputTree = createInputTree();

		const resultTree = await runRule(
			testRunner,
			addOblique({locale: 'de-CH', title: 'My App', applicationOperator: 'My Operator', silent: false}),
			{
				tree: inputTree,
				path: __dirname,
			}
		);

		const component = resultTree.readText('src/app/app.ts');
		expect(component).not.toContain('title = signal');
		expect(component).toContain('year = signal(new Date().getFullYear())');
	});

	test('removes title test from app component spec but keeps the rest', async () => {
		const inputTree = createInputTree();

		const resultTree = await runRule(
			testRunner,
			addOblique({locale: 'de-CH', title: 'My App', applicationOperator: 'My Operator', silent: false}),
			{
				tree: inputTree,
				path: __dirname,
			}
		);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec).not.toContain('should render title');
		// The describe block, beforeEach and the other test must survive so the
		// imports stay used and no unused-vars lint errors are introduced.
		expect(spec).toContain("describe('App'");
		expect(spec).toContain('should create the app');
		expect(spec).toContain('TestBed.configureTestingModule');
	});
});
