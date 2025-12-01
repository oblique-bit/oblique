import {Component, inject} from '@angular/core';
import {
	ObAlertModule,
	ObButtonModule,
	ObEIcon,
	ObEToggleType,
	ObInputClearModule,
	ObNotificationModule,
	ObNotificationService,
	ObPopoverModule,
	WINDOW,
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
import {type Observable, combineLatestWith, map, startWith} from 'rxjs';
import {iconMetadata} from './icons';
import {ObECategory} from './categories.model';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatDivider} from '@angular/material/divider';
import {MatDialog} from '@angular/material/dialog';
import {IconDialogComponent} from './icon-dialog/icon-dialog.component';
import type {IconMetadata} from './icons.model';
import {MarkifyPipe} from '../../../../../shared/markify/markify.pipe';

@Component({
	selector: 'app-icons-example-icons-gallery-preview',
	imports: [
		MarkifyPipe,
		CommonModule,
		MatIconModule,
		MatButtonModule,
		ObButtonModule,
		MatCardModule,
		MatExpansionModule,
		MatSelectModule,
		ObPopoverModule,
		TranslateModule,
		MatTooltipModule,
		MatChipsModule,
		ObNotificationModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		ObInputClearModule,
		ObAlertModule,
		MatDivider,
	],
	templateUrl: './icons-example-icons-gallery-preview.component.html',
	styleUrl: './icons-example-icons-gallery-preview.component.scss',
})
export class IconsExampleIconsGalleryPreviewComponent {
	iconsFilter = new FormControl('');
	byCategoryFilter = new FormControl('ALL');
	filteredIcons$: Observable<ObEIcon[][]>;
	isInfoCardVisible = false;
	showDialog = false;
	selectedIconName: string;
	selectedIconMetaData: IconMetadata;
	selectedCategory: string;

	protected readonly toggleType = ObEToggleType.CLICK;
	protected readonly icons = Object.values(ObEIcon);
	protected readonly obECategory: typeof ObECategory = ObECategory;
	protected readonly iconMetadata = iconMetadata;
	private readonly notificationService = inject(ObNotificationService);
	private readonly translateService = inject(TranslateService);
	private readonly dialog = inject(MatDialog);
	private readonly window: Window = inject(WINDOW);

	constructor() {
		this.filteredIcons$ = this.setUpIconsFilter();
	}

	public copy(text: string, element = 'Icon name'): void {
		const timeoutDuration = 4000;
		navigator.clipboard.writeText(text).then(
			() =>
				this.notificationService.success({
					message: this.translateService.instant('i18n.icons.copy.notification.success.message', {
						iconName: text,
					}) as string,
					title: this.translateService.instant('i18n.icons.copy.notification.success.title', {element}) as string,
					timeout: timeoutDuration,
				}),
			() =>
				this.notificationService.warning({
					message: this.translateService.instant('i18n.icons.notification.error.message', {iconName: text}) as string,
					title: this.translateService.instant('i18n.icons.notification.error.title', {element}) as string,
					timeout: timeoutDuration,
				})
		);
	}

	public isButtonActive(iconName: string): string {
		return iconName === this.selectedIconName && this.isInfoCardVisible ? 'secondary' : 'tertiary';
	}

	public showIconMetaData(iconName: string): void {
		this.toggleSelectedIcon(iconName);
		this.selectedIconMetaData = this.getMetaDataOfIcon(this.selectedIconName);
		if (this.showDialog) {
			this.openDialog();
		}
	}

	public getMetaDataOfIcon(iconName: string): IconMetadata {
		return iconMetadata.find(icon => icon.name === iconName);
	}

	private openDialog(): void {
		const dialogWidth = this.window.innerWidth > 650 ? '450px' : null;
		this.dialog.open(IconDialogComponent, {
			data: this.selectedIconMetaData,
			width: dialogWidth,
		});
	}

	private toggleSelectedIcon(iconName: string): void {
		this.isInfoCardVisible = iconName === this.selectedIconName ? !this.isInfoCardVisible : true;
		this.selectedIconName = iconName;
		this.showDialog = this.window.innerWidth < 1200;
	}

	private setUpIconsFilter(): Observable<ObEIcon[][]> {
		return this.iconsFilter.valueChanges.pipe(
			startWith(null),
			map(filter => (filter ? filter.trim() : filter)),
			combineLatestWith(this.byCategoryFilter.valueChanges.pipe(startWith('ALL'))),
			map(([filter, category]) => {
				return this.filterIcons(this.icons, category, filter);
			})
		);
	}

	private filterIcons(icons: ObEIcon[], category: string, filter: string): ObEIcon[][] {
		const categoryMatches = icons.filter(iconName => {
			const trimmedIconName = iconName.trim();
			return this.matchCategory(category, trimmedIconName);
		});

		const matches = Object.groupBy(categoryMatches, (iconName: string) => {
			const trimmedIconName = iconName.trim();
			if (this.matchFilterAgainstName(filter, trimmedIconName)) {
				return 'nameMatch';
			} else if (this.matchFilterAgainstAliases(filter, trimmedIconName)) {
				return 'aliasMatch';
			}
			return 'none';
		}) as {nameMatch: ObEIcon[]; aliasMatch: ObEIcon[]; none: ObEIcon[]};

		const groups = Object.groupBy([...(matches.nameMatch || []), ...(matches.aliasMatch || [])], (iconName: string) => {
			const iconCategory = this.getMetaDataOfIcon(iconName).category as ObECategory;
			return iconCategory === ObECategory.DEPRECATED_ICONS ? 'deprecatedIcons' : 'icons';
		}) as {icons: ObEIcon[]; deprecatedIcons: ObEIcon[]};

		return [groups.icons || [], groups.deprecatedIcons || []];
	}

	private matchFilterAgainstName(filter: string, iconName: string): boolean {
		return filter === null || this.match(filter.toLowerCase(), iconName.toLowerCase());
	}

	private matchFilterAgainstAliases(filter: string, iconName: string): boolean {
		const metaData = this.getMetaDataOfIcon(iconName);
		const aliases = metaData.aliases ?? [];
		return filter === null || aliases.some(alias => this.match(filter.toLowerCase(), alias.trim()));
	}

	private matchCategory(category: string, iconName: string): boolean {
		return category === 'ALL' || iconMetadata.some(item => item.name === iconName && item.category === category);
	}

	private match(search: string, text: string): boolean {
		const searchTokens = this.getTokens(search);
		const textTokens = this.getTokens(text);

		return (
			textTokens.join(' ').includes(searchTokens.join(' ')) ||
			searchTokens.some(searchToken => textTokens.includes(searchToken))
		);
	}

	private getTokens(text: string): string[] {
		return text.split(/[-_ ]/u);
	}
}
