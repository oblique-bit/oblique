import {Component, effect, input, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ObMenuActionIcon, ObTourAction, ObTourConfig, ObTourState} from '../../models/tour-config.model';
import {ObButtonModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
	selector: 'obt-menu-list',
	imports: [TranslatePipe, MatButtonModule, MatIconModule, ObButtonModule, MatTooltipModule],
	templateUrl: './menu-list.component.html',
	styleUrl: './menu-list.component.scss'
})
export class MenuListComponent {
	listTitle = input<string>('');
	listItems = input<ObTourConfig[] | null>(null);
	listType = input<ObTourState | null>(null);

	readonly actions = signal<{name: ObTourAction; icon: ObMenuActionIcon}[] | null>(null);

	constructor() {
		effect(() => {
			this.setupActions();
		});
	}

	private setupActions(): void {
		switch (this.listType()) {
			case 'new':
				this.actions.set([
					{name: 'start', icon: 'chevron_right'},
					{name: 'skip', icon: 'delete'}
				]);
				break;
			case 'done':
				this.actions.set([
					{name: 'restart', icon: 'redo'},
					{name: 'skip', icon: 'delete'}
				]);
				break;
			case 'inProgress':
				this.actions.set([
					{name: 'resume', icon: 'skip_next'},
					{name: 'skip', icon: 'delete'}
				]);
				break;
			default:
				this.actions.set([]);
				break;
		}
	}
}
