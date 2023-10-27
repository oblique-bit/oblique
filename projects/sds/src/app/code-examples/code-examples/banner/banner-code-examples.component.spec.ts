import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BannerCodeExamplesComponent} from './banner-code-examples.component';

describe('CodeExampleBannerComponent', () => {
	let component: BannerCodeExamplesComponent;
	let fixture: ComponentFixture<BannerCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BannerCodeExamplesComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(BannerCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
