import {Directive, Input, EventEmitter, Output} from "@angular/core";


/**
 * NavigableGroupDirective
 *
 *
 */
@Directive({
    selector: '[navigableGroup]'
})
export class NavigableGroupDirective {

    private navigableGroupValue: any[];

    @Output() navigableGroupChange = new EventEmitter();

    @Input()
    get navigableGroup() {
        return this.navigableGroupValue;
    }

    set navigableGroup(val: any[]) {
        this.navigableGroupValue = val;
        this.navigableGroupChange.emit(this.navigableGroupValue);
        console.log(this.navigableGroupValue);
    }

}