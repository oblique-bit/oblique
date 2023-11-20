import {AsyncPipe} from '@angular/common';
import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {ObGlobalEventsService, obOutsideFilter} from '@oblique/oblique';
import {BehaviorSubject, Observable, Subject, map, takeUntil, withLatestFrom} from 'rxjs';

@Component({
	selector: 'app-global-events-example-ob-outside-filter-preview',
	templateUrl: './global-events-example-ob-outside-filter-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss', '../global-events-example-preview.component.scss'],
	standalone: true,
	imports: [AsyncPipe],
	host: {class: 'layout-column'}
})
export class GlobalEventsExampleObOutsideFilterPreviewComponent implements AfterViewInit, OnDestroy {
	clicksOutsideObOutsideFilterItems$: Observable<number>;

	@ViewChild('obOutsideFilterItem', {read: ElementRef}) private readonly obOutsideFilterItem: ElementRef<HTMLElement>;

	private readonly clicksOutsideObOutsideFilterItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	private readonly unsubscribe = new Subject<void>();

	constructor(private readonly events: ObGlobalEventsService) {
		this.clicksOutsideObOutsideFilterItems$ = this.clicksOutsideObOutsideFilterItems.asObservable();
	}

	ngAfterViewInit(): void {
		this.events.click$
			.pipe(
				obOutsideFilter(this.obOutsideFilterItem.nativeElement),
				withLatestFrom(this.clicksOutsideObOutsideFilterItems),
				map(val => val[1]),
				takeUntil(this.unsubscribe)
			)
			.subscribe(clicksOutsideObOutsideFilterItems => this.clicksOutsideObOutsideFilterItems.next(clicksOutsideObOutsideFilterItems + 1));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
