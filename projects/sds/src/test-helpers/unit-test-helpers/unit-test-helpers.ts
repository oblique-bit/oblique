import {DebugElement} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

export function clickDebugElementById<T>(fixture: ComponentFixture<T>, id: string): void {
	getDebugElementById<T>(fixture, id).triggerEventHandler('click', null);
}

export function getClassesForDebugElementById<T>(fixture: ComponentFixture<T>, id: string): Record<string, boolean> {
	return getDebugElementById<T>(fixture, id).classes;
}

export function getClassForDebugElementById<T>(fixture: ComponentFixture<T>, id: string, className: string): boolean {
	return getClassesForDebugElementById<T>(fixture, id)[className];
}

export function getDebugElementByCss<T>(fixture: ComponentFixture<T>, css: string): DebugElement {
	return fixture.debugElement.query(By.css(css));
}

export function getDebugElementById<T>(fixture: ComponentFixture<T>, id: string): DebugElementExtended {
	return getDebugElementByCss(fixture, `#${id}`) as DebugElementExtended;
}

interface DebugElementExtended extends DebugElement {
	dispatchEvent?: (event: Event) => void;
	innerHTML?: string;
	textContent?: string | null;
	value?: string;
}
