import {type ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {of} from 'rxjs';
import {NavTreeSampleComponent} from './nav-tree-sample.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {TranslateModule} from '@ngx-translate/core';

describe(NavTreeSampleComponent.name, () => {
	let component: NavTreeSampleComponent;
	let fixture: ComponentFixture<NavTreeSampleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavTreeSampleComponent],
			imports: [
				CommonModule,
				FormsModule,
				RouterTestingModule,
				MatRadioModule,
				MatCheckboxModule,
				MatSlideToggleModule,
				TranslateModule,
			],
			providers: [provideObliqueTestingConfiguration()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		activatedRoute.data = of({sample: {navTree: {items: []}}});
		fixture = TestBed.createComponent(NavTreeSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
