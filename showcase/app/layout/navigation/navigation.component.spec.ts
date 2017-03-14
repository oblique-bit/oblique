/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutNavigationComponent} from './navigation.component';
import {MockTranslatePipe} from '../../../../testhelpers';

describe('LayoutNavigation', () => {
    let component: LayoutNavigationComponent;
    let fixture: ComponentFixture<LayoutNavigation>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LayoutNavigationComponent, MockTranslatePipe]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LayoutNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
