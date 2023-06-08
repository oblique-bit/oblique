import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {By} from '@angular/platform-browser';
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
	let component: ButtonCodeExamplesComponent;

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
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have 6 CodeExampleComponent', () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(6);
	});
});
