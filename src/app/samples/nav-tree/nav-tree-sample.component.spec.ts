import {ComponentFixture, TestBed, async, inject} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {NgbButtonsModule, NgbCollapseModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {NavTreeComponent} from 'oblique-reactive';
import {MockTranslatePipe} from 'tests';
import {NavTreeSampleComponent} from './nav-tree-sample.component';
import {TranslateService} from '@ngx-translate/core';

describe('NavTreeSampleComponent', () => {
	let component: NavTreeSampleComponent;
	let fixture: ComponentFixture<NavTreeSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MockTranslatePipe,
				NavTreeSampleComponent,
				NavTreeComponent
			],
			imports: [
				CommonModule,
				FormsModule,
				RouterTestingModule,
				NgbCollapseModule,
				NgbButtonsModule,
				NgbTooltipModule
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			],
			providers: [{provide: TranslateService, useValue: jest.fn()}]
		}).compileComponents();
	}));

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
