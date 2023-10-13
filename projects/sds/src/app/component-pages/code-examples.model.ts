import {SourceCode} from './code-example/source-code.model';
import {Type} from '@angular/core';

/**
 * Each *CodeExamplesComponent extends this class so that they all have the same type.
 * This is necessary so that the CodeExamplesMapper class can work with a single type.
 */
export class CodeExamples {
	protected getSnippet(directory: string, filePath: string, title: string): SourceCode {
		return new SourceCode(this.getRequire(directory, filePath).default, title);
	}

	private getRequire(directory: string, filePath: string): {default: string} {
		switch (directory) {
			case 'node_modules/@oblique/oblique/src/styles/scss/core': {
				return require(`!!raw-loader!../../../../../node_modules/@oblique/oblique/src/styles/scss/core/${filePath}`);
			}
			case 'node_modules/@oblique/oblique/src/styles/scss/core/mixins': {
				return require(`!!raw-loader!../../../../../node_modules/@oblique/oblique/src/styles/scss/core/mixins/${filePath}`);
			}
			default: {
				return require(`!!raw-loader!./code-examples/${directory}/previews/${filePath}`);
			}
		}
	}
}

/**
 * Each *Example*PreviewComponent implements this interface so that they all have the same type.
 * This is necessary so that the CodeExampleComponent class can work with a single type
 */
export interface PreviewComponent {} // eslint-disable-line @typescript-eslint/no-empty-interface

export interface CodeExample {
	component?: Type<PreviewComponent>;
	idParts: string[];
	title?: string;
	snippets: SourceCode[];
}
