import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import {BreadcrumbSampleComponent} from './breadcrumb.component';
import {ObLocalizePipe, provideObliqueTestingConfiguration} from '@oblique/oblique';

describe(BreadcrumbSampleComponent.name, () => {
	let component: BreadcrumbSampleComponent;
	let fixture: ComponentFixture<BreadcrumbSampleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterModule.forRoot([{path: '**', component: BreadcrumbSampleComponent}]),
				ObLocalizePipe,
			],
			declarations: [BreadcrumbSampleComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [provideObliqueTestingConfiguration({hasLanguageInUrl: true})],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BreadcrumbSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
