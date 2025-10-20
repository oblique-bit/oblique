import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionButtonComponent} from './action-button.component';
import {TranslateFakeLoader, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ObtTourAction} from '../../../models/tour.model';

describe('ActionButtonComponent', () => {
	let component: ActionButtonComponent;
	let fixture: ComponentFixture<ActionButtonComponent>;
	let emitSpy: jest.SpyInstance;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ActionButtonComponent,
				TranslateModule.forRoot({
					defaultLanguage: 'en',
					loader: {provide: TranslateLoader, useClass: TranslateFakeLoader}
				})
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ActionButtonComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('actionName', 'start');
		fixture.componentRef.setInput('activeTourKey', 'tour-123');
		fixture.componentRef.setInput('tourTitle', 'My Tour');
		fixture.componentRef.setInput('icon', 'skip_next');
		fixture.componentRef.setInput('id', 'button-id');

		fixture.detectChanges();
		emitSpy = jest.spyOn(component.tourStatusChanged, 'emit');
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('onAction()', () => {
		it('should emit correct event for action "start"', () => {
			component.onAction('start');
			expect(emitSpy).toHaveBeenCalledWith({
				obtTourAction: 'start',
				obtTourKey: 'tour-123'
			});
		});

		it('should emit correct event for action "skip"', () => {
			component.onAction('skip');
			expect(emitSpy).toHaveBeenCalledWith({
				obtTourAction: 'skip',
				obtTourKey: 'tour-123'
			});
		});

		it('should emit correct event for action "restart"', () => {
			component.onAction('restart');
			expect(emitSpy).toHaveBeenCalledWith({
				obtTourAction: 'restart',
				obtTourKey: 'tour-123'
			});
		});

		it('should emit correct event for action "resume"', () => {
			component.onAction('resume');
			expect(emitSpy).toHaveBeenCalledWith({
				obtTourAction: 'resume',
				obtTourKey: 'tour-123'
			});
		});

		it('should not emit anything for unknown action', () => {
			component.onAction('invalid' as ObtTourAction);
			expect(emitSpy).not.toHaveBeenCalled();
		});
	});
});
