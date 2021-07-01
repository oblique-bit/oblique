import {SchematicContext, Tree} from '@angular-devkit/schematics';
import {removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {createSrcFile} from '../ng-add/ng-add-utils';
import {getAngularConfigs, packageJsonConfigPath, readFile, replaceInFile, warn} from '../utils';
import {ObIDependencies, versionFunc} from './ng-update.model';

export function checkDependencies(tree: Tree, _context: SchematicContext, deps: ObIDependencies): void {
	const angular = getDepVersion(tree, '@angular/core');
	const warnings = Object.keys(deps)
		.reduce((warns, dep) => [...warns, checkDependency(tree, _context, dep, getVersions(deps[dep], angular))], [])
		.filter(warning => !!warning)
		.map(warning => `\n    • ${warning}`)
		.join('');
	if (warnings.length) {
		warn(
			_context,
			`Unmet peer dependencies.\n  Following peers are required by Oblique but were not found:${warnings}.` +
				`\n  You must install peer dependencies yourself.`
		);
	}
}

export function minAngularVersion(tree: Tree, _context: SchematicContext, oblique: number, angular: number): void {
	if (getDepVersion(tree, '@angular/core') < angular) {
		warn(_context, `Oblique ${oblique} is designed to work with Angular ${angular}. If the update fails, try to update angular first.`);
	}
}

export function addClassesPrefix(tree: Tree, filePath: string, target: string, suffixes?: string[]) {
	replaceInFile(tree, filePath, new RegExp(`class="((?:[\\w-]*\\s)*|)(${target})(\\s.*|)"`, 'g'), `class="$1ob-$2$3"`);
	if (suffixes) {
		addClassPrefix(tree, filePath, target, suffixes);
	}
}

export function addClassPrefix(tree: Tree, filePath: string, target: string, suffixes: string[]) {
	suffixes.forEach(suffix => {
		replaceInFile(tree, filePath, new RegExp(`class="((?:[\\w-]*\\s)*|)(${target}-${suffix})(\\s.*|)"`, 'g'), `class="$1ob-$2$3"`);
	});
}

export function addPrefixMatchExactOrSuffix(tree: Tree, filePath: string, target: string, suffix: string[]) {
	replaceInFile(tree, filePath, new RegExp(`\\.(${target}(?:[:\\.\\s{]|(?:-(?:${suffix.join('|')}))))`, 'g'), '.ob-$1');
}

export function addPrefixMatchSuffix(tree: Tree, filePath: string, target: string, suffix: string[]) {
	replaceInFile(tree, filePath, new RegExp(`\\.(${target}-(?:${suffix.join('|')})[:\\.\\s{])`, 'g'), '.ob-$1');
}

export function addPrefixMatchExact(tree: Tree, filePath: string, targets: string[]) {
	replaceInFile(tree, filePath, new RegExp(`\\.(${targets.join('|')}[:\\.\\s{])`, 'g'), '.ob-$1');
}

export function renameExactOrSuffix(tree: Tree, filePath: string, target: string, suffix: string[], result: string) {
	replaceInFile(tree, filePath, new RegExp(`\\.${target}([:\\.\\s{]|(?:-(?:${suffix.join('|')})))`, 'g'), `.${result}$1`);
}

function checkDependency(tree: Tree, _context: SchematicContext, dependency: string, versions: number[]): string {
	const currentVersion = getDepVersion(tree, dependency);
	return versions.includes(currentVersion)
		? ''
		: `"${dependency}" at version ${versions
				.filter(version => version > 0)
				.reduce((supportedVersions, version) => [...supportedVersions, version], [])
				.join(' or ')}`;
}

function getVersions(versions: number | number[] | versionFunc, angular: number): number[] {
	if (versions instanceof Function) {
		versions = versions(angular);
	}
	if (!Array.isArray(versions)) {
		versions = [versions as number];
	}
	return versions;
}

function getDepVersion(tree: Tree, dep: string): number {
	const pattern = new RegExp(`"${dep}":\\s*"[~,^]?(?<version>\\d+)\\.\\d+\\.\\d+"`);
	const version = readFile(tree, packageJsonConfigPath).match(pattern)?.groups?.version;
	return version ? parseInt(version, 10) : 0;
}

export function removePolyFill(tree: Tree, polyfillName: string, importPattern: RegExp) {
	const polyfills = getAngularConfigs(tree, ['architect', 'build', 'options', 'polyfills'])
		.map(polyfill => ({name: polyfill.config, file: createSrcFile(tree, polyfill.config).getText()}))
		.filter(polyfill => importPattern.test(polyfill.file));

	if (polyfills.length) {
		polyfills.forEach(polyfill => tree.overwrite(polyfill.name, polyfill.file.replace(importPattern, '')));
		removePackageJsonDependency(tree, polyfillName);
	}
}
