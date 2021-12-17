import {ObENotificationType} from '../notification/notification.model';
import {HttpErrorResponse} from '@angular/common/http';

export interface ObIHttpApiRequest {
	notification: ObIHttpApiRequestNotification;
	spinner: boolean;
}

export interface ObIHttpApiRequestNotification {
	active: boolean;
	severity: ObENotificationType;
	title: string;
	text: string;
	sticky: boolean;
}

export interface ObIObliqueHttpErrorResponse {
	error: HttpErrorResponse;
	handled: boolean;
}
