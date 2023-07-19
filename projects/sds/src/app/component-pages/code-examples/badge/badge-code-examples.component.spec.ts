import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {BadgeCodeExamplesComponent} from './badge-code-examples.component';
import {BadgeExamplePositionBelowBeforeComponent} from './previews/badge-example-position-below-before/badge-example-position-below-before.component';
import {BadgeExampleOverlapFalseComponent} from './previews/badge-example-overlap-false/badge-example-overlap-false.component';
import {BadgeExampleDefaultComponent} from './previews/badge-example-default/badge-example-default.component';
import {BadgeExampleColorWarnComponent} from './previews/badge-example-color-warn/badge-example-color-warn.component';
import {IdPipe} from '../../../shared/id/id.pipe';

describe('BadgeCodeExamplesComponent', () => {
	let component: BadgeCodeExamplesComponent;
	let fixture: ComponentFixture<BadgeCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				IdPipe,
				MatButtonModule,
				ObButtonModule,
				BadgeCodeExamplesComponent,
				BadgeExampleColorWarnComponent,
				BadgeExampleDefaultComponent,
				BadgeExampleOverlapFalseComponent,
				BadgeExamplePositionBelowBeforeComponent
			]
		}).compileComponents();

		fixture = TestBed.createComponent(BadgeCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
