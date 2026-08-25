import {HttpErrorResponse} from '@angular/common/http';
import {Observable, OperatorFunction, of, switchMap, throwError} from 'rxjs';
import {ObIServiceNavigationResponse} from './service-navigation.api.model';

export function obGetDataOrThrowStatus500<T>(): OperatorFunction<ObIServiceNavigationResponse<T>, T> {
	return switchMap((response: ObIServiceNavigationResponse<T>): Observable<T> => {
		if (response.errorCode) {
			return throwError(() => new HttpErrorResponse({status: 500}));
		}

		return of(response.data);
	});
}
