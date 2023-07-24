import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BadgeCodeExamplesComponent} from './badge-code-examples.component';
import {IdPipe} from '../../../shared/id/id.pipe';

describe('BadgeCodeExamplesComponent', () => {
	let component: BadgeCodeExamplesComponent;
	let fixture: ComponentFixture<BadgeCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IdPipe, BadgeCodeExamplesComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(BadgeCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
