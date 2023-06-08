import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {ObButtonModule, ObIconModule} from '@oblique/oblique';
import {ButtonCodeExamplesComponent} from './button-code-examples.component';
import {ButtonExamplePrimaryLinkFrownComponent} from './previews/primary-link-frown/button-example-primary-link-frown.component';
import {ButtonExamplePrimaryLoginDisabledComponent} from './previews/primary-login-disabled/button-example-primary-login-disabled.component';
import {ButtonExampleSecondaryLinkNoIconComponent} from './previews/secondary-link-no-icon/button-example-secondary-link-no-icon.component';
import {ButtonExampleSecondaryWheelchairComponent} from './previews/secondary-wheelchair/button-example-secondary-wheelchair.component';
import {ButtonExampleTertiaryLinkNoIconDisabledComponent} from './previews/tertiary-link-no-icon-disabled/button-example-tertiary-link-no-icon-disabled.component';
import {ButtonExampleTertiaryRepeatNoTextComponent} from './previews/tertiary-repeat-no-text/button-example-tertiary-repeat-no-text.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {HighlightedCodeComponent} from '../../code-example/highlighted-code/highlighted-code.component';
import {TabComponent} from '../../tabs/tab/tab.component';
import {TabsComponent} from '../../tabs//tabs.component';
import {IdModule} from '../../../shared/id/id.module';

describe(`${ButtonCodeExamplesComponent.name}`, () => {
	let fixture: ComponentFixture<ButtonCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [
				ButtonCodeExamplesComponent,
				ButtonExamplePrimaryLinkFrownComponent,
				ButtonExamplePrimaryLoginDisabledComponent,
				ButtonExampleSecondaryLinkNoIconComponent,
				ButtonExampleSecondaryWheelchairComponent,
				ButtonExampleTertiaryLinkNoIconDisabledComponent,
				ButtonExampleTertiaryRepeatNoTextComponent,
				CodeExampleComponent,
				HighlightedCodeComponent,
				TabsComponent,
				TabComponent
			],
			imports: [IdModule, MatIconModule, MatButtonModule, ObButtonModule, ObIconModule.forRoot()]
		}).compileComponents();

		fixture = TestBed.createComponent(ButtonCodeExamplesComponent);
		fixture.detectChanges();
	});

	const obButtonMatcherMiddle = /[^>]*(?=[^>]*\bmat-button\b)(?=[^>]*\bobbutton=[^>]{0,2}primary|secondary|tertiary\b)/;
	const obButtonMatcherEnd = /[^>]*>/;
	type ObButtonTag = '' | 'a' | 'button';
	const getObButtonMatcher = (tag: ObButtonTag = '', propertyMatchers: RegExp[] = []): RegExp =>
		new RegExp(
			`<${tag}${obButtonMatcherMiddle.source}${propertyMatchers
				.map(matcher => matcher.source)
				.reduce((source1, source2) => source1 + source2, '')}${obButtonMatcherEnd.source}`
		);

	test.each<{description: string; propertyMatchers?: RegExp[]; tag?: ObButtonTag}>([
		{description: 'button', tag: 'button'},
		{description: 'link', tag: 'a'},
		{description: 'enabled button or link', propertyMatchers: [/(?![^>]*\bdisabled=[^>]{0,2}true\b)/]},
		{description: 'disabled button or link', propertyMatchers: [/(?=[^>]*\bdisabled=[^>]{0,2}true\b)/]}
	])('that there is a $description in the examples', ({propertyMatchers, tag}) => {
		expect((fixture.debugElement.nativeElement as {innerHTML: string}).innerHTML).toMatch(getObButtonMatcher(tag, propertyMatchers));
	});
});
