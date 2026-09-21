import {Module} from 'node:module';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

// `code-examples.model.ts` reads snippets with dynamic `require('!!raw-loader!...')`. Under Jest those were
// resolved by a moduleNameMapper (`jest-raw-loader`); under the Vitest-driven Angular unit-test builder the
// bundler inlines the JSON requires but leaves the `!!raw-loader!` ones as runtime `require` calls. This hook
// resolves those requests to the raw file content. All calls live in `code-examples.model.ts`, so relative
// paths resolve from that file's directory.
const rawLoaderPrefix = '!!raw-loader!';
const baseDir = (() => {
	let current = process.cwd();
	while (true) {
		const candidate = resolve(current, ...'projects/sds/src/app/code-examples'.split('/'));
		if (existsSync(candidate)) {
			return candidate;
		}
		const parent = resolve(current, '..');
		if (parent === current) {
			return candidate;
		}
		current = parent;
	}
})();

/* eslint-disable func-names, no-underscore-dangle */
// @ts-expect-error _load is not exposed by Module
const originalLoad = Module._load;
// @ts-expect-error _load is not exposed by Module
Module._load = function (request: string, parent: NodeJS.Module, isMain: boolean): unknown {
	if (request.startsWith(rawLoaderPrefix)) {
		const resolvedPath = resolve(baseDir, request.slice(rawLoaderPrefix.length));
		return {default: readFileSync(resolvedPath, 'utf8')};
	}
	return originalLoad.call(this, request, parent, isMain);
};
