import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ObLanguageService} from '../language.service';
import {ObDateFormat, ObFormat, ObTimeFormat} from '../date-adapter/date.model';
import {obFormatDatetime} from '../date-adapter/date-formatters';

@Component({
	selector: 'ob-date',
	templateUrl: './date.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ObDateComponent {
	readonly date = input.required<string | Date | number>();
	readonly format = input<ObDateFormat | null>();
	readonly timeFormat = input<ObTimeFormat | null>();
	readonly formattedDate = computed(() =>
		obFormatDatetime(this.date(), this.locale(), this.buildFormat(this.format(), this.timeFormat()))
	);
	readonly isoDate = computed(() =>
		obFormatDatetime(this.date(), this.locale(), {date: 'isoDate', time: this.timeFormat()})
	);
	private readonly locale = toSignal(inject(ObLanguageService).locale$);

	private buildFormat(dateFormat?: ObDateFormat, timeFormat?: ObTimeFormat): ObFormat {
		return dateFormat || timeFormat ? {date: dateFormat, time: timeFormat} : {date: 'longDate'};
	}
}
