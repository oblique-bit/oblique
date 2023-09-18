import {MatPaginatorSelectConfig} from '@angular/material/paginator';
import {MatSelect} from '@angular/material/select';

export class ObSelectPanelClassHelper {
	private static readonly obSelectPanelClass = 'ob-select-panel';
	private static readonly obSelectPanelSmallClass = `${this.obSelectPanelClass}-sm`;
	private static readonly obSmallFormClasses: string[] = ['.ob-form-sm', '.mat-form-field-sm'];

	static ensureAdditionalClassesAreIncluded(host: HTMLElement, select: SelectType): void {
		this.ensureObSelectIsIncluded(select);
		this.ensureObSelectSmallIsIncluded(host, select);
	}

	private static addClass(select: SelectType, className: string): void {
		if (select.panelClass) {
			if (typeof select.panelClass === 'string') {
				select.panelClass += ` ${className}`;
			} else if (typeof select.panelClass === 'object') {
				if (Array.isArray(select.panelClass)) {
					select.panelClass.push(className);
				} else if (select.panelClass instanceof Set) {
					select.panelClass.add(className);
				} else {
					select.panelClass = {...select.panelClass, [className]: true};
				}
			}
		} else {
			select.panelClass = className;
		}
	}

	private static addObSelect(select: SelectType): void {
		this.addClass(select, this.obSelectPanelClass);
	}

	private static addObSelectSmall(select: SelectType): void {
		this.addClass(select, this.obSelectPanelSmallClass);
	}

	private static ensureObSelectIsIncluded(select: SelectType): void {
		if (!this.isObSelectIncluded(select)) {
			this.addObSelect(select);
		}
	}

	private static ensureObSelectSmallIsIncluded(host: HTMLElement, select: SelectType): void {
		if (this.isSmall(host) && !this.isObSelectSmallIncluded(select)) {
			this.addObSelectSmall(select);
		}
	}

	private static isClassIncluded(select: SelectType, className: string): boolean {
		if (select.panelClass) {
			if (typeof select.panelClass === 'string') {
				return select.panelClass.includes(className);
			} else if (typeof select.panelClass === 'object') {
				if (Array.isArray(select.panelClass)) {
					return select.panelClass.includes(className);
				} else if (select.panelClass instanceof Set) {
					return select.panelClass.has(className);
				}

				return Object.keys(select.panelClass).includes(className);
			}
		}

		return false;
	}

	private static isObSelectIncluded(select: SelectType): boolean {
		return this.isClassIncluded(select, this.obSelectPanelClass);
	}

	private static isObSelectSmallIncluded(select: SelectType): boolean {
		return this.isClassIncluded(select, this.obSelectPanelSmallClass);
	}

	private static isSmall(host: HTMLElement): boolean {
		return this.obSmallFormClasses.map(className => !!host.closest(className)).reduce((previous, current) => previous || current);
	}
}

type SelectType = MatSelect | MatPaginatorSelectConfig;
