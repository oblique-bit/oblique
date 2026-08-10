import {type ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {of} from 'rxjs';
import {NavTreeSampleComponent} from './nav-tree-sample.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {TranslatePipe} from '@ngx-translate/core';

describe(NavTreeSampleComponent.name, () => {
	let component: NavTreeSampleComponent;
	let fixture: ComponentFixture<NavTreeSampleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavTreeSampleComponent],
			imports: [
				CommonModule,
				FormsModule,
				RouterModule.forRoot([]),
				MatRadioModule,
				MatCheckboxModule,
				MatSlideToggleModule,
				TranslatePipe,
			],
			providers: [provideObliqueTestingConfiguration()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		activatedRoute.data = of({
			sample: {
				navTree: {
					items: [
						{label: 'First item', url: '/first'},
						{label: 'Second item', url: '/second', disabled: true},
					],
				},
			},
		});
		fixture = TestBed.createComponent(NavTreeSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should clear the filter pattern', () => {
		component.filter.pattern = 'query';

		component.filter.clear();

		expect(component.filter.pattern).toBeNull();
	});

	it('should toggle the disabled state of a tree item', () => {
		component.setDisabled(0);

		expect(component.items()[0].disabled).toBe(true);

		component.setDisabled(0);

		expect(component.items()[0].disabled).toBe(false);
	});
});
