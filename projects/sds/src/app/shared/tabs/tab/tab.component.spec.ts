import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TabComponent} from './tab.component';
import {IdPipe} from '../../id/id.pipe';

describe(`${TabComponent.name}`, () => {
	let component: TabComponent;
	let fixture: ComponentFixture<TabComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TabComponent, IdPipe]
		}).compileComponents();

		fixture = TestBed.createComponent(TabComponent);
		component = fixture.componentInstance;
		fixture.autoDetectChanges();
	});

	describe('default inputs', () => {
		it(`should not be active by default`, () => {
			expect(component.active).toBeFalsy();
		});

		it(`should be active after calling ${TabComponent.prototype.updateActive.name} with true`, () => {
			component.updateActive(true);
			expect(component.active).toBeTruthy();
		});

		it(`should not be active after calling ${TabComponent.prototype.updateActive.name} with false`, () => {
			component.updateActive(false);
			expect(component.active).toBeFalsy();
		});
	});

	describe('initiallyActive = true', () => {
		beforeEach(() => {
			component.initiallyActive = true;
			component.ngOnChanges({initiallyActive: {previousValue: false, currentValue: true, firstChange: true, isFirstChange: () => true}});
		});

		it(`should be active by default`, () => {
			expect(component.active).toBeTruthy();
		});

		it(`should not be active after calling ${TabComponent.prototype.updateActive.name} with false`, () => {
			component.updateActive(false);
			expect(component.active).toBeFalsy();
		});

		it(`should still be active after calling ${TabComponent.prototype.updateActive.name} with true`, () => {
			component.updateActive(true);
			expect(component.active).toBeTruthy();
		});
	});
});
