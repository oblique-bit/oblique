import {HttpClientTestingModule} from '@angular/common/http/testing';
import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {IdPipe} from '../shared/id/id.pipe';
import {getDebugElementById} from '../../test-helpers/unit-test-helpers/unit-test-helpers';
import {AccordionLinksComponent} from './accordion-links/accordion-links.component';
import {ImageComponent} from './image/image.component';
import {SideNavigationComponent} from './side-navigation.component';
import {VersionComponent} from './version/version.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {WINDOW} from '@oblique/oblique';

type SideNavigationIds = 'accordion-links' | 'logo' | 'search-input' | 'version';

describe(SideNavigationComponent.name, () => {
	let component: SideNavigationComponent;
	let fixture: ComponentFixture<SideNavigationComponent>;

	const idPipe = new IdPipe();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ReactiveFormsModule,
				RouterTestingModule,
				HttpClientTestingModule,
				AccordionLinksComponent,
				IdPipe,
				ImageComponent,
				SideNavigationComponent,
				VersionComponent,
				NoopAnimationsModule
			],
			providers: [{provide: WINDOW, useValue: window}]
		}).compileComponents();

		fixture = TestBed.createComponent(SideNavigationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	afterEach(() => {
		fixture?.destroy();
	});

	describe('on init', () => {
		it.each<{id: SideNavigationIds}>([{id: 'accordion-links'}, {id: 'logo'}, {id: 'search-input'}, {id: 'version'}])(
			'should display $id',
			({id}) => {
				expect(getDebugElementById<SideNavigationComponent>(fixture, idPipe.transform(component.componentId, [id]))).toBeTruthy();
			}
		);
	});
});
