import {appVersion} from './public_api';

describe('public_api', () => {
	// ...existing code...
	const genericSemVerRegex = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
	// ...existing code...

	it('should validate against correct regex', () => {
		expect('111.0.1').toMatch(genericSemVerRegex);
		expect('11.0.1').toMatch(genericSemVerRegex);
		expect('15.00.01').toMatch(genericSemVerRegex);
		expect('15.01').not.toMatch(genericSemVerRegex);
		expect('15.01.3').toMatch(genericSemVerRegex);
	});

	it('should export the version and set it', () => {
		expect(appVersion).toMatch(genericSemVerRegex);
	});
});
