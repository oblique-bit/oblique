import {Component, ViewChild} from '@angular/core';
import {ObSelectableGroupDirective} from '@oblique/oblique';

@Component({
	selector: 'ob-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss']
})
export class ObCardComponent {
	@ViewChild(ObSelectableGroupDirective) selectableGroup: ObSelectableGroupDirective;
	avatarVisible = true;
	titleVisible = true;
	subtitleVisible = true;
	headerVisible = true;
	pictureVisible = true;
	contentVisible = true;
	actionsVisible = true;
	checkboxMode = true;

	toggleAvatarVisibility(): void {
		this.avatarVisible = !this.avatarVisible;
	}

	toggleTitleVisibility(): void {
		this.titleVisible = !this.titleVisible;
	}

	toggleSubtitleVisibility(): void {
		this.subtitleVisible = !this.subtitleVisible;
	}

	toggleHeaderVisibility(): void {
		this.headerVisible = !this.headerVisible;
	}

	togglePictureVisibility(): void {
		this.pictureVisible = !this.pictureVisible;
	}

	toggleContentVisibility(): void {
		this.contentVisible = !this.contentVisible;
	}

	toggleActionsVisibility(): void {
		this.actionsVisible = !this.actionsVisible;
	}

	toggleCheckboxMode(): void {
		this.checkboxMode = !this.checkboxMode;
		this.selectableGroup.mode = this.getSelectMode();
	}

	getSelectMode(): 'checkbox' | 'radio' {
		return this.checkboxMode ? 'checkbox' : 'radio';
	}
}
