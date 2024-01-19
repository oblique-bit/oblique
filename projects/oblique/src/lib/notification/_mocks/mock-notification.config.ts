import {Injectable} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
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
