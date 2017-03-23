import {Component} from '@angular/core';
import {NavigableOnMoveEvent} from "../../../../src/navigable/navigable.directive";

@Component({
	selector: 'navigable-sample',
	templateUrl: './navigable.sample.component.html',
	styleUrls: ['./navigable.sample.component.css']
})
export class NavigableSampleComponent {

	scientistsSelection:any[] = [];
	scientists:any[] = [
		{
			firstname: 'Albert',
			lastname: 'Einstein',
			birthdate: '14.03.1879'
		},
		{
			firstname: 'Nikola',
			lastname: 'Tesla',
			birthdate: '10.07.1856'
		},
		{
			firstname: 'Louis',
			lastname: 'Pasteur',
			birthdate: '27.12.1822'
		},
		{
			firstname: 'Isaac',
			lastname: 'Newton',
			birthdate: '04.01.1643'
		},
		{
			firstname: 'Galileo',
			lastname: 'Galilei',
			birthdate: '15.02.1564'
		}
	];

	// Activation:
	onActivation(scientist:any) {
		this.log(`${this.logs.length} - Activated: ${scientist.firstname}`);
	}

	isActivated(scientist:any) {
		return this.scientistsSelection.indexOf(scientist) !== -1;
	}

	activate(scientist:any) {
		if(this.isActivated(scientist)) {
			this.scientistsSelection.splice(this.scientistsSelection.indexOf(scientist), 1);
		} else {
			this.scientistsSelection.push(scientist);
		}
	}

	// Move:
	onMove(event: NavigableOnMoveEvent, scientist:any) {
		if(this.isLocked(scientist)){
			// Prevent item to be moved:
			event.prevented = true;
			this.log(`${this.logs.length} - Move: ${scientist.firstname} [PREVENTED]`);
		}
	}

	// Highlight:
	highlightedScientist: any = null;

	isHighlighted(scientist:any) {
		return this.highlightedScientist === scientist;
	}

	highlight(scientist:any) {
		this.highlightedScientist = this.isHighlighted(scientist) ? null : scientist;

		if(this.highlightedScientist) {
			this.log(`${this.logs.length} - Highlighted: ${scientist.firstname}`);
		}
	}

	// Lock:
	lockedScientists:any[] = [];

	isLocked(scientist:any) {
		return this.lockedScientists.indexOf(scientist) !== -1;
	}

	lock(scientist:any) {
		if(this.isLocked(scientist)) {
			this.lockedScientists.splice(this.lockedScientists.indexOf(scientist), 1);
		} else {
			this.lockedScientists.push(scientist);
		}
	}

	// Remove:
	remove(scientist:any) {
		this.scientistsSelection.splice(this.scientistsSelection.indexOf(scientist), 1);
		this.scientists.splice(this.scientists.indexOf(scientist), 1);
	}

	// Debug:
	logs = [];
	log(message:string) {
		setTimeout(() => {
			this.logs.unshift(message);
		}, 0);
	}
}
