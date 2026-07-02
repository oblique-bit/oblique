import {HostTree, type Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import type {JsonObject, JsonValue} from '@angular-devkit/core';
import {join} from 'node:path';
import {firstValueFrom} from 'rxjs';
import {obCreateLogger} from '../../../logger';
import {addFavicon} from './add-favicon.rule';

describe(addFavicon.name, () => {
	const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
	const logger = obCreateLogger(true).group('logger');
	const defaultFavicon = '<link rel="icon" type="image/x-icon" href="favicon.ico">';
	const obliqueFavicon = '<link rel="icon" type="image/png" href="assets/images/favicon.png">';
	let inputTree: Tree;

	beforeEach(() => {
		inputTree = new HostTree();
		jest.spyOn(logger, 'step');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('replaces favicon in default project index from angular.json', async () => {
		inputTree.create('angular.json', buildAngularJson({index: 'src/index.html'}));
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
		expect(resultTree.readText('src/index.html')).not.toContain(defaultFavicon);
	});

	test('replaces favicon in default project index configured as an object', async () => {
		inputTree.create('angular.json', buildAngularJson({index: {input: 'src/index.html', output: 'index.html'}}));
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
		expect(resultTree.readText('src/index.html')).not.toContain(defaultFavicon);
	});

	test('replaces favicon in all project indexes if no default project is set', async () => {
		inputTree.create('angular.json', buildAngularJson({index: 'src/app1-index.html'}, {index: 'src/app2-index.html'}));
		inputTree.create('src/app1-index.html', `<head>${defaultFavicon}</head>`);
		inputTree.create('src/app2-index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/app1-index.html')).toContain(obliqueFavicon);
		expect(resultTree.readText('src/app2-index.html')).toContain(obliqueFavicon);
	});

	test('falls back to src/index.html when angular.json is missing', async () => {
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
	});

	test('falls back to src/index.html when no index config is present', async () => {
		inputTree.create('angular.json', JSON.stringify({version: 1, projects: {app: {root: '', architect: {}}}}));
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
	});

	test('falls back to src/index.html when projects are missing in angular.json', async () => {
		inputTree.create('angular.json', JSON.stringify({version: 1}));
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
	});

	test('skips file when index.html exists but has empty content', async () => {
		inputTree.create('angular.json', buildAngularJson({index: 'src/index.html'}));
		inputTree.create('src/index.html', '');

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toBe('<html><head></head><body></body></html>');
	});

	test('falls back to src/index.html when angular.json is not an object', async () => {
		inputTree.create('angular.json', '123');
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
	});

	test('falls back to "{}" when angular.json exists but cannot be read', async () => {
		inputTree.create('angular.json', JSON.stringify({defaultProject: 'app'}));
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);
		jest.spyOn(inputTree, 'read').mockImplementation((path: string) => {
			if (path === 'angular.json') {
				return null;
			}
			return inputTree.get(path)?.content ?? null;
		});

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
	});

	test('falls back to src/index.html when architect config is missing', async () => {
		inputTree.create(
			'angular.json',
			JSON.stringify({
				version: 1,
				projects: {
					app: {},
				},
			})
		);
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
	});

	test('falls back to src/index.html when build config is missing', async () => {
		inputTree.create(
			'angular.json',
			JSON.stringify({
				version: 1,
				projects: {
					app: {
						architect: {},
					},
				},
			})
		);
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
	});

	test('falls back to src/index.html when options config is missing', async () => {
		inputTree.create(
			'angular.json',
			JSON.stringify({
				projects: {
					version: 1,
					app: {
						architect: {
							build: {},
						},
					},
				},
			})
		);
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
	});

	test('falls back to src/index.html when index exists but is not a string', async () => {
		inputTree.create('angular.json', buildAngularJson({index: 123}));
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.readText('src/index.html')).toContain(obliqueFavicon);
	});

	test('skips missing index file without failing', async () => {
		inputTree.create('angular.json', buildAngularJson({index: 'src/index.html'}));

		const resultTree = await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(resultTree.exists('src/index.html')).toBe(false);
	});

	test('skip unchanged file', async () => {
		inputTree.create('angular.json', buildAngularJson({index: 'src/index.html'}));
		inputTree.create('src/index.html', `<html><head>${obliqueFavicon}</head><body></body></html>`);
		jest.spyOn(inputTree, 'overwrite');

		await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(inputTree.overwrite).not.toHaveBeenCalled();
	});

	test('calls logger.step', async () => {
		inputTree.create('src/index.html', `<head>${defaultFavicon}</head>`);

		await firstValueFrom(runner.callRule(addFavicon(logger), inputTree));

		expect(logger.step).toHaveBeenCalledWith('Embed Oblique favicon');
	});
});

function buildAngularJson(options: JsonValue, app2Options?: JsonValue): string {
	const projects: JsonObject = {app: {root: '', architect: {build: {options}}}};
	if (app2Options) {
		projects.app2 = {root: '', architect: {build: {options: app2Options}}};
	}

	return JSON.stringify({version: 1, projects});
}
