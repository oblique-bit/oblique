import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SourceCode} from '../../code-example/source-code.model';
import {CodeExamples} from '../../code-examples.model';

@Component({
	selector: 'app-button-code-examples',
	templateUrl: './button-code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonCodeExamplesComponent implements CodeExamples {
	readonly componentId = 'button-examples';

	readonly codeSnippetsPrimaryLinkFrown = [
		new SourceCode(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
			require('!!raw-loader!./previews/primary-link-frown/button-example-primary-link-frown.component.html').default as string,
			'HTML'
		)
	];

	readonly codeSnippetsPrimaryLoginDisabled = [
		new SourceCode(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
			require('!!raw-loader!./previews/primary-login-disabled/button-example-primary-login-disabled.component.html').default as string,
			'HTML'
		)
	];

	readonly codeSnippetsSecondaryNoIcon = [
		new SourceCode(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
			require('!!raw-loader!./previews/secondary-link-no-icon/button-example-secondary-link-no-icon.component.html').default as string,
			'HTML'
		)
	];

	readonly codeSnippetsSecondaryWheelchair = [
		new SourceCode(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
			require('!!raw-loader!./previews/secondary-wheelchair/button-example-secondary-wheelchair.component.html').default as string,
			'HTML'
		)
	];

	readonly codeSnippetsTertiaryLinkNoIconDisabled = [
		new SourceCode(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
			require('!!raw-loader!./previews/tertiary-link-no-icon-disabled/button-example-tertiary-link-no-icon-disabled.component.html')
				.default as string,
			'HTML'
		)
	];

	readonly codeSnippetsTertiaryRepeatNoText = [
		new SourceCode(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
			require('!!raw-loader!./previews/tertiary-repeat-no-text/button-example-tertiary-repeat-no-text.component.html').default as string,
			'HTML'
		)
	];
}
