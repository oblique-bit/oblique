import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {NgbButtonsModule, NgbCollapseModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {ObNavTreeSampleComponent} from './nav-tree-sample.component';
import {ObliqueTestingModule} from 'oblique/lib/oblique-testing.module';
import {ObNavTreeComponent} from 'oblique/lib/nav-tree/nav-tree.component';

describe('ObNavTreeSampleComponent', () => {
	let component: ObNavTreeSampleComponent;
	let fixture: ComponentFixture<ObNavTreeSampleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObNavTreeSampleComponent, ObNavTreeComponent],
			imports: [CommonModule, FormsModule, RouterTestingModule, NgbCollapseModule, NgbButtonsModule, NgbTooltipModule, ObliqueTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		activatedRoute.data = of({sample: {navTree: {items: []}}});
		fixture = TestBed.createComponent(ObNavTreeSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
