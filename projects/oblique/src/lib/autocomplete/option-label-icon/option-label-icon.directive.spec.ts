import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {By} from '@angular/platform-browser';

import {ObOptionLabelIconDirective} from './option-label-icon.directive';
import {ObEIcon, ObIconService} from '../../icon/icon.module';
import {CommonModule} from '@angular/common';
import {OptionLabelIconPosition} from './../autocomplete.model';
import {provideObliqueTestingConfiguration} from '../../utilities';

@Component({
	template: '',
	standalone: false
})
class OptionLabelTestComponent {
	iconName: ObEIcon | '' = '';
	position: OptionLabelIconPosition = 'end';
}

describe(ObOptionLabelIconDirective.name, () => {
	let fixture: ComponentFixture<OptionLabelTestComponent>;
	let component: OptionLabelTestComponent;
	let directive: ObOptionLabelIconDirective;
	let directiveNode: DebugElement;

	beforeEach(async () => {
		TestBed.resetTestingModule();
		await TestBed.configureTestingModule({
			declarations: [OptionLabelTestComponent],
			imports: [ObOptionLabelIconDirective, MatIconModule, CommonModule],
			providers: [
				provideObliqueTestingConfiguration(),
				{provide: ObIconService, useClass: ObIconService},
				{provide: MatIconRegistry, useClass: MatIconRegistry}
			]
		}).compileComponents();
	});

	describe.each([
		{
			caseText: 'default iconName and default position',
			template: '<div obOptionLabelIcon>Text</div>',
			expected: {
				iconName: undefined,
				iconPosition: 'end',
				innerHtml: 'Text'
			}
		},
		{
			caseText: 'iconName is info and position is end',
			template: '<div obOptionLabelIcon iconName="info" iconPosition="end">Text</div>',
			expected: {
				iconName: 'info',
				iconPosition: 'end',
				innerHtml:
					'Text<span class="mat-icon" style="margin-left: auto;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.26535,7.65413h1.48047v13.3457h-1.48047V7.65413ZM12.76437,3.09456c-.18555-.19238-.43359-.28809-.74609-.28809s-.55957.0957-.74023.28809c-.18066.19141-.27148.42676-.27148.7041,0,.27832.09082.51074.27148.69922.18066.1875.42773.28125.74023.28125s.56055-.09375.74609-.28125c.18457-.18848.27734-.4209.27734-.69922,0-.27734-.09277-.5127-.27734-.7041Z"></path></svg></span>'
			}
		},
		{
			caseText: 'iconName is info and position is start',
			template: '<div  obOptionLabelIcon iconName="info" iconPosition="start">Text</div>',
			expected: {
				iconName: 'info',
				iconPosition: 'start',
				innerHtml:
					'<span class="mat-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.26535,7.65413h1.48047v13.3457h-1.48047V7.65413ZM12.76437,3.09456c-.18555-.19238-.43359-.28809-.74609-.28809s-.55957.0957-.74023.28809c-.18066.19141-.27148.42676-.27148.7041,0,.27832.09082.51074.27148.69922.18066.1875.42773.28125.74023.28125s.56055-.09375.74609-.28125c.18457-.18848.27734-.4209.27734-.69922,0-.27734-.09277-.5127-.27734-.7041Z"></path></svg></span>Text'
			}
		}
	])('with $caseText', ({template, expected}) => {
		beforeEach(() => {
			fixture = TestBed.overrideComponent(OptionLabelTestComponent, {
				set: {template}
			}).createComponent(OptionLabelTestComponent);
			component = fixture.componentInstance;
			directive = fixture.debugElement.query(By.directive(ObOptionLabelIconDirective)).injector.get(ObOptionLabelIconDirective);
			directiveNode = fixture.debugElement.query(By.directive(ObOptionLabelIconDirective));
			fixture.detectChanges();
		});

		it(`should create an instance of ${ObOptionLabelIconDirective.name}`, () => {
			expect(directive).toBeTruthy();
		});

		it(`should create an instance of ${OptionLabelTestComponent.name}`, () => {
			expect(component).toBeTruthy();
		});

		it(`iconName should be  ${expected.iconName}`, () => {
			fixture.detectChanges();
			expect(directive.iconName).toBe(expected.iconName);
		});

		it(`should have a default iconPosition of ${expected.iconPosition}`, () => {
			expect(directive.iconPosition).toBe(expected.iconPosition);
		});

		it('should have added an ob-option-label-icon class to host', () => {
			fixture.detectChanges();
			expect(directiveNode.nativeNode.getElementsByClassName('ob-option-label-icon')).toBeTruthy();
		});

		it(`should have a content of ${expected.innerHtml}`, () => {
			expect(directiveNode.nativeNode.innerHTML).toBe(expected.innerHtml);
		});
	});

	describe('remove icon', () => {
		beforeEach(() => {
			fixture = TestBed.overrideComponent(OptionLabelTestComponent, {
				set: {template: '<div  obOptionLabelIcon iconName="{{iconName}}" iconPosition="{{position}}">Text</div>'}
			}).createComponent(OptionLabelTestComponent);
			component = fixture.componentInstance;
			directive = fixture.debugElement.query(By.directive(ObOptionLabelIconDirective)).injector.get(ObOptionLabelIconDirective);
			directiveNode = fixture.debugElement.query(By.directive(ObOptionLabelIconDirective));
			fixture.detectChanges();
		});

		it(`should have a content of "Text"`, () => {
			component.iconName = ObEIcon.INFO;
			fixture.detectChanges();
			expect(directiveNode.nativeNode.innerHTML).toBe(
				'Text<span class="mat-icon" style="margin-left: auto;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.26535,7.65413h1.48047v13.3457h-1.48047V7.65413ZM12.76437,3.09456c-.18555-.19238-.43359-.28809-.74609-.28809s-.55957.0957-.74023.28809c-.18066.19141-.27148.42676-.27148.7041,0,.27832.09082.51074.27148.69922.18066.1875.42773.28125.74023.28125s.56055-.09375.74609-.28125c.18457-.18848.27734-.4209.27734-.69922,0-.27734-.09277-.5127-.27734-.7041Z"></path></svg></span>'
			);
		});

		it("should have removed icon if iconName = ''", () => {
			component.iconName = ObEIcon.INFO;
			fixture.detectChanges();
			component.iconName = '';
			fixture.detectChanges();
			expect(directiveNode.nativeNode.innerHTML).toBe('Text');
		});

		it('should have removed icon if position = none', () => {
			component.iconName = ObEIcon.INFO;
			component.position = 'none';
			fixture.detectChanges();
			fixture.detectChanges();
			expect(directiveNode.nativeNode.innerHTML).toBe('Text');
		});
	});
});
