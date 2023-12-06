import {TabNameMapper} from './tab-name-mapper';

describe(TabNameMapper.name, () => {
	test.each([
		{urlParam: 'api', expectedTabName: 'API'},
		{urlParam: 'examples', expectedTabName: 'Examples'},
		{urlParam: 'ui-ux', expectedTabName: 'UI/UX'},
		{urlParam: 'unknown', expectedTabName: undefined}
	])('that mapping from url param to tab name works correctly', ({urlParam, expectedTabName}) => {
		expect(TabNameMapper.getTabNameFromUrlParam(urlParam)).toBe(expectedTabName);
	});

	test.each([
		{tabName: 'API', expectedUrlParam: 'api'},
		{tabName: 'Examples', expectedUrlParam: 'examples'},
		{tabName: 'UI/UX', expectedUrlParam: 'ui-ux'},
		{tabName: 'unknown', expectedUrlParam: undefined}
	])('that mapping from tab name to url param works correctly', ({tabName, expectedUrlParam}) => {
		expect(TabNameMapper.getUrlParamForTabName(tabName)).toBe(expectedUrlParam);
	});
});
