import {formattedVariables} from 'style-dictionary/utils';

export class TokenFormat {
	static #instance;
	#indent = '\t';
	#lineSeparator = '\n';
	#rootTokens = [];
	#modeTokens = [];

	static getInstance() {
		if (!TokenFormat.#instance) {
			TokenFormat.#instance = new TokenFormat();
		}
		return TokenFormat.#instance;
	}

	core({dictionary, file}) {
		const {mode} = file.options;
		if (mode) {
			this.#modeTokens[mode] = dictionary;
		} else {
			this.#rootTokens = dictionary;
		}
		return this.#format(':root', /^--ob-[sh]/, false);
	}

	component({file}) {
		const {component} = file.options;
		return this.#format(':host', new RegExp(`^--ob-c-${component}.*var`), true);
	}

	#format(selector, include, isComponent) {
		const rootTokens = this.#transformRootTokens(this.#rootTokens, include, isComponent);
		const indentedRootTokens = rootTokens.map(token => `${this.#indent}${token}`);
		const modeTokens = this.#transformModeTokens(this.#modeTokens, rootTokens, isComponent);
		const rootModeTokens = this.#buildRootModeTokens(modeTokens, isComponent, include);
		const componentModeTokens = this.#buildComponentModeTokens(modeTokens, isComponent, include);
		return rootTokens.length
			? [
					'/** Generated file, do not edit **/',
					'',
					`${selector} {`,
					...indentedRootTokens,
					...rootModeTokens,
					'}',
					...componentModeTokens,
				].join(this.#lineSeparator)
			: null;
	}

	#transformRootTokens(rootTokens, include, isComponent) {
		return this.#transformTokens(rootTokens, [], isComponent).filter(token => include.test(token));
	}

	#transformModeTokens(modeTokens, rootTokens, isComponent) {
		return Object.fromEntries(
			Object.entries(modeTokens).map(([mode, tokens]) => [mode, this.#transformTokens(tokens, rootTokens, isComponent)])
		);
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
				lineSeparator: this.#lineSeparator,
			},
		});
	}

	#filterTokens(token, rootTokens) {
		return (
			!rootTokens.includes(token) && // avoid duplicates
			!token.startsWith('--ob-s-static-font_family-heading:') && // redundant since each heading already have its own font-family
			!token.startsWith('--ob-h-typography-style') // only used by tokens-studio
		);
	}

	#buildRootModeTokens(modeTokens, isComponent, include) {
		return Object.entries(this.#extractMediaTokens(modeTokens, isComponent))
			.map(([selector, tokens]) => ({
				selector,
				tokens: tokens.filter(token => include.test(token)).map(token => `${this.#indent}${token}`),
			}))
			.filter(({tokens}) => tokens.length)
			.reduce(
				(modeTokens, tokens) => [
					...modeTokens,
					'',
					...[`${tokens.selector} {`, ...tokens.tokens, `}`].map(token => `${this.#indent}${token}`),
				],
				[]
			);
	}

	#extractMediaTokens(modeTokens, isComponent) {
		if (!isComponent) {
			return modeTokens;
		}
		return Object.fromEntries(
			Object.entries(modeTokens)
				.filter(([key]) => key.startsWith('@media'))
				.map(([mode, tokens]) => [mode, tokens])
		);
	}

	#buildComponentModeTokens(modeTokens, isComponent, include) {
		return Object.entries(this.#extractComponentTokens(modeTokens, isComponent))
			.map(([selector, tokens]) => ({
				selector,
				tokens: tokens.filter(token => include.test(token)).map(token => `${this.#indent}${token}`),
			}))
			.filter(({tokens}) => tokens.length)
			.reduce(
				(modeTokens, tokens) => [
					...modeTokens,
					'',
					...[`:host(${tokens.selector}),`, `:host-context(${tokens.selector}) {`, ...tokens.tokens, `}`],
				],
				[]
			);
	}

	#extractComponentTokens(modeTokens, isComponent) {
		if (!isComponent) {
			return [];
		}
		return Object.fromEntries(
			Object.entries(modeTokens)
				.filter(([key]) => !key.startsWith('@media'))
				.map(([mode, tokens]) => [mode, tokens])
		);
	}
}
