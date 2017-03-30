import {Component} from '@angular/core';
import {NavigableOnMoveEvent} from '../../../../src/navigable/navigable.directive';

@Component({
	selector: 'navigable-sample',
	templateUrl: './navigable-sample.component.html',
	styleUrls: ['./navigable-sample.component.css']
})
export class NavigableSampleComponent {

	scientistsSelection: any[] = [];
	lockedScientists: any[] = [];
	highlightedScientist: any = null;
	scientists: any[] = [
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
	currentScientist: any = null;
	logs = [];

	// Activation:
	onActivation(scientist: any) {
		this.log(`Activated: ${scientist.firstname}`);
	}

	isActivated(scientist: any) {
		return this.currentScientist === scientist
	}

	activate(scientist: any) {
		this.currentScientist = scientist
	}

	// Selection:
	isSelected(scientist: any) {
		return this.scientistsSelection.indexOf(scientist) !== -1;
	}

	// Move:
	onMove(event: NavigableOnMoveEvent, scientist: any) {
		if (this.isLocked(scientist)) {
			// Prevent item to be moved:
			event.prevented = true;
			this.log(`Move: ${scientist.firstname} [PREVENTED]`);
		} else {
			/* Discard event, let item be moved! */
			this.log(`Move: ${scientist.firstname}`);
		}
	}

	// Highlight:
	isHighlighted(scientist: any) {
		return this.highlightedScientist === scientist;
	}

	highlight(scientist: any) {
		this.highlightedScientist = this.isHighlighted(scientist) ? null : scientist;

		if (this.highlightedScientist) {
			this.log(`Highlighted: ${scientist.firstname}`);
		}
	}

	// Lock:
	isLocked(scientist: any) {
		return this.lockedScientists.indexOf(scientist) !== -1;
	}

	lock(scientist: any) {
		if (this.isLocked(scientist)) {
			this.lockedScientists.splice(this.lockedScientists.indexOf(scientist), 1);
			this.log(`Unlocked: ${scientist.firstname}`);
		} else {
			this.lockedScientists.push(scientist);
			this.log(`Locked: ${scientist.firstname}`);
		}
	}

	// Remove:
	remove(scientist: any) {
		this.scientistsSelection.splice(this.scientistsSelection.indexOf(scientist), 1);
		this.scientists.splice(this.scientists.indexOf(scientist), 1);
		this.log(`Removed: ${scientist.firstname}`);
	}

	// Debug:
	log(message: string) {
		this.logs.unshift(`${this.logs.length} - ${message}`);
	}
}
