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
	state$: Observable<string>;
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
		this.state$ = this.spinnerService.events$.pipe(
			filter(event => event.channel === this.channel),
			map(event => (event.active ? 'in' : 'out')),
			delay(0), // avoid ExpressionChangedAfterItHasBeenCheckedError when the spinner is activated during a component's initialisation process
			tap(state => {
				this.setInert(state);
				this.handleFocus(state);
			})
		);
	}

	private createFocusableElement(): HTMLElement {
		const element = this.renderer.createElement('div');
		this.renderer.addClass(element, 'cdk-visually-hidden');
		this.renderer.setAttribute(element, 'tabindex', '-1');
		return element;
	}

	private setInert(state: string): void {
		if (state === 'in') {
			this.renderer.setAttribute(this.parentElement, 'inert', '');
		} else {
			this.renderer.removeAttribute(this.parentElement, 'inert');
		}
	}

	private announceSpinnerState(state: string): void {
		void this.liveAnnouncer.announce(this.translate.instant(this.getAnnouncementText(state)));
	}

	private getAnnouncementText(state: string): string {
		if (state === 'out') {
			return 'i18n.oblique.spinner.deactivate';
		}
		return this.fixed ? 'i18n.oblique.spinner.is-fixed.activate' : 'i18n.oblique.spinner.activate';
	}

	private handleFocus(state: string): void {
		const currentFocusedElement = this.document.activeElement as HTMLElement;
		if (state === 'in') {
			this.handleFocusOnActivation(currentFocusedElement, state);
		} else {
			this.handleFocusOnDeactivation(currentFocusedElement, state);
		}
	}

	private handleFocusOnActivation(currentFocusedElement: HTMLElement, state: string): void {
		if (this.isElementInsideInertArea(currentFocusedElement)) {
			this.storedFocusedElement = currentFocusedElement;
			this.moveFocusOutsideInertArea();
		} else {
			this.announceSpinnerState(state);
		}
	}

	private isElementInsideInertArea(currentFocus: HTMLElement): boolean {
		return this.parentElement.contains(currentFocus);
	}

	private moveFocusOutsideInertArea(): void {
		this.renderer.setProperty(
			this.elementOutsideInertArea,
			'innerHTML',
			this.translate.instant(this.getAnnouncementText('in'))
		);
		this.renderer.insertBefore(this.parentElement.parentElement, this.elementOutsideInertArea, this.parentElement);
		this.elementOutsideInertArea.focus();
	}

	private handleFocusOnDeactivation(currentFocusedElement: HTMLElement, state: string): void {
		if (currentFocusedElement === this.elementOutsideInertArea) {
			this.storedFocusedElement.focus();
		}
		if (this.elementOutsideInertArea.parentElement) {
			this.removeElementOutsideInertArea();
		}
		this.announceSpinnerState(state);
	}

	private removeElementOutsideInertArea(): void {
		this.renderer.removeChild(this.elementOutsideInertArea.parentElement, this.elementOutsideInertArea);
	}
}
