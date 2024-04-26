import {AfterViewInit, Component, ContentChildren, DestroyRef, EventEmitter, Input, Output, QueryList, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TabComponent} from './tab/tab.component';
import {IdPipe} from '../id/id.pipe';
import {CommonModule} from '@angular/common';
import {ReplaySubject, delay} from 'rxjs';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
	standalone: true,
	imports: [CommonModule, IdPipe]
})
export class TabsComponent implements AfterViewInit {
	@Input() idPrefix = '';
	@Input() set selectedTab(selectedTab: string) {
		this.selectedTab$.next(selectedTab);
	}
	@ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList<TabComponent>();
	@Output() readonly tabChanged = new EventEmitter<string>();

	readonly componentId = 'tabs';
	private readonly selectedTab$ = new ReplaySubject<string>(1);
	private readonly destroyRef = inject(DestroyRef);

	ngAfterViewInit(): void {
		this.selectedTab$.pipe(delay(0), takeUntilDestroyed(this.destroyRef)).subscribe(selectedTab => this.selectTabWithName(selectedTab));
	}

	selectTab(selectedTab: TabComponent): void {
		this.tabs.toArray().forEach(tab => {
			tab.updateActive(selectedTab.name === tab.name);
		});
		this.tabChanged.emit(selectedTab.name);
	}

	private selectTabWithName(tabName: string): void {
		const foundTab: TabComponent = this.tabs.find(tab => tab.name === tabName && !tab.hidden);
		this.selectTab(foundTab ?? this.getDefaultTab());
	}

	private getDefaultTab(): TabComponent {
		return this.tabs.find(tab => !!tab.initiallyActive && !tab.hidden) ?? this.tabs.first;
	}
}
