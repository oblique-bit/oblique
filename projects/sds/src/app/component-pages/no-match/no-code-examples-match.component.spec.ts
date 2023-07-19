import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoCodeExamplesMatchComponent} from './no-code-examples-match.component';

describe(`${NoCodeExamplesMatchComponent.name}`, () => {
	let component: NoCodeExamplesMatchComponent;
	let fixture: ComponentFixture<NoCodeExamplesMatchComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NoCodeExamplesMatchComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(NoCodeExamplesMatchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
