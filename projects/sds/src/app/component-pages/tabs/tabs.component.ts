import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {TabComponent} from './tab/tab.component';
import {IdPipe} from '../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
	standalone: true,
	imports: [CommonModule, IdPipe]
})
export class TabsComponent implements AfterContentInit {
	@Input() idPrefix = '';
	@ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList<TabComponent>();

	readonly componentId = 'tabs';

	ngAfterContentInit(): void {
		const defaultSelectedTab: TabComponent = this.tabs.find(tab => !!tab.initiallyActive) ?? this.tabs.first;
		this.selectTab(defaultSelectedTab);
	}

	selectTab(selectedTab: TabComponent): void {
		this.tabs.toArray().forEach(tab => {
			if (selectedTab.title === tab.title) {
				selectedTab.updateActive(true);
			} else {
				tab.updateActive(false);
			}
		});
	}
}
