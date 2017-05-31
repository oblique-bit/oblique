import {Pipe, PipeTransform} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Pipe({
	name: 'orDateFormatter'
})
export class DateFormatterPipe implements PipeTransform {

	constructor(private parserFormatter: NgbDateParserFormatter) {
	}

	transform(value: NgbDateStruct): string {
		return this.parserFormatter.format(value);
	}
}
