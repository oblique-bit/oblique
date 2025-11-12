import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {InvalidComponent} from './invalid.component';

describe('InvalidComponent', () => {
	let component: InvalidComponent;
	let fixture: ComponentFixture<InvalidComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [InvalidComponent, RouterModule.forRoot([])],
		}).compileComponents();

		fixture = TestBed.createComponent(InvalidComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
