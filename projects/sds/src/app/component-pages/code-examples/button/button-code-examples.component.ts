import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CodeExample} from '../code-example/code-example.model';
import {CodeExamples} from '../code-examples.model';

@Component({
	selector: 'app-button-code-examples',
	templateUrl: './button-code-examples.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonCodeExamplesComponent implements CodeExamples {
	readonly componentId = 'button-examples';

	readonly examplePrimaryLinkFrown = new CodeExample({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
		html: require('!!raw-loader!./previews/primary-link-frown/button-example-primary-link-frown.component.html').default
	});

	readonly examplePrimaryLoginDisabled = new CodeExample({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
		html: require('!!raw-loader!./previews/primary-login-disabled/button-example-primary-login-disabled.component.html').default
	});

	readonly exampleSecondaryNoIcon = new CodeExample({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
		html: require('!!raw-loader!./previews/secondary-link-no-icon/button-example-secondary-link-no-icon.component.html').default
	});

	readonly exampleSecondaryWheelchair = new CodeExample({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
		html: require('!!raw-loader!./previews/secondary-wheelchair/button-example-secondary-wheelchair.component.html').default
	});

	readonly exampleTertiaryLinkNoIconDisabled = new CodeExample({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
		html: require('!!raw-loader!./previews/tertiary-link-no-icon-disabled/button-example-tertiary-link-no-icon-disabled.component.html')
			.default
	});

	readonly exampleTertiaryRepeatNoText = new CodeExample({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
		html: require('!!raw-loader!./previews/tertiary-repeat-no-text/button-example-tertiary-repeat-no-text.component.html').default
	});
}
