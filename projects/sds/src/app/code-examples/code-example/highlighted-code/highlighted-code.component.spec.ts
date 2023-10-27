import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HighlightedCodeComponent} from './highlighted-code.component';
import {IdPipe} from '../../../shared/id/id.pipe';

describe('HighlightedCodeComponent', () => {
	let component: HighlightedCodeComponent;
	let fixture: ComponentFixture<HighlightedCodeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IdPipe, HighlightedCodeComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(HighlightedCodeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
