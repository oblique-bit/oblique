export class SourceCode {
	sourceCode: string;
	name: string;

	/**
	 *
	 * @param sourceCode must be one of the following languages: 'html', 'scss' or 'ts'
	 * @param name will be used as tab title
	 */
	constructor(sourceCode: string, name: string) {
		this.sourceCode = sourceCode;
		this.name = name;
	}
}
