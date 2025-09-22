import {getCodeExampleComponent} from './code-examples.mapper';

describe('getCodeExampleComponent', () => {
	it.each([
		{slug: 'alert', name: 'AlertCodeExamplesComponent'},
		{slug: 'master-layout', name: 'MasterLayoutCodeExamplesComponent'},
		{slug: 'master-layout-12', name: 'MasterLayoutCodeExamplesComponent'},
		{slug: 'master-layout-13', name: 'MasterLayoutCodeExamplesComponent'},
		{slug: 'master-layout-14', name: 'MasterLayoutCodeExamplesComponent'},
		{slug: 'popover-12', name: 'Popover12CodeExamplesComponent'}
	])('should return "$name" with "$slug" slug', ({name, slug}) => {
		expect(getCodeExampleComponent(slug).name).toBe(name);
	});

	it('should return "undefined" with "inexistent" slug', () => {
		expect(getCodeExampleComponent('inexistent')).toBeUndefined();
	});
});
