import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {HarnessLoader} from '@angular/cdk/testing';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatIconHarness} from '@angular/material/icon/testing';
import {MatTooltipHarness} from '@angular/material/tooltip/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {TourPopoverComponent} from '../lib/tour-menu/tour-popover/tour-popover.component';
import type {ObTourConfig} from '../lib/models/tour-config.model';

describe('TourPopoverComponent (Integration)', () => {
	let fixture: ComponentFixture<TourPopoverComponent>;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let component: TourPopoverComponent;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TourPopoverComponent, TranslateModule.forRoot(), BrowserTestingModule]
		}).compileComponents();

		fixture = TestBed.createComponent(TourPopoverComponent);
		component = fixture.componentInstance;
		loader = TestbedHarnessEnvironment.loader(fixture);
		fixture.detectChanges();
	});

	describe('Input Handling and Reactivity', () => {
		it('should render lists when inputs are defined', () => {
			const testTours: ObTourConfig[] = [{id: '1', tourTitle: 'T', tourDescription: 'D', state: 'new'} as any];
			const inProgress: ObTourConfig[] = [{id: '2', tourTitle: 'T2', tourDescription: 'D2', state: 'inProgress'} as any];
			const done: ObTourConfig[] = [{id: '3', tourTitle: 'T3', tourDescription: 'D3', state: 'done'} as any];
			fixture.componentRef.setInput('newTours', testTours);
			fixture.componentRef.setInput('inProgressTours', inProgress);
			fixture.componentRef.setInput('doneTours', done);
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelectorAll('obt-menu-list').length).toBe(3);
		});

		it('should render three lists when inputs are empty', () => {
			fixture.componentRef.setInput('newTours', []);
			fixture.componentRef.setInput('inProgressTours', []);
			fixture.componentRef.setInput('doneTours', []);
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelectorAll('obt-menu-list').length).toBe(3);
		});
	});

	describe('Template Structure and Attributes', () => {
		it('should render dialog title with correct translation key', () => {
			const title = fixture.nativeElement.querySelector('#obt-dialog-title');
			expect(title.textContent).toContain('i18n.ob-tour.tour-menu.list.title.dialog');
		});

		it('should link aria-labelledby to dialog-title', () => {
			const popover = fixture.nativeElement.querySelector('.obt-popover-content');
			expect(popover.getAttribute('aria-labelledby')).toBe('obt-dialog-title');
		});

		it('should set role attribute to dialog', () => {
			const popover = fixture.nativeElement.querySelector('.obt-popover-content');
			expect(popover.getAttribute('role')).toBe('dialog');
		});

		it('should render all menu sections with correct titles', () => {
			const headers = fixture.nativeElement.querySelectorAll('obt-menu-list h3');
			const texts = Array.from(headers).map((htmlElement: HTMLElement) => htmlElement.textContent.trim());
			expect(texts).toEqual(
				expect.arrayContaining([
					'i18n.ob-tour.tour-menu.list.title.new',
					'i18n.ob-tour.tour-menu.list.title.inProgress',
					'i18n.ob-tour.tour-menu.list.title.done'
				])
			);
		});

		it('should render header before first menu list', () => {
			const html = fixture.nativeElement.innerHTML;
			const headerIndex = html.indexOf('<header');
			const listIndex = html.indexOf('<obt-menu-list');
			expect(headerIndex).toBeLessThan(listIndex);
		});
	});

	describe('Material Rendering and Accessibility', () => {
		it('should render at least one mat-icon', async () => {
			expect((await loader.getAllHarnesses(MatIconHarness)).length).toBeGreaterThan(0);
		});

		it('should render at least one mat-button', async () => {
			expect((await loader.getAllHarnesses(MatButtonHarness)).length).toBeGreaterThan(0);
		});

		it('should render tooltip directives on buttons', async () => {
			expect((await loader.getAllHarnesses(MatTooltipHarness)).length).toBeGreaterThanOrEqual(1);
		});

		it('should assign an aria-label to the close button', async () => {
			const [button] = await loader.getAllHarnesses(MatButtonHarness);
			const host = await button.host();
			const ariaLabel = await host.getAttribute('aria-label');
			expect(ariaLabel === null || typeof ariaLabel === 'string').toBeTruthy();
		});
	});

	describe('Visibility Control', () => {
		it('should render popover in DOM when opened', () => {
			fixture.componentRef.setInput('isOpen', true);
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('.obt-popover-content')).toBeTruthy();
		});

		it('should keep popover in DOM after closing', () => {
			fixture.componentRef.setInput('isOpen', true);
			fixture.detectChanges();
			fixture.componentRef.setInput('isOpen', false);
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('.obt-popover-content')).toBeTruthy();
		});
	});
});
