import {ComponentRef, ElementRef, Injectable, Injector, effect, inject} from '@angular/core';
import {ConnectedPosition, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {TourOverlayComponent} from '../tour-overlay/tour-overlay.component';
import {ObTourStep} from '../models/tour-step.model';
import {ObtTourService} from './tour.service';

@Injectable({providedIn: 'root'})
export class ObtTourOverlayService {
	private readonly overlay = inject(Overlay);
	private readonly injector = inject(Injector);
	private readonly tourService = inject(ObtTourService);
	private highlightedElement: HTMLElement | null = null;
	private overlayRef: OverlayRef | null = null;

	private componentRef: ComponentRef<TourOverlayComponent> | null = null;
	private readonly positionsRelative: ConnectedPosition[] = [
		{originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8},
		{originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8},
		{originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8},
		{originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8}
	];

	constructor() {
		effect(
			() => {
				const currentStep = this.tourService.currentStep();
				if (currentStep) {
					void this.open(currentStep);
				} else {
					this.close();
				}
			},
			{injector: this.injector}
		);
	}

	private async open(tourStep: ObTourStep): Promise<void> {
		this.close();

		const target = this.resolveTarget(tourStep);

		if (target) {
			await this.scrollToTarget(target);
			this.highlightTarget(target);
			this.createOverlayRelativeToTarget(target);
		} else {
			this.createOverlayCentered();
		}
	}

	private scrollToTarget(element: HTMLElement): Promise<void> {
		return new Promise(resolve => {
			if (!element) {
				resolve();
				return;
			}

			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center'
			});

			setTimeout(() => resolve(), 500);
		});
	}

	private resolveTarget(tourStep: ObTourStep): HTMLElement | null {
		const {elementSelector, elementRef} = tourStep.target ?? {};

		if (typeof elementRef === 'function') {
			const possibleValue = elementRef();

			if (possibleValue && '_elementRef' in possibleValue) {
				// eslint-disable-next-line no-underscore-dangle
				return (possibleValue as any)._elementRef.nativeElement;
			}

			if (possibleValue instanceof ElementRef) {
				return possibleValue.nativeElement;
			}
			if ((possibleValue as any) instanceof HTMLElement) {
				return possibleValue;
			}
		}

		if (elementSelector?.trim()) {
			return document.querySelector<HTMLElement>(`#${elementSelector.trim()}`);
		}

		return null;
	}

	private createOverlayRelativeToTarget(target: HTMLElement): void {
		const positionStrategy = this.overlay
			.position()
			.flexibleConnectedTo(target)
			.withPositions(this.positionsRelative)
			.withFlexibleDimensions(false)
			.withPush(false);

		this.overlayRef = this.overlay.create({
			positionStrategy,
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
			hasBackdrop: false,
			panelClass: ['obt-tour-overlay-panel']
		});

		const portal = new ComponentPortal(TourOverlayComponent, null, this.injector);
		this.componentRef = this.overlayRef.attach(portal);

		const positionChangeSub = positionStrategy.positionChanges.subscribe(change => {
			const {overlayX, overlayY} = change.connectionPair;
			this.updateArrowDirection(overlayX, overlayY);
		});

		this.componentRef.instance.closeEmitter.subscribe(() => {
			positionChangeSub.unsubscribe();
			this.close();
		});
	}

	private updateArrowDirection(overlayX: 'start' | 'center' | 'end', overlayY: 'top' | 'center' | 'bottom'): void {
		let arrow: 'arrow-top' | 'arrow-bottom' | 'arrow-left' | 'arrow-right' = 'arrow-top';

		if (overlayY === 'top') {
			arrow = 'arrow-top';
		} else if (overlayY === 'bottom') {
			arrow = 'arrow-bottom';
		} else if (overlayX === 'start') {
			arrow = 'arrow-left';
		} else if (overlayX === 'end') {
			arrow = 'arrow-right';
		}

		if (this.componentRef) {
			this.componentRef.instance.arrowPosition = arrow;
		}
	}

	private highlightTarget(element: HTMLElement): void {
		this.removeHighlight();

		element.style.boxShadow = '0 0 0 3px #8655F6FF';
		element.style.transition = 'box-shadow 0.5s ease, outline 0.3s ease';
		element.style.position ||= 'relative';
		element.style.zIndex = '10';

		this.highlightedElement = element;
	}

	private removeHighlight(): void {
		if (this.highlightedElement) {
			const element = this.highlightedElement;
			element.style.boxShadow = '';
			element.style.outline = '';
			element.style.outlineOffset = '';
			element.style.transition = '';
			element.style.zIndex = '';
			this.highlightedElement = null;
		}
	}

	private createOverlayCentered(): void {
		const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

		this.overlayRef = this.overlay.create({
			positionStrategy,
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
			hasBackdrop: false,
			disposeOnNavigation: true,
			panelClass: ['obt-tour-overlay-panel', 'obt-tour-overlay-center']
		});

		this.attachComponent();
		if (this.componentRef) {
			this.componentRef.instance.arrowPosition = 'arrow-none';
		}
	}

	private attachComponent(): void {
		if (!this.overlayRef) {
			return;
		}
		const portal = new ComponentPortal(TourOverlayComponent, null, this.injector);
		this.componentRef = this.overlayRef.attach(portal);
		this.componentRef.instance.closeEmitter.subscribe(() => this.close());
	}

	private close(): void {
		this.removeHighlight();
		this.overlayRef?.dispose();
		this.overlayRef = null;
		this.componentRef = null;
	}
}
