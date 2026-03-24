import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {Text} from './text';

describe(Text.name, () => {
	let component: Text;
	let fixture: ComponentFixture<Text>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Text],
		}).compileComponents();

		fixture = TestBed.createComponent(Text);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('component creation', () => {
		expect(component).toBeTruthy();
	});

	test.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a'])('contains at least a "%s" element', element => {
		expect(fixture.nativeElement.querySelector(element)).toBeTruthy();
	});
});
