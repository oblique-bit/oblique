import {ObServiceNavigationApplicationStatus} from '../service-navigation.model';
import {ObServiceNavigationApplicationAltPipe} from './service-navigation-application-image-alt.pipe';

describe('ObServiceNavigationApplicationImageAltPipe', () => {
	const pipe = new ObServiceNavigationApplicationAltPipe();
	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it.each([
			{input: 'online' as ObServiceNavigationApplicationStatus, output: 'i18n.oblique.service-navigation.applications.image.online.alt'},
			{input: 'offline' as ObServiceNavigationApplicationStatus, output: 'i18n.oblique.service-navigation.applications.image.offline.alt'},
			{
				input: 'inaccessible' as ObServiceNavigationApplicationStatus,
				output: 'i18n.oblique.service-navigation.applications.image.inaccessible.alt'
			}
		])('should return "$output" with "$input" as input', ({input, output}) => {
			expect(pipe.transform(input)).toBe(output);
		});

		it('should trow an error with an illegal input', () => {
			expect(() => pipe.transform('hello' as ObServiceNavigationApplicationStatus)).toThrow('Illegal status: hello');
		});
	});
});
