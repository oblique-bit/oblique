import {Component} from '@angular/core';

@Component({
	selector: 'ob-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss']
})
export class ObCardComponent {
	avatarVisible = true;
	titleVisible = true;
	subtitleVisible = true;
	headerVisible = true;
	pictureVisible = true;
	contentVisible = true;
	actionsVisible = true;

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
}
