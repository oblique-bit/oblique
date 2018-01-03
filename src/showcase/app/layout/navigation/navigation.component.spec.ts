import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MockTranslatePipe} from '../../../../../testhelpers';
import {LayoutNavigationComponent} from './navigation.component';

//TODO: naming
describe('LayoutNavigationComponent', () => {
	let component: LayoutNavigationComponent;
	let fixture: ComponentFixture<LayoutNavigationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [LayoutNavigationComponent, MockTranslatePipe]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LayoutNavigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
