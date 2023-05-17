import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, map} from 'rxjs';
import {Accordion, AccordionLinksChanges} from './accordion-links.model';

@Component({
	selector: 'app-accordion-links',
	templateUrl: './accordion-links.component.html',
	styleUrls: ['./accordion-links.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionLinksComponent implements OnChanges, OnInit {
	@Input() accordions: Accordion[] = [];
	@Input() idPrefix = '';
	@Input() selectedSlug = '';

	readonly componentId = 'accordion-links';

	accordionIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
	collapsedAccordionsRecord$: BehaviorSubject<Record<string, boolean>> = new BehaviorSubject<Record<string, boolean>>({});
	collapsedAccordionIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

	ngOnChanges(changes: AccordionLinksChanges): void {
		if (changes.accordions) {
			this.accordionIds$.next(this.accordions.map(accordion => accordion.id));
		}
	}

	ngOnInit(): void {
		this.collapsedAccordionsRecord$ = combineLatest([this.accordionIds$, this.collapsedAccordionIds$]).pipe(
			map(next => {
				const accordionIds = next[0];
				const collapsedAccordionIds = next[1];
				const collapsedAccordionsRecord = {} as Record<string, boolean>;
				accordionIds.map(accordionId => (collapsedAccordionsRecord[accordionId] = collapsedAccordionIds.includes(accordionId)));
				return collapsedAccordionsRecord;
			})
		) as BehaviorSubject<Record<string, boolean>>;
	}

	updateCollapsedAccordionIds(accordionId: string): void {
		const adjustedCollapsedAccordionIds = [...this.collapsedAccordionIds$.value];
		const accordionIdIndex = adjustedCollapsedAccordionIds.indexOf(accordionId);

		if (accordionIdIndex > -1) {
			adjustedCollapsedAccordionIds.splice(accordionIdIndex, 1);
		} else {
			adjustedCollapsedAccordionIds.push(accordionId);
		}

		this.collapsedAccordionIds$.next(adjustedCollapsedAccordionIds);
	}
}
