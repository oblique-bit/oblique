import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ObMasterLayoutService} from '@oblique/oblique';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {AppStateService} from '../../../app-state.service';

@Component({
	selector: 'sb-master-layout-header-sample',
	imports: [MatCardModule, MatSlideToggleModule, FormsModule],
	templateUrl: './master-layout-header-sample.component.html',
	styleUrl: './master-layout-header-sample.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class MasterLayoutHeaderSampleComponent {
	readonly appState = inject(AppStateService);
	readonly showCustomHeader = this.appState.showCustomHeader;
	readonly showCustomHeaderLogo = this.appState.showCustomHeaderLogo;
	private readonly masterLayout = inject(ObMasterLayoutService);

	get isCustom(): boolean {
		return this.masterLayout.header.isCustom;
	}

	set isCustom(value: boolean) {
		this.masterLayout.header.isCustom = value;
	}

	setShowCustomHeader(value: boolean): void {
		this.appState.showCustomHeader.set(value);
		this.masterLayout.header.isCustom = value;
	}

	get isSticky(): boolean {
		return this.masterLayout.header.isSticky;
	}

	set isSticky(value: boolean) {
		this.masterLayout.header.isSticky = value;
	}

	get isSmall(): boolean {
		return this.masterLayout.header.isSmall;
	}

	set isSmall(value: boolean) {
		this.masterLayout.header.isSmall = value;
	}
}
