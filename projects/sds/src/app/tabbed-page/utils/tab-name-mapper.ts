export class TabNameMapper {
	private static readonly tabNamesToUrlParam: Record<string, string> = {
		API: 'api', // eslint-disable-line @typescript-eslint/naming-convention
		Examples: 'examples', // eslint-disable-line @typescript-eslint/naming-convention
		'UI/UX': 'ui-ux'
	};

	private static readonly urlParamToTabName: Record<string, string> = {
		api: 'API',
		examples: 'Examples',
		'ui-ux': 'UI/UX'
	};

	static getUrlParamForTabName(tabNmae: string): string | undefined {
		return this.tabNamesToUrlParam[tabNmae];
	}

	static getTabNameFromUrlParam(urlParam: string): string | undefined {
		return this.urlParamToTabName[urlParam];
	}
}
