import {ObliquePage} from './app.po';

describe('Oblique App', function () {
	let page: ObliquePage;

	beforeEach(() => {
		page = new ObliquePage();
	});

	it('should display message saying app works', () => {
		page.navigateTo();
		expect(page.getHeaderText()).toEqual('Oblique');
	});
});
