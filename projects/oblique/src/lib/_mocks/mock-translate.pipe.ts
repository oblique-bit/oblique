import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'translate',
	standalone: true
})
export class ObMockTranslatePipe implements PipeTransform {
	transform(value: string): string {
		return value;
	}
}
