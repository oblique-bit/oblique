import {Component} from '@angular/core';

@Component({
	selector: 'app-navigator-sample',
	templateUrl: './navigator-sample.component.html'
})
export class NavigatorSampleComponent {

}

@Component({
	template: `	<span class="sample-node fa fa-chevron-right"></span>
				<a class="thumbnail well" [routerLink]="['/samples/navigator/1']">Child state 1</a>
				<router-outlet></router-outlet>`
})
export class ChildState1Component {

}

@Component({
	template: `<span class="sample-node fa fa-chevron-right"></span>
				<a class="thumbnail well" [routerLink]="['/samples/navigator/1/1']">Child state 1.1</a>
				<router-outlet></router-outlet>`,
})
export class ChildState11Component {

}

@Component({
	template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 1.1.1</span>',
})
export class ChildState111Component {

}

@Component({
	template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 1.1.2</span>',
})
export class ChildState112Component {

}

@Component({
	template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 1.2</span>',
})
export class ChildState12Component {

}
