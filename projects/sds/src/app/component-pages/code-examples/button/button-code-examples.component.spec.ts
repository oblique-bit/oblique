import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ButtonCodeExamplesComponent} from './button-code-examples.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ButtonExamplePrimaryLoginDisabledComponent} from './previews/primary-login-disabled/button-example-primary-login-disabled.component';
import {ButtonExampleSecondaryLinkNoIconComponent} from './previews/secondary-link-no-icon/button-example-secondary-link-no-icon.component';
import {ButtonExamplePrimaryLinkFrownComponent} from './previews/primary-link-frown/button-example-primary-link-frown.component';
import {ButtonExampleSecondaryWheelchairComponent} from './previews/secondary-wheelchair/button-example-secondary-wheelchair.component';
import {ButtonExampleTertiaryLinkNoIconDisabledComponent} from './previews/tertiary-link-no-icon-disabled/button-example-tertiary-link-no-icon-disabled.component';

describe(`${ButtonCodeExamplesComponent.name}`, () => {
	let fixture: ComponentFixture<ButtonCodeExamplesComponent>;
	let component: ButtonCodeExamplesComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ButtonCodeExamplesComponent,
				ButtonExamplePrimaryLinkFrownComponent,
				ButtonExamplePrimaryLoginDisabledComponent,
				ButtonExampleSecondaryLinkNoIconComponent,
				ButtonExampleSecondaryWheelchairComponent,
				ButtonExampleTertiaryLinkNoIconDisabledComponent
			]
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
