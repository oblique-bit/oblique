import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {By} from '@angular/platform-browser';

import {ObOptionLabelIconDirective} from './option-label-icon.directive';
import {ObEIcon, ObIconModule, ObIconService} from '../../icon/icon.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CommonModule} from '@angular/common';
import {OptionLabelIconPosition} from './../autocomplete.model';

@Component({
	template: ''
})
class OptionLabelTestComponent {
	iconName: ObEIcon | '' = '';
	position: OptionLabelIconPosition = 'end';
}

describe('ObOptionLabelIconDirective', () => {
	let fixture: ComponentFixture<OptionLabelTestComponent>;
	let component: OptionLabelTestComponent;
	let directive: ObOptionLabelIconDirective;
	let directiveNode: DebugElement;

	beforeEach(async () => {
		TestBed.resetTestingModule();
		await TestBed.configureTestingModule({
			declarations: [OptionLabelTestComponent],
			imports: [ObOptionLabelIconDirective, MatIconModule, ObIconModule.forRoot(), HttpClientTestingModule, CommonModule],
			providers: [
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
					'Text<span class="mat-icon" style="margin-left: auto;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><rect x="11.26535" y="7.65413" width="1.48047" height="13.3457" fill="currentColor"></rect><path d="M12.76437,3.09456a.98717.98717,0,0,0-.74609-.28808.96654.96654,0,0,0-.74023.28808.98876.98876,0,0,0-.27149.70411.94827.94827,0,0,0,1.01172.98046,1.00138,1.00138,0,0,0,.74609-.28125.95958.95958,0,0,0,.27735-.69921A.97732.97732,0,0,0,12.76437,3.09456Z" fill="currentColor"></path></svg></span>'
			}
		},
		{
			caseText: 'iconName is info and position is start',
			template: '<div  obOptionLabelIcon iconName="info" iconPosition="start">Text</div>',
			expected: {
				iconName: 'info',
				iconPosition: 'start',
				innerHtml:
					'<span class="mat-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><rect x="11.26535" y="7.65413" width="1.48047" height="13.3457" fill="currentColor"></rect><path d="M12.76437,3.09456a.98717.98717,0,0,0-.74609-.28808.96654.96654,0,0,0-.74023.28808.98876.98876,0,0,0-.27149.70411.94827.94827,0,0,0,1.01172.98046,1.00138,1.00138,0,0,0,.74609-.28125.95958.95958,0,0,0,.27735-.69921A.97732.97732,0,0,0,12.76437,3.09456Z" fill="currentColor"></path></svg></span>Text'
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

		it('should create an instance of ObOptionTestDirective', () => {
			expect(directive).toBeTruthy();
		});

		it('should create an instance of TestComponent', () => {
			expect(component).toBeTruthy();
		});

		it(`iconName should to be  ${expected.iconName}`, () => {
			fixture.detectChanges();
			expect(directive.iconName).toBe(expected.iconName);
		});

		it(`should have an default iconPosition to be ${expected.iconPosition}`, () => {
			expect(directive.iconPosition).toBe(expected.iconPosition);
		});

		it('should have added an ob-option-label-icon class to host', () => {
			fixture.detectChanges();
			expect(directiveNode.nativeNode.getElementsByClassName('ob-option-label-icon')).toBeTruthy();
		});

		it(`should have an content to be ${expected.innerHtml}`, () => {
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

		it(`should have an content to be Text`, () => {
			component.iconName = ObEIcon.INFO;
			fixture.detectChanges();
			expect(directiveNode.nativeNode.innerHTML).toBe(
				'Text<span class="mat-icon" style="margin-left: auto;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" focusable="false"><rect x="11.26535" y="7.65413" width="1.48047" height="13.3457" fill="currentColor"></rect><path d="M12.76437,3.09456a.98717.98717,0,0,0-.74609-.28808.96654.96654,0,0,0-.74023.28808.98876.98876,0,0,0-.27149.70411.94827.94827,0,0,0,1.01172.98046,1.00138,1.00138,0,0,0,.74609-.28125.95958.95958,0,0,0,.27735-.69921A.97732.97732,0,0,0,12.76437,3.09456Z" fill="currentColor"></path></svg></span>'
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
