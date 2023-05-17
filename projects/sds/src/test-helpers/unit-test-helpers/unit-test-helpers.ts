import {DebugElement} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

export class UnitTestHelpers {
	static clickDebugElementById<T>(fixture: ComponentFixture<T>, id: string): void {
		UnitTestHelpers.getDebugElementById<T>(fixture, id).triggerEventHandler('click', null);
	}

	static getClassesForDebugElementById<T>(fixture: ComponentFixture<T>, id: string): Record<string, boolean> {
		return UnitTestHelpers.getDebugElementById<T>(fixture, id).classes;
	}

	static getClassForDebugElementById<T>(fixture: ComponentFixture<T>, id: string, className: string): boolean {
		return UnitTestHelpers.getClassesForDebugElementById<T>(fixture, id)[className];
	}

	static getDebugElementByCss<T>(fixture: ComponentFixture<T>, css: string): DebugElement {
		return fixture.debugElement.query(By.css(`${css}`));
	}

	static getDebugElementById<T>(fixture: ComponentFixture<T>, id: string): DebugElementExtended {
		return UnitTestHelpers.getDebugElementByCss(fixture, `#${id}`) as DebugElementExtended;
	}
}

interface DebugElementExtended extends DebugElement {
	dispatchEvent?: (event: Event) => void;
	innerHTML?: string;
	textContent?: string | null;
	value?: string;
}
