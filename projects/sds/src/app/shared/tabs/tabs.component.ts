import {Component, type OnChanges, contentChildren, input, output} from '@angular/core';
import {TabComponent} from './tab/tab.component';
import {IdPipe} from '../id/id.pipe';

@Component({
	selector: 'app-tabs',
	imports: [IdPipe],
	templateUrl: './tabs.component.html',
	styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnChanges {
	readonly idPrefix = input('');
	readonly selectedTab = input('');
	readonly tabs = contentChildren(TabComponent);
	readonly tabChanged = output<string>();

	readonly componentId = 'tabs';

	ngOnChanges(): void {
		setTimeout(() => {
			this.activateTab(this.selectedTab());
		});
	}

	selectTab(selectedTab: TabComponent): void {
		const currentActiveTab = this.getActiveTab();
		const nextActiveTab =
			this.tabs().find((tab: TabComponent) => tab.name() === selectedTab.name() && !tab.hidden()) ??
			this.getFallbackTab();

		if (currentActiveTab === nextActiveTab) {
			return;
		}

		currentActiveTab?.updateActive(false);
		if (nextActiveTab) {
			nextActiveTab.updateActive(true);
			this.tabChanged.emit(nextActiveTab.name());
		}
	}

	private activateTab(tabName: string): void {
		const foundTab = this.getInitiallyActiveTab() || this.getActiveTab() || this.getTabWithName(tabName);
		this.selectTab(foundTab ?? this.getDefaultTab());
	}

	private getActiveTab(): TabComponent {
		return this.tabs().find(tab => !tab.hidden() && tab.active === true);
	}

	private getTabWithName(tabName: string): TabComponent {
		return this.tabs().find(tab => !tab.hidden() && tab.name() === tabName);
	}

	private getInitiallyActiveTab(): TabComponent {
		return this.tabs().find(tab => Boolean(tab.initiallyActive()) && !tab.hidden());
	}

	private getDefaultTab(): TabComponent {
		return this.tabs().at(0);
	}

	private getVisibleDefaultTab(): TabComponent {
		return this.tabs().find((tab: TabComponent) => !tab.hidden());
	}

	private getFallbackTab(): TabComponent {
		return this.getInitiallyActiveTab() || this.getActiveTab() || this.getVisibleDefaultTab();
	}
}
