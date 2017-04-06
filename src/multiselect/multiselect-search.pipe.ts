import {Pipe, PipeTransform} from '@angular/core';
import {MultiselectComponent} from './multiselect.component';

@Pipe({
    name: 'searchFilter'
})
export class MultiselectSearchPipe implements PipeTransform {

    constructor(private multiselectDropdown: MultiselectComponent) {

    }

    transform(options: any[], searchString: string): any[] {
        searchString = searchString || '';
        /*const matchPredicate = (option) => option.name.toLowerCase().indexOf((args || '').toLowerCase()) > -1,
            getChildren = (option) => options.filter(child => child.parentId === option.id),
            getParent = (option) => options.find(parent => option.parentId === parent.id);
        return options.filter((option) => {
            return matchPredicate(option) ||
                (typeof (option) === 'undefined' && getChildren(option).some(matchPredicate)) ||
                (typeof (option) !== 'undefined' && matchPredicate(getParent(option)));
        });*/
        return options.filter((option) => {
           return this.multiselectDropdown.formatOptionForLabel(option).toLowerCase().indexOf(searchString.toLowerCase()) > -1;
        });
    }
}
