import {ObContactToLinksPipe} from './contact-to-links.pipe';

describe('ObContactToLinksPipe', () => {
	const pipe = new ObContactToLinksPipe();
	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it.each([undefined, null, {}])('should return an empty array when not provided values (%s)', parameter => {
			expect(pipe.transform(parameter)).toEqual([]);
		});

		it.each([
			{
				description: 'an email only',
				values: {email: 'test@test.com'},
				result: [{url: 'mailto:test@test.com', label: 'test@test.com', isInternalLink: true}]
			},
			{
				description: 'an email and an undefined phone number',
				values: {email: 'test@test.com', tel: undefined},
				result: [{url: 'mailto:test@test.com', label: 'test@test.com', isInternalLink: true}]
			},
			{
				description: 'a phone number only',
				values: {tel: '+4123456'},
				result: [
					{
						url: 'tel:+4123456',
						label: '+4123456',
						isInternalLink: true,
						ariaLabel: {
							text: 'i18n.oblique.service-navigation.section.tel.arial-label',
							parameters: {phoneNumber: '+, 4, 1, 2, 3, 4, 5, 6'}
						}
					}
				]
			},
			{
				description: 'a phone number and an undefined email',
				values: {tel: '+4123456', email: undefined},
				result: [
					{
						url: 'tel:+4123456',
						label: '+4123456',
						isInternalLink: true,
						ariaLabel: {
							text: 'i18n.oblique.service-navigation.section.tel.arial-label',
							parameters: {phoneNumber: '+, 4, 1, 2, 3, 4, 5, 6'}
						}
					}
				]
			},
			{
				description: 'both an email and a phone number',
				values: {email: 'test@test.com', tel: '+4123456'},
				result: [
					{url: 'mailto:test@test.com', label: 'test@test.com', isInternalLink: true},
					{
						url: 'tel:+4123456',
						label: '+4123456',
						isInternalLink: true,
						ariaLabel: {
							text: 'i18n.oblique.service-navigation.section.tel.arial-label',
							parameters: {phoneNumber: '+, 4, 1, 2, 3, 4, 5, 6'}
						}
					}
				]
			}
		])('should return an url array when provided with $description', ({values, result}) => {
			expect(pipe.transform(values)).toEqual(result);
		});
	});
});
