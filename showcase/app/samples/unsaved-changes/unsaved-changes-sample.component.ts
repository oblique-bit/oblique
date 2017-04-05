import {Component} from '@angular/core';

@Component({
	selector: 'app-unsaved-changes',
	templateUrl: 'unsaved-changes-sample.component.html',
	// styleUrls: ['./unsaved-changes.component.css']
})
export class UnsavedChangesComponent {
	tabs = {
		one: {},
		two: {},
		three: {}
	};

	save(form) {
		console.log(form);
	}
}


// save(form) {
	// 	if (form.$valid) {
	// 		form.$setPristine();
	// 		this.notificationService.success('Form has been successfully saved!');
	// 	}
	// }

