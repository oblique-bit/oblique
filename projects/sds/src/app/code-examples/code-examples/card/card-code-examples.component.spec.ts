import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CardCodeExamplesComponent} from './card-code-examples.component';
import {RouterTestingModule} from '@angular/router/testing';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';

describe('CardCodeExamplesComponent', () => {
	let component: CardCodeExamplesComponent;
	let fixture: ComponentFixture<CardCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardCodeExamplesComponent, RouterTestingModule],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(CardCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
