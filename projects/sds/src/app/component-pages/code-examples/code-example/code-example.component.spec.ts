import {TemplateRef} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CodeExampleComponent} from './code-example.component';
import {CodeExample} from './code-example.model';
import {TabComponent} from '../../tabs/tab/tab.component';
import {TabsComponent} from '../../tabs/tabs.component';
import {IdModule} from '../../../shared/id/id.module';
import {IdPipe} from '../../../shared/id/id.pipe';
import {UnitTestHelpers} from '../../../../test-helpers/unit-test-helpers/unit-test-helpers';
import {HighlightedCodeComponent} from './highlighted-code/highlighted-code.component';

describe(`${CodeExampleComponent.name}`, () => {
	let component: CodeExampleComponent;
	let fixture: ComponentFixture<CodeExampleComponent>;

	const idPipe = new IdPipe();
	const preview = {} as TemplateRef<any>;

	const getIdParts: (id?: string) => string[] = (id?: string) => {
		const idParts = [component.componentId];

		if (id) {
			idParts.push(id);
		}

		return idParts;
	};

	const setupComponent = async (inputs?: ComponentInputs): Promise<void> => {
		await TestBed.configureTestingModule({
			declarations: [CodeExampleComponent, HighlightedCodeComponent, TabComponent, TabsComponent],
			imports: [IdModule]
		}).compileComponents();

		fixture = TestBed.createComponent(CodeExampleComponent);
		component = fixture.componentInstance;
		component.example = inputs?.example ?? new CodeExample();
		component.idPrefix = inputs?.idPrefix ?? '';
		component.preview = inputs?.preview;

		await fixture.whenStable().then(() => {
			fixture.detectChanges();
		});
	};

	afterEach(() => {
		fixture.destroy();
	});

	it.each<{id: string}>([{id: 'tabs'}])('should display $id when only idPrefix input is truthy', async ({id}) => {
		await setupComponent({idPrefix: 'test'});

		expect(UnitTestHelpers.getDebugElementById(fixture, idPipe.transform(component.idPrefix, getIdParts(id)))).toBeTruthy();
	});

	it.each<{id: string}>([{id: 'preview-tab'}, {id: 'html-tab'}, {id: 'scss-tab'}, {id: 'ts-tab'}])(
		'should not display $id when only idPrefix input is truthy',
		async ({id}) => {
			await setupComponent({idPrefix: 'test'});

			expect(UnitTestHelpers.getDebugElementById(fixture, idPipe.transform(component.idPrefix, getIdParts(id)))).toBeFalsy();
		}
	);

	it.each<{id: string}>([{id: 'tabs'}, {id: 'html-tab'}, {id: 'scss-tab'}, {id: 'ts-tab'}])(
		'should display $id when only example & idPrefix inputs are truthy',
		async ({id}) => {
			await setupComponent({example: new CodeExample({html: 'html', scss: 'scss', ts: 'ts'}), idPrefix: 'test'});

			expect(UnitTestHelpers.getDebugElementById(fixture, idPipe.transform(component.idPrefix, getIdParts(id)))).toBeTruthy();
		}
	);

	it.each<{id: string}>([{id: 'preview-tab'}])('should not display $id when only example & idPrefix inputs are truthy', async ({id}) => {
		await setupComponent({example: new CodeExample({html: 'html', scss: 'scss', ts: 'ts'}), idPrefix: 'test'});

		expect(UnitTestHelpers.getDebugElementById(fixture, idPipe.transform(component.idPrefix, getIdParts(id)))).toBeFalsy();
	});

	it.each<{id: string}>([{id: 'tabs'}, {id: 'preview-tab'}, {id: 'html-tab'}, {id: 'scss-tab'}, {id: 'ts-tab'}])(
		'should display $id when all inputs are truthy',
		async ({id}) => {
			await setupComponent({
				example: new CodeExample({html: 'html', scss: 'scss', ts: 'ts'}),
				idPrefix: 'test',
				preview
			});

			expect(UnitTestHelpers.getDebugElementById(fixture, idPipe.transform(component.idPrefix, getIdParts(id)))).toBeTruthy();
		}
	);
});

interface ComponentInputs {
	example?: CodeExample;
	idPrefix?: string;
	preview?: TemplateRef<any>;
}
