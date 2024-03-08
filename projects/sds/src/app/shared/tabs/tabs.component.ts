import {Component, ContentChildren, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {TabComponent} from './tab/tab.component';
import {IdPipe} from '../id/id.pipe';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
	standalone: true,
	imports: [CommonModule, IdPipe]
})
export class TabsComponent {
	@Input() idPrefix = '';
	@ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList<TabComponent>();
	@Output() readonly tabChanged = new EventEmitter<string>();

	readonly componentId = 'tabs';

	selectTabWithName(tabName: string): void {
		const foundTab: TabComponent = this.tabs.find(tab => tab.name === tabName && !tab.hidden);
		this.selectTab(foundTab ?? this.getDefaultTab());
	}

	selectTab(selectedTab: TabComponent): void {
		this.tabs.toArray().forEach(tab => {
			tab.updateActive(selectedTab.name === tab.name);
		});
		this.tabChanged.emit(selectedTab.name);
	}

	private getDefaultTab(): TabComponent {
		return this.tabs.find(tab => !!tab.initiallyActive && !tab.hidden) ?? this.tabs.first;
	}
}
