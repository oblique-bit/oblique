import {formattedVariables} from 'style-dictionary/utils';

export class TokenFormat {
	static #instance;
	#indent = '\t';
	#lineSeparator = '\n';
	#rootTokens = [];

	static getInstance() {
		if (!TokenFormat.#instance) {
			TokenFormat.#instance = new TokenFormat();
		}
		return TokenFormat.#instance;
	}

	core({dictionary}) {
		this.#rootTokens = dictionary;
		return this.#format(':root', /^--ob-[sh]/);
	}

	#format(selector, include, isComponent) {
		const rootTokens = this.#transformRootTokens(this.#rootTokens, include, isComponent);
		const indentedRootTokens = rootTokens.map(token => `${this.#indent}${token}`);
		return rootTokens.length
			? ['/** Generated file, do not edit **/', '', `${selector} {`, ...indentedRootTokens, '}'].join(this.#lineSeparator)
			: null;
	}

	#transformRootTokens(rootTokens, include, isComponent) {
		return this.#transformTokens(rootTokens, [], isComponent).filter(token => include.test(token));
	}

	#transformTokens(dictionary, rootTokens, outputReferences) {
		return this.#styleDictionaryFormat(dictionary, outputReferences)
			.split(this.#lineSeparator)
			.map(token => token.trim())
			.filter(token => this.#filterTokens(token, rootTokens))
			.map(token => token.replace(/"/g, "'")) // to make StyleLint happy
			.sort();
	}

	#styleDictionaryFormat(dictionary, outputReferences) {
		return formattedVariables({
			format: 'css',
			dictionary,
			outputReferences,
			usesDtcg: true,
			formatting: {
				commentStyle: 'none',
				lineSeparator: this.#lineSeparator
			}
		});
	}

	#filterTokens(token, rootTokens) {
		return (
			!rootTokens.includes(token) && // avoid duplicates
			!token.startsWith('--ob-s-static-font_family-heading:') && // redundant since each heading already have its own font-family
			!token.startsWith('--ob-h-typography-context') // only used by tokens-studio
		);
	}
}
