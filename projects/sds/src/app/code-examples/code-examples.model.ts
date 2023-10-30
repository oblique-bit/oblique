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
			case 'code-examples': {
				return require(`!!raw-loader!./${filePath}`);
			}
			default: {
				return require(`!!raw-loader!./code-examples/${directory}/previews/${filePath}`);
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
	snippets: SourceCode[];
}
