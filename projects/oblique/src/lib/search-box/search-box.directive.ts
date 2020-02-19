import {AfterViewInit, ComponentFactoryResolver, Directive, ElementRef, HostListener, Input, OnChanges, ViewContainerRef} from '@angular/core';
import {NgControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe.class';
import {SearchWidgetItem} from './search-box.component';
import {SearchBoxResultsComponent} from './search-box-results.component';

@Directive({
	selector: '[orSearchBox]',
	exportAs: 'orSearchBoxDirective'
})
export class SearchBoxDirective extends Unsubscribable implements AfterViewInit, OnChanges {
	@Input('orSearchBox') items: SearchWidgetItem[] = [];
	@Input() minPatternLength = 1;
	@Input() maxResults = 10;

	private results: SearchBoxResultsComponent;

	public constructor(
		private readonly ngControl: NgControl,
		private readonly element: ElementRef,
		private readonly viewContainer: ViewContainerRef,
		private readonly componentFactoryResolver: ComponentFactoryResolver
	) {
		super();
	}

	ngOnChanges(): void {
		if (this.results) {
			this.results.minPatternLength = this.minPatternLength;
			this.results.maxResults = this.maxResults;
		}
	}

	ngAfterViewInit(): void {
		const factory = this.componentFactoryResolver.resolveComponentFactory(SearchBoxResultsComponent);
		this.results = this.viewContainer.createComponent(factory).instance;
		this.results.items = this.items;
		this.results.input = this.element;
		this.results.minPatternLength = this.minPatternLength;
		this.results.maxResults = this.maxResults;
		this.results.closed.subscribe(() => this.ngControl.valueAccessor.writeValue(''));
		this.ngControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.results.pattern = value || '';
		});
	}

	@HostListener('keydown.arrowdown', ['$event']) navigateDown($event: KeyboardEvent) {
		this.results.navigateDown($event);
	}

	@HostListener('keydown.arrowup', ['$event']) navigateUp($event: KeyboardEvent) {
		this.results.navigateUp($event);
	}
}
