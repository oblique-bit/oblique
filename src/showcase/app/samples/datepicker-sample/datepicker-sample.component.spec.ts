import {ComponentFixture, TestBed, async} from '@angular/core/testing';

import {DatepickerSampleComponent} from './datepicker-sample.component';
import {ObliqueModule} from '../../../../lib/ng/index';
import {FormsModule} from '@angular/forms';
import {MockTranslatePipe} from '../../../../../testhelpers';
import {NgbDatepickerModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DatepickerPlaceholderDirective} from '../../../../lib/ng/datepicker/datepicker-placeholder.directive';
import {DatepickerModule} from '../../../../lib/ng/datepicker/datepicker.module';

describe('DatepickerSampleComponent', () => {
	let component: DatepickerSampleComponent;
	let fixture: ComponentFixture<DatepickerSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatepickerSampleComponent, MockTranslatePipe],
			imports: [
				ObliqueModule.forRoot(),
				NgbDatepickerModule.forRoot(),
				NgbTooltipModule.forRoot(),
				FormsModule
			],
		}).overrideModule(DatepickerModule, {
			//We don't need this directive in this test
			remove: {
				declarations: [
					DatepickerPlaceholderDirective
				],
				exports: [
					DatepickerPlaceholderDirective
				]
			}
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatepickerSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
