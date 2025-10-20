import {ComponentRef, ElementRef, Injectable, Injector, inject} from '@angular/core';
import {ConnectedPosition, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {TourOverlayComponent} from '../tour-overlay/tour-overlay.component';
import {ObtArrowDirection, ObtTourStep} from '../models/tour.model';
import {FlexibleConnectedPositionStrategy} from '@angular/cdk/overlay';

@Injectable({providedIn: 'root'})
export class ObtTourOverlayService {
	private readonly overlay = inject(Overlay);

	private overlayRef: OverlayRef | null = null;
	private componentRef: ComponentRef<TourOverlayComponent> | null = null;
	private highlightedElement: HTMLElement | null = null;
	private originalZIndex = '';

	private originalPosition = '';

	private readonly positionsRelative: ConnectedPosition[] = [
		{originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -16},
		{originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 16},
		{originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -16},
		{originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 16}
	];

	async openOverlayForStep(tourStep: ObtTourStep, componentInjector: Injector): Promise<void> {
		const target = this.resolveTarget(tourStep);

		if (target) {
			await this.scrollToTarget(target);
			this.highlightTarget(target, tourStep.target?.zIndex?.toString() ?? '10');
			this.createOverlayRelativeToTarget(target, componentInjector);
			return;
		}

		this.createOverlayCentered(componentInjector);
	}

	closeOverlay(): void {
		this.removeHighlight();
		this.overlayRef?.dispose();
		this.overlayRef = null;
		this.componentRef = null;
	}

	private resolveTarget(tourStep: ObtTourStep): HTMLElement | null {
		const {elementSelector, elementRef} = tourStep.target ?? {};
		if (typeof elementRef === 'function' && elementRef()) {
			const possibleValue = elementRef();
			if (possibleValue instanceof ElementRef) {
				return possibleValue.nativeElement;
			}
			if ((possibleValue as any) instanceof HTMLElement) {
				return possibleValue;
			}
			if (possibleValue && '_elementRef' in possibleValue) {
				// eslint-disable-next-line no-underscore-dangle
				return (possibleValue as any)._elementRef.nativeElement;
			}
		}
		if (elementSelector?.trim()) {
			return document.querySelector<HTMLElement>(`#${elementSelector.trim()}`);
		}
		return null;
	}

	// eslint-disable-next-line max-lines-per-function,max-statements
	private async scrollToTarget(element: HTMLElement): Promise<void> {
		if (!element) {
			return;
		}

		await new Promise(resolve => {
			requestAnimationFrame(resolve);
		});

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const scrollContainer = this.getScrollParent(element);
		const elementRect = element.getBoundingClientRect();
		const containerRect = scrollContainer.getBoundingClientRect();

		const isAboveViewport = elementRect.top < containerRect.top;
		const isBelowViewport = elementRect.bottom > containerRect.bottom;

		if (!isAboveViewport && !isBelowViewport) {
			return;
		}

		if (scrollContainer === document.body || scrollContainer === document.documentElement) {
			const absoluteY = elementRect.top + window.scrollY;
			const targetY = absoluteY - window.innerHeight / 2 + elementRect.height / 2;
			window.scrollTo({
				top: targetY,
				behavior: prefersReducedMotion ? 'auto' : 'smooth'
			});
		} else {
			const offsetTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
			const targetY = offsetTop - scrollContainer.clientHeight / 2 + elementRect.height / 2;

			scrollContainer.scrollTo({
				top: targetY,
				behavior: prefersReducedMotion ? 'auto' : 'smooth'
			});
		}

		await new Promise(resolve => {
			setTimeout(resolve, prefersReducedMotion ? 0 : 700);
		});
	}

	private getScrollParent(element: HTMLElement): HTMLElement {
		let parent: HTMLElement | null = element.parentElement;
		while (parent) {
			const style = getComputedStyle(parent);
			const {overflowY} = style;
			if (overflowY === 'auto' || overflowY === 'scroll') {
				return parent;
			}
			parent = parent.parentElement;
		}
		return document.documentElement;
	}

	private createOverlayRelativeToTarget(target: HTMLElement, componentInjector: Injector): void {
		const positionStrategy = this.createRelativePositionStrategy(target);
		this.overlayRef = this.overlay.create({
			positionStrategy,
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
			hasBackdrop: false,
			panelClass: ['obt-tour-overlay-panel']
		});

		const portal = new ComponentPortal(TourOverlayComponent, null, componentInjector);
		this.componentRef = this.overlayRef.attach(portal);

		positionStrategy.positionChanges.subscribe(change => {
			const {overlayX, overlayY} = change.connectionPair;
			const arrowDirection = this.updateArrowDirection(overlayX, overlayY);
			this.componentRef.setInput('arrowPosition', arrowDirection);
			this.componentRef.instance.closeEmitter.subscribe(() => {
				this.closeOverlay();
			});
		});
	}

	private createRelativePositionStrategy(target: HTMLElement): FlexibleConnectedPositionStrategy {
		return this.overlay
			.position()
			.flexibleConnectedTo(target)
			.withPositions(this.positionsRelative)
			.withFlexibleDimensions(true)
			.withPush(false);
	}

	private createOverlayCentered(componentInjector: Injector): void {
		const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
		this.overlayRef = this.overlay.create({
			positionStrategy,
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
			hasBackdrop: false,
			panelClass: ['obt-tour-overlay-panel', 'obt-tour-overlay-center']
		});

		const portal = new ComponentPortal(TourOverlayComponent, null, componentInjector);
		this.componentRef = this.overlayRef.attach(portal);
	}

	private updateArrowDirection(overlayX: 'start' | 'center' | 'end', overlayY: 'top' | 'center' | 'bottom'): ObtArrowDirection {
		const isVertical = overlayX === 'center';
		const isHorizontal = overlayY === 'center';

		if (isHorizontal && overlayX === 'start') {
			return 'arrow-left';
		}
		if (isHorizontal && overlayX === 'end') {
			return 'arrow-right';
		}
		if (isVertical && overlayY === 'top') {
			return 'arrow-top';
		}
		if (isVertical && overlayY === 'bottom') {
			return 'arrow-bottom';
		}

		return 'arrow-none';
	}

	private highlightTarget(element: HTMLElement | null | undefined, zIndex = '10'): void {
		if (!element) {
			return;
		}

		this.removeHighlight();
		this.originalZIndex = element.style.zIndex;
		this.originalPosition = element.style.position;
		element.style.boxShadow = '0 0 0 4px #8655F6FF';
		element.style.transition = 'box-shadow 0.5s ease, outline 0.3s ease';

		if (!element.style.position || element.style.position === 'static') {
			element.style.position = 'relative';
		}

		element.style.zIndex = zIndex ?? '10';
		this.highlightedElement = element;
	}

	private removeHighlight(): void {
		if (!this.highlightedElement) {
			return;
		}
		const element = this.highlightedElement;
		element.style.boxShadow = '';
		element.style.transition = '';
		element.style.zIndex = this.originalZIndex;
		element.style.position = this.originalPosition;
		this.highlightedElement = null;
	}
}
