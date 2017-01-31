/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {NavigableDirective} from "./navigable.directive";


//TODO: needs more tests
describe('NavigableDirective', () => {
    let directive: NavigableDirective;
    let fixture: ComponentFixture<NavigableDirective>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NavigableDirective],
            imports: [CommonModule]
        })
            .compileComponents();
    }));

    /*beforeEach(() => {
        fixture = TestBed.createComponent(NavigableDirective);
        directive = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });*/
});
