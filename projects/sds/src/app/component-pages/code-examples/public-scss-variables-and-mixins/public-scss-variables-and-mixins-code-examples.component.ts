import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CommonModule} from '@angular/common';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {PublicScssVariablesAndMixinsExampleVariablesPreviewComponent} from '../public-scss-variables-and-mixins/previews/variables/public-scss-variables-and-mixins-example-variables-preview.component';
import {PublicScssVariablesAndMixinsExamplePalettePreviewComponent} from '../public-scss-variables-and-mixins/previews/palette/public-scss-variables-and-mixins-example-palette-preview.component';
import {PublicScssVariablesAndMixinsExampleLayoutPreviewComponent} from '../public-scss-variables-and-mixins/previews/layout/public-scss-variables-and-mixins-example-layout-preview.component';
import {PublicScssVariablesAndMixinsExampleShadowPreviewComponent} from '../public-scss-variables-and-mixins/previews/shadow/public-scss-variables-and-mixins-example-shadow-preview.component';
import {PublicScssVariablesAndMixinsExampleTypographyPreviewComponent} from '../public-scss-variables-and-mixins/previews/typography/public-scss-variables-and-mixins-example-typography-preview.component';

@Component({
	selector: 'app-code-example-public-scss-variables-and-mixins',
	templateUrl: '../../code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, IdPipe, CodeExampleComponent]
})
export class PublicScssVariablesAndMixinsCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'public-scss-variables-and-mixins-examples';
	readonly previews: CodeExample[] = [
		{
			component: PublicScssVariablesAndMixinsExamplePalettePreviewComponent,
			idParts: ['palette'],
			title: 'Palette',
			snippets: [
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'palette/public-scss-variables-and-mixins-example-palette-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'palette/public-scss-variables-and-mixins-example-palette-preview.component.ts',
					'TS'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'palette/public-scss-variables-and-mixins-example-palette-preview.component.scss',
					'SCSS'
				),
				this.getSnippet('node_modules/@oblique/oblique/src/styles/scss/core', '_palette.scss', 'palette.scss')
			]
		},
		{
			component: PublicScssVariablesAndMixinsExampleVariablesPreviewComponent,
			idParts: ['variables'],
			title: 'Variables',
			snippets: [
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'variables/public-scss-variables-and-mixins-example-variables-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'variables/public-scss-variables-and-mixins-example-variables-preview.component.ts',
					'TS'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'variables/public-scss-variables-and-mixins-example-variables-preview.component.scss',
					'SCSS'
				),
				this.getSnippet('node_modules/@oblique/oblique/src/styles/scss/core', '_variables.scss', 'variables.scss')
			]
		},
		{
			component: PublicScssVariablesAndMixinsExampleLayoutPreviewComponent,
			idParts: ['layout'],
			title: 'Layout',
			snippets: [
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'layout/public-scss-variables-and-mixins-example-layout-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'layout/public-scss-variables-and-mixins-example-layout-preview.component.ts',
					'TS'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'layout/public-scss-variables-and-mixins-example-layout-preview.component.scss',
					'SCSS'
				),
				this.getSnippet('node_modules/@oblique/oblique/src/styles/scss/core/mixins', '_layout.scss', 'layout.scss')
			]
		},
		{
			component: PublicScssVariablesAndMixinsExampleShadowPreviewComponent,
			idParts: ['shadow'],
			title: 'Shadow',
			snippets: [
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'shadow/public-scss-variables-and-mixins-example-shadow-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'shadow/public-scss-variables-and-mixins-example-shadow-preview.component.ts',
					'TS'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'shadow/public-scss-variables-and-mixins-example-shadow-preview.component.scss',
					'SCSS'
				),
				this.getSnippet('node_modules/@oblique/oblique/src/styles/scss/core/mixins', '_shadow.scss', 'shadow.scss')
			]
		},
		{
			component: PublicScssVariablesAndMixinsExampleTypographyPreviewComponent,
			idParts: ['typography'],
			title: 'Typography',
			snippets: [
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'typography/public-scss-variables-and-mixins-example-typography-preview.component.html',
					'HTML'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'typography/public-scss-variables-and-mixins-example-typography-preview.component.ts',
					'TS'
				),
				this.getSnippet(
					'public-scss-variables-and-mixins',
					'typography/public-scss-variables-and-mixins-example-typography-preview.component.scss',
					'SCSS'
				),
				this.getSnippet('node_modules/@oblique/oblique/src/styles/scss/core/mixins', '_typography.scss', 'typography.scss')
			]
		}
	];
}
