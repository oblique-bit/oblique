import {Injectable} from '@angular/core';
import {NgControl} from '@angular/forms';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockErrorMessagesService {
	createMessages(control: NgControl): {key: string; params: Record<string, any>}[] {
		return [];
	}
}
