import {Pipe, PipeTransform, inject} from '@angular/core';
import {WINDOW} from '../../../utilities';

@Pipe({
	name: 'obIsCurrentUrl'
})
export class ObIsCurrentUrlPipe implements PipeTransform {
	private readonly window = inject<Window>(WINDOW);

	transform(url: string): boolean {
		return this.window.location.href.startsWith(url);
	}
}
