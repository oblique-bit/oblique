import {ErrorMessagesService} from './error-messages.service';

describe('ErrorMessagesService', () => {
	let service: ErrorMessagesService;
	let controlMock;
	let result;

	beforeEach(() => {
		service = new ErrorMessagesService();
		controlMock = {
			errors: {
				bar: {
					limit: 1
				},
				fuu: {
					valid: false
				}
			}
		};
		result = service.createMessages(controlMock);
	});

	it('should add the `i18n.validation.` prefix to the key', () => {
		expect(result[0].key).toBe(`i18n.validation.bar`);
		expect(result[1].key).toBe(`i18n.validation.fuu`);
	});

	it('should keep the params if they are provided', () => {
		expect(result[0].params).toBe(controlMock.errors.bar);
	});
});
