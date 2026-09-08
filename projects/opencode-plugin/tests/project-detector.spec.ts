import {mkdirSync, mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import {describe, expect, it} from '@jest/globals';

import {detectObliqueProjectInfo} from '../src/project-detector.js';

function createTempProject(): string {
	return mkdtempSync(join(tmpdir(), 'oblique-opencode-plugin-'));
}

function writePackageJson(directory: string, content: Record<string, unknown>): void {
	writeFileSync(join(directory, 'package.json'), JSON.stringify(content, null, 2), 'utf8');
}

function writeTextFile(directory: string, fileName: string, content: string): void {
	writeFileSync(join(directory, fileName), content, 'utf8');
}

describe('detectObliqueProjectInfo', () => {
	it('detects an Angular project using Oblique', () => {
		const directory = createTempProject();
		writePackageJson(directory, {
			name: 'demo-app',
			dependencies: {
				'@angular/core': '^21.0.0',
				'@oblique/oblique': '^15.4.4',
			},
		});
		writeTextFile(directory, 'angular.json', '{}');
		writeTextFile(directory, 'package-lock.json', '{}');

		const result = detectObliqueProjectInfo(directory);

		expect(result.projectRoot).toBe(directory);
		expect(result.isAngularProject).toBe(true);
		expect(result.isObliqueProject).toBe(true);
		expect(result.angularVersion).toBe('21.0.0');
		expect(result.obliqueVersion).toBe('15.4.4');
		expect(result.packageManager).toBe('npm');
	});

	it('detects an Angular project without Oblique', () => {
		const directory = createTempProject();
		writePackageJson(directory, {
			name: 'angular-only-app',
			devDependencies: {
				'@angular/core': '^21.2.0',
			},
		});

		const result = detectObliqueProjectInfo(directory);

		expect(result.isAngularProject).toBe(true);
		expect(result.isObliqueProject).toBe(false);
		expect(result.angularVersion).toBe('21.2.0');
		expect(result.obliqueVersion).toBeUndefined();
	});

	it('rejects non-Angular projects', () => {
		const directory = createTempProject();
		writePackageJson(directory, {
			name: 'node-service',
			dependencies: {
				express: '^4.18.0',
			},
		});

		const result = detectObliqueProjectInfo(directory);

		expect(result.isAngularProject).toBe(false);
		expect(result.isObliqueProject).toBe(false);
		expect(result.projectRoot).toBe(directory);
	});

	it('does not crash on malformed package.json', () => {
		const directory = createTempProject();
		writeTextFile(directory, 'package.json', '{invalid json');

		const result = detectObliqueProjectInfo(directory);

		expect(result.projectRoot).toBe(directory);
		expect(result.isAngularProject).toBe(false);
		expect(result.isObliqueProject).toBe(false);
		expect(result.angularVersion).toBeUndefined();
		expect(result.obliqueVersion).toBeUndefined();
	});

	it('handles missing package.json safely', () => {
		const directory = createTempProject();

		const result = detectObliqueProjectInfo(directory);

		expect(result.projectRoot).toBe(directory);
		expect(result.isAngularProject).toBe(false);
		expect(result.isObliqueProject).toBe(false);
	});

	it('detects Oblique in dependencies', () => {
		const directory = createTempProject();
		writePackageJson(directory, {
			name: 'app-with-regular-deps',
			dependencies: {
				'@oblique/oblique': '~15.4.4',
			},
		});

		const result = detectObliqueProjectInfo(directory);

		expect(result.isObliqueProject).toBe(true);
		expect(result.obliqueVersion).toBe('15.4.4');
	});

	it('detects Oblique in devDependencies', () => {
		const directory = createTempProject();
		writePackageJson(directory, {
			name: 'app-with-dev-deps',
			devDependencies: {
				'@oblique/oblique': '^15.4.4',
			},
		});

		const result = detectObliqueProjectInfo(directory);

		expect(result.isObliqueProject).toBe(true);
		expect(result.obliqueVersion).toBe('15.4.4');
	});

	it('normalizes version ranges such as ^15.4.4', () => {
		const directory = createTempProject();
		writePackageJson(directory, {
			name: 'version-range-app',
			dependencies: {
				'@oblique/oblique': '^15.4.4',
				'@angular/core': '^21.0.0',
			},
		});

		const result = detectObliqueProjectInfo(directory);

		expect(result.angularVersion).toBe('21.0.0');
		expect(result.obliqueVersion).toBe('15.4.4');
	});

	it.each(['bun.lock', 'bun.lockb'])('detects Bun from %s', lockFile => {
		const directory = createTempProject();
		writePackageJson(directory, {name: 'bun-app'});
		writeTextFile(directory, lockFile, '');

		expect(detectObliqueProjectInfo(directory).packageManager).toBe('bun');
	});

	it.each(['npm', 'pnpm', 'yarn', 'bun'] as const)('detects %s from packageManager metadata', packageManager => {
		const directory = createTempProject();
		writePackageJson(directory, {name: 'managed-app', packageManager: `${packageManager}@1.0.0`});

		expect(detectObliqueProjectInfo(directory).packageManager).toBe(packageManager);
	});

	it('considers workspace and monorepo package roots', () => {
		const workspaceRoot = createTempProject();
		const childProjectDir = join(workspaceRoot, 'apps', 'portal');
		mkdirSync(childProjectDir, {recursive: true});
		writePackageJson(workspaceRoot, {
			name: 'workspace-root',
			workspaces: ['apps/*'],
			dependencies: {
				'@oblique/oblique': '15.4.4',
			},
		});
		writePackageJson(childProjectDir, {
			name: 'portal-app',
			dependencies: {
				'@angular/core': '^21.0.0',
			},
		});

		const result = detectObliqueProjectInfo(childProjectDir);

		expect(result.projectRoot).toBe(workspaceRoot);
		expect(result.isAngularProject).toBe(true);
		expect(result.isObliqueProject).toBe(true);
		expect(result.obliqueVersion).toBe('15.4.4');
	});
});
