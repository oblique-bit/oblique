import {Component, ContentChild, HostBinding, Input, OnChanges, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'or-sticky',
	exportAs: 'orSticky',
	styleUrls: ['./sticky.component.scss'],
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="sticky-header" *ngIf="stickyHeaderTemplate">
			<ng-container *ngTemplateOutlet="stickyHeaderTemplate"></ng-container>
		</div>
		<div class="sticky-main">
			<div class="sticky" [ngClass]="nestedSize"
				 *ngIf="stickyHeaderTemplate && stickyFooterTemplate; else mainContent">
				<div class="sticky-main">
					<ng-container *ngTemplateOutlet="mainContent"></ng-container>
				</div>
				<div class="sticky-footer" *ngIf="stickyFooterTemplate">
					<ng-container *ngTemplateOutlet="stickyFooterTemplate"></ng-container>
				</div>
			</div>
		</div>
		<div class="sticky-footer" *ngIf="!stickyHeaderTemplate && stickyFooterTemplate">
			<ng-container *ngTemplateOutlet="stickyFooterTemplate"></ng-container>
		</div>

		<ng-template #mainContent>
			<ng-container *ngTemplateOutlet="stickyMainTemplate"></ng-container>
		</ng-template>
	`
})
export class StickyComponent implements OnInit, OnChanges {
	@ContentChild('orStickyHeader') readonly stickyHeaderTemplate: TemplateRef<any>;
	@ContentChild('orStickyMain') readonly stickyMainTemplate: TemplateRef<any>;
	@ContentChild('orStickyFooter') readonly stickyFooterTemplate: TemplateRef<any>;
	@Input() headerSize: string;
	@Input() footerSize: string;
	@HostBinding('class') @Input('class') hostClass: string;
	nestedSize = '';

	private static readonly acceptedSizes = ['sm', 'md', 'lg'];
	private initialClass: string;

	ngOnInit(): void {
		this.initialClass = this.hostClass;
	}

	ngOnChanges(): void {
		if ((this.headerSize && StickyComponent.acceptedSizes.indexOf(this.headerSize) === -1)
			|| (this.footerSize && StickyComponent.acceptedSizes.indexOf(this.footerSize) === -1)) {
			throw new Error(`"${this.headerSize}" is not a valid size.Only "lg", "md" and "sm" are acceptable alternatives.`);
		}

		if (this.stickyHeaderTemplate) {
			this.hostClass = this.setClassList(this.headerSize);
			if (this.stickyFooterTemplate) {
				this.nestedSize = 'sticky-' + this.footerSize;
			}
		} else if (this.stickyFooterTemplate) {
			this.hostClass = this.setClassList(this.footerSize);
		} else {
			this.hostClass = this.setClassList();
		}
	}

	private setClassList(size?: string): string {
		const classList = ['sticky'];
		if (size && size !== 'md') {
			classList.push(`sticky-${size}`);
		}
		if (this.initialClass) {
			classList.unshift(this.initialClass);
		}
		return classList.join(' ');
	}
}
