import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../../logger/mock';
import {readFileWithSystemEol, runRule} from '../../test-utils';
import {toolchain} from '../index';

const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
const {loggerGroups, clearGroups} = obMockLogger();
const templatesDir = join(__dirname, '../templates');

interface AngularJson {
	version: number;
	projects: Record<string, {root: string; architect: {serve: {options: Record<string, unknown>}}}>;
}

function createAngularJson(projects: AngularJson['projects'] = {}): string {
	return JSON.stringify({
		version: 1,
		projects,
	});
}

function createBaseTree(): HostTree {
	const tree = new HostTree();
	tree.create('/package.json', JSON.stringify({devDependencies: {}}));
	return tree;
}

describe('addProxy', () => {
	afterEach(() => {
		vi.clearAllMocks();
		clearGroups();
	});

	describe('when no proxy port is provided', () => {
		test('does not create proxy.conf.json', async () => {
			const inputTree = createBaseTree();
			inputTree.create('/angular.json', createAngularJson({app: {root: '', architect: {serve: {options: {}}}}}));
			const resultTree = await runRule(runner, toolchain({npmrc: true}), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});
			expect(resultTree.exists('./proxy.conf.json')).toBe(false);
		});

		test('does not update angular.json', async () => {
			const inputTree = createBaseTree();
			inputTree.create('/angular.json', createAngularJson({app: {root: '', architect: {serve: {options: {}}}}}));
			const resultTree = await runRule(runner, toolchain({npmrc: true}), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});

			const angularJson = JSON.parse(resultTree.readContent('/angular.json')) as AngularJson;
			expect(angularJson.projects.app.architect.serve.options.proxyConfig).toBeUndefined();
		});
	});

	describe('when proxy.conf.json does not exist', () => {
		test('creates a new proxy.conf.json file', async () => {
			const inputTree = createBaseTree();
			inputTree.create('/angular.json', createAngularJson({app: {root: '', architect: {serve: {options: {}}}}}));
			const templateContent = readFileWithSystemEol(templatesDir, 'add-proxy/proxy.conf.json');
			const resultTree = await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});

			expect(resultTree.readContent('./proxy.conf.json')).toEqual(templateContent.replace('<%= port %>', '4200'));
		});

		test('updates angular.json with proxyConfig for default project', async () => {
			const inputTree = createBaseTree();
			inputTree.create('/angular.json', createAngularJson({app: {root: '', architect: {serve: {options: {}}}}}));
			const resultTree = await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});

			const angularJson = JSON.parse(resultTree.readContent('/angular.json')) as AngularJson;
			expect(angularJson.projects.app.architect.serve.options.proxyConfig).toBe('proxy.conf.json');
		});

		test('logs only as soon as rule executes', async () => {
			const inputTree = createBaseTree();
			inputTree.create('/angular.json', createAngularJson({app: {root: '', architect: {serve: {options: {}}}}}));
			expect(loggerGroups[0]).toBeUndefined();

			await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {tree: inputTree, path: join(__dirname, '..')});
			expect(loggerGroups[0].step).toHaveBeenCalledWith('Create proxy.conf.json file at project root');
		});

		test('logs angular.json update', async () => {
			const inputTree = createBaseTree();
			inputTree.create('/angular.json', createAngularJson({app: {root: '', architect: {serve: {options: {}}}}}));
			await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {tree: inputTree, path: join(__dirname, '..')});
			expect(loggerGroups[0].step).toHaveBeenCalledWith('Update angular.json to use proxy configuration');
		});

		test('is idempotent - multiple executions produce same result', async () => {
			const inputTree = createBaseTree();
			inputTree.create('/angular.json', createAngularJson({app: {root: '', architect: {serve: {options: {}}}}}));
			const templateContent = readFileWithSystemEol(templatesDir, 'add-proxy/proxy.conf.json');
			const expectedContent = templateContent.replace('<%= port %>', '4200');

			const firstResultTree = await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});
			const secondResultTree = await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {
				tree: firstResultTree,
				path: join(__dirname, '..'),
			});

			expect(firstResultTree.readContent('./proxy.conf.json')).toEqual(expectedContent);
			expect(secondResultTree.readContent('./proxy.conf.json')).toEqual(expectedContent);

			const angularJson = JSON.parse(secondResultTree.readContent('/angular.json')) as AngularJson;
			expect(angularJson.projects.app.architect.serve.options.proxyConfig).toBe('proxy.conf.json');
		});
	});

	describe('when proxy.conf.json already exists', () => {
		test('does not overwrite existing proxy.conf.json', async () => {
			const inputTree = createBaseTree();
			inputTree.create('/angular.json', createAngularJson({app: {root: '', architect: {serve: {options: {}}}}}));
			inputTree.create('proxy.conf.json', 'existing content');
			const resultTree = await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});
			expect(resultTree.readContent('./proxy.conf.json')).toEqual('existing content');
		});

		test('does not update angular.json when proxy.conf.json already exists', async () => {
			const inputTree = createBaseTree();
			inputTree.create('/angular.json', createAngularJson({app: {root: '', architect: {serve: {options: {}}}}}));
			inputTree.create('proxy.conf.json', 'existing content');
			const resultTree = await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});

			const angularJson = JSON.parse(resultTree.readContent('/angular.json')) as AngularJson;
			expect(angularJson.projects.app.architect.serve.options.proxyConfig).toBeUndefined();
		});
	});

	describe('with multiple projects', () => {
		test('updates angular.json with proxyConfig for all projects', async () => {
			const inputTree = createBaseTree();
			inputTree.create(
				'/angular.json',
				createAngularJson({
					app1: {root: '', architect: {serve: {options: {}}}},
					app2: {root: '', architect: {serve: {options: {}}}},
				})
			);
			const resultTree = await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});

			const angularJson = JSON.parse(resultTree.readContent('/angular.json')) as AngularJson;
			expect(angularJson.projects.app1.architect.serve.options.proxyConfig).toBe('proxy.conf.json');
			expect(angularJson.projects.app2.architect.serve.options.proxyConfig).toBe('proxy.conf.json');
		});
	});

	describe('without angular.json', () => {
		test('creates proxy.conf.json without error', async () => {
			const inputTree = createBaseTree();
			const templateContent = readFileWithSystemEol(templatesDir, 'add-proxy/proxy.conf.json');
			const resultTree = await runRule(runner, toolchain({npmrc: true, proxy: '4200'}), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});
			expect(resultTree.readContent('./proxy.conf.json')).toEqual(templateContent.replace('<%= port %>', '4200'));
		});
	});
});
