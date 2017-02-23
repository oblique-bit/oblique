/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DebugElement, Component} from '@angular/core';
import {NavigableDirective} from './navigable.directive';


@Component({
    template: `
        <div [navigable]="model" [navigableInitialActivated]="true">
            
        </div>
    `
})
class TestComponent {
    model = {

    };
}

//TODO: needs more tests
describe('NavigableDirective', () => {
    //let component: TestComponent;
    let directive: NavigableDirective;
    let element: DebugElement;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, NavigableDirective],
            imports: [CommonModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        element = fixture.debugElement.query(By.directive(NavigableDirective));
        directive = element.injector.get(NavigableDirective);
    });

    it('should be created', () => {
        expect(directive).toBeTruthy();
    });

    it('should add class navigable on element', () => {
        expect(element.classes[['navigable']]).toBeTruthy();
    });

    it('should add class navigable-selected if it\'s selected', () => {
        directive.selected = true;
        fixture.detectChanges();

        expect(element.classes[['navigable-selected']]).toBeTruthy();
    });

    it('should add class navigable-active if it\'s active', () => {
        directive.activated = true;
        fixture.detectChanges();

        expect(element.classes[['navigable-active']]).toBeTruthy();
    });

});