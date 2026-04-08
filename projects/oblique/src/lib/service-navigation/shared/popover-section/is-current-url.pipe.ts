import {Pipe, PipeTransform, inject} from '@angular/core';
import {WINDOW} from '../../../utilities';
import {ObWindow} from '../../../utilities.model';

@Pipe({
	name: 'obIsCurrentUrl',
})
export class ObIsCurrentUrlPipe implements PipeTransform {
	private readonly window = inject<ObWindow>(WINDOW);

	transform(url: string): boolean {
		return this.window.location.href.startsWith(url);
	}
}
