import {Injectable} from '@angular/core';

@Injectable()
export class ObMockNotificationConfig {
	sticky = false;
	timeout = 3500;
	channel = 'oblique';
	clearAllOnNavigate: boolean;
	groupSimilar: boolean;
	info = {};
	success = {};
	warning = {};
	error = {};
}
