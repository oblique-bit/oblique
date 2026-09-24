import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../../logger/mock';
import {runRule} from '../../test-utils';
import rootLayout from './root-layout';

describe('rootLayout', () => {
	const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
	const {logger, loggerGroups, clearGroups} = obMockLogger();

	afterEach(() => {
		vi.clearAllMocks();
		clearGroups();
	});

	function createInputTree(): UnitTestTree {
		const tree = new UnitTestTree(Tree.empty());
		tree.create('package.json', JSON.stringify({name: 'test-app', dependencies: {'@oblique/oblique': '^16.0.0'}}));
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

	async function runRootLayout(inputTree: Tree): Promise<UnitTestTree> {
		const groupLogger = logger.group('rootLayout');
		return runRule(runner, rootLayout(groupLogger, 'My App', 'My Operator'), {
			tree: inputTree,
			path: join(__dirname, '..'),
		});
	}

	test('applies master layout template', async () => {
		const inputTree = createInputTree();
		const resultTree = await runRootLayout(inputTree);

		const html = resultTree.readText('src/app/app.html');
		expect(html).toContain('My App');
		expect(html).toContain('My Operator');
		expect(html).toContain('ob-master-layout');
	});

	test('imports ObMasterLayoutModule', async () => {
		const inputTree = createInputTree();
		const resultTree = await runRootLayout(inputTree);

		const module = resultTree.readText('src/app/app-module.ts');
		expect(module).toContain('ObMasterLayoutModule');
		expect(module).toContain('@oblique/oblique');
	});

	test('replaces title signal with year signal', async () => {
		const inputTree = createInputTree();
		const resultTree = await runRootLayout(inputTree);

		const component = resultTree.readText('src/app/app.ts');
		expect(component).not.toContain('title = signal');
		expect(component).toContain('year = signal(new Date().getFullYear())');
	});

	test('removes title test but keeps the rest of the spec', async () => {
		const inputTree = createInputTree();
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec).not.toContain('should render title');
		// The describe block, beforeEach and the other test must survive so the
		// imports stay used and no unused-vars lint errors are introduced.
		expect(spec).toContain("describe('App'");
		expect(spec).toContain('should create the app');
		expect(spec).toContain('TestBed.configureTestingModule');
	});

	test('adds master layout to the spec test bed', async () => {
		const inputTree = createInputTree();
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec).toContain('ObMasterLayoutModule');
		expect(spec).toContain('provideObliqueTestingConfiguration');
		expect(spec).toContain("from '@oblique/oblique'");
		// The TestBed configuration must stay valid: the import lands after the App import,
		// the provider before the imports array.
		expect(spec.indexOf("from '@oblique/oblique'")).toBeGreaterThan(spec.indexOf('import {App}'));
		expect(spec).toContain('providers: [provideObliqueTestingConfiguration()]');
	});

	test('adds a single oblique import statement to the spec', async () => {
		const inputTree = createInputTree();
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec.match(/from '@oblique\/oblique'/gu)).toHaveLength(1);
	});

	test('skips the spec test bed change when the spec already imports from oblique', async () => {
		const inputTree = createInputTree();
		inputTree.overwrite(
			'src/app/app.spec.ts',
			`import {TestBed} from '@angular/core/testing';\nimport {ObMasterLayoutModule} from '@oblique/oblique';\nimport {App} from './app';\ndescribe('App', () => {\n\tit('should create the app', () => {});\n});`
		);
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec).not.toContain('provideObliqueTestingConfiguration');
		expect(spec.match(/ObMasterLayoutModule/gu)).toHaveLength(1);
	});

	test('warns and skips the spec test bed change when the spec does not match the expected shapes', async () => {
		const inputTree = createInputTree();
		inputTree.overwrite('src/app/app.spec.ts', 'export const nothingHere = true;\n');
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec).toBe('export const nothingHere = true;\n');
		expect(loggerGroups[0].warn).toHaveBeenCalledWith(expect.stringContaining('app.spec.ts'));
	});

	test('adds the provider when the spec has an empty imports array', async () => {
		const inputTree = createInputTree();
		inputTree.overwrite(
			'src/app/app.spec.ts',
			`import {TestBed} from '@angular/core/testing';\nimport {App} from './app';\ndescribe('App', () => {\n\tbeforeEach(async () => {\n\t\tawait TestBed.configureTestingModule({\n\t\t\timports: [],\n\t\t\tdeclarations: [App],\n\t\t}).compileComponents();\n\t});\n});`
		);
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec).toContain('ObMasterLayoutModule');
		expect(spec).toContain('provideObliqueTestingConfiguration()');
	});

	test('warns and skips the spec test bed change when the imports property is not an array', async () => {
		const inputTree = createInputTree();
		const specContent = `import {TestBed} from '@angular/core/testing';\nimport {RouterModule} from '@angular/router';\nimport {App} from './app';\ndescribe('App', () => {\n\tbeforeEach(async () => {\n\t\tawait TestBed.configureTestingModule({\n\t\t\timports: RouterModule,\n\t\t\tdeclarations: [App],\n\t\t}).compileComponents();\n\t});\n});`;
		inputTree.overwrite('src/app/app.spec.ts', specContent);
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec).toBe(specContent);
		expect(loggerGroups[0].warn).toHaveBeenCalledWith(expect.stringContaining('imports'));
	});

	test('warns and skips the spec test bed change when the spec has no TestBed.configureTestingModule call', async () => {
		const inputTree = createInputTree();
		const specContent = `import {App} from './app';\ndescribe('App', () => {\n\tit('should create the app', () => {});\n});`;
		inputTree.overwrite('src/app/app.spec.ts', specContent);
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec).toBe(specContent);
		expect(loggerGroups[0].warn).toHaveBeenCalledWith(expect.stringContaining('TestBed.configureTestingModule'));
	});

	test('warns and skips the spec test bed change when the TestBed argument is not an object literal', async () => {
		const inputTree = createInputTree();
		const specContent = `import {TestBed} from '@angular/core/testing';\nimport {App} from './app';\ndescribe('App', () => {\n\tbeforeEach(async () => {\n\t\tawait TestBed.configureTestingModule(App);\n\t});\n});`;
		inputTree.overwrite('src/app/app.spec.ts', specContent);
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		expect(spec).toBe(specContent);
		expect(loggerGroups[0].warn).toHaveBeenCalledWith(expect.stringContaining('object literal'));
	});

	test('adds the provider to an empty TestBed configuration', async () => {
		const inputTree = createInputTree();
		inputTree.overwrite(
			'src/app/app.spec.ts',
			`import {TestBed} from '@angular/core/testing';\nimport {App} from './app';\ndescribe('App', () => {\n\tbeforeEach(async () => {\n\t\tawait TestBed.configureTestingModule({});\n\t});\n});`
		);
		const resultTree = await runRootLayout(inputTree);

		const spec = resultTree.readText('src/app/app.spec.ts');
		// Both properties are new and must be emitted together with a comma between them,
		// otherwise the generated spec is malformed.
		expect(spec).toBe(
			`import {TestBed} from '@angular/core/testing';\nimport {App} from './app';\nimport { ObMasterLayoutModule, provideObliqueTestingConfiguration } from '@oblique/oblique';\ndescribe('App', () => {\n\tbeforeEach(async () => {\n\t\tawait TestBed.configureTestingModule({\n\t\timports: [ObMasterLayoutModule],\n\t\tproviders: [provideObliqueTestingConfiguration()]});\n\t});\n});`
		);
	});

	test('logs step', async () => {
		const inputTree = createInputTree();
		await runRootLayout(inputTree);

		expect(loggerGroups[0].step).toHaveBeenCalledWith('Embed Oblique master layout');
	});

	test('does nothing when app files are missing', async () => {
		const inputTree = new UnitTestTree(Tree.empty());
		inputTree.create('package.json', JSON.stringify({name: 'test-app', dependencies: {'@oblique/oblique': '^16.0.0'}}));

		const resultTree = await runRootLayout(inputTree);

		expect(resultTree.exists('src/app/app.html')).toBe(false);
		expect(resultTree.exists('src/app/app-module.ts')).toBe(false);
		expect(resultTree.exists('src/app/app.ts')).toBe(false);
		expect(resultTree.exists('src/app/app.spec.ts')).toBe(false);
	});
});
