import {Injectable} from '@angular/core';

@Injectable()
export class MockNotificationConfig {
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
