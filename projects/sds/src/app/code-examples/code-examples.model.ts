import {SourceCode} from './code-example/source-code.model';
import type {Type} from '@angular/core';

/**
 * Each *CodeExamplesComponent extends this class so that they all have the same type.
 * This is necessary so that the CodeExamplesMapper class can work with a single type.
 */
export class CodeExamples {
	protected getSnippet(directory: string, filePath: string, title: string): SourceCode {
		return new SourceCode(this.getRequire(directory, filePath).default, title);
	}

	protected getJsonSnippet(directory: string, filePath: string, title: string): SourceCode {
		if (!filePath.endsWith('.json')) {
			throw new Error(`${filePath} cannot be loaded with the JSON loader`);
		}
		return new SourceCode(JSON.stringify(this.getJsonRequire(directory, filePath), null, 2), title);
	}

	private getRequire(directory: string, filePath: string): {default: string} {
		switch (directory) {
			case 'node_modules/@oblique/oblique/src/styles/scss/core': {
				return require(`!!raw-loader!../../../../../node_modules/@oblique/oblique/src/styles/scss/core/${filePath}`);
			}
			case 'node_modules/@oblique/oblique/src/styles/scss/core/mixins': {
				return require(
					`!!raw-loader!../../../../../node_modules/@oblique/oblique/src/styles/scss/core/mixins/${filePath}`
				);
			}
			case 'code-examples': {
				const fileContent = require(`!!raw-loader!./${filePath}`) as {default: string};
				return {default: this.fixPath(filePath.split('.').pop(), fileContent.default ?? '')};
			}
			default: {
				const fileContent = require(`!!raw-loader!./code-examples/${directory}/previews/${filePath}`) as {
					default: string;
				};
				return {default: this.fixPath(filePath.split('.').pop(), fileContent.default ?? '')};
			}
		}
	}

	private fixPath(fileType: string, fileContent: string): string {
		switch (fileType) {
			case 'scss':
				return fileContent.replace(/@oblique\/oblique\/src\/styles\/scss\/core/gu, '@oblique/oblique/styles/scss/core');
			case 'ts':
				return fileContent.replace(/(?:\.\.\/)+/gu, './');
			default:
				return fileContent;
		}
	}

	private getJsonRequire(directory: string, filePath: string): string {
		switch (directory) {
			case 'i18n': {
				return require(`../../assets/i18n/${filePath}`);
			}
			case 'node_modules/@oblique/oblique/src/assets/i18n': {
				return require(`../../../../../node_modules/@oblique/oblique/src/assets/i18n/${filePath}`);
			}
			default: {
				// adding `.json` tells `require` that the file is a JSON. Otherwise, it tries to load any file type
				// which causes errors
				return require(`${filePath.replace('.json', '')}.json`);
			}
		}
	}
}

// Type<T> ensures that `component` is a class with all properties of T. It may have more but no less
// Since the preview components don't have any mandatory properties, `T` is `void`
export type PreviewComponent = Type<void>;

export interface CodeExample {
	component?: PreviewComponent;
	idParts: string[];
	title?: string;
	snippets?: SourceCode[];
}
