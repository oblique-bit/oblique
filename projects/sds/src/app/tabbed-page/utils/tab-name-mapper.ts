const tabNamesToUrlParam: Record<string, string> = {
	API: 'api', // eslint-disable-line @typescript-eslint/naming-convention
	Examples: 'examples', // eslint-disable-line @typescript-eslint/naming-convention
	'UI/UX': 'ui-ux',
	'Icon Gallery': 'icon-gallery',
};

const urlParamToTabName: Record<string, string> = {
	api: 'API',
	examples: 'Examples',
	'ui-ux': 'UI/UX',
	'icon-gallery': 'Icon Gallery',
};

export function getUrlParamForTabName(tabName: string): string | undefined {
	return tabNamesToUrlParam[tabName];
}

export function getTabNameFromUrlParam(urlParam: string): string | undefined {
	return urlParamToTabName[urlParam];
}
