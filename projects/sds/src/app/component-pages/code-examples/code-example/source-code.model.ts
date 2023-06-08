export class SourceCode {
	sourceCode: string;
	title: string;

	/**
	 *
	 * @param sourceCode must be one of the following languages: 'html', 'scss' or 'ts'
	 * @param title will be used as tab title
	 */
	constructor(sourceCode: string, title: string) {
		this.sourceCode = sourceCode;
		this.title = title;
	}
}
