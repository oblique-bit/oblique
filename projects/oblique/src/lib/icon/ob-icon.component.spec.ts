import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {By} from '@angular/platform-browser';
import {ObIconComponent} from './ob-icon.component';
import {ObUseObliqueIcons} from './icon.model';

describe('IconComponent', () => {
	let component: ObIconComponent;
	let fixture: ComponentFixture<ObIconComponent>;

	describe('with FontAwesome', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [MatIconModule],
				declarations: [ObIconComponent]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObIconComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should show a FontAwesome icon', () => {
			expect(fixture.debugElement.query(By.css('.fa'))).toBeDefined();
		});

		describe('fontAwesome aliases', () => {
			it('should have 12 aliases ', () => {
				expect(Object.keys(component.fontAwesomeAliases).length).toBe(12);
			});

			it('should map cancel ', () => {
				expect(component.fontAwesomeAliases.cancel).toBe('fa-times');
			});

			it('should map checkmark ', () => {
				expect(component.fontAwesomeAliases.checkmark).toBe('fa-check');
			});

			it('should map chevron-down ', () => {
				expect(component.fontAwesomeAliases['chevron-down']).toBe('fa-angle-down');
			});

			it('should map chevron-left ', () => {
				expect(component.fontAwesomeAliases['chevron-left']).toBe('fa-angle-left');
			});

			it('should map chevron-right ', () => {
				expect(component.fontAwesomeAliases['chevron-right']).toBe('fa-angle-right');
			});

			it('chevron-small-right', () => {
				expect(component.fontAwesomeAliases['chevron-small-right']).toBe('fa-angle-right');
			});

			it('should map chevron-up ', () => {
				expect(component.fontAwesomeAliases['chevron-up']).toBe('fa-angle-up');
			});

			it('should map refresh ', () => {
				expect(component.fontAwesomeAliases.refresh).toBe('fa-spinner');
			});

			it('should map search ', () => {
				expect(component.fontAwesomeAliases.search).toBe('fa-search');
			});

			it('should map universal-access', () => {
				expect(component.fontAwesomeAliases['universal-access']).toBe('fa-universal-access');
			});

			it('should map warning ', () => {
				expect(component.fontAwesomeAliases.warning).toBe('fa-exclamation');
			});
		});
	});

	describe('with Oblique icons', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [MatIconModule],
				declarations: [ObIconComponent],
				providers: [{provide: ObUseObliqueIcons, useValue: true}]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObIconComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should show an Angular icon', () => {
			expect(fixture.debugElement.query(By.css('mat-icon'))).toBeDefined();
		});
	});
});
