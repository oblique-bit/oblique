import {SourceCode} from './code-example/source-code.model';
import {Type} from '@angular/core';

/**
 * Each *CodeExamplesComponent extends this class so that they all have the same type.
 * This is necessary so that the CodeExamplesMapper class can work with a single type.
 */
export class CodeExamples {
	protected getSnippet(directory: string, filePath: string, title: string): SourceCode {
		return new SourceCode(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
			require(`!!raw-loader!./code-examples/${directory}/previews/${filePath}`).default as string,
			title
		);
	}
}

/**
 * Each *Example*PreviewComponent implements this interface so that they all have the same type.
 * This is necessary so that the CodeExampleComponent class can work with a single type
 */
export interface PreviewComponent {} // eslint-disable-line @typescript-eslint/no-empty-interface

export interface CodeExample {
	component?: Type<PreviewComponent>;
}
