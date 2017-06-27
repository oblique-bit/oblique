/* tslint:disable:no-unused-variable */
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, async, inject} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbButtonsModule, NgbCollapseModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {MockTranslatePipe} from '../../../../../testhelpers/mock-translate.pipe';
import {NavTreeSampleComponent} from './nav-tree-sample.component';
import {NavTreeComponent} from '../../../../lib/ng/nav-tree/nav-tree.component';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

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
				NgbTooltipModule.forRoot()
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			]
		}).compileComponents();
	}));

	beforeEach(inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		activatedRoute.data = Observable.of({sample: {navTree: {items: []}}});
		fixture = TestBed.createComponent(NavTreeSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
