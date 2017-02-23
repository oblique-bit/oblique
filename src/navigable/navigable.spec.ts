/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DebugElement, Component} from '@angular/core';
import {NavigableGroupDirective} from './navigable-group.directive';
import {NavigableDirective} from './navigable.directive';

@Component({
    template: `
        <div [navigableGroup]='selectedModel'>
            <div [navigable]='model'></div>
            <div [navigable]='model2'></div>
            <div [navigable]='model3'></div>
            <div [navigable]='model4'></div>
        </div>
    `
})
class TestComponent {
    selectedModel = [];
    model = {fuu: 'bar'};
    model2 = {fuu: 'bar2'};
    model3 = {fuu: 'bar3'};
    model4 = {fuu: 'bar4'};
}

//TODO: Add more tests, if specifications are clear

/**
 * Tests for both Navigable directives
 */
describe('Navigable', () => {
    let component: TestComponent;
    let directive: NavigableGroupDirective;
    let children: NavigableDirective[];
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestComponent,
                NavigableDirective,
                NavigableGroupDirective
            ],
            imports: [CommonModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        directive = fixture.debugElement.query(By.directive(NavigableGroupDirective)).injector.get(NavigableGroupDirective);
        children = fixture.debugElement.queryAll(By.directive(NavigableDirective)).map(child => {
            return child.injector.get(NavigableDirective);
        });
    });

    it('should be created', () => {
        expect(directive).toBeTruthy();
    });

    describe('click on child', () => {
        let firstChild: NavigableDirective;
        let mouseEvent: MouseEvent;
        let ctrlMouseEvent: MouseEvent;
        let shiftMouseEvent: MouseEvent;
        beforeEach(() => {
            firstChild = children[0];

            mouseEvent = {
                ctrlKey: false,
                shiftKey: false,
                preventDefault: jasmine.createSpy('preventDefault')
            } as MouseEvent;

            ctrlMouseEvent = {
                ctrlKey: true,
                shiftKey: false,
                preventDefault: jasmine.createSpy('preventDefault')
            } as MouseEvent;

            shiftMouseEvent = {
                ctrlKey: false,
                shiftKey: true,
                preventDefault: jasmine.createSpy('preventDefault')
            } as MouseEvent;
        });
        it('should activate child', () => {
            firstChild.onMouseDown(mouseEvent);
            expect(firstChild.activated).toBe(true);
        });

        it('should select child', () => {
            firstChild.onMouseDown(mouseEvent);
            expect(firstChild.selected).toBe(true);
        });

        it('should add child to selection', () => {
            firstChild.onMouseDown(mouseEvent);
            expect(directive.navigableSelection.length).toBe(1);
            expect(directive.navigableSelection).toContain(component.model);
        });

        describe('with ctrlKey pressed', () => {
            it('should still activate child', () => {
                firstChild.onMouseDown(ctrlMouseEvent);
                expect(firstChild.activated).toBe(true);
            });

            it('should still select child', () => {
                firstChild.onMouseDown(ctrlMouseEvent);
                expect(firstChild.selected).toBe(true);
            });

            it('should still add child to selection', () => {
                firstChild.onMouseDown(ctrlMouseEvent);
                expect(directive.navigableSelection.length).toBe(1);
                expect(directive.navigableSelection).toContain(component.model);
            });

            it('should keep other selected children in selection', () => {
                firstChild.selected = true;
                firstChild.activated = true;
                directive.navigableSelection.push(firstChild.model);

                children[1].onMouseDown(ctrlMouseEvent);

                expect(directive.navigableSelection.length).toBe(2);
                expect(directive.navigableSelection).toContain(component.model2);

                children[2].onMouseDown(ctrlMouseEvent);

                expect(directive.navigableSelection.length).toBe(3);
                expect(directive.navigableSelection).toContain(component.model3);
            });

            it('should remove child if it\'s already in the selection', () => {
                firstChild.selected = true;
                firstChild.activated = true;
                directive.navigableSelection.push(firstChild.model);

                firstChild.onMouseDown(ctrlMouseEvent);

                expect(directive.navigableSelection.length).toBe(0);
                expect(firstChild.activated).toBeFalsy();
                expect(firstChild.selected).toBeFalsy();
            });

            it('should not select children between the active and the clicked', () => {
                firstChild.selected = true;
                firstChild.activated = true;
                directive.navigableSelection.push(firstChild.model);

                children[3].onMouseDown(ctrlMouseEvent);

                expect(directive.navigableSelection.length).toBe(2);
                expect(firstChild.activated).toBeFalsy();
                expect(firstChild.selected).toBeTruthy();

                expect(children[3].activated).toBeTruthy();
                expect(children[3].selected).toBeTruthy();
            });
        });
        describe('with shiftKey pressed', () => {
            it('should still activate child', () => {
                firstChild.onMouseDown(shiftMouseEvent);
                expect(firstChild.activated).toBe(true);
            });

            it('should still select child', () => {
                firstChild.onMouseDown(shiftMouseEvent);
                expect(firstChild.selected).toBe(true);
            });

            it('should still add child to selection', () => {
                firstChild.onMouseDown(shiftMouseEvent);
                expect(directive.navigableSelection.length).toBe(1);
                expect(directive.navigableSelection).toContain(component.model);
            });

            it('should select every child between the active and the clicked', () => {
                firstChild.selected = true;
                firstChild.activated = true;
                directive.navigableSelection.push(firstChild.model);

                children[3].onMouseDown(shiftMouseEvent);
                expect(directive.navigableSelection.length).toBe(4);

                children.forEach(child => {
                    expect(child.selected).toBeTruthy();
                });
            });

            it('should unselect every child that is not between the active and the clicked', () => {
                let secondChild = children[1];
                firstChild.selected = true;

                secondChild.activated = true;
                secondChild.selected = true;

                directive.navigableSelection.push(firstChild.model);
                directive.navigableSelection.push(secondChild.model);

                children[2].onMouseDown(shiftMouseEvent);
                expect(directive.navigableSelection.length).toBe(2);

                expect(children[2].selected).toBeTruthy();
                expect(children[2].activated).toBeTruthy();

            });
        });
    });
});


