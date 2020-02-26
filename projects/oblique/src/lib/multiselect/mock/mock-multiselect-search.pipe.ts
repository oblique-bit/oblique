import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'searchFilter'
})
export class ObMockMultiselectSearchPipe implements PipeTransform {
	transform(options: any[], searchString: string): any[] {
		return null;
	}
}
