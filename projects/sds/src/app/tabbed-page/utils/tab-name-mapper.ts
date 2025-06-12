const tabNamesToUrlParam: Record<string, string> = {
	API: 'api', // eslint-disable-line @typescript-eslint/naming-convention
	Examples: 'examples', // eslint-disable-line @typescript-eslint/naming-convention
	'UI/UX': 'ui-ux'
};

const urlParamToTabName: Record<string, string> = {
	api: 'API',
	examples: 'Examples',
	'ui-ux': 'UI/UX'
};

export function getUrlParamForTabName(tabName: string): string | undefined {
	return tabNamesToUrlParam[tabName];
}

export function getTabNameFromUrlParam(urlParam: string): string | undefined {
	return urlParamToTabName[urlParam];
}
