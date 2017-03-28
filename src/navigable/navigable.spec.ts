/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DebugElement, Component} from '@angular/core';
import {NavigableGroupDirective} from './navigable-group.directive';
import {NavigableDirective} from './navigable.directive';

@Component({
    template: `<div [navigableGroup]="models" [navigableSelection]='selectedModel'>
					<div [navigable]='model'></div>
					<div [navigable]='model2'></div>
					<div [navigable]='model3'></div>
					<div [navigable]='model4'></div>
				</div>`
})
class TestComponent {
    selectedModel = [];
    models = [
        {fuu: 'bar'},
        {fuu: 'bar2'},
        {fuu: 'bar3'},
        {fuu: 'bar4'}
    ]
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
    let childrenDirectives: DebugElement[];

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
        childrenDirectives = fixture.debugElement.queryAll(By.directive(NavigableDirective));
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

            mouseEvent = new MouseEvent("mousedown");
            ctrlMouseEvent = new MouseEvent("mousedown", {ctrlKey: true});
            shiftMouseEvent = new MouseEvent("mousedown",{shiftKey: true});

        });
        it('should activate child', () => {
            childrenDirectives[0].nativeElement.dispatchEvent(mouseEvent);
            expect(firstChild.activate).toBe(true);
        });

        it('should select child', () => {
            childrenDirectives[0].nativeElement.dispatchEvent(mouseEvent);
            expect(firstChild.selected).toBe(true);
        });

        it('should add child to selection', () => {
            childrenDirectives[0].nativeElement.dispatchEvent(mouseEvent);
            expect(directive.navigableSelection.length).toBe(1);
            expect(directive.navigableSelection).toContain(component.models[0]);
        });

        describe('with ctrlKey pressed', () => {
            it('should still activate child', () => {
                childrenDirectives[0].nativeElement.dispatchEvent(ctrlMouseEvent);
                expect(firstChild.activate).toBe(true);
            });

            it('should still select child', () => {
                childrenDirectives[0].nativeElement.dispatchEvent(ctrlMouseEvent);
                expect(firstChild.selected).toBe(true);
            });

            it('should still add child to selection', () => {
                childrenDirectives[0].nativeElement.dispatchEvent(ctrlMouseEvent);
                expect(directive.navigableSelection.length).toBe(1);
                expect(directive.navigableSelection).toContain(component.models[0]);
            });

            it('should keep other selected children in selection', () => {
                firstChild.selected = true;
                firstChild.activate = true;
                directive.navigableSelection.push(firstChild.model);

                childrenDirectives[1].nativeElement.dispatchEvent(ctrlMouseEvent);

                expect(directive.navigableSelection.length).toBe(2);
                expect(directive.navigableSelection).toContain(component.models[1]);

                childrenDirectives[2].nativeElement.dispatchEvent(ctrlMouseEvent);

                expect(directive.navigableSelection.length).toBe(3);
                expect(directive.navigableSelection).toContain(component.models[2]);
            });

            it('should remove child if it\'s already in the selection', () => {
                firstChild.selected = true;
                firstChild.activate = true;
                directive.navigableSelection.push(firstChild.model);

                childrenDirectives[0].nativeElement.dispatchEvent(ctrlMouseEvent);

                expect(directive.navigableSelection.length).toBe(0);
                expect(firstChild.activate).toBeFalsy();
                expect(firstChild.selected).toBeFalsy();
            });

            it('should not select children between the active and the clicked', () => {
                firstChild.selected = true;
                firstChild.activate = true;
                directive.navigableSelection.push(firstChild.model);

                childrenDirectives[3].nativeElement.dispatchEvent(ctrlMouseEvent);

                expect(directive.navigableSelection.length).toBe(2);
                expect(firstChild.activate).toBeFalsy();
                expect(firstChild.selected).toBeTruthy();

                expect(children[3].activate).toBeTruthy();
                expect(children[3].selected).toBeTruthy();
            });
        });
        describe('with shiftKey pressed', () => {
            it('should still activate child', () => {
                childrenDirectives[0].nativeElement.dispatchEvent(shiftMouseEvent);
                expect(firstChild.activate).toBe(true);
            });

            it('should still select child', () => {
                childrenDirectives[0].nativeElement.dispatchEvent(shiftMouseEvent);
                expect(firstChild.selected).toBe(true);
            });

            it('should still add child to selection', () => {
                childrenDirectives[0].nativeElement.dispatchEvent(shiftMouseEvent);
                expect(directive.navigableSelection.length).toBe(1);
                expect(directive.navigableSelection).toContain(component.models[0]);
            });

            it('should select every child between the active and the clicked', () => {
                firstChild.selected = true;
                firstChild.activate = true;
                directive.navigableSelection.push(firstChild.model);

                childrenDirectives[3].nativeElement.dispatchEvent(shiftMouseEvent);
                expect(directive.navigableSelection.length).toBe(4);

                children.forEach(child => {
                    expect(child.selected).toBeTruthy();
                });
            });

            it('should unselect every child that is not between the active and the clicked', () => {
                let secondChild = children[1];
                firstChild.selected = true;

                secondChild.activate = true;
                secondChild.selected = true;

                directive.navigableSelection.push(firstChild.model);
                directive.navigableSelection.push(secondChild.model);

                childrenDirectives[2].nativeElement.dispatchEvent(shiftMouseEvent);
                expect(directive.navigableSelection.length).toBe(2);

                expect(children[2].selected).toBeTruthy();
                expect(children[2].activate).toBeTruthy();
            });
        });
    });
});


