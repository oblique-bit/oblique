import {CdkScrollableModule} from '@angular/cdk/scrolling';
import {
	AfterViewInit,
	Component,
	DoCheck,
	ElementRef,
	OnDestroy,
	Renderer2,
	ViewEncapsulation,
	inject,
	input,
	signal,
	viewChildren,
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {combineLatestWith, distinctUntilChanged, map, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ObColumnPanelDirective} from './column-panel.directive';
import {ObColumnToggleDirective} from './column-toggle.directive';
import {WINDOW} from '../window/window.provider';
import {ObWindow} from '../window/window.provider.model';
import {ObIDimension, ObTColumnState} from './column-layout.model';

@Component({
	selector: 'ob-column-layout',
	imports: [CdkScrollableModule, MatIconModule, ObColumnPanelDirective, ObColumnToggleDirective, TranslatePipe],
	templateUrl: './column-layout.component.html',
	styleUrls: ['./column-layout.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.ob-no-layout]': 'noLayout()',
		'[class.ob-wider-columns]': 'wider()',
		class: 'ob-column-layout',
	},
	exportAs: 'obColumnLayout',
})
/* A warning is given by eslint when using both DoCheck and OnChanges to prevent checking @Input changes in the DoCheck hook.
	As long as the OnChanges lifecycle exclusively deals with @Input changes this warning isn't necessary. */
export class ObColumnLayoutComponent implements AfterViewInit, DoCheck, OnDestroy {
	readonly left = input<ObTColumnState>('OPENED');
	readonly leftCollapsed = signal(false);
	readonly right = input<ObTColumnState>('OPENED');
	readonly rightCollapsed = signal(false);
	readonly wider = input(false);
	readonly noLayout = input(false);
	private readonly toggles = viewChildren<ElementRef>('columnToggle');
	private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly renderer = inject(Renderer2);

	private readonly unsubscribe = new Subject<void>();
	private readonly dimensionChange = new Subject<{top: number; height: number; windowHeight: number}>();
	private readonly window = inject<ObWindow>(WINDOW);
	private observer: ResizeObserver;

	ngDoCheck(): void {
		const {top, height} = this.el.nativeElement.getBoundingClientRect();
		this.dimensionChange.next({top, height, windowHeight: this.window.innerHeight});
	}

	ngAfterViewInit(): void {
		this.getDimensionChangeObservable().subscribe(dimension => this.center(dimension));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.dimensionChange.complete();
		this.observer?.disconnect();
	}

	toggleLeft(): void {
		this.leftCollapsed.update(state => !state);
	}

	toggleRight(): void {
		this.rightCollapsed.update(state => !state);
	}

	private getDimensionChangeObservable(): Observable<ObIDimension> {
		return this.dimensionChange.pipe(
			distinctUntilChanged((previous, current) =>
				Object.keys(previous).reduce((hasNotChanged, key) => hasNotChanged && previous[key] === current[key], true)
			),
			combineLatestWith(this.getHeaderHeightObservable()),
			map(([dimension, headerHeight]) => ({
				...dimension,
				headerHeight,
			})),
			takeUntil(this.unsubscribe)
		);
	}

	// this is hacky, the correct way would be that the master layout exposes an observable with the header height
	private getHeaderHeightObservable(): Observable<number> {
		// this ensures a value is emitted even when the master layout isn't there
		const headerHeight$ = new BehaviorSubject<number>(0);
		this.observer = new ResizeObserver(entries => headerHeight$.next(entries[0].contentRect.height));
		this.observer.observe(
			this.getMasterLayout(this.el.nativeElement.parentElement).querySelector('.ob-master-layout-header')
		);

		return headerHeight$;
	}

	private getMasterLayout(element: HTMLElement): HTMLElement {
		if (element.nodeName !== 'OB-MASTER-LAYOUT' && element.parentElement) {
			return this.getMasterLayout(element.parentElement);
		}

		return element;
	}

	private center(dimension: ObIDimension): void {
		// Math.min(Math.max(...)) simply contains the computation between 2 values
		const top = Math.min(Math.max(0, dimension.headerHeight - dimension.top), dimension.windowHeight - dimension.top);
		const bottom = Math.min(dimension.windowHeight - dimension.top, dimension.height);
		if (bottom > top) {
			this.toggles().forEach(toggle => this.renderer.setStyle(toggle.nativeElement, 'top', `${(bottom + top) / 2}px`));
		}
	}
}
