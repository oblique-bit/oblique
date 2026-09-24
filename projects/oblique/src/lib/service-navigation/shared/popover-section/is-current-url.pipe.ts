import {Pipe, PipeTransform, inject} from '@angular/core';
import {WINDOW} from '../../../window/window.provider';
import {ObWindow} from '../../../window/window.provider.model';

@Pipe({
	name: 'obIsCurrentUrl',
})
export class ObIsCurrentUrlPipe implements PipeTransform {
	private readonly window = inject<ObWindow>(WINDOW);

	transform(url: string): boolean {
		return this.window.location.href.startsWith(url);
	}
}
