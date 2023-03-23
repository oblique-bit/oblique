import {TestElement} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatIconHarness} from '@angular/material/icon/testing';
import {Component} from '@angular/core';
import {ObMockTranslatePipe} from './../../../_mocks/mock-translate.pipe';
import {ObServiceNavigationPopOverSectionHarness} from './service-navigation-popover-section.harness';
import {ObServiceNavigationPopoverSectionComponent} from './service-navigation-popover-section.component';

@Component({template: ''})
class TestComponent {}

describe('ObServiceNavigationPopoverSectionComponent', () => {
	let component: ObServiceNavigationPopoverSectionComponent;
	let fixture: ComponentFixture<ObServiceNavigationPopoverSectionComponent>;
	let harness: ObServiceNavigationPopOverSectionHarness;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconModule],
			declarations: [ObServiceNavigationPopoverSectionComponent, ObMockTranslatePipe, TestComponent]
		}).compileComponents();
	});

	describe('without content projection', () => {
		beforeEach(async () => {
			fixture = TestBed.createComponent(ObServiceNavigationPopoverSectionComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ObServiceNavigationPopOverSectionHarness);
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should have "ob-service-navigation-popover-section" class', async () => {
			const host = await harness.host();
			expect(await host.hasClass('ob-service-navigation-popover-section')).toBe(true);
		});

		describe('header', () => {
			let header: TestElement;
			beforeEach(async () => {
				header = await harness.getHeader();
			});

			it('should exist', () => {
				expect(header).toBeTruthy();
			});

			it('should contain the header attribute', async () => {
				component.header = 'Section title';
				fixture.detectChanges();
				expect(await header.text()).toBe('Section title');
			});

			it('should have the "ob-popover-header" class', async () => {
				expect(await header.hasClass('ob-popover-header')).toBe(true);
			});

			describe('image', () => {
				it('should not exists', async () => {
					const testFixture = TestBed.createComponent(TestComponent);
					harness = await TestbedHarnessEnvironment.harnessForFixture(testFixture, ObServiceNavigationPopOverSectionHarness);
					expect(await harness.getHeaderImage()).toBeNull();
				});
			});
		});

		describe('list', () => {
			let list: TestElement;
			describe('with default value', () => {
				beforeEach(async () => {
					list = await harness.getLinkList();
				});

				it('should not be there', () => {
					expect(list).toBeFalsy();
				});
			});

			describe('with some links', () => {
				const sampleLinks = [
					{url: 'link1', label: 'Label 1'},
					{url: 'link2', label: 'Label 2', icon: 'cog'},
					{url: 'link3', label: 'Label 3', isInternalLink: true},
					{url: 'link4', label: 'Label 4', ariaLabel: {text: 'some.key', parameters: null}}
				];
				let links: TestElement[];
				beforeEach(async () => {
					component.links = sampleLinks;
					fixture.detectChanges();
					list = await harness.getLinkList();
					links = await harness.getLinks();
				});

				it('should not be there', () => {
					expect(list).toBeTruthy();
				});

				it('should have "ob-popover-list" class', async () => {
					expect(await list.hasClass('ob-popover-list')).toBe(true);
				});

				it('should contain 4 items', () => {
					expect(links.length).toBe(4);
				});

				describe.each(Object.keys(sampleLinks))('item %s', index => {
					let link: TestElement;
					beforeEach(() => {
						link = links[index];
					});

					it(`should have "${sampleLinks[index].label as string}" as content`, async () => {
						expect(await link.text()).toBe(sampleLinks[index].label);
					});

					it(`should have "${sampleLinks[index].url as string}" as href attribute`, async () => {
						expect(await link.getAttribute('href')).toBe(sampleLinks[index].url);
					});

					it(`should have "${sampleLinks[index].isExternalLink as boolean}" as isExternalLink attribute`, async () => {
						expect(await link.getProperty('isExternalLink')).toBe(!sampleLinks[index].isInternalLink);
					});

					it(`should have "${(sampleLinks[index].ariaLabel?.text as string) ?? null}" as aria-label attribute`, async () => {
						expect(await link.getAttribute('aria-label')).toBe(sampleLinks[index].ariaLabel?.text ?? null);
					});

					it('should have the "ob-popover-link" class', async () => {
						expect(await link.hasClass('ob-popover-link')).toBe(true);
					});
				});

				describe('icon', () => {
					describe.each([1, 3, 4])('item %s', index => {
						describe('icon', () => {
							let iconHarness: MatIconHarness;
							beforeEach(async () => {
								iconHarness = await harness.getIconHarnessesForNthLink(index);
							});

							it('should exists', () => {
								expect(iconHarness).toBeFalsy();
							});
						});
					});

					describe('item 2', () => {
						describe('icon', () => {
							let iconHarness: MatIconHarness;
							beforeEach(async () => {
								iconHarness = await harness.getIconHarnessesForNthLink(2);
							});

							it('should exists', () => {
								expect(iconHarness).toBeTruthy();
							});

							it('should be "cog"', async () => {
								expect(await iconHarness.getName()).toBe(sampleLinks[1].icon);
							});

							it('should have "ob-icon-text" class', async () => {
								const host = await iconHarness.host();
								expect(await host.hasClass('ob-icon-text')).toBe(true);
							});
						});
					});
				});
			});
		});
	});

	describe('with content projection', () => {
		describe('image', () => {
			let image: TestElement;
			beforeEach(async () => {
				TestBed.overrideTemplate(
					TestComponent,
					`<ob-service-navigation-popover-section><img obHeaderPrefix alt="altText" src="http://image-src" /></ob-service-navigation-popover-section>`
				);
				const testFixture = TestBed.createComponent(TestComponent);
				harness = await TestbedHarnessEnvironment.harnessForFixture(testFixture, ObServiceNavigationPopOverSectionHarness);
				image = await harness.getHeaderImage();
			});

			it('should exists', () => {
				expect(image).toBeTruthy();
			});

			it.each([
				{property: 'src', value: 'http://image-src'},
				{property: 'alt', value: 'altText'}
			])('should have "$value" as "$property" property', async ({property, value}) => {
				expect(await image.getAttribute(property)).toBe(value);
			});
		});
	});
});
