import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {By} from '@angular/platform-browser';
import {ObIconComponent} from './ob-icon.component';

describe('IconComponent', () => {
	let fixture: ComponentFixture<ObIconComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [MatIconModule],
			declarations: [ObIconComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObIconComponent);
		fixture.detectChanges();
	});

	it('should show the correct icon', () => {
		expect(fixture.debugElement.query(By.css('mat-icon'))).toBeTruthy();
	});
});
