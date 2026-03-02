import {AsyncPipe} from '@angular/common';
import {Component, DOCUMENT, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {delay, filter, map, tap} from 'rxjs/operators';
import {ObSpinnerService} from './spinner.service';

@Component({
	selector: 'ob-spinner',
	imports: [AsyncPipe, MatIconModule],
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss', './spinner-animations.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-spinner', '[attr.aria-hidden]': 'true'},
	exportAs: 'obSpinner',
})
export class ObSpinnerComponent implements OnInit {
	@Input() channel: string = ObSpinnerService.CHANNEL;
	@Input() fixed = false;
	isActive$: Observable<boolean>;
	storedFocusedElement: HTMLElement;
	elementOutsideInertArea: HTMLElement;

	private readonly renderer = inject(Renderer2);
	private readonly spinnerService = inject(ObSpinnerService);
	private readonly element = inject(ElementRef);
	private readonly document = inject(DOCUMENT);
	private readonly liveAnnouncer = inject(LiveAnnouncer);
	private readonly translate = inject(TranslateService);
	private readonly parentElement = this.element.nativeElement.parentElement;

	ngOnInit(): void {
		this.element.nativeElement.parentElement.classList.add('ob-has-overlay');
		this.elementOutsideInertArea = this.createFocusableElement();
		this.isActive$ = this.spinnerService.events$.pipe(
			filter(event => event.channel === this.channel),
			map(event => event.active),
			delay(0), // avoid ExpressionChangedAfterItHasBeenCheckedError when the spinner is activated during a component's initialisation process
			tap((isActive: boolean) => {
				this.setInert(isActive);
				this.handleFocus(isActive);
			})
		);
	}

	private createFocusableElement(): HTMLElement {
		const element = this.renderer.createElement('div');
		this.renderer.addClass(element, 'cdk-visually-hidden');
		this.renderer.setAttribute(element, 'tabindex', '-1');
		return element;
	}

	private setInert(isActive: boolean): void {
		if (isActive) {
			this.renderer.setAttribute(this.parentElement, 'inert', '');
		} else {
			this.renderer.removeAttribute(this.parentElement, 'inert');
		}
	}

	private announceSpinnerState(isActive: boolean): void {
		void this.liveAnnouncer.announce(this.translate.instant(this.getAnnouncementText(isActive)));
	}

	private getAnnouncementText(isActive: boolean): string {
		if (!isActive) {
			return 'i18n.oblique.spinner.deactivate';
		}
		return this.fixed ? 'i18n.oblique.spinner.is-fixed.activate' : 'i18n.oblique.spinner.activate';
	}

	private handleFocus(isActive: boolean): void {
		const currentFocusedElement = this.document.activeElement as HTMLElement;
		if (isActive) {
			this.handleFocusOnActivation(currentFocusedElement, isActive);
		} else {
			this.handleFocusOnDeactivation(currentFocusedElement, isActive);
		}
	}

	private handleFocusOnActivation(currentFocusedElement: HTMLElement, isActive: boolean): void {
		if (this.isElementInsideInertArea(currentFocusedElement)) {
			this.storedFocusedElement = currentFocusedElement;
			this.moveFocusOutsideInertArea();
		} else {
			this.announceSpinnerState(isActive);
		}
	}

	private isElementInsideInertArea(currentFocus: HTMLElement): boolean {
		return this.parentElement.contains(currentFocus);
	}

	private moveFocusOutsideInertArea(): void {
		this.renderer.setProperty(
			this.elementOutsideInertArea,
			'innerHTML',
			this.translate.instant(this.getAnnouncementText(true))
		);
		this.renderer.insertBefore(this.parentElement.parentElement, this.elementOutsideInertArea, this.parentElement);
		this.elementOutsideInertArea.focus();
	}

	private handleFocusOnDeactivation(currentFocusedElement: HTMLElement, isActive: boolean): void {
		if (currentFocusedElement === this.elementOutsideInertArea) {
			this.storedFocusedElement.focus();
		}
		if (this.elementOutsideInertArea.parentElement) {
			this.removeElementOutsideInertArea();
		}
		this.announceSpinnerState(isActive);
	}

	private removeElementOutsideInertArea(): void {
		this.renderer.removeChild(this.elementOutsideInertArea.parentElement, this.elementOutsideInertArea);
	}
}
