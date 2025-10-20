import {Component, effect, inject, input, output, signal} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ObButtonModule} from '@oblique/oblique';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ActionButtonComponent} from './action-button/action-button.component';
import {ObtActionButton, ObtTour, ObtTourChange, ObtTourState} from '../../models/tour.model';
import {
	MatAccordion,
	MatExpansionPanel,
	MatExpansionPanelDescription,
	MatExpansionPanelHeader,
	MatExpansionPanelTitle
} from '@angular/material/expansion';
import {DatePipe} from '@angular/common';

@Component({
	selector: 'obt-menu-list',
	imports: [
		TranslatePipe,
		MatButtonModule,
		MatIconModule,
		ObButtonModule,
		MatTooltipModule,
		ActionButtonComponent,
		MatAccordion,
		MatExpansionPanel,
		MatExpansionPanelHeader,
		MatExpansionPanelTitle,
		MatExpansionPanelDescription,
		DatePipe
	],
	templateUrl: './menu-list.component.html',
	styleUrl: './menu-list.component.scss'
})
export class MenuListComponent {
	listTitle = input<string>('');
	listItems = input<ObtTour[] | null>(null);
	listType = input<ObtTourState>('new');

	readonly tourStatusChanged = output<ObtTourChange>();
	readonly actions = signal<ObtActionButton[] | null>(null);
	currentLang = 'en';
	private readonly translate = inject(TranslateService);

	constructor() {
		this.currentLang = this.translate.currentLang;
		this.translate.onTranslationChange.subscribe(lang => {
			this.currentLang = lang.lang;
		});
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
			case 'skipped': {
				this.actions.set([{name: 'start', icon: 'chevron_right'}]);
				break;
			}
			default:
				this.actions.set([]);
				break;
		}
	}
}
