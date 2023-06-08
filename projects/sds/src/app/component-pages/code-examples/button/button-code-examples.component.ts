import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample, CodeExamples} from '../../code-examples.model';
import {ButtonExamplePrimaryLinkFrownComponent} from './previews/primary-link-frown/button-example-primary-link-frown.component';
import {ButtonExamplePrimaryLoginDisabledComponent} from './previews/primary-login-disabled/button-example-primary-login-disabled.component';
import {ButtonExampleSecondaryLinkNoIconComponent} from './previews/secondary-link-no-icon/button-example-secondary-link-no-icon.component';
import {ButtonExampleSecondaryWheelchairComponent} from './previews/secondary-wheelchair/button-example-secondary-wheelchair.component';
import {ButtonExampleTertiaryLinkNoIconDisabledComponent} from './previews/tertiary-link-no-icon-disabled/button-example-tertiary-link-no-icon-disabled.component';
import {ButtonExampleTertiaryRepeatNoTextComponent} from './previews/tertiary-repeat-no-text/button-example-tertiary-repeat-no-text.component';

@Component({
	selector: 'app-button-code-examples',
	templateUrl: './button-code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonCodeExamplesComponent extends CodeExamples {
	readonly componentId = 'button-examples';

	readonly codeSnippetsPrimaryLinkFrown = [
		this.getSnippet('button', 'primary-link-frown/button-example-primary-link-frown.component.html', 'HTML')
	];

	readonly codeSnippetsPrimaryLoginDisabled = [
		this.getSnippet('button', 'primary-login-disabled/button-example-primary-login-disabled.component.html', 'HTML')
	];

	readonly codeSnippetsSecondaryNoIcon = [
		this.getSnippet('button', 'secondary-link-no-icon/button-example-secondary-link-no-icon.component.html', 'HTML')
	];

	readonly codeSnippetsSecondaryWheelchair = [
		this.getSnippet('button', 'secondary-wheelchair/button-example-secondary-wheelchair.component.html', 'HTML')
	];

	readonly codeSnippetsTertiaryLinkNoIconDisabled = [
		this.getSnippet('button', 'tertiary-link-no-icon-disabled/button-example-tertiary-link-no-icon-disabled.component.html', 'HTML')
	];

	readonly codeSnippetsTertiaryRepeatNoText = [
		this.getSnippet('button', 'tertiary-repeat-no-text/button-example-tertiary-repeat-no-text.component.html', 'HTML')
	];
	readonly previews: CodeExample[] = [
		{component: ButtonExamplePrimaryLinkFrownComponent},
		{component: ButtonExamplePrimaryLoginDisabledComponent},
		{component: ButtonExampleSecondaryLinkNoIconComponent},
		{component: ButtonExampleSecondaryWheelchairComponent},
		{component: ButtonExampleTertiaryLinkNoIconDisabledComponent},
		{component: ButtonExampleTertiaryRepeatNoTextComponent}
	];
}
