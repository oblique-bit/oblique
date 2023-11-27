import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ObDragDropDirective} from './drag-and-drop.directive';

@Component({
	template: `<input obDragDrop (onFileDropped)="saveFiles($event)" />`
})
class TestDropDirectiveComponent {
	files;
	saveFiles(files): void {
		this.files = files;
	}
}

describe(ObDragDropDirective.name, () => {
	let fixture: ComponentFixture<TestDropDirectiveComponent>;
	let input: DebugElement;
	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [ObDragDropDirective],
			declarations: [TestDropDirectiveComponent]
		}).createComponent(TestDropDirectiveComponent);
		input = fixture.debugElement.query(By.directive(ObDragDropDirective));
		fixture.detectChanges();
		fixture.detectChanges();
	});

	it('should create an instance', () => {
		expect(input).toBeTruthy();
	});

	describe('onDragOver', () => {
		it('should initially not have ob-dragging class', () => {
			expect(input.nativeElement.classList.contains('ob-dragging')).toBe(false);
		});

		describe('fire event', () => {
			let event;
			beforeEach(() => {
				event = new CustomEvent('dragover', {bubbles: true, cancelable: true});
				jest.spyOn(event, 'stopPropagation');
				input.nativeElement.dispatchEvent(event);
				fixture.detectChanges();
			});

			it('should add ob-dragging class', () => {
				expect(input.nativeElement.classList.contains('ob-dragging')).toBe(true);
			});

			it('should prevent event default', () => {
				expect(event.defaultPrevented).toBe(true);
			});

			it('should prevent event propagation', () => {
				expect(event.stopPropagation).toHaveBeenCalled();
			});
		});
	});

	describe('onDragLeave', () => {
		beforeEach(() => {
			input.nativeElement.dispatchEvent(new CustomEvent('dragover', {bubbles: true, cancelable: true}));
			fixture.detectChanges();
		});
		it('should initially have ob-dragging class', () => {
			expect(input.nativeElement.classList.contains('ob-dragging')).toBe(true);
		});

		describe('fire event', () => {
			let event;
			beforeEach(() => {
				event = new CustomEvent('dragleave', {bubbles: true, cancelable: true});
				jest.spyOn(event, 'stopPropagation');
				input.nativeElement.dispatchEvent(event);
				fixture.detectChanges();
			});

			it('should remove ob-dragging class', () => {
				expect(input.nativeElement.classList.contains('ob-dragging')).toBe(false);
			});

			it('should prevent event default', () => {
				expect(event.defaultPrevented).toBe(true);
			});

			it('should prevent event propagation', () => {
				expect(event.stopPropagation).toHaveBeenCalled();
			});
		});
	});

	describe('ondrop', () => {
		beforeEach(() => {
			input.nativeElement.dispatchEvent(new CustomEvent('dragover', {bubbles: true, cancelable: true}));
			fixture.detectChanges();
		});
		it('should initially have ob-dragging class', () => {
			expect(input.nativeElement.classList.contains('ob-dragging')).toBe(true);
		});

		it('should not have files', () => {
			expect(fixture.debugElement.componentInstance.files).toBeUndefined();
		});

		describe('fire event', () => {
			let event;
			beforeEach(() => {
				event = new CustomEvent('drop', {bubbles: true, cancelable: true});
				event.dataTransfer = {files: []};
				jest.spyOn(event, 'stopPropagation');
				input.nativeElement.dispatchEvent(event);
				fixture.detectChanges();
			});

			it('should prevent event default', () => {
				expect(event.defaultPrevented).toBe(true);
			});

			it('should prevent event propagation', () => {
				expect(event.stopPropagation).toHaveBeenCalled();
			});
		});

		describe('fire event with files', () => {
			let event: CustomEvent & {dataTransfer?: DataTransfer};
			beforeEach(() => {
				event = new CustomEvent('drop', {bubbles: true, cancelable: true});
				event.dataTransfer = {
					files: JSON.parse('{"0":{},"1":{},"length": 2}')
				} as DataTransfer;
				jest.spyOn(event, 'stopPropagation');
				input.nativeElement.dispatchEvent(event);
				fixture.detectChanges();
			});

			it('should remove ob-dragging class', () => {
				expect(input.nativeElement.classList.contains('ob-dragging')).toBe(false);
			});

			it('should emit files', () => {
				expect(fixture.debugElement.componentInstance.files).toEqual({'0': {}, '1': {}, length: 2});
			});
		});
	});
});
