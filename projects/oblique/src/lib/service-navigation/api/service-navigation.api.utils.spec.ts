import {HttpErrorResponse} from '@angular/common/http';
import {firstValueFrom, of} from 'rxjs';
import {obGetDataOrThrowStatus500} from './service-navigation.api.utils';

describe('obGetDataOrThrowStatus500', () => {
	it('should return data when no errorCode is present', () => {
		const response = {
			statusCode: 200,
			success: true,
			data: {test: 'test'},
		};

		return expect(firstValueFrom(of(response).pipe(obGetDataOrThrowStatus500()))).resolves.toEqual(response.data);
	});

	it('should throw HttpErrorResponse with status 500 when errorCode is present', async () => {
		const response = {
			statusCode: 200,
			success: false,
			data: {test: 'test'},
			errorCode: 500,
		};
		const responsePromise = firstValueFrom(of(response).pipe(obGetDataOrThrowStatus500()));

		await expect(responsePromise).rejects.toBeInstanceOf(HttpErrorResponse);
		await expect(responsePromise).rejects.toMatchObject({
			status: 500,
		});
	});
});
