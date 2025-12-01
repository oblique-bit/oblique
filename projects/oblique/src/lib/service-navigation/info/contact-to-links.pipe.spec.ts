import {ObIServiceNavigationContact} from '../service-navigation.model';
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
				description: 'an empty array when all elements are empty strings',
				values: {email: '', formUrl: '', tel: ''},
				result: [],
			},
			{
				description: 'an email only',
				values: {email: 'test@test.com'},
				result: [
					{
						url: 'mailto:test@test.com',
						label: 'test@test.com',
						icon: 'mail',
						isInternalLink: true,
						extraText: undefined,
					},
				],
			},
			{
				description: 'an email and an undefined phone number',
				values: {email: 'test@test.com', phone: undefined},
				result: [
					{
						url: 'mailto:test@test.com',
						label: 'test@test.com',
						icon: 'mail',
						isInternalLink: true,
						extraText: undefined,
					},
				],
			},
			{
				description: 'a contact URL only',
				values: {formUrl: 'http://example.com'},
				result: [
					{
						url: 'http://example.com',
						label: 'i18n.oblique.service-navigation.info.contact.form',
						isInternalLink: false,
						extraText: undefined,
					},
				],
			},
			{
				description: 'a phone number only',
				values: {phone: '+4123456'},
				result: [
					{
						url: 'tel:+4123456',
						label: '+4123456',
						icon: 'phone',
						isInternalLink: true,
						ariaLabel: {
							text: 'i18n.oblique.service-navigation.section.phone.aria-label',
							parameters: {phoneNumber: '+, 4, 1, 2, 3, 4, 5, 6'},
						},
						extraText: undefined,
					},
				],
			},
			{
				description: 'a phone number and an undefined email',
				values: {phone: '+4123456', email: undefined},
				result: [
					{
						url: 'tel:+4123456',
						label: '+4123456',
						isInternalLink: true,
						icon: 'phone',
						ariaLabel: {
							text: 'i18n.oblique.service-navigation.section.phone.aria-label',
							parameters: {phoneNumber: '+, 4, 1, 2, 3, 4, 5, 6'},
						},
						extraText: undefined,
					},
				],
			},
			{
				description: 'all options',
				values: {
					emailText: 'email text',
					email: 'test@test.com',
					phoneText: 'tel text',
					phone: '+4123456',
					formUrlText: 'form url text',
					formUrl: 'http://example.com',
				},
				result: [
					{
						url: 'tel:+4123456',
						label: '+4123456',
						isInternalLink: true,
						icon: 'phone',
						ariaLabel: {
							text: 'i18n.oblique.service-navigation.section.phone.aria-label',
							parameters: {phoneNumber: '+, 4, 1, 2, 3, 4, 5, 6'},
						},
						extraText: 'tel text',
					},
					{
						url: 'mailto:test@test.com',
						label: 'test@test.com',
						isInternalLink: true,
						icon: 'mail',
						extraText: 'email text',
					},
					{
						isInternalLink: false,
						label: 'i18n.oblique.service-navigation.info.contact.form',
						url: 'http://example.com',
						extraText: 'form url text',
					},
				],
			},
		])('should return an url array when provided with $description', ({values, result}) => {
			expect(pipe.transform(values as ObIServiceNavigationContact)).toEqual(result);
		});
	});
});
