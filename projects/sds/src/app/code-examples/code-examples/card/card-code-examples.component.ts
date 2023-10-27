import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {BasicCardComponent} from './previews/basic-card/basic-card.component';
import {CardWithMultipleSectionsComponent} from './previews/card-with-multiple-sections/card-with-multiple-sections.component';
import {ClickableCardsComponent} from './previews/clickable-cards/clickable-cards.component';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';

@Component({
	selector: 'app-card-code-examples',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class CardCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'card-examples';
	readonly previews: CodeExample[] = [
		{
			component: BasicCardComponent,
			idParts: ['basic-card'],
			title: 'Basic card',
			snippets: [
				this.getSnippet('card', 'basic-card/basic-card.component.html', 'HTML'),
				this.getSnippet('card', 'basic-card/basic-card.component.ts', 'TS')
			]
		},
		{
			component: ClickableCardsComponent,
			idParts: ['clickable-cards'],
			title: 'Clickable cards',
			snippets: [
				this.getSnippet('card', 'clickable-cards/clickable-cards.component.html', 'HTML'),
				this.getSnippet('card', 'clickable-cards/clickable-cards.component.ts', 'TS'),
				this.getSnippet('card', 'clickable-cards/clickable-cards.component.scss', 'SCSS')
			]
		},
		{
			component: CardWithMultipleSectionsComponent,
			idParts: ['card-with-multiple-sections'],
			title: 'Card with multiple sections',
			snippets: [
				this.getSnippet('card', 'card-with-multiple-sections/card-with-multiple-sections.component.html', 'HTML'),
				this.getSnippet('card', 'card-with-multiple-sections/card-with-multiple-sections.component.ts', 'TS'),
				this.getSnippet('card', 'card-with-multiple-sections/card-with-multiple-sections.component.scss', 'SCSS')
			]
		}
	];
}
