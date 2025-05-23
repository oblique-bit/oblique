import {Component, viewChild} from '@angular/core';
import {ObSelectableGroupDirective} from '@oblique/oblique';

@Component({
	selector: 'sb-card',
	templateUrl: './card.component.html',
	styleUrl: './card.component.scss',
	standalone: false
})
export class CardComponent {
	readonly selectableGroup = viewChild(ObSelectableGroupDirective);
	avatarVisible = true;
	titleVisible = true;
	subtitleVisible = true;
	headerVisible = true;
	pictureVisible = true;
	contentVisible = true;
	actionsVisible = true;
	checkboxMode = true;
	alertVisible = true;
	disabled = false;
	signatureVisible = true;

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
		this.selectableGroup().mode = this.getSelectMode();
	}

	toggleAlertVisibility(): void {
		this.alertVisible = !this.alertVisible;
	}

	toggleDisabledMode(): void {
		this.disabled = !this.disabled;
	}

	toggleSignature(): void {
		this.signatureVisible = !this.signatureVisible;
	}

	getSelectMode(): 'checkbox' | 'radio' {
		return this.checkboxMode ? 'checkbox' : 'radio';
	}
}
