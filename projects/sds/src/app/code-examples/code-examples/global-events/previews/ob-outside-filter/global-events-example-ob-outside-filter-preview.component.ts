import {AsyncPipe} from '@angular/common';
import {type AfterViewInit, Component, ElementRef, type OnDestroy, type Signal, inject, viewChild} from '@angular/core';
import {ObGlobalEventsService, obOutsideFilter} from '@oblique/oblique';
import {BehaviorSubject, type Observable, Subject, map, takeUntil, withLatestFrom} from 'rxjs';

@Component({
	selector: 'app-global-events-example-ob-outside-filter-preview',
	imports: [AsyncPipe],
	templateUrl: './global-events-example-ob-outside-filter-preview.component.html',
	styleUrls: ['../global-events-example-preview.component.scss', '../../../../code-example-flex-layout.scss'],
	host: {class: 'layout-column'},
})
export class GlobalEventsExampleObOutsideFilterPreviewComponent implements AfterViewInit, OnDestroy {
	clicksOutsideObOutsideFilterItems$: Observable<number>;

	private readonly events = inject(ObGlobalEventsService);
	private readonly obOutsideFilterItem: Signal<ElementRef<HTMLElement>> = viewChild('obOutsideFilterItem', {
		read: ElementRef,
	});
	private readonly clicksOutsideObOutsideFilterItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	private readonly unsubscribe = new Subject<void>();

	constructor() {
		this.clicksOutsideObOutsideFilterItems$ = this.clicksOutsideObOutsideFilterItems.asObservable();
	}

	ngAfterViewInit(): void {
		this.events.click$
			.pipe(
				obOutsideFilter(this.obOutsideFilterItem().nativeElement),
				withLatestFrom(this.clicksOutsideObOutsideFilterItems),
				map(val => val[1]),
				takeUntil(this.unsubscribe)
			)
			.subscribe(clicksOutsideObOutsideFilterItems =>
				this.clicksOutsideObOutsideFilterItems.next(clicksOutsideObOutsideFilterItems + 1)
			);
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
