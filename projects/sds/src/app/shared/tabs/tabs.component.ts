import {type AfterViewInit, Component, contentChildren, input, output} from '@angular/core';
import {TabComponent} from './tab/tab.component';
import {IdPipe} from '../id/id.pipe';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	styleUrl: './tabs.component.scss',
	imports: [CommonModule, IdPipe]
})
export class TabsComponent implements AfterViewInit {
	readonly idPrefix = input('');
	readonly selectedTab = input('');
	readonly tabs = contentChildren(TabComponent);
	readonly tabChanged = output<string>();

	readonly componentId = 'tabs';

	ngAfterViewInit(): void {
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
