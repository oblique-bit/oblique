import {Component, inject} from '@angular/core';
import {ObMasterLayoutService} from '@oblique/oblique';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';

@Component({
	selector: 'sb-master-layout-footer-sample',
	imports: [MatCard, MatCardContent, MatCardTitle, MatSlideToggle, FormsModule],
	templateUrl: './master-layout-footer-sample.component.html',
	styleUrl: './master-layout-footer-sample.component.scss',
})
export class MasterLayoutFooterSampleComponent {
	private readonly masterLayout = inject(ObMasterLayoutService);

	get isCustom(): boolean {
		return this.masterLayout.footer.isCustom;
	}

	set isCustom(value: boolean) {
		this.masterLayout.footer.isCustom = value;
	}

	get isSticky(): boolean {
		return this.masterLayout.footer.isSticky;
	}

	set isSticky(value: boolean) {
		this.masterLayout.footer.isSticky = value;
	}
}
