import {Component, inject} from '@angular/core';
import {ObMasterLayoutService} from '@oblique/oblique';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';

@Component({
	selector: 'sb-master-layout-header-sample',
	imports: [MatCardModule, MatSlideToggleModule, FormsModule],
	templateUrl: './master-layout-header-sample.component.html',
	styleUrl: './master-layout-header-sample.component.scss',
})
export class MasterLayoutHeaderSampleComponent {
	private readonly masterLayout = inject(ObMasterLayoutService);

	get isCustom(): boolean {
		return this.masterLayout.header.isCustom;
	}

	set isCustom(value: boolean) {
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
