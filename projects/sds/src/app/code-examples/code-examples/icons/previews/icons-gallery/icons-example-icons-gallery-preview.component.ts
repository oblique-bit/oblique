import {Component, inject} from '@angular/core';
import {
	ObButtonModule,
	ObEIcon,
	ObEToggleType,
	ObInputClearModule,
	ObNotificationModule,
	ObNotificationService,
	ObPopoverModule
} from '@oblique/oblique';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {type Observable, map, startWith} from 'rxjs';

@Component({
	selector: 'app-icons-example-icons-gallery-preview',
	templateUrl: './icons-example-icons-gallery-preview.component.html',
	styleUrl: './icons-example-icons-gallery-preview.component.scss',
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		ObButtonModule,
		MatCardModule,
		MatExpansionModule,
		ObPopoverModule,
		TranslateModule,
		MatTooltipModule,
		ObNotificationModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		ObInputClearModule
	]
})
export class IconsExampleIconsGalleryPreviewComponent {
	iconsFilter = new FormControl('');
	filteredIcons$: Observable<ObEIcon[]>;

	protected readonly toggleType = ObEToggleType.CLICK;
	private readonly icons = Object.values(ObEIcon);
	private readonly notificationService = inject(ObNotificationService);
	private readonly translateService = inject(TranslateService);

	constructor() {
		this.filteredIcons$ = this.setUpIconsFilter();
	}

	public copy(text: string, element = 'Icon name'): void {
		const timeoutDuration = 4000;
		navigator.clipboard.writeText(text).then(
			() =>
				this.notificationService.success({
					message: this.translateService.instant('i18n.icons.copy.notification.success.message', {iconName: text}) as string,
					title: this.translateService.instant('i18n.icons.copy.notification.success.title', {element}) as string,
					timeout: timeoutDuration
				}),
			() =>
				this.notificationService.warning({
					message: this.translateService.instant('i18n.icons.notification.error.message', {iconName: text}) as string,
					title: this.translateService.instant('i18n.icons.notification.error.title', {element}) as string,
					timeout: timeoutDuration
				})
		);
	}

	private setUpIconsFilter(): Observable<ObEIcon[]> {
		return this.iconsFilter.valueChanges.pipe(
			map(txt => this.filterIcons(txt)),
			startWith(this.icons)
		);
	}

	private filterIcons(text: string): ObEIcon[] {
		return this.icons.filter(iconName => iconName.toLowerCase().includes(text?.toLowerCase()));
	}
}
