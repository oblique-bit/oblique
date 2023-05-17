import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IdModule} from '../../../../shared/id/id.module';

import {HighlightedCodeComponent} from './highlighted-code.component';

describe('HighlightedCodeComponent', () => {
	let component: HighlightedCodeComponent;
	let fixture: ComponentFixture<HighlightedCodeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [HighlightedCodeComponent],
			imports: [IdModule]
		}).compileComponents();

		fixture = TestBed.createComponent(HighlightedCodeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
