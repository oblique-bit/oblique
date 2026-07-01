import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ChangeDetectionStrategy, Component, DebugElement} from '@angular/core';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {By} from '@angular/platform-browser';

import {ObOptionLabelIconDirective} from './option-label-icon.directive';
import {ObEIcon} from '../../icon/icon.model';
import {ObIconService} from '../../icon/icon.service';
import {CommonModule} from '@angular/common';
import {OptionLabelIconPosition} from './../autocomplete.model';
import {provideObliqueTestingConfiguration} from '../../utilities';

interface ObOptionLabelIconDirectivePrivate {
	addIcon: (iconName: string, iconSpan: HTMLSpanElement, host: HTMLElement, position: OptionLabelIconPosition) => void;
}

@Component({
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
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
				{provide: MatIconRegistry, useClass: MatIconRegistry},
			],
		}).compileComponents();
	});

	describe.each([
		{
			caseText: 'default iconName and default position',
			template: '<div obOptionLabelIcon>Text</div>',
			expected: {
				iconName: undefined,
				iconPosition: 'end',
				innerHtml: 'Text',
			},
		},
		{
			caseText: 'iconName is info and position is end',
			template: '<div obOptionLabelIcon iconName="info" iconPosition="end">Text</div>',
			expected: {
				iconName: 'info',
				iconPosition: 'end',
				innerHtml:
					'Text<span class="mat-icon" aria-hidden="true" style="margin-left: auto;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.26535,7.65413h1.48047v13.3457h-1.48047V7.65413ZM12.76437,3.09456c-.18555-.19238-.43359-.28809-.74609-.28809s-.55957.0957-.74023.28809c-.18066.19141-.27148.42676-.27148.7041,0,.27832.09082.51074.27148.69922.18066.1875.42773.28125.74023.28125s.56055-.09375.74609-.28125c.18457-.18848.27734-.4209.27734-.69922,0-.27734-.09277-.5127-.27734-.7041Z"></path></svg></span>',
			},
		},
		{
			caseText: 'iconName is info and position is start',
			template: '<div  obOptionLabelIcon iconName="info" iconPosition="start">Text</div>',
			expected: {
				iconName: 'info',
				iconPosition: 'start',
				innerHtml:
					'<span class="mat-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.26535,7.65413h1.48047v13.3457h-1.48047V7.65413ZM12.76437,3.09456c-.18555-.19238-.43359-.28809-.74609-.28809s-.55957.0957-.74023.28809c-.18066.19141-.27148.42676-.27148.7041,0,.27832.09082.51074.27148.69922.18066.1875.42773.28125.74023.28125s.56055-.09375.74609-.28125c.18457-.18848.27734-.4209.27734-.69922,0-.27734-.09277-.5127-.27734-.7041Z"></path></svg></span>Text',
			},
		},
		{
			caseText: 'ariaLabel is added',
			template: '<div obOptionLabelIcon ariaLabel="test-label" iconName="info" iconPosition="end">Text</div>',
			expected: {
				iconName: 'info',
				iconPosition: 'end',
				ariaLabel: 'test-label',
				innerHtml:
					'Text<span class="mat-icon" aria-label="test-label" style="margin-left: auto;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.26535,7.65413h1.48047v13.3457h-1.48047V7.65413ZM12.76437,3.09456c-.18555-.19238-.43359-.28809-.74609-.28809s-.55957.0957-.74023.28809c-.18066.19141-.27148.42676-.27148.7041,0,.27832.09082.51074.27148.69922.18066.1875.42773.28125.74023.28125s.56055-.09375.74609-.28125c.18457-.18848.27734-.4209.27734-.69922,0-.27734-.09277-.5127-.27734-.7041Z"></path></svg></span>',
			},
		},
	])('with $caseText', ({template, expected}) => {
		beforeEach(() => {
			fixture = TestBed.overrideComponent(OptionLabelTestComponent, {
				set: {template},
			}).createComponent(OptionLabelTestComponent);
			component = fixture.componentInstance;
			directive = fixture.debugElement
				.query(By.directive(ObOptionLabelIconDirective))
				.injector.get(ObOptionLabelIconDirective);
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
				set: {template: '<div  obOptionLabelIcon iconName="{{iconName}}" iconPosition="{{position}}">Text</div>'},
			}).createComponent(OptionLabelTestComponent);
			component = fixture.componentInstance;
			directive = fixture.debugElement
				.query(By.directive(ObOptionLabelIconDirective))
				.injector.get(ObOptionLabelIconDirective);
			directiveNode = fixture.debugElement.query(By.directive(ObOptionLabelIconDirective));
			fixture.detectChanges();
		});

		it(`should have a content of "Text"`, () => {
			directive.iconName = ObEIcon.INFO;
			directive.ngOnChanges();
			fixture.detectChanges();
			expect(directiveNode.nativeNode.innerHTML).toBe(
				'Text<span class="mat-icon" aria-hidden="true" style="margin-left: auto;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.26535,7.65413h1.48047v13.3457h-1.48047V7.65413ZM12.76437,3.09456c-.18555-.19238-.43359-.28809-.74609-.28809s-.55957.0957-.74023.28809c-.18066.19141-.27148.42676-.27148.7041,0,.27832.09082.51074.27148.69922.18066.1875.42773.28125.74023.28125s.56055-.09375.74609-.28125c.18457-.18848.27734-.4209.27734-.69922,0-.27734-.09277-.5127-.27734-.7041Z"></path></svg></span>'
			);
		});

		it("should have removed icon if iconName = ''", () => {
			directive.iconName = ObEIcon.INFO;
			directive.ngOnChanges();
			fixture.detectChanges();
			directive.iconName = '' as ObEIcon;
			directive.ngOnChanges();
			fixture.detectChanges();
			expect(directiveNode.nativeNode.innerHTML).toBe('Text');
		});

		it('should have removed icon if position = none', () => {
			directive.iconName = ObEIcon.INFO;
			directive.iconPosition = 'none';
			directive.ngOnChanges();
			fixture.detectChanges();
			expect(directiveNode.nativeNode.innerHTML).toBe('Text');
		});

		it('should leave the host unchanged when addIcon receives no icon element', () => {
			const directivePrivate = directive as unknown as ObOptionLabelIconDirectivePrivate;

			Reflect.apply(directivePrivate.addIcon, directive, [ObEIcon.INFO, undefined, directiveNode.nativeNode, 'end']);

			expect(directiveNode.nativeNode.innerHTML).toBe('Text');
		});
	});
});
