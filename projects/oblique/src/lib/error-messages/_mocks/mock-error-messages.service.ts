import {Injectable} from '@angular/core';
import {NgControl} from '@angular/forms';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable()
export class ObMockErrorMessagesService {
	createMessages(control: NgControl): {key: string; params: Record<string, any>}[] {
		return [];
	}
}
