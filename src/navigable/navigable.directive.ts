import {
    Directive, Input, OnInit, ElementRef, HostBinding, AfterViewInit, Output, EventEmitter,
    HostListener
} from '@angular/core';

/**
 * NavigableDirective
 *
 *
 */
@Directive({
    selector: '[navigable]'
})
export class NavigableDirective implements OnInit, AfterViewInit {

    @Input('navigable') model: any;

    @Input() navigableActivate: boolean;

    @Output() navigableOnActivation = new EventEmitter();

    @Output() navigableOnMove = new EventEmitter();

    @HostBinding('class.navigable') navigableClass: boolean = true;

    @HostBinding('class.navigable-highlight') highlighted: boolean = true;

    @HostBinding('class.navigable-selected') selected: boolean = false;

    @HostBinding('tabindex') tabindex;

    navigableSelectionValue = [];

    private arrows = {
        up: 38,
        down: 40
    };

    constructor(private el: ElementRef) {

    }

    @Input()
    get navigableSelection() {
        return this.navigableSelectionValue;
    }

    set navigableSelection(val: any[]) {
        this.navigableSelectionValue = val;
        console.log('bar');
    }

    ngOnInit(): void {
        console.log(this.navigableSelection);
        console.log('tabindex: ', this.tabindex);

        this.navigableSelection.push(this.model);
    }

    ngAfterViewInit(): void {
        console.log('this.navigableActivate: ', this.navigableActivate);
        if (this.navigableActivate) {
            this.el.nativeElement.focus();
        }
    }

    @HostListener('keydown',['$event']) onKeyDown($event:KeyboardEvent) {
        console.log($event);
        let keyCode = $event.keyCode;
        if (keyCode === this.arrows.up || keyCode === this.arrows.down) {
            let focused = this.el.nativeElement.querySelector(':focus');
            //TODO: Implement parent check, if ng-bootstrap is integrated
            if (!focused || !focused.classList.contains('dropdown-toggle') /*&& (focused.parents('.dropdown-menu').length === 0)*/) {
                $event.preventDefault();
                if ($event.ctrlKey && $event.shiftKey) {
                    /*scope.$apply(() => {
                        navigable.navigableOnMove(event, navigable.model, keyCode === arrows.up);
                    });*/
                } else {
                    /*navigable.move(keyCode, event.ctrlKey || event.shiftKey);*/
                }
            }
        }
    }

    move(direction, combine) {
        /*let items = this.items();
        let active = this.active();
        let index = items.index(active);
        let next = null;

        if (direction === this.arrows.up) {
            next = items.eq(Math.max(index - 1, 0));
        } else if (direction === this.arrows.down) {
            next = items.eq(Math.min(index + 1, items.length));
        }

        if (next && next.length) {
            if (next.hasClass('navigable-selected')) {
                this.unselect(active);
            }

            // Trigger focus on next item in order to ensure activation is performed within the right scope:
            next.data('navigable-combine', combine).focus();
        }*/
    }
}