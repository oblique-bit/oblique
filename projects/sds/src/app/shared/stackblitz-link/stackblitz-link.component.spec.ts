import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {StackblitzLinkComponent} from './stackblitz-link.component';

describe('StackblitzLinkComponent', () => {
	let fixture: ComponentFixture<StackblitzLinkComponent>;
	let component: StackblitzLinkComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StackblitzLinkComponent],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(StackblitzLinkComponent);
		component = fixture.componentInstance;
	});

	it('creates the StackBlitz URL', () => {
		fixture.componentRef.setInput('project', 'my-project');
		fixture.componentRef.setInput('file', 'src/app/app.component.ts');
		expect(component.href()).toBe(
			`https://stackblitz.com/github/oblique-bit/oblique-stackblitz/tree/master/my-project?file=src%2Fapp%2Fapp.component.ts`
		);
	});

	it('sets the generated URL on the link', () => {
		fixture.componentRef.setInput('project', 'my-project');
		fixture.componentRef.setInput('file', 'src/app/app.component.ts');
		fixture.detectChanges();
		const link = fixture.nativeElement.querySelector('a');
		expect(link.href).toBe(
			`https://stackblitz.com/github/oblique-bit/oblique-stackblitz/tree/master/my-project?file=src%2Fapp%2Fapp.component.ts`
		);
	});
});
