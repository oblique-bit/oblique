import {Pipe, PipeTransform} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Pipe({
	name: 'obDateFormatter'
})
export class ObDateFormatterPipe implements PipeTransform {
	constructor(private readonly parserFormatter: NgbDateParserFormatter) {}

	transform(value: NgbDateStruct): string {
		return this.parserFormatter.format(value);
	}
}
