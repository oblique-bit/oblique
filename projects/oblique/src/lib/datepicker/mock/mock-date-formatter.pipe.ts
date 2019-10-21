import {Pipe, PipeTransform} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Pipe({
	name: 'orDateFormatter'
})
export class MockDateFormatterPipe implements PipeTransform {
	transform(value: NgbDateStruct): string {
		return '';
	}
}
