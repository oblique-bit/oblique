import {NgControl} from '@angular/forms';
import {ObErrorMessagesService} from './error-messages.service';

describe(ObErrorMessagesService.name, () => {
	let service: ObErrorMessagesService;

	beforeEach(() => {
		service = new ObErrorMessagesService();
	});

	it('should create the service', () => {
		expect(service).toBeTruthy();
	});

	it.each([
		{
			desc: 'simple error',
			control: {
				errors: {
					required: true,
					minlength: {requiredLength: 5, actualLength: 2},
				},
			} as unknown as NgControl,
			expected: [
				{key: 'i18n.validation.required', params: true},
				{
					key: 'i18n.validation.minlength',
					params: {requiredLength: 5, actualLength: 2},
				},
			],
		},
		{
			desc: 'nested object errors',
			control: {
				errors: {
					pattern: {
						regex: {pattern: '[a-z]+', value: '123'},
					},
					max: {
						maxValue: {value: 10},
					},
				},
			} as unknown as NgControl,
			expected: [
				{
					key: 'i18n.validation.pattern.regex',
					params: {pattern: '[a-z]+', value: '123'},
				},
				{
					key: 'i18n.validation.max.maxValue',
					params: {value: 10},
				},
			],
		},
		{
			desc: 'empty error',
			control: {errors: {}} as unknown as NgControl,
			expected: [],
		},
	])('should map $desc correctly', ({control, expected}) => {
		expect(service.createMessages(control)).toEqual(expected);
	});
});
