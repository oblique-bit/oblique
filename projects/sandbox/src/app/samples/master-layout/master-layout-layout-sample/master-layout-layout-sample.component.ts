import {Component, inject, output} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {type ObICollapseBreakpoints, ObMasterLayoutService} from '@oblique/oblique';
import {DynamicNavigationService} from '../dynamic-navigation.service';

@Component({
	selector: 'sb-master-layout-layout',
	imports: [
		MatCard,
		MatCardTitle,
		MatSlideToggle,
		FormsModule,
		MatFormField,
		MatCardContent,
		MatLabel,
		MatSelect,
		MatOption,
		MatInput,
	],
	templateUrl: './master-layout-layout-sample.component.html',
	styleUrl: './master-layout-layout-sample.component.scss',
})
export class MasterLayoutLayoutSampleComponent {
	readonly coverLayout = output<boolean>();
	breakpointOptions = ['xs', 'sm', 'md', 'lg', 'xl'];
	private readonly masterLayout = inject(ObMasterLayoutService);
	private readonly dynamicNavigationService = inject(DynamicNavigationService);

	get hasCover(): boolean {
		return this.masterLayout.layout.hasCover;
	}

	set hasCover(value: boolean) {
		this.coverLayout.emit(value);
		this.masterLayout.layout.hasCover = value;
	}

	get hasLayout(): boolean {
		return this.masterLayout.layout.hasLayout;
	}

	set hasLayout(value: boolean) {
		this.masterLayout.layout.hasLayout = value;
	}
	get hasMaxWidth(): boolean {
		return this.masterLayout.layout.hasMaxWidth;
	}

	set hasMaxWidth(value: boolean) {
		this.masterLayout.layout.hasMaxWidth = value;
	}

	get hasMainNavigation(): boolean {
		return this.masterLayout.layout.hasMainNavigation;
	}

	set hasMainNavigation(value: boolean) {
		this.masterLayout.layout.hasMainNavigation = value;
	}

	get hasOffCanvas(): boolean {
		return this.masterLayout.layout.hasOffCanvas;
	}

	set hasOffCanvas(value: boolean) {
		this.masterLayout.layout.hasOffCanvas = value;
	}

	set breakpoint(breakpoint: ObICollapseBreakpoints) {
		this.dynamicNavigationService.collapseBreakpoint.set(breakpoint);
	}

	get breakpoint(): ObICollapseBreakpoints {
		return this.dynamicNavigationService.collapseBreakpoint();
	}

	get homePageRoute(): string {
		return this.masterLayout.homePageRoute;
	}

	set homePageRoute(value: string) {
		this.masterLayout.homePageRoute = value;
	}
}
