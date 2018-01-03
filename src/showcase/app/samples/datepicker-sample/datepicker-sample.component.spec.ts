import {FormsModule} from '@angular/forms';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {NgbDatepickerModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {ObliqueModule, SchemaValidationService, DatepickerModule, DatepickerPlaceholderDirective} from '../../../../lib/ng';
import {MockTranslatePipe} from '../../../../../testhelpers';
import {DatepickerSampleComponent} from './datepicker-sample.component';

describe('DatepickerSampleComponent', () => {
	let component: DatepickerSampleComponent;
	let fixture: ComponentFixture<DatepickerSampleComponent>;
	let schemaValidationService;

	beforeEach(async(() => {
		schemaValidationService = jasmine.createSpyObj('SchemaValidationService', ['isRequired']);
		TestBed.configureTestingModule({
			declarations: [DatepickerSampleComponent, MockTranslatePipe],
			providers: [
				{provide: SchemaValidationService, useValue: schemaValidationService}
			],
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
