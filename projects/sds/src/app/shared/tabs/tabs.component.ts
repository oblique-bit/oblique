import {Component, type OnChanges, contentChildren, input, output} from '@angular/core';
import {TabComponent} from './tab/tab.component';
import {IdPipe} from '../id/id.pipe';

@Component({
	selector: 'app-tabs',
	imports: [IdPipe],
	templateUrl: './tabs.component.html',
	styleUrl: './tabs.component.scss'
})
export class TabsComponent implements OnChanges {
	readonly idPrefix = input('');
	readonly selectedTab = input('');
	readonly tabs = contentChildren(TabComponent);
	readonly tabChanged = output<string>();

	readonly componentId = 'tabs';

	ngOnChanges(): void {
		setTimeout(() => {
			this.selectTabWithName(this.selectedTab());
		});
	}

	selectTab(selectedTab: TabComponent): void {
		this.tabs().forEach(tab => {
			tab.updateActive(selectedTab.name() === tab.name());
		});
		this.tabChanged.emit(selectedTab.name());
	}

	private selectTabWithName(tabName: string): void {
		const foundTab: TabComponent = this.tabs().find(tab => tab.name() === tabName && !tab.hidden());
		this.selectTab(foundTab ?? this.getDefaultTab());
	}

	private getDefaultTab(): TabComponent {
		const tabs = this.tabs();
		return tabs.find(tab => Boolean(tab.initiallyActive()) && !tab.hidden()) ?? tabs.at(0);
	}
}
