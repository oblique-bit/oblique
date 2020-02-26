import {Pipe, PipeTransform} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Pipe({
	name: 'obDateFormatter'
})
export class ObMockDateFormatterPipe implements PipeTransform {
	transform(value: NgbDateStruct): string {
		return '';
	}
}
