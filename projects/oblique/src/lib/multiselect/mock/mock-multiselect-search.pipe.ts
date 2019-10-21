import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'searchFilter'
})
export class MockMultiselectSearchPipe implements PipeTransform {
	transform(options: any[], searchString: string): any[] {
		return null;
	}
}
